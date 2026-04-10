import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import {
  loadFlowConfig,
  takeScreenshot,
  waitForPageStable,
  toFilename,
  ensureDir,
} from './utils.js';
import { executeAction } from './actions.js';
import { log } from './logger.js';
import type {
  FlowConfig,
  FlowStep,
  CapturedFrame,
  FlowMetadata,
} from './types.js';

/** Validate and cast a raw JSON object to FlowConfig */
function validateFlowConfig(raw: unknown): FlowConfig {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Flow config must be a JSON object');
  }
  const obj = raw as Record<string, unknown>;
  if (typeof obj.name !== 'string' || !obj.name) {
    throw new Error('Flow config must have a "name" string field');
  }
  if (typeof obj.title !== 'string' || !obj.title) {
    throw new Error('Flow config must have a "title" string field');
  }
  if (!Array.isArray(obj.steps) || obj.steps.length === 0) {
    throw new Error('Flow config must have a non-empty "steps" array');
  }
  return raw as FlowConfig;
}

interface RunnerOptions {
  flowPath: string;
  baseUrl?: string;
  /** Override viewport */
  viewport?: { width: number; height: number };
  /** Show browser window */
  headless?: boolean;
  /** Root output directory (defaults to ./output) */
  outputRoot?: string;
}

export async function runFlow(options: RunnerOptions): Promise<FlowMetadata> {
  const { flowPath, headless = false, outputRoot = './output' } = options;

  log.bold('🎬 Automated Video Tutorial Generator — Playwright Runner');
  log.divider();

  // Load & validate flow
  log.info(`Loading flow: ${flowPath}`);
  const raw = loadFlowConfig(flowPath);
  const flow = validateFlowConfig(raw);

  const baseUrl =
    options.baseUrl ??
    flow.baseUrl ??
    process.env.BASE_URL ??
    'http://localhost:3000';
  const viewport = options.viewport ??
    flow.viewport ?? { width: 1280, height: 720 };

  log.info(`Flow: "${flow.title}" (${flow.steps.length} steps)`);
  log.info(`Base URL: ${baseUrl}`);
  log.info(`Viewport: ${viewport.width}x${viewport.height}`);
  log.divider();

  // Prepare output directory
  const flowSlug = toFilename(flow.name);
  const outputDir = path.resolve(outputRoot, flowSlug);
  ensureDir(outputDir);

  const frames: CapturedFrame[] = [];
  let frameIndex = 0;

  // Launch browser
  const browser = await chromium.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2, // Retina quality screenshots
    locale: 'es-AR',
  });

  const page = await context.newPage();

  // Mask cookie banners and chat widgets that may appear
  await context.addInitScript(() => {
    // Override Date if needed for deterministic screenshots — optional
  });

  try {
    for (let i = 0; i < flow.steps.length; i++) {
      const step = flow.steps[i] as FlowStep;
      const stepNum = i + 1;
      const stepName = step.name ?? step.action;

      log.bold(`Step ${stepNum}/${flow.steps.length}: ${stepName}`);

      // Execute the action
      await executeAction(page, step, baseUrl);

      // Decide whether to take a screenshot
      const shouldCapture =
        step.screenshot !== false && // default to capture unless explicitly false
        step.action !== 'wait' &&
        step.action !== 'waitForSelector';

      if (shouldCapture || step.action === 'screenshot') {
        await waitForPageStable(page, 300);

        const filename = `frame-${String(frameIndex + 1).padStart(3, '0')}-${toFilename(stepName)}.png`;
        const absPath = await takeScreenshot(page, outputDir, filename);

        frames.push({
          index: frameIndex,
          stepName,
          narration: step.narration,
          filename,
          relativePath: `frames/${flowSlug}/${filename}`,
          capturedAt: new Date().toISOString(),
        });

        frameIndex++;
        log.success(`  Frame ${frameIndex} captured`);
      }

      log.info('');
    }
  } catch (err) {
    log.error(`Error during step execution: ${(err as Error).message}`);
    // Take error screenshot for debugging
    const errFilename = `error-${Date.now()}.png`;
    await takeScreenshot(page, outputDir, errFilename).catch(() => {});
    throw err;
  } finally {
    await context.close();
    await browser.close();
  }

  // Write metadata
  const metadata: FlowMetadata = {
    flowName: flowSlug,
    title: flow.title,
    description: flow.description,
    ctaText: flow.video?.ctaText,
    appName: flow.video?.appName,
    backgroundMusic: flow.video?.backgroundMusic,
    frames,
    generatedAt: new Date().toISOString(),
  };

  const metadataPath = path.join(outputDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  log.divider();
  log.success(`✅ Flow complete! ${frames.length} frames captured`);
  log.info(`Output: ${outputDir}`);
  log.divider();

  return metadata;
}

// ─── CLI entry point ───────────────────────────────────────────────────────

if (
  process.argv[1]?.endsWith('runner.ts') ||
  process.argv[1]?.endsWith('runner.js')
) {
  const args = process.argv.slice(2);
  const flowArg =
    args.find((a) => a.startsWith('--flow='))?.split('=')[1] ??
    args[args.indexOf('--flow') + 1];
  const headless = args.includes('--headless');
  const baseUrl =
    args.find((a) => a.startsWith('--base-url='))?.split('=')[1] ??
    args[args.indexOf('--base-url') + 1];

  if (!flowArg) {
    log.error(
      'Usage: tsx scripts/runner.ts --flow <path/to/flow.json> [--headless] [--base-url <url>]',
    );
    process.exit(1);
  }

  runFlow({ flowPath: flowArg, headless, baseUrl })
    .then(() => process.exit(0))
    .catch((err) => {
      log.error(`Fatal: ${err.message}`);
      process.exit(1);
    });
}

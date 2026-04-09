#!/usr/bin/env node
/**
 * Main orchestration script: generate-video.ts
 *
 * This script coordinates the entire video generation pipeline:
 * 1. Runs Playwright to capture screenshots from flow
 * 2. Copies assets to Remotion public folder
 * 3. Invokes Remotion to render the final video
 *
 * Usage:
 *   npm run generate -- flows/demo-navegacion.json
 *   tsx generate-video.ts flows/demo-registro.json --headless
 */

import * as path from "path";
import * as fs from "fs-extra";
import { runFlow } from "./scripts/runner.js";
import { log } from "./scripts/logger.js";
import type { FlowMetadata } from "./scripts/types.js";
import { execSync } from "child_process";

interface GenerateOptions {
  flowPath: string;
  headless?: boolean;
  baseUrl?: string;
  skipRender?: boolean;
  outputName?: string;
}

async function generateVideo(options: GenerateOptions): Promise<void> {
  const {
    flowPath,
    headless = true,
    baseUrl,
    skipRender = false,
    outputName,
  } = options;

  log.bold("🎬 Automated Video Tutorial Generator");
  log.divider();

  // ─── Phase 1: Run Playwright and capture screenshots ──────────────────────
  log.bold("Phase 1: Capturing screenshots with Playwright");
  log.divider();

  const metadata: FlowMetadata = await runFlow({
    flowPath,
    headless,
    baseUrl,
    outputRoot: "./output",
  });

  const { flowName, frames } = metadata;
  const outputDir = path.resolve("./output", flowName);

  log.divider();
  log.success(`✅ Captured ${frames.length} frames`);
  log.divider();

  // ─── Phase 2: Prepare Remotion assets ──────────────────────────────────────
  log.bold("Phase 2: Preparing Remotion assets");
  log.divider();

  const remotionPublic = path.resolve("./remotion/public");
  const framesDestDir = path.join(remotionPublic, "frames", flowName);

  // Create frames directory
  fs.ensureDirSync(framesDestDir);

  // Copy all screenshots to remotion/public/frames/<flowName>/
  log.info(`Copying ${frames.length} screenshots to Remotion public folder...`);
  for (const frame of frames) {
    const srcPath = path.join(outputDir, frame.filename);
    const destPath = path.join(framesDestDir, frame.filename);
    fs.copyFileSync(srcPath, destPath);
  }
  log.success(`  ✔ Copied screenshots to ${framesDestDir}`);

  // Copy metadata.json
  const metadataSrc = path.join(outputDir, "metadata.json");
  const metadataDest = path.join(remotionPublic, `${flowName}-metadata.json`);
  fs.copyFileSync(metadataSrc, metadataDest);
  log.success(`  ✔ Copied metadata to ${metadataDest}`);

  log.divider();

  if (skipRender) {
    log.warn("⏭  Skipping Remotion render (--skip-render flag enabled)");
    log.info(
      `To render manually, run: cd remotion && npx remotion render TutorialVideo --props='${metadataDest}' output.mp4`,
    );
    return;
  }

  // ─── Phase 3: Render video with Remotion ───────────────────────────────────
  log.bold("Phase 3: Rendering video with Remotion");
  log.divider();

  const videoOutputDir = path.resolve("./output", flowName);
  const videoOutputFile = outputName ?? `${flowName}.mp4`;
  const videoOutputPath = path.join(videoOutputDir, videoOutputFile);

  log.info("Starting Remotion render... (this may take several minutes)");
  log.info("");

  // Build input props for Remotion from metadata
  const remotionProps = JSON.stringify({
    title: metadata.title,
    description: metadata.description,
    appName: metadata.appName ?? "Mi App",
    ctaText: metadata.ctaText ?? "¡Probalo gratis!",
    backgroundMusic: metadata.backgroundMusic,
    frames: metadata.frames,
  });

  try {
    // Run Remotion CLI from the remotion/ directory
    const renderCmd = [
      "npx",
      "remotion",
      "render",
      "TutorialVideo",
      `"${videoOutputPath}"`,
      "--props",
      `'${remotionProps}'`,
      "--overwrite",
    ].join(" ");

    log.info(`Executing: ${renderCmd}`);
    log.divider();

    execSync(renderCmd, {
      cwd: path.resolve("./remotion"),
      stdio: "inherit",
      shell: process.platform === "win32" ? "powershell.exe" : undefined,
    });

    log.divider();
    log.success("✅ Video rendered successfully!");
    log.divider();
    log.bold(`📹 Output: ${videoOutputPath}`);
    log.info("");
    log.info(`You can preview the video at: ${videoOutputPath}`);
    log.divider();
  } catch (err) {
    log.error(`Remotion render failed: ${(err as Error).message}`);
    log.error("Check the logs above for details.");
    process.exit(1);
  }
}

// ─── CLI entry point ───────────────────────────────────────────────────────

if (
  import.meta.url.endsWith(process.argv[1]!) ||
  process.argv[1]?.endsWith("generate-video.ts")
) {
  const args = process.argv.slice(2);

  // Parse arguments
  const flowArg =
    args.find((a) => !a.startsWith("--")) ??
    args.find((a) => a.startsWith("--flow="))?.split("=")[1];
  const headless = args.includes("--headless") || !args.includes("--headed");
  const skipRender = args.includes("--skip-render");
  const baseUrl = args.find((a) => a.startsWith("--base-url="))?.split("=")[1];
  const outputName = args.find((a) => a.startsWith("--output="))?.split("=")[1];

  if (!flowArg) {
    console.error("❌ Error: No flow file specified\n");
    console.log("Usage: tsx generate-video.ts <path/to/flow.json> [options]\n");
    console.log("Options:");
    console.log("  --headless         Run browser in headless mode (default)");
    console.log("  --headed           Show browser window during capture");
    console.log(
      "  --skip-render      Skip video rendering (only capture screenshots)",
    );
    console.log("  --base-url <url>   Override base URL for the flow");
    console.log(
      "  --output <name>    Custom output filename (default: <flowName>.mp4)",
    );
    console.log("\nExamples:");
    console.log("  npm run generate -- flows/demo-navegacion.json");
    console.log("  tsx generate-video.ts flows/demo-registro.json --headed");
    console.log(
      "  tsx generate-video.ts flows/demo-registro.json --base-url http://localhost:4000",
    );
    process.exit(1);
  }

  generateVideo({
    flowPath: flowArg,
    headless,
    baseUrl,
    skipRender,
    outputName,
  })
    .then(() => process.exit(0))
    .catch((err) => {
      log.error(`Fatal error: ${err.message}`);
      console.error(err);
      process.exit(1);
    });
}

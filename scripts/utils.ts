import * as fs from 'fs';
import * as path from 'path';
import type { Page } from '@playwright/test';
import { log } from './logger.js';

/** Pause execution for a given number of milliseconds */
export function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Ensure a directory exists (creates it recursively if needed) */
export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

/** Sanitize a string for use as a filename */
export function toFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Take a high-resolution screenshot and save it to disk.
 * Returns the absolute path of the saved file.
 */
export async function takeScreenshot(
  page: Page,
  outputDir: string,
  filename: string
): Promise<string> {
  ensureDir(outputDir);
  const filePath = path.join(outputDir, filename);
  await page.screenshot({
    path: filePath,
    type: 'png',
    fullPage: false,
    animations: 'disabled',
  });
  log.success(`  📸 Screenshot saved: ${filename}`);
  return filePath;
}

/**
 * Wait until the page has no pending network requests
 * for at least `quietMs` milliseconds.
 */
export async function waitForPageStable(
  page: Page,
  quietMs = 500
): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout: 10_000 });
  } catch {
    // networkidle can timeout on pages with constant polling — that's OK
  }
  await waitMs(quietMs);
}

/** Load and parse a JSON flow config file */
export function loadFlowConfig(filePath: string): unknown {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Flow config not found: ${abs}`);
  }
  const raw = fs.readFileSync(abs, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in flow config "${abs}": ${(err as Error).message}`);
  }
}

/** Format a date as YYYY-MM-DD_HH-MM-SS for use in filenames */
export function formatDateForFilename(date = new Date()): string {
  return date
    .toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '-');
}

import type { Page } from '@playwright/test';
import type {
  FlowStep,
  GotoStep,
  ClickStep,
  FillStep,
  TypeStep,
  WaitStep,
  WaitForSelectorStep,
  HoverStep,
  PressStep,
  SelectOptionStep,
  ScrollStep,
} from './types.js';
import { waitMs } from './utils.js';
import { log } from './logger.js';

/** Execute a single flow step on the Playwright page */
export async function executeAction(
  page: Page,
  step: FlowStep,
  baseUrl?: string,
): Promise<void> {
  switch (step.action) {
    case 'goto':
      await handleGoto(page, step, baseUrl);
      break;
    case 'click':
      await handleClick(page, step);
      break;
    case 'fill':
      await handleFill(page, step);
      break;
    case 'type':
      await handleType(page, step);
      break;
    case 'wait':
      await handleWait(page, step);
      break;
    case 'waitForSelector':
      await handleWaitForSelector(page, step);
      break;
    case 'screenshot':
      // Screenshot action is handled at runner level — skip here
      break;
    case 'hover':
      await handleHover(page, step);
      break;
    case 'press':
      await handlePress(page, step);
      break;
    case 'selectOption':
      await handleSelectOption(page, step);
      break;
    case 'scroll':
      await handleScroll(page, step);
      break;
    default: {
      const exhaustive: never = step;
      log.warn(`Unknown action type: ${(exhaustive as FlowStep).action}`);
    }
  }

  // Post-step delay for realistic UX simulation
  if (step.delayAfter && step.delayAfter > 0) {
    log.info(`  ⏱  Waiting ${step.delayAfter}ms after step...`);
    await waitMs(step.delayAfter);
  }
}

async function handleGoto(
  page: Page,
  step: GotoStep,
  baseUrl?: string,
): Promise<void> {
  // Resolve relative URLs against baseUrl
  let targetUrl = step.url;
  if (
    baseUrl &&
    !step.url.startsWith('http://') &&
    !step.url.startsWith('https://')
  ) {
    // Remove trailing slash from baseUrl and leading slash from path to avoid double slashes
    const base = baseUrl.replace(/\/$/, '');
    const path = step.url.startsWith('/') ? step.url : `/${step.url}`;
    targetUrl = `${base}${path}`;
  }

  log.info(`  → goto: ${targetUrl}`);
  await page.goto(targetUrl, {
    waitUntil: step.waitUntil ?? 'domcontentloaded',
    timeout: 30_000,
  });
  // Small settle time after navigation
  await waitMs(500);
}

async function handleClick(page: Page, step: ClickStep): Promise<void> {
  log.info(`  → click: ${step.selector}`);
  const locator = page.locator(step.selector).first();
  await locator.waitFor({ state: 'visible', timeout: 15_000 });

  if (step.clickType === 'double') {
    await locator.dblclick();
  } else if (step.clickType === 'right') {
    await locator.click({ button: 'right' });
  } else {
    await locator.click();
  }
}

async function handleFill(page: Page, step: FillStep): Promise<void> {
  log.info(`  → fill: ${step.selector} = "${step.value}"`);
  const locator = page.locator(step.selector).first();
  await locator.waitFor({ state: 'visible', timeout: 15_000 });

  if (step.clear !== false) {
    await locator.clear();
  }
  await locator.fill(step.value);
}

async function handleType(page: Page, step: TypeStep): Promise<void> {
  log.info(`  → type: ${step.selector} = "${step.value}"`);
  const locator = page.locator(step.selector).first();
  await locator.waitFor({ state: 'visible', timeout: 15_000 });
  await locator.pressSequentially(step.value, {
    delay: step.typingDelay ?? 80,
  });
}

async function handleWait(page: Page, step: WaitStep): Promise<void> {
  log.info(`  → wait: ${step.ms}ms`);
  await waitMs(step.ms);
}

async function handleWaitForSelector(
  page: Page,
  step: WaitForSelectorStep,
): Promise<void> {
  log.info(`  → waitForSelector: ${step.selector}`);
  await page.locator(step.selector).waitFor({
    state: 'visible',
    timeout: step.timeout ?? 15_000,
  });
}

async function handleHover(page: Page, step: HoverStep): Promise<void> {
  log.info(`  → hover: ${step.selector}`);
  const locator = page.locator(step.selector).first();
  await locator.waitFor({ state: 'visible', timeout: 15_000 });
  await locator.hover();
}

async function handlePress(page: Page, step: PressStep): Promise<void> {
  log.info(`  → press: ${step.key} on ${step.selector}`);
  await page.locator(step.selector).first().press(step.key);
}

async function handleSelectOption(
  page: Page,
  step: SelectOptionStep,
): Promise<void> {
  log.info(`  → selectOption: ${step.selector} = "${step.value}"`);
  await page.locator(step.selector).first().selectOption(step.value);
}

async function handleScroll(page: Page, step: ScrollStep): Promise<void> {
  if (step.selector) {
    log.info(`  → scroll element: ${step.selector}`);
    await page.locator(step.selector).first().scrollIntoViewIfNeeded();
  } else {
    const x = step.x ?? 0;
    const y = step.y ?? 500;
    log.info(`  → scroll page: (${x}, ${y})`);
    await page.evaluate(({ x, y }) => window.scrollBy(x, y), { x, y });
  }
}

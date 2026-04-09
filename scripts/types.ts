/**
 * TypeScript types for flow configuration and all action types.
 */

export type ActionType =
  | 'goto'
  | 'click'
  | 'fill'
  | 'type'
  | 'wait'
  | 'waitForSelector'
  | 'screenshot'
  | 'hover'
  | 'press'
  | 'selectOption'
  | 'scroll';

export interface BaseStep {
  /** Human-readable name shown in the video overlay */
  name?: string;
  /** Optional narration text for voiceover */
  narration?: string;
  /** Milliseconds to wait after the action completes */
  delayAfter?: number;
  /** Capture a screenshot after this step */
  screenshot?: boolean;
}

export interface GotoStep extends BaseStep {
  action: 'goto';
  url: string;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
}

export interface ClickStep extends BaseStep {
  action: 'click';
  selector: string;
  /** Click type: single (default), double, right */
  clickType?: 'single' | 'double' | 'right';
}

export interface FillStep extends BaseStep {
  action: 'fill';
  selector: string;
  value: string;
  /** Clear field before filling */
  clear?: boolean;
}

export interface TypeStep extends BaseStep {
  action: 'type';
  selector: string;
  value: string;
  /** Delay in ms between keystrokes (simulates human typing) */
  typingDelay?: number;
}

export interface WaitStep extends BaseStep {
  action: 'wait';
  /** Milliseconds to wait */
  ms: number;
}

export interface WaitForSelectorStep extends BaseStep {
  action: 'waitForSelector';
  selector: string;
  timeout?: number;
}

export interface ScreenshotStep extends BaseStep {
  action: 'screenshot';
  /** Override default filename */
  filename?: string;
}

export interface HoverStep extends BaseStep {
  action: 'hover';
  selector: string;
}

export interface PressStep extends BaseStep {
  action: 'press';
  selector: string;
  key: string;
}

export interface SelectOptionStep extends BaseStep {
  action: 'selectOption';
  selector: string;
  value: string;
}

export interface ScrollStep extends BaseStep {
  action: 'scroll';
  selector?: string;
  x?: number;
  y?: number;
}

export type FlowStep =
  | GotoStep
  | ClickStep
  | FillStep
  | TypeStep
  | WaitStep
  | WaitForSelectorStep
  | ScreenshotStep
  | HoverStep
  | PressStep
  | SelectOptionStep
  | ScrollStep;

export interface FlowConfig {
  /** Unique identifier for this flow (used as folder name) */
  name: string;
  /** Human-readable title shown in the video intro */
  title: string;
  /** Subtitle / description shown in the video intro */
  description?: string;
  /** Override base URL for this flow */
  baseUrl?: string;
  /** Video metadata */
  video?: {
    /** Call-to-action text in the outro */
    ctaText?: string;
    /** Brand/app name for intro */
    appName?: string;
    /** Background music file (relative to remotion/public/) */
    backgroundMusic?: string;
  };
  /** Viewport size (default: 1280x720) */
  viewport?: {
    width: number;
    height: number;
  };
  /** Steps to execute */
  steps: FlowStep[];
}

/** Metadata generated per captured screenshot */
export interface CapturedFrame {
  index: number;
  stepName: string;
  narration?: string;
  filename: string;
  /** Relative path from remotion/public/frames/<flowName>/ */
  relativePath: string;
  /** Timestamp when captured */
  capturedAt: string;
}

/** Output metadata file written to output/<name>/metadata.json */
export interface FlowMetadata {
  flowName: string;
  title: string;
  description?: string;
  ctaText?: string;
  appName?: string;
  backgroundMusic?: string;
  frames: CapturedFrame[];
  generatedAt: string;
}

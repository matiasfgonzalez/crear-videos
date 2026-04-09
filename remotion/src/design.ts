/** Shared design tokens for the tutorial video */

export const COLORS = {
  /** Deep dark background */
  bg: '#0A0A0F',
  /** Card/surface background */
  surface: '#13131A',
  /** Primary accent — vivid purple-blue */
  primary: '#6C63FF',
  /** Secondary accent — electric cyan */
  secondary: '#00D4FF',
  /** Text on dark backgrounds */
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.4)',
  /** Gradient start */
  gradientStart: '#6C63FF',
  /** Gradient end */
  gradientEnd: '#FF6B9D',
  /** Overlay for screenshots */
  overlay: 'rgba(0,0,0,0.35)',
};

export const FONTS = {
  heading: '"Inter", "Helvetica Neue", Arial, sans-serif',
  body: '"Inter", "Helvetica Neue", Arial, sans-serif',
};

/** 9:16 vertical format for Reels / TikTok / Shorts */
export const CANVAS = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const TIMING = {
  introDurationFrames: 90,    // 3 seconds
  stepDurationFrames: 120,    // 4 seconds per step
  outroDurationFrames: 90,    // 3 seconds
  transitionFrames: 20,       // 0.66s fade transition
};

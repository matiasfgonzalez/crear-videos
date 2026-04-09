/** Props passed to the TutorialVideo composition */
export interface FrameProps {
  index: number;
  stepName: string;
  narration?: string;
  filename: string;
  relativePath: string;
  capturedAt: string;
}

export interface TutorialVideoProps {
  title: string;
  description?: string;
  appName?: string;
  ctaText?: string;
  backgroundMusic?: string;
  frames: FrameProps[];
}

import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { z } from 'zod';
import { TutorialVideo } from './TutorialVideo';
import { CANVAS, TIMING } from './design';

/** Zod schema for frame props */
const frameSchema = z.object({
  index: z.number(),
  stepName: z.string(),
  narration: z.string().optional(),
  filename: z.string(),
  relativePath: z.string(),
  capturedAt: z.string(),
});

/** Zod schema for TutorialVideo props */
const tutorialVideoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  appName: z.string().optional(),
  ctaText: z.string().optional(),
  backgroundMusic: z.string().optional(),
  frames: z.array(frameSchema),
});

type TutorialVideoProps = z.infer<typeof tutorialVideoSchema>;

/** Default props used in Remotion Studio preview */
const defaultProps: TutorialVideoProps = {
  title: 'Tutorial de demostración',
  description: 'Generado automáticamente',
  appName: 'Mi App',
  ctaText: '¡Registrate gratis!',
  frames: [
    {
      index: 0,
      stepName: 'Paso de ejemplo',
      filename: 'placeholder.png',
      relativePath: 'frames/placeholder.png',
      capturedAt: new Date().toISOString(),
    },
  ],
};

function calculateTotalDuration(frameCount: number): number {
  return (
    TIMING.introDurationFrames +
    frameCount * TIMING.stepDurationFrames +
    TIMING.outroDurationFrames
  );
}

// Cast component to satisfy Remotion's strict typing
const TutorialVideoComponent = TutorialVideo as React.FC<TutorialVideoProps>;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TutorialVideo"
      component={TutorialVideoComponent}
      schema={tutorialVideoSchema}
      durationInFrames={calculateTotalDuration(defaultProps.frames.length)}
      fps={CANVAS.fps}
      width={CANVAS.width}
      height={CANVAS.height}
      defaultProps={defaultProps}
      calculateMetadata={async ({ props }) => {
        return {
          durationInFrames: calculateTotalDuration(props.frames.length),
        };
      }}
    />
  );
};

registerRoot(RemotionRoot);

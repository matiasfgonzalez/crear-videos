import React from 'react';
import {
  Composition,
  registerRoot,
} from 'remotion';
import { TutorialVideo } from './TutorialVideo.js';
import { CANVAS, TIMING } from './design.js';
import type { TutorialVideoProps } from './types.js';

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

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TutorialVideo"
      component={TutorialVideo}
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

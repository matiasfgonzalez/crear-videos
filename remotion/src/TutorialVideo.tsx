import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { IntroScene } from './components/IntroScene';
import { StepScene } from './components/StepScene';
import { OutroScene } from './components/OutroScene';
import { TIMING } from './design';

interface FrameProps {
  index: number;
  stepName: string;
  narration?: string;
  filename: string;
  relativePath: string;
  capturedAt: string;
}

interface TutorialVideoProps {
  title: string;
  description?: string;
  appName?: string;
  ctaText?: string;
  backgroundMusic?: string;
  frames: FrameProps[];
}

export const TutorialVideo = ({
  title,
  description,
  appName,
  ctaText,
  backgroundMusic,
  frames,
}: TutorialVideoProps) => {
  const totalSteps = frames.length;
  let currentOffset = 0;

  // Build the sequence of scenes
  const sequences: React.ReactElement[] = [];

  // 1. Intro
  sequences.push(
    <Sequence
      key="intro"
      from={currentOffset}
      durationInFrames={TIMING.introDurationFrames}
    >
      <IntroScene title={title} description={description} appName={appName} />
    </Sequence>,
  );
  currentOffset += TIMING.introDurationFrames;

  // 2. Step scenes (one per captured frame)
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const stepOffset = currentOffset;

    sequences.push(
      <Sequence
        key={`step-${i}`}
        from={stepOffset}
        durationInFrames={TIMING.stepDurationFrames}
      >
        <StepScene
          stepNumber={i + 1}
          totalSteps={totalSteps}
          stepName={frame.stepName}
          imagePath={frame.relativePath}
          isFirst={i === 0}
          isLast={i === frames.length - 1}
        />
      </Sequence>,
    );

    currentOffset += TIMING.stepDurationFrames;
  }

  // 3. Outro
  sequences.push(
    <Sequence
      key="outro"
      from={currentOffset}
      durationInFrames={TIMING.outroDurationFrames}
    >
      <OutroScene ctaText={ctaText} appName={appName} />
    </Sequence>,
  );

  return (
    <AbsoluteFill style={{ background: '#0A0A0F' }}>
      {sequences}
      {backgroundMusic && (
        <Audio src={staticFile(backgroundMusic)} volume={0.15} loop={true} />
      )}
    </AbsoluteFill>
  );
};

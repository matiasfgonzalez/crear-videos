import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  Easing,
} from 'remotion';
import { COLORS, FONTS } from '../design';

interface StepSceneProps {
  stepNumber: number;
  totalSteps: number;
  stepName: string;
  imagePath: string; // relative from remotion/public/
  isFirst?: boolean;
  isLast?: boolean;
}

export const StepScene: React.FC<StepSceneProps> = ({
  stepNumber,
  totalSteps,
  stepName,
  imagePath,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in the whole scene
  const sceneOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade out at end
  const sceneOpacityOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
    },
  );

  const finalOpacity = Math.min(sceneOpacity, sceneOpacityOut);

  // Ken Burns zoom: start slightly zoomed, slowly pan
  const zoomProgress = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    easing: Easing.inOut(Easing.ease),
  });

  // Step label slides in from bottom
  const labelProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14 },
    durationInFrames: 30,
  });
  const labelY = interpolate(labelProgress, [0, 1], [80, 0]);
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Progress bar
  const progressWidth = (stepNumber / totalSteps) * 100;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONTS.body,
        opacity: finalOpacity,
      }}
    >
      {/* Screenshot with Ken Burns zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile(imagePath)}
          style={{
            width: '100%',
            height: '85%',
            objectFit: 'cover',
            objectPosition: 'top center',
            transform: `scale(${zoomProgress})`,
            transformOrigin: 'center top',
          }}
        />
      </div>

      {/* Dark gradient overlay on screenshot */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '85%',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 60%, rgba(10,10,15,0.95) 100%)',
        }}
      />

      {/* Bottom panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18%',
          background: COLORS.surface,
          borderTop: `1px solid rgba(108,99,255,0.3)`,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 40px',
          gap: 12,
        }}
      >
        {/* Step counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              borderRadius: 10,
              padding: '6px 14px',
              fontSize: 20,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: 1,
            }}
          >
            {stepNumber}/{totalSteps}
          </div>

          {/* Progress bar */}
          <div
            style={{
              flex: 1,
              height: 6,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressWidth}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                borderRadius: 3,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Step name */}
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.textPrimary,
              lineHeight: 1.15,
              letterSpacing: -0.5,
            }}
          >
            {stepName}
          </h2>
        </div>
      </div>

      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
        }}
      />

      {/* Corner step number badge (top right) */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 40,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          border: `1px solid rgba(255,255,255,0.15)`,
          borderRadius: 16,
          padding: '10px 22px',
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.textSecondary,
        }}
      >
        Paso {stepNumber}
      </div>
    </div>
  );
};

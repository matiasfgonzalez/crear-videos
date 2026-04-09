import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { COLORS, FONTS } from '../design.js';

interface IntroSceneProps {
  title: string;
  description?: string;
  appName?: string;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
  description,
  appName = 'Tutorial',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // App name slides in from top
  const appNameProgress = spring({ frame, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 30 });
  const appNameY = interpolate(appNameProgress, [0, 1], [-60, 0]);
  const appNameOpacity = interpolate(appNameProgress, [0, 1], [0, 1]);

  // Title fades + scales in
  const titleProgress = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 80 }, durationInFrames: 40 });
  const titleScale = interpolate(titleProgress, [0, 1], [0.85, 1]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Description slides from bottom
  const descProgress = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 90 }, durationInFrames: 35 });
  const descY = interpolate(descProgress, [0, 1], [40, 0]);
  const descOpacity = interpolate(descProgress, [0, 1], [0, 1]);

  // Animated gradient orbs
  const orbPulse = interpolate(frame, [0, 90], [0, 1], { easing: Easing.inOut(Easing.ease) });
  const orb1Scale = 1 + Math.sin(orbPulse * Math.PI * 2) * 0.05;

  // Bottom pulse line
  const lineProgress = spring({ frame: frame - 50, fps, config: { damping: 18 }, durationInFrames: 25 });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 300]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.heading,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background gradient orbs */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}33 0%, transparent 70%)`,
          top: -150,
          left: -200,
          transform: `scale(${orb1Scale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.gradientEnd}22 0%, transparent 70%)`,
          bottom: 100,
          right: -150,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.secondary}18 0%, transparent 70%)`,
          bottom: -100,
          left: 50,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          padding: '0 80px',
          textAlign: 'center',
        }}
      >
        {/* App name badge */}
        <div
          style={{
            opacity: appNameOpacity,
            transform: `translateY(${appNameY}px)`,
            background: `linear-gradient(135deg, ${COLORS.primary}33, ${COLORS.secondary}22)`,
            border: `1px solid ${COLORS.primary}55`,
            borderRadius: 40,
            padding: '12px 32px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {appName}
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.textPrimary,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Divider line */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
            borderRadius: 2,
          }}
        />

        {/* Description */}
        {description && (
          <div
            style={{
              opacity: descOpacity,
              transform: `translateY(${descY}px)`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 400,
                color: COLORS.textSecondary,
                lineHeight: 1.5,
                maxWidth: 800,
              }}
            >
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

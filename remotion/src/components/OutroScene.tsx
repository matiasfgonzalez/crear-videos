import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONTS } from '../design';

interface OutroSceneProps {
  ctaText?: string;
  appName?: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  ctaText = '¡Probalo gratis hoy!',
  appName = 'Mi App',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  // Scene fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Checkmark / success icon springs in
  const iconProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 80 },
    durationInFrames: 35,
  });
  const iconScale = interpolate(iconProgress, [0, 1], [0.3, 1]);
  const iconOpacity = interpolate(iconProgress, [0, 1], [0, 1]);

  // Title slides up
  const titleProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14 },
    durationInFrames: 30,
  });
  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // CTA button pops in
  const ctaProgress = spring({
    frame: frame - 42,
    fps,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: 25,
  });
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.7, 1]);
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);

  // Animated ring pulse around icon
  const ringPulse = interpolate(frame, [30, 60], [0.9, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        position: 'relative',
        overflow: 'hidden',
        opacity,
      }}
    >
      {/* Background gradient orbs */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}28 0%, transparent 70%)`,
          top: -200,
          right: -300,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.secondary}18 0%, transparent 70%)`,
          bottom: -100,
          left: -200,
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
          gap: 48,
          padding: '0 80px',
          textAlign: 'center',
        }}
      >
        {/* Success icon */}
        <div
          style={{
            opacity: iconOpacity,
            transform: `scale(${iconScale})`,
            position: 'relative',
          }}
        >
          {/* Pulsing ring */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              border: `3px solid ${COLORS.primary}44`,
              transform: `scale(${ringPulse})`,
            }}
          />
          {/* Icon container */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 70,
              boxShadow: `0 0 60px ${COLORS.primary}66`,
            }}
          >
            ✓
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 68,
              fontWeight: 900,
              color: COLORS.textPrimary,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            ¡Ya sabés cómo
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              usar {appName}!
            </span>
          </h1>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              borderRadius: 24,
              padding: '28px 64px',
              fontSize: 38,
              fontWeight: 800,
              color: '#fff',
              boxShadow: `0 8px 40px ${COLORS.primary}55`,
              letterSpacing: -0.5,
            }}
          >
            {ctaText}
          </div>
        </div>

        {/* Subtitle text */}
        <div
          style={{
            opacity: Math.max(0, ctaOpacity - 0.1),
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 28,
              color: COLORS.textMuted,
              fontWeight: 400,
            }}
          >
            Seguí para más tutoriales 👇
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';
import { MONITOR_COLORS } from '../components/Monitor';

// Scene is 80 frames = 2.64s
// Narration: "This is where PNPM changes the game."
const PNPM = '#f9a825';

export const Scene3PnpmIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // pnpm logo bursts in
  const logoSpr = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 180 } });
  const logoScale = interpolate(logoSpr, [0, 1], [0.2, 1]);
  const logoOp = interpolate(logoSpr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // "This is where PNPM changes the game." fades up
  const textOp = interpolate(frame, [28, 48], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [28, 48], [40, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, #fffde7 0%, ${MONITOR_COLORS.BG_LIGHT} 50%, ${MONITOR_COLORS.BG_DARK} 100%)`,
      opacity: sceneOp,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* pnpm logo */}
      <div style={{
        opacity: logoOp,
        transform: `scale(${logoScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 60,
      }}>
        <div style={{
          width: 260,
          height: 260,
          borderRadius: 56,
          background: '#ffffff',
          boxShadow: `0 32px 80px ${PNPM}44, 0 8px 20px rgba(0,0,0,0.08)`,
          border: `2px solid ${PNPM}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}>
          <Img src={staticFile('npm-vs-pnpm/pnpm-logo.png')} style={{ width: '100%', display: 'block' }} />
        </div>
      </div>

      {/* Text */}
      <div style={{
        position: 'absolute',
        bottom: 400,
        left: 60,
        right: 60,
        textAlign: 'center',
        opacity: textOp,
        transform: `translateY(${textY}px)`,
      }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 58,
          fontWeight: 900,
          color: MONITOR_COLORS.TEXT_MAIN,
          letterSpacing: -2,
          lineHeight: 1.15,
        }}>
          This is where{' '}
          <span style={{ color: PNPM }}>pnpm</span>
          <br />
          changes the game.
        </div>
      </div>
    </AbsoluteFill>
  );
};

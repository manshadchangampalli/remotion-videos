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

const NPM_RED = '#cb3837';
const PNPM_GOLD = '#f9a825';

export const Scene0Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background fade in
  const bgOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // npm logo — slides in from left
  const npmSpr = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const npmX = interpolate(npmSpr, [0, 1], [-300, 0]);
  const npmOp = interpolate(npmSpr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // pnpm logo — slides in from right
  const pnpmSpr = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 120 } });
  const pnpmX = interpolate(pnpmSpr, [0, 1], [300, 0]);
  const pnpmOp = interpolate(pnpmSpr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // "VS" badge — pops in after both logos
  const vsSpr = spring({ frame: frame - 35, fps, config: { damping: 10, stiffness: 200 } });
  const vsScale = interpolate(vsSpr, [0, 1], [0, 1.1]);
  const vsOp = interpolate(vsSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Bottom tagline
  const tagOp = interpolate(frame, [48, 65], [0, 1], { extrapolateRight: 'clamp' });
  const tagY = interpolate(frame, [48, 65], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, #fff8f0 0%, #f5f0fb 50%, #e8f0fe 100%)`,
      opacity: bgOp,
      justifyContent: 'center',
      alignItems: 'center',
    }}>

      {/* Logo pair */}
      <div style={{
        position: 'absolute',
        top: 680,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}>
        {/* npm logo */}
        <div style={{
          opacity: npmOp,
          transform: `translateX(${npmX}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          width: 360,
        }}>
          <div style={{
            width: 220,
            height: 220,
            borderRadius: 36,
            background: '#fff',
            boxShadow: `0 20px 50px ${NPM_RED}22, 0 4px 10px rgba(0,0,0,0.06)`,
            border: `2px solid ${NPM_RED}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}>
            <Img src={staticFile('npm-vs-pnpm/npm-logo.svg')} style={{ width: '100%', display: 'block' }} />
          </div>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 900,
            color: NPM_RED,
            letterSpacing: 2,
          }}>npm</span>
        </div>

        {/* VS badge */}
        <div style={{
          opacity: vsOp,
          transform: `scale(${vsScale})`,
          zIndex: 10,
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 30,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: 1,
          }}>VS</span>
        </div>

        {/* pnpm logo */}
        <div style={{
          opacity: pnpmOp,
          transform: `translateX(${pnpmX}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          width: 360,
        }}>
          <div style={{
            width: 220,
            height: 220,
            borderRadius: 36,
            background: '#fff',
            boxShadow: `0 20px 50px ${PNPM_GOLD}33, 0 4px 10px rgba(0,0,0,0.06)`,
            border: `2px solid ${PNPM_GOLD}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}>
            <Img src={staticFile('npm-vs-pnpm/pnpm-logo.png')} style={{ width: '100%', display: 'block' }} />
          </div>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 900,
            color: PNPM_GOLD,
            letterSpacing: 2,
          }}>pnpm</span>
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        bottom: 160,
        left: 60,
        right: 60,
        textAlign: 'center',
        opacity: tagOp,
        transform: `translateY(${tagY}px)`,
      }}>
        <h1 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 52,
          fontWeight: 900,
          color: MONITOR_COLORS.TEXT_MAIN,
          margin: 0,
          letterSpacing: -2,
          lineHeight: 1.1,
        }}>
          Which package manager
          <br />
          <span style={{ color: MONITOR_COLORS.ACCENT_PURPLE }}>should you use?</span>
        </h1>
      </div>
    </AbsoluteFill>
  );
};

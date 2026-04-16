import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import { Monitor, MONITOR_COLORS } from '../components/Monitor';

const BG_GRADIENT = `radial-gradient(circle at center, ${MONITOR_COLORS.BG_LIGHT} 0%, ${MONITOR_COLORS.BG_DARK} 100%)`;
const NPM_RED = '#cb3837';
const GREEN = '#2ecc71';
const BORDER = '#d1d5db';
const DIM = '#94a3b8';

const COMMAND = 'npm install react';

// Timing in frames (30fps) — scene is 260 frames = 8.66s
// Narration sync:
//   0–136f  "Standard NPM install works by reaching out to the registry"  → typing + packet going up
//   136–147f "downloading the package"                                      → folder starts coming down
//   147–260f "placing it directly into your project's node_modules folder"  → badge appears + holds
const T_FADE_IN = 8;
const T_TYPE_START = 10;
const T_TYPE_END = 35;
const T_ENTER = 42;
const T_OUTPUT = 50;
const T_PACKET_START = 55;   // packet travels up — "reaching out to the registry"
const T_PACKET_END = 120;    // packet arrives at registry
const T_FOLDER_START = 128;  // folder comes down — near "downloading the package"
const T_FOLDER_END = 175;    // folder arrives at laptop
const T_NM_APPEAR = 180;     // badge pops — "placing it directly into node_modules"

// Canvas: 1080 × 1920
const CX = 540; // horizontal center

export const Scene1NpmInstall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = interpolate(frame, [0, T_FADE_IN], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const chars = Math.floor(
    interpolate(frame, [T_TYPE_START, T_TYPE_END], [0, COMMAND.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const cursor = frame < T_ENTER && Math.floor(frame / 15) % 2 === 0;

  const outputOp = interpolate(frame, [T_OUTPUT, T_OUTPUT + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const packetOp = interpolate(
    frame,
    [T_PACKET_START, T_PACKET_START + 10, T_PACKET_END - 8, T_PACKET_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const srvGlow = interpolate(
    frame,
    [T_PACKET_END, T_PACKET_END + 15, T_FOLDER_START + 20, T_FOLDER_START + 40],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const folderOp = interpolate(
    frame,
    [T_FOLDER_START, T_FOLDER_START + 10, T_FOLDER_END - 8, T_FOLDER_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const nmSp = spring({
    frame: frame - T_NM_APPEAR,
    fps,
    config: { damping: 11, stiffness: 180 },
  });
  const nmScale = interpolate(nmSp, [0, 1], [0.3, 1]);

  return (
    <AbsoluteFill style={{ background: BG_GRADIENT, opacity: sceneOp }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: '#fff',
          boxShadow: `0 8px 24px ${NPM_RED}22`,
          border: `1.5px solid ${NPM_RED}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          flexShrink: 0,
        }}>
          <Img src={staticFile('npm-vs-pnpm/npm-logo.svg')} style={{ width: '100%', display: 'block' }} />
        </div>
        <div style={{
          fontSize: 54,
          fontWeight: 900,
          color: MONITOR_COLORS.TEXT_MAIN,
          letterSpacing: -2,
        }}>
          How <span style={{ color: NPM_RED }}>npm install</span> works
        </div>
      </div>

      {/* Modern Monitor / Laptop Container */}
      <div
        style={{
          position: 'absolute',
          top: 1100,
          left: CX - 450,
          transform: 'scale(1.05)',
        }}
      >
        <Monitor
          terminalCommand={COMMAND}
          terminalChars={chars}
          showCursor={cursor}
        />

        {/* Output Overlay */}
        {frame >= T_OUTPUT && (
          <div
            style={{
              position: 'absolute',
              top: 320,
              left: 540,
              opacity: outputOp,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              padding: '24px 34px',
              borderRadius: 20,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              zIndex: 30,
              fontFamily: 'monospace',
            }}
          >
            <div style={{ color: GREEN, fontSize: 24, fontWeight: 800 }}>
              ✓ Added 1 package
            </div>
            <div style={{ color: DIM, fontSize: 17, marginTop: 6, fontWeight: 500 }}>
              Found 0 vulnerabilities
            </div>
          </div>
        )}

        {/* node_modules badge */}
        {frame >= T_NM_APPEAR && (
          <div
            style={{
              position: 'absolute',
              top: 480,
              left: 360,
              transform: `scale(${nmScale})`,
              backgroundColor: '#ffffff',
              border: `1.5px solid ${GREEN}22`,
              borderRadius: 16,
              padding: '16px 24px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: 18,
              color: GREEN,
              zIndex: 40,
            }}
          >
            📦 node_modules/react
            <br />
            <span style={{ fontWeight: 800, fontSize: 20 }}>✓ installed!</span>
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: CX - 1,
          top: 420,
          width: 2,
          height: 700,
          backgroundColor: BORDER,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: CX - 7,
          top: 410,
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: `10px solid ${BORDER}`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: CX - 7,
          top: 1110,
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: `10px solid ${BORDER}`,
          opacity: 0.5,
        }}
      />

      {/* "Request ▲" label */}
      <div
        style={{
          position: 'absolute',
          left: CX + 30,
          top: 750,
          color: NPM_RED,
          fontFamily: 'monospace',
          fontSize: 18,
          fontWeight: 700,
          opacity: packetOp,
        }}
      >
        ▲ Request
      </div>

      {/* "Response ▼" label */}
      <div
        style={{
          position: 'absolute',
          right: CX + 30,
          top: 750,
          color: GREEN,
          fontFamily: 'monospace',
          fontSize: 18,
          fontWeight: 700,
          opacity: folderOp,
          textAlign: 'right',
        }}
      >
        ▼ Response
      </div>

      {/* JSON packet heading UP */}
      {frame >= T_PACKET_START && frame < T_FOLDER_START && (
        <div
          style={{
            position: 'absolute',
            left: CX + 30,
            top: interpolate(frame, [T_PACKET_START, T_PACKET_END], [1100, 420], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.inOut(Easing.cubic),
            }),
            opacity: packetOp,
            backgroundColor: '#ffffff',
            border: `1px solid ${NPM_RED}33`,
            borderRadius: 12,
            padding: '10px 20px',
            fontFamily: 'monospace',
            fontSize: 16,
            color: NPM_RED,
            boxShadow: '0 10px 20px rgba(203, 56, 55, 0.1)',
          }}
        >
          GET /react
          <br />
          → registry.npmjs.org
        </div>
      )}

      {/* Package heading DOWN (NOW USING IMAGE) */}
      {frame >= T_FOLDER_START && frame < T_NM_APPEAR && (
        <div
          style={{
            position: 'absolute',
            right: CX + 30,
            top: interpolate(frame, [T_FOLDER_START, T_FOLDER_END], [420, 1100], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.inOut(Easing.cubic),
            }),
            opacity: folderOp,
            transform: `scale(${interpolate(frame, [T_FOLDER_START, T_FOLDER_START + 10], [0.8, 1], { extrapolateRight: 'clamp' })})`,
          }}
        >
          <div style={{
            width: 200,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            <Img src={staticFile('npm-vs-pnpm/react-folder-image.png')} style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      )}

      {/* Registry Server (NOW USING IMAGE) */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          left: CX - 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 15,
          opacity: srvGlow > 0 ? 1 : 0.9,
          transform: `scale(${1 + srvGlow * 0.05})`,
        }}
      >
        <div style={{
          width: 200,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: srvGlow > 0.1 ? `0 0 40px ${NPM_RED}44` : '0 10px 30px rgba(0,0,0,0.05)',
          background: '#ffffff',
          border: `1.5px solid ${srvGlow > 0.1 ? NPM_RED + '44' : BORDER + '44'}`,
          padding: '12px'
        }}>
          <Img src={staticFile('npm-vs-pnpm/npm-registery.png')} style={{ width: '100%', display: 'block' }} />
        </div>
        <span
          style={{
            color: NPM_RED,
            fontSize: 20,
            fontFamily: 'monospace',
            fontWeight: 800,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '4px 12px',
            borderRadius: 10,
          }}
        >
          registry.npmjs.org
        </span>
      </div>
    </AbsoluteFill>
  );
};

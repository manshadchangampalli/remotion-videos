import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { STARS, CONNECTIONS } from "../components/constellationData";

// Extended node network: original stars + extra global nodes
const GLOBAL_NODES = [
  ...STARS,
  { id: 18, x: 80,  y: 400,  size: 6, freq: 0.7 },
  { id: 19, x: 960, y: 450,  size: 6, freq: 0.72 },
  { id: 20, x: 50,  y: 1500, size: 7, freq: 0.75 },
  { id: 21, x: 1020,y: 1480, size: 6, freq: 0.68 },
  { id: 22, x: 200, y: 1700, size: 5, freq: 0.65 },
  { id: 23, x: 840, y: 1720, size: 5, freq: 0.66 },
  { id: 24, x: 540, y: 350,  size: 8, freq: 0.8  },
  { id: 25, x: 540, y: 1580, size: 8, freq: 0.78 },
];

const EXTRA_CONNECTIONS: [number, number][] = [
  [0, 18], [7, 19], [18, 24], [19, 24],
  [20, 9], [21, 14], [22, 20], [23, 21],
  [25, 15], [25, 17], [20, 25], [21, 25],
];
const ALL_CONNECTIONS = [...CONNECTIONS, ...EXTRA_CONNECTIONS];

export const Scene14Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Explosion: nodes fly outward (frames 0-50)
  const explosionSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 11, stiffness: 90 },
  });

  // Each node starts at center (540, 960) and flies to its position
  const nodePositions = GLOBAL_NODES.map((node) => {
    const cx = 540;
    const cy = 960;
    const x = cx + (node.x - cx) * explosionSpring;
    const y = cy + (node.y - cy) * explosionSpring;
    return { ...node, rx: x, ry: y };
  });

  // Lines appear after nodes settle
  const linesOp = interpolate(frame, [38, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "PATTERN > MELODY" slams in (frame 55)
  const patternSpring = spring({
    frame: frame - 58,
    fps,
    config: { damping: 5, stiffness: 280 },
  });
  const patternY = interpolate(patternSpring, [0, 1], [-240, 0]);
  // Screen shake
  const shakeX =
    frame >= 60 && frame <= 74
      ? Math.sin(frame * 5.2) * interpolate(frame, [60, 74], [12, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const shakeY =
    frame >= 60 && frame <= 74
      ? Math.cos(frame * 4.1) * interpolate(frame, [60, 74], [6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const slamFlash = interpolate(frame, [58, 66], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // FOLLOW badge pulses (frame 110+)
  const followSpring = spring({
    frame: frame - 112,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const followPulse = 0.8 + Math.sin(frame / 7) * 0.2;
  const followGlow = 0.4 + Math.sin(frame / 7) * 0.2;

  // Network pulse wave
  const pulsing = frame > 60 ? 0.04 + Math.sin(frame / 14) * 0.03 : 0;

  const sceneOp = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#050505",
        opacity: sceneOp,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Slam flash */}
      {slamFlash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#00f2ff",
            opacity: slamFlash * 0.35,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Global node network */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="s14Glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="s14GlowSm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <g opacity={linesOp}>
          {ALL_CONNECTIONS.map(([ai, bi], i) => {
            const a = nodePositions[ai] || nodePositions[0];
            const b = nodePositions[bi] || nodePositions[0];
            return (
              <line
                key={i}
                x1={a.rx}
                y1={a.ry}
                x2={b.rx}
                y2={b.ry}
                stroke="#00f2ff"
                strokeWidth={1}
                opacity={0.2 + pulsing * 2}
              />
            );
          })}
        </g>

        {/* Nodes */}
        {nodePositions.map((node) => {
          const pulse = 0.7 + Math.sin(frame / 12 + node.id * 0.9) * 0.3;
          return (
            <g key={node.id} opacity={explosionSpring}>
              <circle
                cx={node.rx}
                cy={node.ry}
                r={node.size * 2.5 * pulse}
                fill="#00f2ff"
                opacity={pulsing + 0.04}
              />
              <circle
                cx={node.rx}
                cy={node.ry}
                r={node.size}
                fill="#00f2ff"
                opacity={0.85}
                filter="url(#s14GlowSm)"
              />
              <circle
                cx={node.rx}
                cy={node.ry}
                r={node.size * 0.4}
                fill="#aafeff"
                opacity={0.95}
              />
            </g>
          );
        })}
      </svg>

      {/* "PATTERN > MELODY" bold center */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${patternY}px)`,
          opacity: patternSpring,
        }}
      >
        <div
          style={{
            fontSize: 112,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            color: "#fff",
            WebkitTextStroke: "2.5px #00f2ff",
            textShadow: "0 0 60px rgba(0,242,255,0.5), 0 0 120px rgba(0,242,255,0.2)",
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          PATTERN
        </div>
        <div
          style={{
            fontSize: 64,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            color: "#00f2ff",
            textShadow: "0 0 40px rgba(0,242,255,0.6)",
            letterSpacing: 6,
            marginTop: 8,
          }}
        >
          {">"} MELODY
        </div>
      </div>

      {/* FOLLOW badge */}
      {followSpring > 0.05 && (
        <div
          style={{
            position: "absolute",
            bottom: 220,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: followSpring,
            transform: `scale(${0.7 + followSpring * 0.3})`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,242,255,0.18), rgba(0,242,255,0.08))",
              border: `2px solid rgba(0,242,255,${followPulse * 0.85})`,
              borderRadius: 50,
              padding: "20px 60px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: `0 0 ${30 + followPulse * 20}px rgba(0,242,255,${followGlow}), 0 0 60px rgba(0,242,255,${followGlow * 0.4})`,
            }}
          >
            <span
              style={{
                color: "#00f2ff",
                fontSize: 32,
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                letterSpacing: 3,
                textShadow: `0 0 20px rgba(0,242,255,${followPulse * 0.7})`,
              }}
            >
              FOLLOW
            </span>
            <span style={{ color: "#00f2ff", fontSize: 28, opacity: 0.7 }}>→</span>
          </div>
        </div>
      )}

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 370,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: interpolate(frame, [130, 155], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 30,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            fontStyle: "italic",
          }}
        >
          for more system design breakdowns
        </div>
      </div>
    </AbsoluteFill>
  );
};

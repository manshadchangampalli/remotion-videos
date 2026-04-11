import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { STARS, CONNECTIONS } from "../components/constellationData";

export const Scene09Measuring: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lines snap in rapidly, staggered every 3 frames
  const lineProgress = CONNECTIONS.map((_, i) =>
    spring({
      frame: frame - (8 + i * 3),
      fps,
      config: { damping: 7, stiffness: 280 },
    })
  );

  // Stars always visible
  const starsOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Spark flashes on line contact points
  const sparks = CONNECTIONS.map((conn, i) => {
    const p = lineProgress[i];
    const flashFrame = 8 + i * 3;
    const flash = interpolate(frame, [flashFrame, flashFrame + 5, flashFrame + 10], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const a = STARS[conn[0]];
    const b = STARS[conn[1]];
    const sx = a.x + (b.x - a.x) * p;
    const sy = a.y + (b.y - a.y) * p;
    return { sx, sy, flash };
  });

  // Label
  const labelSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const sceneOp = interpolate(frame, [0, 12, 108, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOp = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="s9Glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="s9GlowSm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines drawing in */}
        {CONNECTIONS.map(([ai, bi], i) => {
          const a = STARS[ai];
          const b = STARS[bi];
          const p = lineProgress[i];
          const ex = a.x + (b.x - a.x) * p;
          const ey = a.y + (b.y - a.y) * p;
          return (
            <g key={i}>
              {/* Main line */}
              <line
                x1={a.x}
                y1={a.y}
                x2={ex}
                y2={ey}
                stroke="#00f2ff"
                strokeWidth={1.5}
                opacity={0.55 * p}
                filter="url(#s9GlowSm)"
              />
              {/* Distance label mid-point */}
              {p > 0.8 && (
                <text
                  x={(a.x + ex) / 2}
                  y={(a.y + ey) / 2 - 6}
                  fill="#00f2ff"
                  fontSize={10}
                  fontFamily="'Courier New', monospace"
                  textAnchor="middle"
                  opacity={0.4 * p}
                >
                  {(Math.hypot(b.x - a.x, b.y - a.y) * 0.12).toFixed(1)}ms
                </text>
              )}
            </g>
          );
        })}

        {/* Spark contact flashes */}
        {sparks.map((spark, i) =>
          spark.flash > 0.05 ? (
            <circle
              key={`spark${i}`}
              cx={spark.sx}
              cy={spark.sy}
              r={8 + spark.flash * 12}
              fill="#fff"
              opacity={spark.flash * 0.9}
              filter="url(#s9Glow)"
            />
          ) : null
        )}

        {/* Stars */}
        <g opacity={starsOp}>
          {STARS.map((star) => (
            <g key={star.id}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.size * 2.2}
                fill="#00f2ff"
                opacity={0.06}
              />
              <circle
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill="#00f2ff"
                opacity={0.85}
                filter="url(#s9GlowSm)"
              />
              <circle cx={star.x} cy={star.y} r={star.size * 0.4} fill="#aafeff" opacity={0.95} />
            </g>
          ))}
        </g>
      </svg>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelSpring,
          transform: `translateY(${interpolate(labelSpring, [0, 1], [50, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(0,242,255,0.08)",
            border: "1px solid #00f2ff",
            borderRadius: 8,
            padding: "10px 32px",
          }}
        >
          <span
            style={{
              color: "#00f2ff",
              fontSize: 28,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              letterSpacing: 3,
              textShadow: "0 0 14px rgba(0,242,255,0.6)",
            }}
          >
            MEASURING DISTANCES
          </span>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOp,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 36,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Measures the{" "}
          <span style={{ color: "#00f2ff" }}>precise time gap</span>
          <br />
          and frequency distance between each star.
        </div>
      </div>
    </AbsoluteFill>
  );
};

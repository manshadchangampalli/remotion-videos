import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { STARS } from "../components/constellationData";

export const Scene08Constellation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stars appear staggered
  const starSprings = STARS.map((_, i) =>
    spring({
      frame: frame - (8 + i * 3),
      fps,
      config: { damping: 10, stiffness: 180 },
    })
  );

  // Camera pulls back slowly
  const pullBack = interpolate(frame, [0, 120], [1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label
  const labelSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const sceneOp = interpolate(frame, [0, 15, 108, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOp = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      {/* Pure dark space - no grid */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="starGlowSm" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background micro-stars */}
        {Array.from({ length: 60 }, (_, i) => {
          const sx = (i * 173 + 41) % 1080;
          const sy = 300 + ((i * 237 + 97) % 1320);
          const twinkle = 0.1 + Math.sin(frame / 12 + i * 0.7) * 0.08;
          return (
            <circle
              key={`bg${i}`}
              cx={sx}
              cy={sy}
              r={0.8 + (i % 3) * 0.5}
              fill="#fff"
              opacity={twinkle}
            />
          );
        })}

        {/* Main constellation stars */}
        <g transform={`scale(${pullBack})`} style={{ transformOrigin: "540px 960px" }}>
          {STARS.map((star, i) => {
            const s = starSprings[i];
            const pulse = 0.8 + Math.sin(frame / 12 + i * 0.8) * 0.2;
            return (
              <g key={star.id} opacity={s}>
                {/* Outer glow ring */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size * 2.5 * pulse}
                  fill="#00f2ff"
                  opacity={0.06}
                />
                {/* Main dot */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size * (0.8 + s * 0.2)}
                  fill="#00f2ff"
                  opacity={0.9}
                  filter="url(#starGlow)"
                />
                {/* Core bright */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size * 0.45}
                  fill="#aafeff"
                  opacity={0.95}
                />
                {/* Freq label (small, appears late) */}
                {frame > 65 && (
                  <text
                    x={star.x + star.size + 6}
                    y={star.y - star.size}
                    fill="#00f2ff"
                    fontSize={11}
                    fontFamily="'Courier New', monospace"
                    opacity={0.45 * s}
                  >
                    {(star.freq * 4000).toFixed(0)}Hz
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* AUDIO CONSTELLATION label */}
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
            AUDIO CONSTELLATION
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
            fontSize: 38,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          The tallest peaks become{" "}
          <span style={{ color: "#00f2ff" }}>stars</span>
          <br />
          plotted in frequency space.
        </div>
      </div>
    </AbsoluteFill>
  );
};

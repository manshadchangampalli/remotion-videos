import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 12 SPARK — "converts it into a tiny spark of electricity" (120f / 4s)
export const Scene12Spark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Spark erupts at f30
  const sparkStart = 30;
  const sparkSpring = spring({ frame: frame - sparkStart, fps, config: { damping: 9, stiffness: 220 } });
  const sparkScale = interpolate(sparkSpring, [0, 1], [0, 1]);

  const rays = 12;
  const boltOp = interpolate(frame, [sparkStart, sparkStart + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 40, letterSpacing: 8 }}>
          RESULT:
        </div>
        <div style={{ color: palette.warn, fontFamily: fonts.heading, fontWeight: 900, fontSize: 110, letterSpacing: 2, textShadow: `0 0 30px ${palette.warn}` }}>
          A SPARK ⚡
        </div>
      </div>

      {/* Central lightning burst */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 600, height: 600 }}>
          {/* flash core */}
          <div
            style={{
              position: "absolute",
              inset: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${palette.warn}, ${palette.accent} 40%, transparent 70%)`,
              transform: `scale(${sparkScale * (1 + Math.sin(frame / 3) * 0.1)})`,
              filter: `blur(2px)`,
              opacity: boltOp,
            }}
          />

          {/* radial rays */}
          {Array.from({ length: rays }).map((_, i) => {
            const angle = (i / rays) * Math.PI * 2;
            const len = 260 * sparkScale + Math.sin(frame / 3 + i) * 14;
            const x2 = 300 + Math.cos(angle) * len;
            const y2 = 300 + Math.sin(angle) * len;
            return (
              <svg key={i} width={600} height={600} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <line
                  x1={300}
                  y1={300}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? palette.warn : palette.accent}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={boltOp}
                  style={{ filter: `drop-shadow(0 0 12px ${palette.accent})` }}
                />
              </svg>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 0,
          right: 0,
          textAlign: "center",
          color: palette.text,
          fontFamily: fonts.mono,
          fontSize: 28,
          letterSpacing: 4,
          opacity: interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        TINY VOLTAGE · ENOUGH TO POWER A CHIP
      </div>
    </AbsoluteFill>
  );
};

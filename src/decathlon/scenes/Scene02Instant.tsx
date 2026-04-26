import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 02 INSTANT — "and it instantly calculates your total" (120f / 4s)
export const Scene02Instant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ticker counting up
  const tickProgress = interpolate(frame, [10, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const final = 2499;
  const current = Math.round(final * tickProgress);

  const numberSpring = spring({ frame: frame - 58, fps, config: { damping: 10, stiffness: 200 } });
  const thump = interpolate(numberSpring, [0, 1], [1.2, 1]);

  const labelOp = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = 20 + Math.sin(frame / 6) * 10;

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            opacity: labelOp,
            color: palette.accent,
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: 16,
            textShadow: `0 0 16px ${palette.accent}`,
          }}
        >
          YOUR TOTAL
        </div>

        <div
          style={{
            transform: `scale(${thump})`,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 260,
            color: palette.text,
            letterSpacing: -8,
            textShadow: `0 0 ${glow}px ${palette.accent}, 0 0 ${glow * 2}px ${palette.blue}88`,
            lineHeight: 1,
          }}
        >
          ₹{current.toLocaleString("en-IN")}
        </div>

        <div
          style={{
            marginTop: 24,
            opacity: interpolate(frame, [65, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            padding: "14px 36px",
            borderRadius: 999,
            border: `2px solid ${palette.success}`,
            background: `${palette.success}22`,
            color: palette.success,
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 4,
            textShadow: `0 0 14px ${palette.success}`,
          }}
        >
          INSTANTLY
        </div>
      </div>
    </AbsoluteFill>
  );
};

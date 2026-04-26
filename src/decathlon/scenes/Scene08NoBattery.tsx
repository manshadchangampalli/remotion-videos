import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 08 NO BATTERY — "Notice, no battery. So how does it turn on?" (150f / 5s)
export const Scene08NoBattery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const battSpring = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 140 } });
  const battScale = interpolate(battSpring, [0, 1], [0.3, 1]);

  const slash = interpolate(frame, [32, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX = frame > 30 && frame < 60 ? Math.sin(frame * 3) * 6 : 0;

  const qSpring = spring({ frame: frame - 80, fps, config: { damping: 10, stiffness: 200 } });
  const qScale = interpolate(qSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 }}>
        <div
          style={{
            color: palette.warn,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 58,
            letterSpacing: 10,
            textShadow: `0 0 20px ${palette.warn}`,
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          NOTICE:
        </div>

        <div style={{ position: "relative", transform: `scale(${battScale}) translateX(${shakeX}px)` }}>
          {/* Battery icon */}
          <svg width={440} height={220} viewBox="0 0 220 110">
            <rect x={6} y={15} width={180} height={80} rx={10} fill="none" stroke={palette.text} strokeWidth={5} />
            <rect x={186} y={40} width={18} height={30} rx={4} fill={palette.text} />
            <rect x={20} y={30} width={50} height={50} fill={palette.success} opacity={0.2} />
            <rect x={76} y={30} width={50} height={50} fill={palette.success} opacity={0.15} />
            <rect x={132} y={30} width={50} height={50} fill={palette.success} opacity={0.1} />
          </svg>
          {/* Red slash */}
          <svg width={500} height={280} viewBox="0 0 500 280" style={{ position: "absolute", top: -30, left: -30 }}>
            <line
              x1={60}
              y1={30}
              x2={60 + 380 * slash}
              y2={30 + 220 * slash}
              stroke={palette.danger}
              strokeWidth={16}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 20px ${palette.danger})` }}
            />
          </svg>
        </div>

        <div
          style={{
            color: palette.danger,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 78,
            letterSpacing: 4,
            textShadow: `0 0 22px ${palette.danger}`,
            opacity: interpolate(frame, [50, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          NO BATTERY
        </div>

        <div
          style={{
            transform: `scale(${qScale})`,
            color: palette.accent,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 88,
            letterSpacing: 2,
            textShadow: `0 0 28px ${palette.accent}`,
          }}
        >
          SO HOW?
        </div>
      </div>
    </AbsoluteFill>
  );
};

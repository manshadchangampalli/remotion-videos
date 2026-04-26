import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 11 INDUCTION — "Through a process called electromagnetic induction" (150f / 5s)
export const Scene11Induction: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sine wave hitting antenna coil
  const waveProgress = interpolate(frame, [10, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Build sine path
  const pts: string[] = [];
  const amp = 60;
  const cycles = 3;
  for (let x = 0; x <= 700 * waveProgress; x += 4) {
    const y = Math.sin((x / 700) * Math.PI * 2 * cycles + frame / 4) * amp;
    pts.push(`${x === 0 ? "M" : "L"}${x},${y + 150}`);
  }

  const labelOp = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const formulaOp = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", opacity: labelOp }}>
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 34, letterSpacing: 8 }}>
          PROCESS:
        </div>
        <div
          style={{
            color: palette.text,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 72,
            letterSpacing: -1,
            marginTop: 6,
            textShadow: `0 0 22px ${palette.accent}`,
          }}
        >
          ELECTROMAGNETIC<br />INDUCTION
        </div>
      </div>

      {/* Wave → Antenna coil illustration */}
      <div
        style={{
          position: "absolute",
          top: 780,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* Wave */}
        <svg width={720} height={320} viewBox="0 0 720 320" style={{ filter: `drop-shadow(0 0 16px ${palette.accent})` }}>
          <path d={pts.join(" ")} fill="none" stroke={palette.accent} strokeWidth={5} strokeLinecap="round" />
          <text x={20} y={60} fontFamily="'JetBrains Mono'" fontSize={20} fill={palette.accent}>
            RF WAVE →
          </text>
        </svg>

        {/* Coil (antenna) */}
        <svg width={220} height={260} viewBox="0 0 220 260">
          <defs>
            <linearGradient id="coil-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.warn} />
              <stop offset="100%" stopColor={palette.accent} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={i}
              cx={110}
              cy={60 + i * 34}
              rx={80}
              ry={14}
              fill="none"
              stroke="url(#coil-g)"
              strokeWidth={5}
              opacity={0.6 + Math.sin(frame / 5 + i) * 0.3}
              filter={`drop-shadow(0 0 8px ${palette.accent})`}
            />
          ))}
          <text x={110} y={240} textAnchor="middle" fontFamily="'JetBrains Mono'" fontSize={18} fill={palette.text}>
            ANTENNA COIL
          </text>
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: formulaOp,
          color: palette.success,
          fontFamily: fonts.mono,
          fontSize: 32,
          letterSpacing: 2,
          textShadow: `0 0 14px ${palette.success}`,
        }}
      >
        WAVE + COIL ⇒ ELECTRICITY
      </div>
    </AbsoluteFill>
  );
};

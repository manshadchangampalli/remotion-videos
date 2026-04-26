import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 06 CHIP REVEAL — "microscopic computer chip" (120f / 4s)
export const Scene06ChipReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const zoom = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 80 } });
  const chipScale = interpolate(zoom, [0, 1], [0.2, 1]);

  const pulse = 1 + Math.sin(frame / 6) * 0.03;
  const glow = 40 + Math.sin(frame / 5) * 18;

  // pulse rings emanating
  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
        <div
          style={{
            color: palette.accent,
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: 10,
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          ZOOM IN 1000×
        </div>

        <div style={{ position: "relative", width: 620, height: 620, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* animated orbit rings */}
          {[0, 1, 2].map((i) => {
            const ringScale = 1 + (frame % 40) / 40 * (0.6 + i * 0.3);
            const ringOp = 0.5 - (frame % 40) / 40;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  border: `2px solid ${palette.accent}`,
                  transform: `scale(${ringScale})`,
                  opacity: Math.max(0, ringOp),
                }}
              />
            );
          })}

          {/* microchip */}
          <div style={{ transform: `scale(${chipScale * pulse})`, filter: `drop-shadow(0 0 ${glow}px ${palette.accent})` }}>
            <svg width={380} height={380} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chip-face" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2a2a2a" />
                  <stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>
              </defs>
              <rect x={20} y={20} width={60} height={60} rx={4} fill="url(#chip-face)" stroke={palette.accent} strokeWidth={1.2} />
              {/* pins */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <React.Fragment key={i}>
                  <rect x={12} y={24 + i * 9} width={8} height={4} fill={palette.blue} />
                  <rect x={80} y={24 + i * 9} width={8} height={4} fill={palette.blue} />
                  <rect x={24 + i * 9} y={12} width={4} height={8} fill={palette.blue} />
                  <rect x={24 + i * 9} y={80} width={4} height={8} fill={palette.blue} />
                </React.Fragment>
              ))}
              {/* inner circuits */}
              <rect x={32} y={32} width={36} height={36} rx={2} fill="none" stroke={palette.accent} strokeWidth={0.4} opacity={0.6} />
              <circle cx={50} cy={50} r={6} fill={palette.accent} opacity={0.8 + Math.sin(frame / 4) * 0.2} />
              <text x={50} y={54} textAnchor="middle" fill="#0a0a0a" fontFamily="'JetBrains Mono'" fontWeight={700} fontSize={6}>
                EPC
              </text>
            </svg>
          </div>
        </div>

        <div
          style={{
            color: palette.text,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 68,
            letterSpacing: 2,
            textAlign: "center",
            textShadow: `0 0 22px ${palette.accent}`,
            opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          MICROSCOPIC<br />COMPUTER CHIP
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 14 BOUNCE — "bounces back its electronic product code" (150f / 5s)
export const Scene14Bounce: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Packet flies from chip (left) to reader (right)
  const packetX = interpolate(frame, [20, 85], [220, 860], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packetOp = interpolate(frame, [18, 24, 80, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const labelOp = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const codeOp = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", opacity: labelOp }}>
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 36, letterSpacing: 8 }}>
          CHIP SENDS BACK
        </div>
        <div style={{ color: palette.text, fontFamily: fonts.heading, fontWeight: 900, fontSize: 72, letterSpacing: -1, marginTop: 4 }}>
          ELECTRONIC PRODUCT CODE
        </div>
      </div>

      {/* Chip on left, reader on right */}
      <div style={{ position: "absolute", top: 800, left: 0, right: 0, height: 400 }}>
        {/* chip */}
        <div style={{ position: "absolute", left: 100, top: 100, width: 180, height: 180, borderRadius: 16, background: "#111", border: `2px solid ${palette.accent}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${palette.accent}77` }}>
          <div style={{ color: palette.accent, fontFamily: fonts.mono, fontSize: 20, letterSpacing: 2 }}>CHIP</div>
        </div>
        {/* reader */}
        <div style={{ position: "absolute", right: 100, top: 80, width: 220, height: 220, borderRadius: 24, background: `linear-gradient(135deg, ${palette.blueDeep}, ${palette.bg})`, border: `2px solid ${palette.accent}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${palette.accent}77` }}>
          <div style={{ fontSize: 68 }}>📡</div>
        </div>

        {/* flying packet */}
        <div
          style={{
            position: "absolute",
            left: packetX,
            top: 170,
            transform: "translate(-50%, -50%)",
            opacity: packetOp,
            padding: "12px 20px",
            borderRadius: 10,
            background: `linear-gradient(90deg, ${palette.accent}, ${palette.blue})`,
            color: "#041829",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            boxShadow: `0 0 30px ${palette.accent}`,
            whiteSpace: "nowrap",
          }}
        >
          EPC: 4902115
        </div>

        {/* trail */}
        <svg width={1080} height={400} style={{ position: "absolute", inset: 0 }}>
          <line x1={280} y1={190} x2={packetX} y2={190} stroke={palette.accent} strokeWidth={3} strokeDasharray="6 6" opacity={packetOp * 0.6} style={{ filter: `drop-shadow(0 0 8px ${palette.accent})` }} />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: codeOp,
          color: palette.success,
          fontFamily: fonts.mono,
          fontSize: 34,
          letterSpacing: 3,
          textShadow: `0 0 14px ${palette.success}`,
        }}
      >
        ✓ RECEIVED
      </div>
    </AbsoluteFill>
  );
};

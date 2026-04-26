import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "./palette";

interface Props {
  appearFrame: number;
  icon: string;
  label: string;
  sn: string;
  price: string;
  accent?: string;
}

export const ItemListRow: React.FC<Props> = ({
  appearFrame,
  icon,
  label,
  sn,
  price,
  accent = palette.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearFrame;

  const s = spring({ frame: local, fps, config: { damping: 14, stiffness: 170 } });
  const tx = interpolate(s, [0, 1], [-60, 0]);
  const op = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "18px 26px",
        background: "rgba(0,130,195,0.08)",
        border: `1px solid ${accent}33`,
        borderRadius: 16,
        opacity: op,
        transform: `translateX(${tx}px)`,
        boxShadow: `0 0 24px ${accent}14`,
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${palette.blue}, ${palette.blueDeep})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: palette.text, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>{label}</div>
        <div
          style={{
            color: palette.textDim,
            fontSize: 18,
            fontFamily: "'JetBrains Mono', monospace",
            marginTop: 4,
            letterSpacing: 1,
          }}
        >
          {sn}
        </div>
      </div>
      <div
        style={{
          color: accent,
          fontSize: 30,
          fontWeight: 800,
          fontFamily: "'Montserrat', sans-serif",
          textShadow: `0 0 14px ${accent}66`,
        }}
      >
        {price}
      </div>
    </div>
  );
};

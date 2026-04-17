import React from "react";
import { interpolate } from "remotion";

interface ClickRippleProps {
  frame: number;
  triggerFrame: number;
  x: number;
  y: number;
  color?: string;
  maxRadius?: number;
}

/** Visual ripple burst at (x, y) triggered at triggerFrame */
export const ClickRipple: React.FC<ClickRippleProps> = ({
  frame,
  triggerFrame,
  x,
  y,
  color = "#00f2ff",
  maxRadius = 80,
}) => {
  const t = frame - triggerFrame;
  if (t < 0 || t > 28) return null;

  const r1 = interpolate(t, [0, 22], [4, maxRadius], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o1 = interpolate(t, [0, 4, 22], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r2 = interpolate(t, [4, 28], [4, maxRadius * 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o2 = interpolate(t, [4, 8, 28], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <circle cx={x} cy={y} r={r1} fill="none" stroke={color} strokeWidth={3} opacity={o1} />
      <circle cx={x} cy={y} r={r2} fill="none" stroke={color} strokeWidth={1.5} opacity={o2} />
    </svg>
  );
};

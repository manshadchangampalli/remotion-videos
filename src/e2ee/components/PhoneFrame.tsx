import React from "react";

interface PhoneFrameProps {
  x: number;
  y: number;
  width: number;
  height: number;
  glowColor: string;
  screenContent?: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  x,
  y,
  width: w,
  height: h,
  glowColor,
  screenContent,
}) => {
  const rx = 30;
  const screenPad = 14;
  const screenTop = 52;
  const screenBottom = 40;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* SVG frame */}
      <svg
        width={w}
        height={h}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {/* Outer glow ring */}
        <rect
          x={-3}
          y={-3}
          width={w + 6}
          height={h + 6}
          rx={rx + 3}
          fill="none"
          stroke={glowColor}
          strokeWidth={10}
          opacity={0.1}
        />
        {/* Phone body */}
        <rect
          x={2}
          y={2}
          width={w - 4}
          height={h - 4}
          rx={rx}
          fill="rgba(5,12,22,0.97)"
          stroke={glowColor}
          strokeWidth={2}
        />
        {/* Side volume buttons */}
        <rect
          x={0}
          y={h * 0.22}
          width={3}
          height={34}
          rx={2}
          fill={glowColor}
          opacity={0.45}
        />
        <rect
          x={0}
          y={h * 0.32}
          width={3}
          height={34}
          rx={2}
          fill={glowColor}
          opacity={0.45}
        />
        {/* Power button */}
        <rect
          x={w - 3}
          y={h * 0.27}
          width={3}
          height={44}
          rx={2}
          fill={glowColor}
          opacity={0.45}
        />
        {/* Camera pill */}
        <rect
          x={w / 2 - 18}
          y={12}
          width={36}
          height={14}
          rx={7}
          fill="rgba(0,0,0,0.9)"
          stroke={glowColor}
          strokeWidth={0.8}
          opacity={0.55}
        />
        <circle cx={w / 2 + 8} cy={19} r={3} fill={glowColor} opacity={0.35} />
        {/* Screen area */}
        <rect
          x={screenPad}
          y={screenTop}
          width={w - screenPad * 2}
          height={h - screenTop - screenBottom}
          rx={8}
          fill="rgba(5,20,12,0.65)"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
        {/* Home indicator bar */}
        <rect
          x={(w - 60) / 2}
          y={h - 22}
          width={60}
          height={4}
          rx={2}
          fill={glowColor}
          opacity={0.4}
        />
      </svg>

      {/* Screen content overlay */}
      {screenContent && (
        <div
          style={{
            position: "absolute",
            left: screenPad,
            top: screenTop,
            width: w - screenPad * 2,
            height: h - screenTop - screenBottom,
            overflow: "hidden",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "10px 8px",
            gap: 8,
          }}
        >
          {screenContent}
        </div>
      )}
    </div>
  );
};

import React from "react";

interface IPhoneFrameProps {
  width?: number;
  height?: number;
  glowColor?: string;
  screenContent?: React.ReactNode;
  style?: React.CSSProperties;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  width = 320,
  height = 640,
  glowColor = "#00f2ff",
  screenContent,
  style,
}) => {
  const rx = 44;
  const screenPadX = 16;
  const screenTop = 56;
  const screenBottom = 32;
  const screenW = width - screenPadX * 2;
  const screenH = height - screenTop - screenBottom;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
      {/* Outer glow */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <filter id="phoneGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Shadow glow ring */}
        <rect
          x={-6}
          y={-6}
          width={width + 12}
          height={height + 12}
          rx={rx + 6}
          fill="none"
          stroke={glowColor}
          strokeWidth={12}
          opacity={0.12}
        />
        {/* Phone body */}
        <rect
          x={2}
          y={2}
          width={width - 4}
          height={height - 4}
          rx={rx}
          fill="#0a0a0a"
          stroke={glowColor}
          strokeWidth={2.5}
          filter="url(#phoneGlow)"
        />
        {/* Dynamic Island pill */}
        <rect
          x={width / 2 - 36}
          y={14}
          width={72}
          height={22}
          rx={11}
          fill="#000"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />
        {/* Volume buttons */}
        <rect x={-2} y={height * 0.2} width={4} height={36} rx={2} fill={glowColor} opacity={0.4} />
        <rect x={-2} y={height * 0.3} width={4} height={36} rx={2} fill={glowColor} opacity={0.4} />
        {/* Power button */}
        <rect x={width - 2} y={height * 0.25} width={4} height={52} rx={2} fill={glowColor} opacity={0.4} />
        {/* Screen bezel */}
        <rect
          x={screenPadX}
          y={screenTop}
          width={screenW}
          height={screenH}
          rx={10}
          fill="#050505"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
        {/* Home indicator */}
        <rect
          x={(width - 80) / 2}
          y={height - 20}
          width={80}
          height={4}
          rx={2}
          fill={glowColor}
          opacity={0.35}
        />
      </svg>

      {/* Screen content */}
      {screenContent && (
        <div
          style={{
            position: "absolute",
            left: screenPadX,
            top: screenTop,
            width: screenW,
            height: screenH,
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          {screenContent}
        </div>
      )}
    </div>
  );
};

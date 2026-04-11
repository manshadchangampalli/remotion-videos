import React from "react";

interface DataPacketProps {
  x: number;
  y: number;
  glowColor?: string;
  size?: number;
  opacity?: number;
}

export const DataPacket: React.FC<DataPacketProps> = ({
  x,
  y,
  glowColor = "#FF1744",
  size = 62,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size * 0.18,
        background: `rgba(4,8,16,0.92)`,
        border: `2px solid ${glowColor}`,
        boxShadow: `0 0 ${size * 0.35}px ${glowColor},
                    0 0 ${size * 0.7}px ${glowColor}44,
                    inset 0 0 ${size * 0.2}px ${glowColor}22`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translate(-50%, -50%)",
        opacity,
      }}
    >
      {/* Padlock icon */}
      <svg
        width={size * 0.48}
        height={size * 0.48}
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect
          x="3"
          y="11"
          width="18"
          height="12"
          rx="2.5"
          stroke={glowColor}
          strokeWidth="2"
        />
        <path
          d="M7 11V7.5a5 5 0 0 1 10 0V11"
          stroke={glowColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.5" r="1.5" fill={glowColor} />
      </svg>
    </div>
  );
};

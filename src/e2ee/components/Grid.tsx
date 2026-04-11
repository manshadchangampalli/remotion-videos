import React from "react";
import { useCurrentFrame } from "remotion";

interface GridProps {
  tint?: string;
  zoom?: number;
}

export const Grid: React.FC<GridProps> = ({
  tint = "rgba(0, 229, 255, 0.06)",
  zoom = 1,
}) => {
  const frame = useCurrentFrame();
  const cols = 24;
  const rows = 48;
  const W = 1080;
  const H = 1920;
  const colW = W / cols;
  const rowH = H / rows;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "800px",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "150%",
          transform: `rotateX(55deg) scale(${zoom}) translateY(-20%)`,
          transformOrigin: "50% 80%",
        }}
      >
        <svg
          width={W}
          height={H * 1.5}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {Array.from({ length: cols + 1 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * colW}
              y1={0}
              x2={i * colW}
              y2={H * 1.5}
              stroke={tint}
              strokeWidth={0.8}
              opacity={0.4 + Math.sin(frame / 20 + i * 0.3) * 0.15}
            />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * rowH}
              x2={W}
              y2={i * rowH}
              stroke={tint}
              strokeWidth={0.8}
              opacity={0.4 + Math.sin(frame / 20 + i * 0.3) * 0.15}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

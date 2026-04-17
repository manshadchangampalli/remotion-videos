import React from "react";
import { useCurrentFrame } from "remotion";

interface CyberGridProps {
  opacity?: number;
  color?: string;
}

export const CyberGrid: React.FC<CyberGridProps> = ({
  opacity = 1,
  color = "#1a1a1a",
}) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.35;
  const cols = 20;
  const rows = 36;
  const cellW = 1080 / cols;
  const cellH = 1920 / rows;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "900px",
        perspectiveOrigin: "540px 960px",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "rotateX(52deg)",
          transformOrigin: "center 70%",
        }}
      >
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {Array.from({ length: cols + 1 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * cellW}
              y1={-drift % cellH}
              x2={i * cellW}
              y2={1920}
              stroke={color}
              strokeWidth={0.8}
              opacity={0.5 + Math.sin(frame / 25 + i * 0.4) * 0.15}
            />
          ))}
          {Array.from({ length: rows + 2 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * cellH - (drift % cellH)}
              x2={1080}
              y2={i * cellH - (drift % cellH)}
              stroke={color}
              strokeWidth={0.6}
              opacity={0.4 + Math.sin(frame / 30 + i * 0.3) * 0.1}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

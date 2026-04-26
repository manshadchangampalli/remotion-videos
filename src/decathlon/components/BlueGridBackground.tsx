import React from "react";
import { useCurrentFrame } from "remotion";
import { palette } from "./palette";

interface Props {
  opacity?: number;
  color?: string;
  accent?: string;
}

export const BlueGridBackground: React.FC<Props> = ({
  opacity = 1,
  color = "rgba(0,130,195,0.25)",
  accent = palette.accent,
}) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.4;
  const cols = 18;
  const rows = 32;
  const cellW = 1080 / cols;
  const cellH = 1920 / rows;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, ${palette.bgSoft} 0%, ${palette.bg} 70%)`,
        pointerEvents: "none",
        opacity,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: "900px",
          perspectiveOrigin: "540px 960px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(50deg)",
            transformOrigin: "center 70%",
          }}
        >
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: cols + 1 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={i * cellW}
                y1={-drift % cellH}
                x2={i * cellW}
                y2={1920}
                stroke={color}
                strokeWidth={0.8}
                opacity={0.55 + Math.sin(frame / 28 + i * 0.35) * 0.2}
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
                opacity={0.45 + Math.sin(frame / 32 + i * 0.25) * 0.15}
              />
            ))}
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 30%, ${palette.bg} 85%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}1a 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
};

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Terrain3D } from "../components/Terrain3D";

export const Scene06TerrainHold: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow horizontal camera drift
  const driftX = Math.sin(frame / 45) * 40;
  const driftY = Math.cos(frame / 60) * 15;

  // Subtle zoom breathe
  const breatheScale = 1 + Math.sin(frame / 38) * 0.025;

  const sceneOp = interpolate(frame, [0, 12, 78, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      <CyberGrid opacity={0.2} />

      {/* Terrain with camera drift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${driftX}px, ${driftY}px) scale(${breatheScale})`,
          transformOrigin: "center center",
        }}
      >
        <Terrain3D frame={frame} />
      </div>

      {/* Ambient glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 65%, rgba(255,140,0,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle frequency label lines */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.25 }}
      >
        {[200, 400, 800, 1600, 3200].map((freq, i) => (
          <g key={i}>
            <text
              x={28}
              y={1350 - i * 80}
              fill="#00f2ff"
              fontSize={14}
              fontFamily="'Courier New', monospace"
              opacity={0.5}
            >
              {freq}Hz
            </text>
            <line
              x1={90}
              y1={1350 - i * 80}
              x2={1060}
              y2={1350 - i * 80}
              stroke="#00f2ff"
              strokeWidth={0.5}
              strokeDasharray="6 8"
              opacity={0.2}
            />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { palette } from "./palette";

interface Props {
  count?: number;
  color?: string;
  size?: number;
  cycleFrames?: number;
  startFrame?: number;
  maxScale?: number;
}

export const RadioWaveRings: React.FC<Props> = ({
  count = 4,
  color = palette.accent,
  size = 520,
  cycleFrames = 55,
  startFrame = 0,
  maxScale = 2.6,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const delay = i * Math.floor(cycleFrames / count);
        const l = Math.max(0, local - delay);
        if (l <= 0) return null;
        const t = (l % cycleFrames) / cycleFrames;
        const scale = interpolate(t, [0, 1], [0.15, maxScale]);
        const opacity = interpolate(t, [0, 0.12, 0.85, 1], [0, 0.85, 0.08, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `4px solid ${color}`,
              opacity,
              transform: `scale(${scale})`,
              boxShadow: `0 0 50px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

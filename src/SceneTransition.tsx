import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export const SceneTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const scale = interpolate(spr, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1]);

  return (
    <AbsoluteFill className="bg-white flex items-center justify-center">
      <div style={{ transform: `scale(${scale})`, opacity }} className="text-center">
        <h1 className="text-9xl font-black uppercase tracking-tighter text-brand-primary italic">
          Microservices
        </h1>
        <div className="h-4 w-64 bg-brand-primary mx-auto mt-8 rounded-full" />
      </div>
    </AbsoluteFill>
  );
};

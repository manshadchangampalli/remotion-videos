import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 10 },
  });

  const scale = interpolate(spr, [0, 1], [0.8, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1]);

  return (
    <AbsoluteFill className="bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Background Glow */}
        <div className="absolute w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px]" />
        
        <div style={{ transform: `scale(${scale})`, opacity }} className="z-10 text-center px-10">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-none mb-4">
            Monolithic <br />
            <span className="text-brand-primary italic">vs</span> <br />
            Microservices
          </h1>
          <div className="h-2 w-48 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full" />
        </div>

        <div className="absolute bottom-20 flex gap-10 z-10">
          <Img 
            src={staticFile("monolithic-logo.png")} 
            className="w-32 h-32 object-contain"
          />
          <Img 
            src={staticFile("microservices-logo.png")} 
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

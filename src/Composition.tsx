import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DataFlowScene } from "./DataFlowScene";
import { Captions } from "./Captions";
import captionsListData from "../public/captions.json";
import type { Caption } from "@remotion/captions";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Active step calculation based on frame ranges from audio transcription
  let activeStep = 0;
  if (frame > 210) activeStep = 1; // Load Balancer
  if (frame > 420) activeStep = 2; // Redis Cache
  if (frame > 900) activeStep = 3; // NoSQL DB lookup
  if (frame > 1650) activeStep = 4; // Redirect/Analytics
  if (frame > 2100) activeStep = 5; // Final Destination

  return (
    <AbsoluteFill className="bg-white font-['Outfit']">
      <Audio src={staticFile("short-url.wav")} />
      
      {/* Visual Data Flow Scene with Cartoon Assets */}
      <DataFlowScene activeStep={activeStep} />

      {/* Final Refined TikTok-style Captions (V3) */}
      <Captions captions={captionsListData as Caption[]} />

      {/* Header Label */}
      <div className="absolute top-20 left-0 right-0 text-center">
        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic scale-125 z-10 bg-white/40 px-6 py-2 rounded-full inline-block backdrop-blur-sm">
          How Short URLs Work
        </h2>
      </div>
    </AbsoluteFill>
  );
};

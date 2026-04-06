import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
} from "remotion";
import { Captions } from "./Captions";
import captionsListData from "../public/captions.json";
import type { Caption } from "@remotion/captions";

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill className="bg-white font-['Outfit']">
      <Audio src={staticFile("short-url.wav")} />
      
      {/* Final Refined TikTok-style Captions (V3) over a clean background */}
      <Captions captions={captionsListData as Caption[]} />
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { Scene1Intro } from "./Scene1Intro";
import { Scene2Monolith } from "./Scene2Monolith";
import { Scene3Microservices } from "./Scene3Microservices";
import { Scene4Conclusion } from "./Scene4Conclusion";
import { Captions } from "./Captions";
import captionsData from "../public/captions.json";
import type { Caption } from "@remotion/captions";

export const MyComposition: React.FC = () => {

  // Timing based on the script and captions (approximate frame marks)
  // Intro: 0 - 9s (~270 frames)
  // Monolith: 9s - 45s (~1080 frames)
  // Microservices: 45s - 85s (~1200 frames)
  // Conclusion: 85s - end

  return (
    <AbsoluteFill className="bg-black">
      <Audio src={staticFile("monolithicvsmicroservices.mp3")} />
      
      <Sequence from={0} durationInFrames={270}>
        <Scene1Intro />
      </Sequence>

      <Sequence from={270} durationInFrames={1080}>
        <Scene2Monolith />
      </Sequence>

      <Sequence from={1350} durationInFrames={1100}>
        <Scene3Microservices />
      </Sequence>

      <Sequence from={2450}>
        <Scene4Conclusion />
      </Sequence>

      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

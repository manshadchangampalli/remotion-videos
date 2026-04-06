import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { Scene1Intro } from "./Scene1Intro";
import { Scene2Monolith } from "./Scene2Monolith";
import { SceneTransition } from "./SceneTransition";
import { Scene3Microservices } from "./Scene3Microservices";
import { Scene4Conclusion } from "./Scene4Conclusion";
import { Captions } from "./Captions";
import captionsData from "../public/captions.json";
import type { Caption } from "@remotion/captions";

export const MyComposition: React.FC = () => {

  // Timing adjusted for requested transition at 00:41.14 (frame 1234)
  // Scene 1: 0 - 270 frames (9s)
  // Scene 2: 270 - 1234 frames (starts at 9s, ends at 41.14s)
  // Transition: 1234 - 1294 frames (roughly 2s)
  // Scene 3: 1294 - 2394 frames (shifted by transition)
  // Scene 4: 2394 - end

  return (
    <AbsoluteFill className="bg-white">
      <Audio src={staticFile("audio.wav")} />
      
      <Sequence from={0} durationInFrames={270}>
        <Scene1Intro />
      </Sequence>

      <Sequence from={270} durationInFrames={964}>
        <Scene2Monolith />
      </Sequence>

      <Sequence from={1234} durationInFrames={60}>
        <SceneTransition />
      </Sequence>

      <Sequence from={1294} durationInFrames={1100}>
        <Scene3Microservices />
      </Sequence>

      <Sequence from={2394}>
        <Scene4Conclusion />
      </Sequence>

      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

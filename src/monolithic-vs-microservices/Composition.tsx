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
import captionsData from "../../public/monolithic-vs-microservices/captions.json";
import type { Caption } from "@remotion/captions";

export const MyComposition: React.FC = () => {

  // Timing adjusted for requested transition at 00:42.0 (frame 1260)
  // Scene 1: 0 - 276 frames (9.2s)
  // Scene 2: 276 - 1260 frames (starts at 9.2s, ends at 42.0s)
  // Transition: 1260 - 1320 frames (2s)
  // Scene 3: 1320 - 2480 frames
  // Scene 4: 2480 - end

  return (
    <AbsoluteFill className="bg-white">
      <Audio src={staticFile("monolithic-vs-microservices/audio.wav")} />
      
      <Sequence from={0} durationInFrames={276}>
        <Scene1Intro />
      </Sequence>

      <Sequence from={276} durationInFrames={984}>
        <Scene2Monolith />
      </Sequence>

      <Sequence from={1260} durationInFrames={60}>
        <SceneTransition />
      </Sequence>

      <Sequence from={1332} durationInFrames={1148}>
        <Scene3Microservices />
      </Sequence>

      <Sequence from={2480}>
        <Scene4Conclusion />
      </Sequence>

      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

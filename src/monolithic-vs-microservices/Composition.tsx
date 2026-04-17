import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { Scene1Intro } from "./Scene1Intro";

const SFX = {
  woosh:  "sound-effects/mixkit-air-woosh-1489.wav",
  zoom:   "sound-effects/mixkit-air-zoom-vacuum-2608.wav",
  arrow:  "sound-effects/mixkit-arrow-whoosh-1491.wav",
  bleeps: "sound-effects/mixkit-clock-countdown-bleeps-916.wav",
  typing: "sound-effects/mixkit-keyboard-typing-1386.wav",
  cheer:  "sound-effects/mixkit-small-group-cheer-and-applause-518.wav",
};
interface SfxProps { src: string; from: number; dur?: number; vol?: number; }
const Sfx: React.FC<SfxProps> = ({ src, from, dur = 60, vol = 0.4 }) => (
  <Sequence from={from} durationInFrames={dur}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);
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

      {/* ── Sound Effects ── */}
      <Sfx src={SFX.woosh}  from={0}    dur={45}  vol={0.4} />  {/* Intro */}
      <Sfx src={SFX.typing} from={276}  dur={90}  vol={0.35} /> {/* Monolith */}
      <Sfx src={SFX.zoom}   from={1260} dur={45}  vol={0.4} />  {/* Transition */}
      <Sfx src={SFX.arrow}  from={1332} dur={35}  vol={0.4} />  {/* Microservices */}
      <Sfx src={SFX.cheer}  from={2480} dur={150} vol={0.5} />  {/* Conclusion */}

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

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

      {/* ── Sound Effects ─────────────────────────────────────────────────
          Scene 1 — Intro: reveal sweep
          Scene 2 — Monolith building appears at f18, caption at f55; crash springs
                    at f40 (within crash section, ~276+320+40≈636), war at f65
          Transition — sharp impact as the wall of text slams
          Scene 3 — Microservices: services appear at f20, gateway at f191, stats at f120
          Scene 4 — Conclusion: cheer at the happy ending
      */}
      <Sfx src={SFX.woosh}  from={0}          dur={70}  vol={0.42} />
      <Sfx src={SFX.zoom}   from={276 + 18}   dur={38}  vol={0.50} />
      <Sfx src={SFX.zoom}   from={276 + 55}   dur={38}  vol={0.48} />
      <Sfx src={SFX.zoom}   from={276 + 80}   dur={38}  vol={0.50} />
      <Sfx src={SFX.zoom}   from={1260}       dur={38}  vol={0.55} />
      <Sfx src={SFX.zoom}   from={1332 + 20}  dur={38}  vol={0.50} />
      <Sfx src={SFX.arrow}  from={1332 + 55}  dur={33}  vol={0.42} />
      <Sfx src={SFX.zoom}   from={1332 + 120} dur={38}  vol={0.48} />
      <Sfx src={SFX.zoom}   from={1332 + 191} dur={38}  vol={0.50} />
      <Sfx src={SFX.cheer}  from={2480}       dur={45}  vol={0.32} />

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

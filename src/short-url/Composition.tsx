import React from "react";
import { AbsoluteFill, Audio, staticFile, Sequence } from "remotion";
import { Captions } from "./Captions";
import captionsListData from "../../public/short-url/captions.json";
import type { Caption } from "@remotion/captions";

import { HookScene } from "./scenes/HookScene";

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
import { Step1Scene } from "./scenes/Step1Scene";
import { Step2Scene } from "./scenes/Step2Scene";
import { Step3Scene } from "./scenes/Step3Scene";
import { Step4Scene } from "./scenes/Step4Scene";
import { OutroScene } from "./scenes/OutroScene";

// Scene timing — derived from captions.json word timestamps (at 30fps):
//   Hook:   0ms   –  6320ms  → frames   0 –  189
//   Step 1: 6320ms – 24080ms → frames 190 –  722
//   Step 2: 24080ms– 39440ms → frames 722 – 1183
//   Step 3: 39440ms– 54200ms → frames 1183– 1626
//   Step 4: 54200ms– 73760ms → frames 1626– 2213
//   Outro:  73760ms– 77160ms → frames 2213– 2315

// Global sync offset (positive delays visuals, negative advances them)
// User says audio is too fast, so we advance visuals by ~400ms (12 frames)
const SYNC_OFFSET_FRAMES = -12; 

const fps = 30;
const getFrame = (ms: number) => Math.floor((ms / 1000) * fps) + SYNC_OFFSET_FRAMES;

const HOOK_START = 0;
const STEP1_START = getFrame(6320); 
const STEP2_START = getFrame(24080);
const STEP3_START = getFrame(39440);
const STEP4_START = getFrame(54200);
const OUTRO_START = getFrame(73760);

const HOOK_DUR = STEP1_START - HOOK_START;
const STEP1_DUR = STEP2_START - STEP1_START;
const STEP2_DUR = STEP3_START - STEP2_START;
const STEP3_DUR = STEP4_START - STEP3_START;
const STEP4_DUR = OUTRO_START - STEP4_START;
const OUTRO_DUR = 2318 - OUTRO_START;


export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050914", fontFamily: "Outfit, sans-serif" }}>
      <Audio src={staticFile("short-url/short-url.wav")} />

      {/* ── Sound Effects ── */}
      <Sfx src={SFX.zoom}   from={HOOK_START}  dur={45}  vol={0.4} />
      <Sfx src={SFX.arrow}  from={STEP1_START} dur={35}  vol={0.4} />
      <Sfx src={SFX.zoom}   from={STEP2_START} dur={45}  vol={0.4} />
      <Sfx src={SFX.typing} from={STEP3_START} dur={90}  vol={0.35} />
      <Sfx src={SFX.arrow}  from={STEP4_START} dur={35}  vol={0.4} />
      <Sfx src={SFX.cheer}  from={OUTRO_START} dur={150} vol={0.5} />

      {/* ── Hook: URL collapses → cursor clicks → dive into screen ── */}
      <Sequence from={HOOK_START} durationInFrames={HOOK_DUR} premountFor={30}>
        <HookScene />
      </Sequence>

      {/* ── Step 1: Load Balancer chaos → proper routing ── */}
      <Sequence from={STEP1_START} durationInFrames={STEP1_DUR} premountFor={30}>
        <Step1Scene />
      </Sequence>

      {/* ── Step 2: Redis cache HIT! ── */}
      <Sequence from={STEP2_START} durationInFrames={STEP2_DUR} premountFor={30}>
        <Step2Scene />
      </Sequence>

      {/* ── Step 3: NoSQL Database + key-value table ── */}
      <Sequence from={STEP3_START} durationInFrames={STEP3_DUR} premountFor={30}>
        <Step3Scene />
      </Sequence>

      {/* ── Step 4: HTTP 301 vs 302 Redirect comparison ── */}
      <Sequence from={STEP4_START} durationInFrames={STEP4_DUR} premountFor={30}>
        <Step4Scene />
      </Sequence>

      {/* ── Outro: Full architecture overview + 302 fires ── */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DUR} premountFor={30}>
        <OutroScene />
      </Sequence>

      {/* ── Captions always on top of every scene ── */}
      <Captions captions={captionsListData as Caption[]} />
    </AbsoluteFill>
  );
};

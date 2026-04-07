import React from "react";
import { AbsoluteFill, Audio, staticFile, Sequence } from "remotion";
import { Captions } from "./Captions";
import captionsListData from "../public/short-url/captions.json";
import type { Caption } from "@remotion/captions";

import { HookScene } from "./scenes/HookScene";
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

const HOOK_START = 0;
const HOOK_DUR = 190;

const STEP1_START = 190;
const STEP1_DUR = 532;

const STEP2_START = 722;
const STEP2_DUR = 461;

const STEP3_START = 1183;
const STEP3_DUR = 443;

const STEP4_START = 1626;
const STEP4_DUR = 587;

const OUTRO_START = 2213;
const OUTRO_DUR = 105;

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050914", fontFamily: "Outfit, sans-serif" }}>
      <Audio src={staticFile("short-url/short-url.wav")} />

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

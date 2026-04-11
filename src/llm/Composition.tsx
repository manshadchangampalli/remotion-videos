import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "@remotion/google-fonts/Montserrat";
import "@remotion/google-fonts/JetBrainsMono";
import "@remotion/google-fonts/Inter";
import { HookScene } from "./scenes/HookScene";
import { TokenScene } from "./scenes/TokenScene";
import { VectorScene } from "./scenes/VectorScene";
import { TransformerScene } from "./scenes/TransformerScene";
import { PredictionScene } from "./scenes/PredictionScene";
import { OutroScene } from "./scenes/OutroScene";
import { Captions } from "./Captions";
import captionsData from "../../public/llm-working/captions.json";
import type { Caption } from "@remotion/captions";

// Durations derived from whisper transcript timestamps:
//   Hook:        0:00-0:15  → 15s  = 450 frames
//   Token:       0:15-0:23  →  8s  = 240 frames
//   Vector:      0:23-0:37  → 14s  = 420 frames
//   Transformer: 0:37-1:28  → 51s  = 1530 frames
//   Prediction:  1:28-2:04  → 36s  = 1080 frames
//   Outro:       2:04-end   → 26.5s = 795 frames (visual outro, audio ends at 2:06)
const mf = (s: number) => Math.round(s * 30);

const HOOK_DUR        = mf(15);   // 450
const TOKEN_DUR       = mf(8);    // 240
const VECTOR_DUR      = mf(14);   // 420
const TRANSFORMER_DUR = mf(51);   // 1530
const PREDICTION_DUR  = mf(36);   // 1080
const OUTRO_DUR       = 75;       // 2.5s — matches audio end exactly (no silent frames)

const HOOK_S        = 0;
const TOKEN_S       = HOOK_S + HOOK_DUR;
const VECTOR_S      = TOKEN_S + TOKEN_DUR;
const TRANSFORMER_S = VECTOR_S + VECTOR_DUR;
const PREDICTION_S  = TRANSFORMER_S + TRANSFORMER_DUR;
const OUTRO_S       = PREDICTION_S + PREDICTION_DUR;

export const TOTAL_FRAMES = OUTRO_S + OUTRO_DUR; // 3795 — matches audio duration exactly (126.5s)

export const LLMComposition: React.FC = () => (
  <AbsoluteFill style={{ background: "#050505" }}>
    <Audio src={staticFile("llm-working/llm-working.wav")} />

    <Sequence from={HOOK_S} durationInFrames={HOOK_DUR}>
      <HookScene />
    </Sequence>
    <Sequence from={TOKEN_S} durationInFrames={TOKEN_DUR}>
      <TokenScene />
    </Sequence>
    <Sequence from={VECTOR_S} durationInFrames={VECTOR_DUR}>
      <VectorScene />
    </Sequence>
    <Sequence from={TRANSFORMER_S} durationInFrames={TRANSFORMER_DUR}>
      <TransformerScene />
    </Sequence>
    <Sequence from={PREDICTION_S} durationInFrames={PREDICTION_DUR}>
      <PredictionScene />
    </Sequence>
    <Sequence from={OUTRO_S} durationInFrames={OUTRO_DUR}>
      <OutroScene />
    </Sequence>

    <Captions captions={captionsData as Caption[]} />
  </AbsoluteFill>
);

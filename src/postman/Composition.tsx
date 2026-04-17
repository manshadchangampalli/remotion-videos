import React from "react";
import { AbsoluteFill, Audio, staticFile, Sequence } from "remotion";
import { Captions } from "./Captions";
import captionsData from "../../public/postman/captions.json";
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
import { MysteryScene } from "./scenes/MysteryScene";
import { PostmanScene } from "./scenes/PostmanScene";
import { BrowserScene } from "./scenes/BrowserScene";
import { PreflightScene } from "./scenes/PreflightScene";
import { PostmanOutroScene } from "./scenes/OutroScene";

// Scene timing derived from whisper transcription (at 30fps):
//   Hook:      0ms   – 11000ms  → frames   0 –  330
//   Mystery:  11000ms – 19000ms  → frames 330 –  570
//   Postman:  19000ms – 32000ms  → frames 570 –  960
//   Browser:  32000ms – 50000ms  → frames 960 – 1500
//   Preflight:50000ms – 62000ms  → frames 1500– 1860
//   Outro:    62000ms – 70370ms  → frames 1860– 2112

const fps = 30;
const mf = (ms: number) => Math.floor((ms / 1000) * fps);

const HOOK_START     = 0;
const MYSTERY_START  = mf(11000);
const POSTMAN_START  = mf(19000);
const BROWSER_START  = mf(32000);
const PREFLIGHT_START = mf(50000);
const OUTRO_START    = mf(62000);
const TOTAL_FRAMES   = mf(70400);

const HOOK_DUR      = MYSTERY_START  - HOOK_START;
const MYSTERY_DUR   = POSTMAN_START  - MYSTERY_START;
const POSTMAN_DUR   = BROWSER_START  - POSTMAN_START;
const BROWSER_DUR   = PREFLIGHT_START - BROWSER_START;
const PREFLIGHT_DUR = OUTRO_START    - PREFLIGHT_START;
const OUTRO_DUR     = TOTAL_FRAMES   - OUTRO_START;

export const PostmanComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050914", fontFamily: "Outfit, sans-serif" }}>
      <Audio src={staticFile("postman/postman.wav")} />

      {/* ── Sound Effects ─────────────────────────────────────────────────
          Hook: Postman badge pops, 200 OK pops, Browser badge, CORS slams, WHY?!
      */}
      <Sfx src={SFX.zoom}  from={HOOK_START + 30}  dur={38}  vol={0.50} />
      <Sfx src={SFX.zoom}  from={HOOK_START + 55}  dur={38}  vol={0.48} />
      <Sfx src={SFX.zoom}  from={HOOK_START + 120} dur={38}  vol={0.50} />
      <Sfx src={SFX.zoom}  from={HOOK_START + 155} dur={38}  vol={0.58} />
      <Sfx src={SFX.zoom}  from={HOOK_START + 210} dur={38}  vol={0.50} />

      {/* Mystery scene opens */}
      <Sfx src={SFX.woosh} from={MYSTERY_START}    dur={70}  vol={0.42} />

      {/* Postman scene: big reveal */}
      <Sfx src={SFX.woosh} from={POSTMAN_START}    dur={70}  vol={0.45} />

      {/* Browser scene: badge springs, shield pops, beam fires, explosion, preflight appears */}
      <Sfx src={SFX.zoom}  from={BROWSER_START + 15}  dur={38}  vol={0.50} />
      <Sfx src={SFX.zoom}  from={BROWSER_START + 100} dur={38}  vol={0.48} />
      <Sfx src={SFX.arrow} from={BROWSER_START + 180} dur={33}  vol={0.42} />
      <Sfx src={SFX.zoom}  from={BROWSER_START + 230} dur={38}  vol={0.55} />
      <Sfx src={SFX.woosh} from={BROWSER_START + 300} dur={70}  vol={0.42} />

      {/* Preflight scene: chat bubble, YES, NO, CORS BOMB slams, bouncer reveals */}
      <Sfx src={SFX.zoom}  from={PREFLIGHT_START + 10}  dur={38}  vol={0.48} />
      <Sfx src={SFX.zoom}  from={PREFLIGHT_START + 85}  dur={38}  vol={0.50} />
      <Sfx src={SFX.zoom}  from={PREFLIGHT_START + 110} dur={38}  vol={0.50} />
      <Sfx src={SFX.zoom}  from={PREFLIGHT_START + 150} dur={38}  vol={0.60} />
      <Sfx src={SFX.woosh} from={PREFLIGHT_START + 200} dur={70}  vol={0.42} />

      {/* Outro: brief cheer at the success reveal */}
      <Sfx src={SFX.cheer} from={OUTRO_START}           dur={45}  vol={0.32} />

      {/* Hook: Postman 200OK vs browser CORS error */}
      <Sequence from={HOOK_START} durationInFrames={HOOK_DUR} premountFor={30}>
        <HookScene />
      </Sequence>

      {/* Mystery: Is Postman hacking your server? No — it acts like a backend */}
      <Sequence from={MYSTERY_START} durationInFrames={MYSTERY_DUR} premountFor={30}>
        <MysteryScene />
      </Sequence>

      {/* Postman = server-to-server: no CORS, golden rule */}
      <Sequence from={POSTMAN_START} durationInFrames={POSTMAN_DUR} premountFor={30}>
        <PostmanScene />
      </Sequence>

      {/* Browser is paranoid: pre-flight OPTIONS request */}
      <Sequence from={BROWSER_START} durationInFrames={BROWSER_DUR} premountFor={30}>
        <BrowserScene />
      </Sequence>

      {/* Pre-flight bouncer check: YES flows, NO = CORS bomb */}
      <Sequence from={PREFLIGHT_START} durationInFrames={PREFLIGHT_DUR} premountFor={30}>
        <PreflightScene />
      </Sequence>

      {/* Outro: The fix — whitelist your frontend + subscribe */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DUR} premountFor={30}>
        <PostmanOutroScene />
      </Sequence>

      {/* Captions always on top */}
      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

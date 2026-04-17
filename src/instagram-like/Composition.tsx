import React from "react";
import { AbsoluteFill, Audio, staticFile, Sequence } from "remotion";
import { Captions } from "./Captions";
import captionsData from "../../public/instagram-like/captions.json";
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
import { BottleneckScene } from "./scenes/BottleneckScene";
import { LoadBalancerScene } from "./scenes/LoadBalancerScene";
import { EventStreamScene } from "./scenes/EventStreamScene";
import { CacheScene } from "./scenes/CacheScene";
import { DatabaseScene } from "./scenes/DatabaseScene";
import { BigPictureScene } from "./scenes/BigPictureScene";

// Scene timing derived from whisper transcription (at 30fps):
//   Hook:         0ms   –   6760ms  → frames    0 –   203
//   Bottleneck:   6760ms – 19080ms  → frames  203 –   572
//   LoadBalancer: 19080ms – 28840ms → frames  572 –   865
//   EventStream:  28840ms – 61040ms → frames  865 –  1831
//   Cache:        61040ms – 80320ms → frames 1831 –  2410
//   Database:     80320ms – 103080ms→ frames 2410 –  3092
//   BigPicture:   103080ms – 128000ms→ frames 3092 – 3840

const fps = 30;
const mf = (ms: number) => Math.floor((ms / 1000) * fps);

const HOOK_START         = 0;
const BOTTLENECK_START   = mf(6760);
const LOADBALANCER_START = mf(19080);
const EVENTSTREAM_START  = mf(28840);
const CACHE_START        = mf(61040);
const DATABASE_START     = mf(80320);
const BIGPICTURE_START   = mf(103080);
const TOTAL_FRAMES       = mf(128000);

const HOOK_DUR         = BOTTLENECK_START   - HOOK_START;
const BOTTLENECK_DUR   = LOADBALANCER_START - BOTTLENECK_START;
const LOADBALANCER_DUR = EVENTSTREAM_START  - LOADBALANCER_START;
const EVENTSTREAM_DUR  = CACHE_START        - EVENTSTREAM_START;
const CACHE_DUR        = DATABASE_START     - CACHE_START;
const DATABASE_DUR     = BIGPICTURE_START   - DATABASE_START;
const BIGPICTURE_DUR   = TOTAL_FRAMES       - BIGPICTURE_START;

export const InstagramLikeComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050914", fontFamily: "Outfit, sans-serif" }}>
      <Audio src={staticFile("instagram-like/Instagram-like.wav")} />

      {/* ── Sound Effects ── */}
      <Sfx src={SFX.woosh}  from={HOOK_START}         dur={45}  vol={0.4} />
      <Sfx src={SFX.bleeps} from={BOTTLENECK_START}   dur={60}  vol={0.45} />
      <Sfx src={SFX.arrow}  from={LOADBALANCER_START} dur={35}  vol={0.4} />
      <Sfx src={SFX.typing} from={EVENTSTREAM_START}  dur={90}  vol={0.35} />
      <Sfx src={SFX.zoom}   from={CACHE_START}        dur={45}  vol={0.4} />
      <Sfx src={SFX.typing} from={DATABASE_START}     dur={90}  vol={0.35} />
      <Sfx src={SFX.cheer}  from={BIGPICTURE_START}   dur={150} vol={0.5} />

      {/* Scene 1: Hook — Cristiano Ronaldo, 5M likes */}
      <Sequence from={HOOK_START} durationInFrames={HOOK_DUR} premountFor={30}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Bottleneck — one door breaks, hundreds scale */}
      <Sequence from={BOTTLENECK_START} durationInFrames={BOTTLENECK_DUR} premountFor={30}>
        <BottleneckScene />
      </Sequence>

      {/* Scene 3: Load Balancer — traffic cop splits crowd */}
      <Sequence from={LOADBALANCER_START} durationInFrames={LOADBALANCER_DUR} premountFor={30}>
        <LoadBalancerScene />
      </Sequence>

      {/* Scene 4: Event Stream — endless logbook, no crashing */}
      <Sequence from={EVENTSTREAM_START} durationInFrames={EVENTSTREAM_DUR} premountFor={30}>
        <EventStreamScene />
      </Sequence>

      {/* Scene 5: Cache — whiteboard, instant read */}
      <Sequence from={CACHE_START} durationInFrames={CACHE_DUR} premountFor={30}>
        <CacheScene />
      </Sequence>

      {/* Scene 6: Database — steady clerk, permanent vault */}
      <Sequence from={DATABASE_START} durationInFrames={DATABASE_DUR} premountFor={30}>
        <DatabaseScene />
      </Sequence>

      {/* Scene 7: Big Picture — eventual consistency */}
      <Sequence from={BIGPICTURE_START} durationInFrames={BIGPICTURE_DUR} premountFor={30}>
        <BigPictureScene />
      </Sequence>

      {/* Captions always on top */}
      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

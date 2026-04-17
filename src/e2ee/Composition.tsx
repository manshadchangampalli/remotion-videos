import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "./Captions";
import captionsData from "../../public/whatsapp/captions.json";
import type { Caption } from "@remotion/captions";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Reframe } from "./scenes/Scene2Reframe";
import { Scene3Encryption } from "./scenes/Scene3Encryption";
import { Scene4Interception } from "./scenes/Scene4Interception";
import { Scene5Unlock } from "./scenes/Scene5Unlock";
import { Scene6Outro } from "./scenes/Scene6Outro";

const SCENE_DUR = 200;

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

export const E2EEComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050A0F" }}>
      <Audio src={staticFile("whatsapp/whatsapp-encryption.wav")} />

      {/* ── Sound Effects ─────────────────────────────────────────────────
          Scene 1 — Hook reveal: sweep
          Scene 2 — Reframe: sweep
          Scene 3 — Encryption: bubble launches, key rises, padlock slams
          Scene 4 — Interception: scanning bleeps, attempts spring in, arrow
          Scene 5 — Unlock: vault sweeps in, key springs, particles fire, success
          Scene 6 — Outro: sweep
      */}
      <Sfx src={SFX.woosh}  from={0}         dur={70}  vol={0.42} />
      <Sfx src={SFX.woosh}  from={200}        dur={70}  vol={0.38} />
      <Sfx src={SFX.zoom}   from={400 + 10}   dur={38}  vol={0.50} />
      <Sfx src={SFX.woosh}  from={400 + 62}   dur={70}  vol={0.40} />
      <Sfx src={SFX.zoom}   from={400 + 162}  dur={38}  vol={0.52} />
      <Sfx src={SFX.bleeps} from={600}        dur={60}  vol={0.18} />
      <Sfx src={SFX.zoom}   from={600 + 42}   dur={38}  vol={0.52} />
      <Sfx src={SFX.arrow}  from={600 + 102}  dur={33}  vol={0.42} />
      <Sfx src={SFX.zoom}   from={600 + 122}  dur={38}  vol={0.50} />
      <Sfx src={SFX.woosh}  from={800 + 30}   dur={70}  vol={0.42} />
      <Sfx src={SFX.zoom}   from={800 + 42}   dur={38}  vol={0.52} />
      <Sfx src={SFX.arrow}  from={800 + 102}  dur={33}  vol={0.42} />
      <Sfx src={SFX.cheer}  from={800 + 148}  dur={45}  vol={0.32} />
      <Sfx src={SFX.woosh}  from={1000}       dur={70}  vol={0.38} />

      <Sequence from={0} durationInFrames={SCENE_DUR}>
        <Scene1Hook />
      </Sequence>
      <Sequence from={200} durationInFrames={SCENE_DUR}>
        <Scene2Reframe />
      </Sequence>
      <Sequence from={400} durationInFrames={SCENE_DUR}>
        <Scene3Encryption />
      </Sequence>
      <Sequence from={600} durationInFrames={SCENE_DUR}>
        <Scene4Interception />
      </Sequence>
      <Sequence from={800} durationInFrames={SCENE_DUR}>
        <Scene5Unlock />
      </Sequence>
      <Sequence from={1000} durationInFrames={SCENE_DUR}>
        <Scene6Outro />
      </Sequence>

      {/* ── Captions (always on top) ── */}
      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

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

      {/* ── Sound Effects ── */}
      <Sfx src={SFX.woosh}  from={0}   dur={45}  vol={0.4} />  {/* Hook intro */}
      <Sfx src={SFX.zoom}   from={200} dur={45}  vol={0.4} />  {/* Reframe */}
      <Sfx src={SFX.typing} from={400} dur={90}  vol={0.35} /> {/* Encryption */}
      <Sfx src={SFX.bleeps} from={600} dur={60}  vol={0.45} /> {/* Interception attempt */}
      <Sfx src={SFX.cheer}  from={800} dur={120} vol={0.45} /> {/* Unlock success */}
      <Sfx src={SFX.cheer}  from={1000} dur={150} vol={0.5} /> {/* Outro */}

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

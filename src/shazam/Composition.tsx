import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "./Captions";
import captionsData from "../../public/shazam/captions.json";
import type { Caption } from "@remotion/captions";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Match } from "./scenes/Scene02Match";
import { Scene03UnderHood } from "./scenes/Scene03UnderHood";
import { Scene04RawWaves } from "./scenes/Scene04RawWaves";
import { Scene05SpectrogramBirth } from "./scenes/Scene05SpectrogramBirth";
import { Scene06TerrainHold } from "./scenes/Scene06TerrainHold";
import { Scene07Scan } from "./scenes/Scene07Scan";
import { Scene08Constellation } from "./scenes/Scene08Constellation";
import { Scene09Measuring } from "./scenes/Scene09Measuring";
import { Scene10Fingerprint } from "./scenes/Scene10Fingerprint";
import { Scene11Firing } from "./scenes/Scene11Firing";
import { Scene12Search } from "./scenes/Scene12Search";
import { Scene13Reframe } from "./scenes/Scene13Reframe";
import { Scene14Outro } from "./scenes/Scene14Outro";

const SCENES = [
  { from: 0,    dur: 90,  Component: Scene01Hook },
  { from: 90,   dur: 90,  Component: Scene02Match },
  { from: 180,  dur: 90,  Component: Scene03UnderHood },
  { from: 270,  dur: 120, Component: Scene04RawWaves },
  { from: 390,  dur: 120, Component: Scene05SpectrogramBirth },
  { from: 510,  dur: 90,  Component: Scene06TerrainHold },
  { from: 600,  dur: 120, Component: Scene07Scan },
  { from: 720,  dur: 120, Component: Scene08Constellation },
  { from: 840,  dur: 120, Component: Scene09Measuring },
  { from: 960,  dur: 120, Component: Scene10Fingerprint },
  { from: 1080, dur: 90,  Component: Scene11Firing },
  { from: 1170, dur: 120, Component: Scene12Search },
  { from: 1290, dur: 180, Component: Scene13Reframe },
  { from: 1470, dur: 240, Component: Scene14Outro },
] as const;

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

export const ShazamComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Audio src={staticFile("shazam-song/shazam-song.wav")} />

      {/* ── Sound Effects ── */}
      <Sfx src={SFX.woosh}  from={0}    dur={45} vol={0.4} />  {/* Hook intro */}
      <Sfx src={SFX.zoom}   from={90}   dur={45} vol={0.4} />  {/* Match scene */}
      <Sfx src={SFX.typing} from={180}  dur={90} vol={0.35} /> {/* Under the hood */}
      <Sfx src={SFX.arrow}  from={270}  dur={35} vol={0.4} />  {/* Raw waves */}
      <Sfx src={SFX.zoom}   from={390}  dur={45} vol={0.4} />  {/* Spectrogram birth */}
      <Sfx src={SFX.woosh}  from={600}  dur={45} vol={0.4} />  {/* Scan */}
      <Sfx src={SFX.arrow}  from={720}  dur={35} vol={0.4} />  {/* Constellation */}
      <Sfx src={SFX.zoom}   from={960}  dur={45} vol={0.4} />  {/* Fingerprint */}
      <Sfx src={SFX.arrow}  from={1080} dur={35} vol={0.4} />  {/* Firing */}
      <Sfx src={SFX.bleeps} from={1170} dur={60} vol={0.4} />  {/* Search */}
      <Sfx src={SFX.woosh}  from={1290} dur={45} vol={0.4} />  {/* Reframe */}
      <Sfx src={SFX.cheer}  from={1470} dur={150} vol={0.45} /> {/* Outro */}

      {/* ── Scenes ── */}
      {SCENES.map(({ from, dur, Component }) => (
        <Sequence key={from} from={from} durationInFrames={dur}>
          <Component />
        </Sequence>
      ))}

      {/* ── Captions (always on top) ── */}
      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

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

      {/* ── Sound Effects ─────────────────────────────────────────────────
          Scene 01 — Shazam app appears: sweeping reveal
          Scene 02 — Instant match: sharp recognition pop
          Scene 03 — Under the hood: conceptual reveal sweep
          Scene 04 — Raw waveform draws across screen: directional arrow
          Scene 05 — Spectrogram born: sharp visual birth
          Scene 06 — Terrain hold (quiet, no sound needed)
          Scene 07 — Scan line draws: arrow as line sweeps, bleeps for scanning
          Scene 08 — Constellation springs in at f50: star field appears
          Scene 09 — Measuring/analysis: clock bleeps
          Scene 10 — Fingerprint hex pops at f35, label at f60
          Scene 11 — Fires packet toward server: arrow
          Scene 12 — DB search bleeps, match lock springs at f90, cheer at f96
          Scene 13 — Reframe: sweep
      */}
      <Sfx src={SFX.woosh}  from={0}         dur={70}  vol={0.42} />
      <Sfx src={SFX.zoom}   from={90}         dur={38}  vol={0.50} />
      <Sfx src={SFX.woosh}  from={180}        dur={70}  vol={0.38} />
      <Sfx src={SFX.arrow}  from={270}        dur={33}  vol={0.42} />
      <Sfx src={SFX.zoom}   from={390}        dur={38}  vol={0.48} />
      <Sfx src={SFX.arrow}  from={600 + 15}   dur={33}  vol={0.42} />
      <Sfx src={SFX.bleeps} from={600 + 20}   dur={60}  vol={0.18} />
      <Sfx src={SFX.zoom}   from={720 + 50}   dur={38}  vol={0.50} />
      <Sfx src={SFX.bleeps} from={840}        dur={90}  vol={0.20} />
      <Sfx src={SFX.zoom}   from={960 + 35}   dur={38}  vol={0.52} />
      <Sfx src={SFX.zoom}   from={960 + 60}   dur={38}  vol={0.48} />
      <Sfx src={SFX.arrow}  from={1080 + 5}   dur={33}  vol={0.45} />
      <Sfx src={SFX.bleeps} from={1170 + 30}  dur={50}  vol={0.18} />
      <Sfx src={SFX.zoom}   from={1170 + 90}  dur={38}  vol={0.52} />
      <Sfx src={SFX.cheer}  from={1170 + 96}  dur={45}  vol={0.32} />
      <Sfx src={SFX.woosh}  from={1290}       dur={70}  vol={0.42} />

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

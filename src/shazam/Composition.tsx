import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
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

// Frame ranges from spec
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

export const ShazamComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Audio src={staticFile("shazam-song/shazam-song.wav")} />

      {SCENES.map(({ from, dur, Component }) => (
        <Sequence key={from} from={from} durationInFrames={dur}>
          <Component />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

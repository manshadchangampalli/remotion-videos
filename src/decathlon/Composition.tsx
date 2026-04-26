import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "../vpn/Captions";
import captionsData from "../../public/decathlon/captions.json";
import type { Caption } from "@remotion/captions";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Instant } from "./scenes/Scene02Instant";
import { Scene03NoBarcodes } from "./scenes/Scene03NoBarcodes";
import { Scene04RFIDReveal } from "./scenes/Scene04RFIDReveal";
import { Scene05Peel } from "./scenes/Scene05Peel";
import { Scene06ChipReveal } from "./scenes/Scene06ChipReveal";
import { Scene07Antenna } from "./scenes/Scene07Antenna";
import { Scene08NoBattery } from "./scenes/Scene08NoBattery";
import { Scene09ReaderKiosk } from "./scenes/Scene09ReaderKiosk";
import { Scene10RadioWaves } from "./scenes/Scene10RadioWaves";
import { Scene11Induction } from "./scenes/Scene11Induction";
import { Scene12Spark } from "./scenes/Scene12Spark";
import { Scene13Wake } from "./scenes/Scene13Wake";
import { Scene14Bounce } from "./scenes/Scene14Bounce";
import { Scene15UniqueIntro } from "./scenes/Scene15UniqueIntro";
import { Scene16UniqueID } from "./scenes/Scene16UniqueID";
import { Scene17MatchDB } from "./scenes/Scene17MatchDB";
import { Scene18Outro } from "./scenes/Scene18Outro";

export const TOTAL_FRAMES = 2352; // 78.4s @ 30fps

const SCENES = [
  { from:    0, dur: 120, Component: Scene01Hook },
  { from:  120, dur: 120, Component: Scene02Instant },
  { from:  240, dur:  90, Component: Scene03NoBarcodes },
  { from:  330, dur: 150, Component: Scene04RFIDReveal },
  { from:  480, dur: 150, Component: Scene05Peel },
  { from:  630, dur: 120, Component: Scene06ChipReveal },
  { from:  750, dur: 120, Component: Scene07Antenna },
  { from:  870, dur: 150, Component: Scene08NoBattery },
  { from: 1020, dur: 120, Component: Scene09ReaderKiosk },
  { from: 1140, dur: 120, Component: Scene10RadioWaves },
  { from: 1260, dur: 150, Component: Scene11Induction },
  { from: 1410, dur: 120, Component: Scene12Spark },
  { from: 1530, dur: 120, Component: Scene13Wake },
  { from: 1650, dur: 150, Component: Scene14Bounce },
  { from: 1800, dur: 120, Component: Scene15UniqueIntro },
  { from: 1920, dur: 150, Component: Scene16UniqueID },
  { from: 2070, dur: 150, Component: Scene17MatchDB },
  { from: 2220, dur: 132, Component: Scene18Outro },
] as const;

const SFX = {
  woosh:  "sound-effects/mixkit-air-woosh-1489.wav",
  zoom:   "sound-effects/mixkit-air-zoom-vacuum-2608.wav",
  arrow:  "sound-effects/mixkit-arrow-whoosh-1491.wav",
  bleeps: "sound-effects/mixkit-clock-countdown-bleeps-916.wav",
  cheer:  "sound-effects/mixkit-small-group-cheer-and-applause-518.wav",
};

const Sfx: React.FC<{ src: string; from: number; dur: number; vol?: number }> = (
  { src, from, dur, vol = 0.4 }
) => (
  <Sequence from={from} durationInFrames={dur}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const DecathlonRFIDComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#041829" }}>
      {/* Narration */}
      <Audio src={staticFile("decathlon/decathlon 2.wav")} volume={1} />

      {/* Sound effects — placed to land on visual beats
         Scene 1 HOOK (0-120) — clothes falling into bin */}
      <Sfx src={SFX.woosh}  from={10}   dur={60}  vol={0.30} />

      {/* Scene 2 INSTANT (120-240) — total slams in */}
      <Sfx src={SFX.zoom}   from={178}  dur={38}  vol={0.55} />
      <Sfx src={SFX.bleeps} from={130}  dur={45}  vol={0.15} />

      {/* Scene 3 NO BARCODES (240-330) — slash + "HOW?" */}
      <Sfx src={SFX.zoom}   from={262}  dur={38}  vol={0.45} />
      <Sfx src={SFX.arrow}  from={290}  dur={33}  vol={0.50} />

      {/* Scene 4 RFID REVEAL (330-480) — letters slam in */}
      <Sfx src={SFX.woosh}  from={330}  dur={70}  vol={0.45} />
      <Sfx src={SFX.zoom}   from={350}  dur={38}  vol={0.35} />

      {/* Scene 5 PEEL (480-630) — peel starts, reveal label */}
      <Sfx src={SFX.arrow}  from={518}  dur={33}  vol={0.42} />
      <Sfx src={SFX.woosh}  from={540}  dur={70}  vol={0.35} />

      {/* Scene 6 CHIP REVEAL (630-750) — zoom-in pulse */}
      <Sfx src={SFX.zoom}   from={632}  dur={38}  vol={0.48} />
      <Sfx src={SFX.bleeps} from={650}  dur={60}  vol={0.16} />

      {/* Scene 7 ANTENNA (750-870) — antenna draws on */}
      <Sfx src={SFX.arrow}  from={756}  dur={33}  vol={0.40} />
      <Sfx src={SFX.woosh}  from={790}  dur={70}  vol={0.30} />

      {/* Scene 8 NO BATTERY (870-1020) — battery slash + "SO HOW?" */}
      <Sfx src={SFX.zoom}   from={900}  dur={38}  vol={0.45} />
      <Sfx src={SFX.arrow}  from={950}  dur={33}  vol={0.45} />

      {/* Scene 9 READER KIOSK (1020-1140) — kiosk springs in */}
      <Sfx src={SFX.woosh}  from={1024} dur={70}  vol={0.45} />

      {/* Scene 10 RADIO WAVES (1140-1260) — waves pulse */}
      <Sfx src={SFX.woosh}  from={1140} dur={70}  vol={0.45} />
      <Sfx src={SFX.woosh}  from={1200} dur={60}  vol={0.35} />

      {/* Scene 11 INDUCTION (1260-1410) — wave sweeps into coil */}
      <Sfx src={SFX.arrow}  from={1270} dur={33}  vol={0.40} />
      <Sfx src={SFX.bleeps} from={1340} dur={45}  vol={0.16} />

      {/* Scene 12 SPARK (1410-1530) — spark burst at local f30 */}
      <Sfx src={SFX.zoom}   from={1440} dur={38}  vol={0.60} />

      {/* Scene 13 WAKE (1530-1650) — chip boots up */}
      <Sfx src={SFX.bleeps} from={1560} dur={65}  vol={0.24} />

      {/* Scene 14 BOUNCE (1650-1800) — packet flight */}
      <Sfx src={SFX.arrow}  from={1670} dur={33}  vol={0.45} />
      <Sfx src={SFX.bleeps} from={1735} dur={30}  vol={0.20} />

      {/* Scene 15 UNIQUE INTRO (1800-1920) — barcode X slash + serial reveal */}
      <Sfx src={SFX.zoom}   from={1830} dur={38}  vol={0.40} />
      <Sfx src={SFX.woosh}  from={1854} dur={70}  vol={0.35} />

      {/* Scene 16 UNIQUE ID (1920-2070) — row-by-row reveal */}
      <Sfx src={SFX.arrow}  from={1924} dur={33}  vol={0.32} />
      <Sfx src={SFX.arrow}  from={1950} dur={33}  vol={0.32} />
      <Sfx src={SFX.arrow}  from={1970} dur={33}  vol={0.32} />
      <Sfx src={SFX.cheer}  from={2015} dur={45}  vol={0.22} />

      {/* Scene 17 MATCH DB (2070-2220) — items populate, total thump, ms */}
      <Sfx src={SFX.arrow}  from={2074} dur={33}  vol={0.30} />
      <Sfx src={SFX.arrow}  from={2080} dur={33}  vol={0.30} />
      <Sfx src={SFX.arrow}  from={2086} dur={33}  vol={0.30} />
      <Sfx src={SFX.arrow}  from={2092} dur={33}  vol={0.30} />
      <Sfx src={SFX.zoom}   from={2158} dur={38}  vol={0.55} />

      {/* Scene 18 OUTRO (2220-2352) — logo + follow */}
      <Sfx src={SFX.woosh}  from={2224} dur={70}  vol={0.40} />
      <Sfx src={SFX.cheer}  from={2250} dur={60}  vol={0.28} />

      {/* Scenes */}
      {SCENES.map(({ from, dur, Component }) => (
        <Sequence key={from} from={from} durationInFrames={dur}>
          <Component />
        </Sequence>
      ))}

      {/* TikTok captions on top — tighter grouping (1200ms) so dense narration breaks into short pages */}
      <Captions captions={captionsData as Caption[]} combineTokensWithinMs={1200} />
    </AbsoluteFill>
  );
};

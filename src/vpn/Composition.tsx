import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "./Captions";
import captionsData from "../../public/vpn/captions.json";
import type { Caption } from "@remotion/captions";
import { Scene01Problem } from "./scenes/Scene01Problem";
import { Scene02Block } from "./scenes/Scene02Block";
import { Scene03Pivot } from "./scenes/Scene03Pivot";
import { Scene04Answer } from "./scenes/Scene04Answer";
import { Scene05Gatekeeper } from "./scenes/Scene05Gatekeeper";
import { Scene06Request } from "./scenes/Scene06Request";
import { Scene07Trash } from "./scenes/Scene07Trash";
import { Scene08VPNShift } from "./scenes/Scene08VPNShift";
import { Scene09Disguise } from "./scenes/Scene09Disguise";
import { Scene10Pass } from "./scenes/Scene10Pass";
import { Scene11Fetch } from "./scenes/Scene11Fetch";
import { Scene12Download } from "./scenes/Scene12Download";
import { Scene13BlindReturn } from "./scenes/Scene13BlindReturn";
import { Scene14Philosophy } from "./scenes/Scene14Philosophy";
import { Scene15Outro } from "./scenes/Scene15Outro";

export const TOTAL_FRAMES = 2040;

const SCENES = [
  { from:    0, dur: 130, Component: Scene01Problem },
  { from:  130, dur:  65, Component: Scene02Block },
  { from:  195, dur: 235, Component: Scene03Pivot },
  { from:  430, dur: 110, Component: Scene04Answer },
  { from:  540, dur:  90, Component: Scene05Gatekeeper },
  { from:  630, dur:  98, Component: Scene06Request },
  { from:  728, dur:  95, Component: Scene07Trash },
  { from:  823, dur: 188, Component: Scene08VPNShift },
  { from: 1011, dur: 149, Component: Scene09Disguise },
  { from: 1160, dur: 141, Component: Scene10Pass },
  { from: 1301, dur: 148, Component: Scene11Fetch },
  { from: 1449, dur: 126, Component: Scene12Download },
  { from: 1575, dur: 258, Component: Scene13BlindReturn },
  { from: 1833, dur: 174, Component: Scene14Philosophy },
  { from: 2007, dur:  33, Component: Scene15Outro },
] as const;

// Sounds used and why:
//   air-woosh       (2.32s/70f)  → VPN toggle activation, big scene reveals
//   air-zoom-vacuum (1.27s/38f)  → Sharp physical impacts: padlock slam, BLOCKED, shatter, explosion
//   arrow-whoosh    (1.10s/33f)  → Laser lines drawing, data packets flying
//   clock-bleeps    (5.00s/150f) → Loading spinner, ISP firewall scanning
//
// NOT used: keyboard-typing (typing doesn't match VPN/cyber visuals)
//           cheer-applause   (crowd cheer is too casual for cyber aesthetic;
//                             only a brief clip at the one genuine success moment)
const SFX = {
  woosh:  "sound-effects/mixkit-air-woosh-1489.wav",
  zoom:   "sound-effects/mixkit-air-zoom-vacuum-2608.wav",
  arrow:  "sound-effects/mixkit-arrow-whoosh-1491.wav",
  bleeps: "sound-effects/mixkit-clock-countdown-bleeps-916.wav",
  cheer:  "sound-effects/mixkit-small-group-cheer-and-applause-518.wav",
};

const Sfx: React.FC<{ src: string; from: number; dur: number; vol?: number }> = (
  { src, from, dur, vol = 0.45 }
) => (
  <Sequence from={from} durationInFrames={dur}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const VPNComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {/* ── Main narration ── */}
      <Audio src={staticFile("vpn/vpn.wav")} />

      {/* ── Sound Effects ───────────────────────────────────────────────────
          Only placed at moments that genuinely need audio feedback.

          Scene 01 — loading spinner starts: subtle clock bleeps
      */}
      <Sfx src={SFX.bleeps} from={40}   dur={45}  vol={0.16} />

      {/* Scene 02 — padlock SLAMS down: sharp vacuum impact */}
      <Sfx src={SFX.zoom}   from={132}  dur={38}  vol={0.55} />

      {/* Scene 03 — VPN toggle flips ON: sweeping activation whoosh */}
      <Sfx src={SFX.woosh}  from={200}  dur={70}  vol={0.50} />
      {/* Scene 03 — padlock SHATTERS: sharp blast */}
      <Sfx src={SFX.zoom}   from={217}  dur={38}  vol={0.52} />

      {/* Scene 05 — ISP firewall wall slams in */}
      <Sfx src={SFX.zoom}   from={543}  dur={38}  vol={0.50} />

      {/* Scene 06 — red laser fires toward wall */}
      <Sfx src={SFX.arrow}  from={644}  dur={33}  vol={0.42} />
      {/* Scene 06 — wall scanning the request */}
      <Sfx src={SFX.bleeps} from={690}  dur={38}  vol={0.18} />

      {/* Scene 07 — request EXPLODES / thrown in trash */}
      <Sfx src={SFX.zoom}   from={728}  dur={38}  vol={0.60} />

      {/* Scene 08 — VPN toggle flips ON again: activation whoosh */}
      <Sfx src={SFX.woosh}  from={828}  dur={70}  vol={0.50} />
      {/* Scene 08 — cyan tunnel laser forms */}
      <Sfx src={SFX.arrow}  from={908}  dur={33}  vol={0.40} />

      {/* Scene 09 — Singapore packet fires toward wall */}
      <Sfx src={SFX.arrow}  from={1025} dur={33}  vol={0.42} />

      {/* Scene 10 — wall turns green, APPROVED: one brief cheer burst */}
      <Sfx src={SFX.cheer}  from={1210} dur={45}  vol={0.32} />
      {/* Scene 10 — laser pierces through wall */}
      <Sfx src={SFX.arrow}  from={1229} dur={33}  vol={0.45} />

      {/* Scene 11 — laser travels to Singapore server */}
      <Sfx src={SFX.arrow}  from={1301} dur={33}  vol={0.40} />

      {/* Scene 12 — video packet fires back to phone */}
      <Sfx src={SFX.arrow}  from={1504} dur={33}  vol={0.40} />

      {/* Scene 14 — philosophy scene opens with a sweep */}
      <Sfx src={SFX.woosh}  from={1833} dur={70}  vol={0.35} />

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

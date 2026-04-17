import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
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

// Audio: 67.88s × 30fps = 2037 frames → 2040
export const TOTAL_FRAMES = 2040;

// ─── SCENE BOUNDARIES (audio-synced) ────────────────────────────────────────
// Each scene starts ~2-4 frames BEFORE its narration line,
// so the visual is ready when the voice hits.
//
//  #   from   dur   Audio sentence (starts at frame)
//  1     0    130   "You are in India…"          → f0
//  2   130     65   "It's blocked…"               → f136
//  3   195    235   "But you turn on a VPN…"     → f193  |  "How did you bypass…" → f340
//  4   430    110   "You didn't. Middleman."     → f432
//  5   540     90   "Border guard…"              → f542
//  6   630     98   "Phone asks for TikTok…"     → f631
//  7   728     95   "Throws in trash."           → f728
//  8   823    188   "VPN → Singapore"            → f823  |  "Stops asking"        → f924
//  9  1011    149   "Asks for Singapore"         → f1011 |  "Random server"       → f1080
// 10  1160    141   "Not on ban list"            → f1160 |  "Lets you through"    → f1229
// 11  1301    148   "Reaches Singapore"          → f1301 |  "VPN does the work"  → f1368
// 12  1449    126   "Connects TikTok"            → f1449 |  "Streams back"        → f1516
// 13  1575    258   "ISP sees random data"       → f1575 |  "No idea it's TikTok" → f1715
// 14  1833    174   "Doesn't break walls"        → f1833 |  "Offshore friend"     → f1899
// 15  2007     33   "Follow for more."           → f2007
// ────────────────────────────────────────────────────────────────────────────

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

export const VPNComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Audio src={staticFile("vpn/vpn.wav")} />
      {SCENES.map(({ from, dur, Component }) => (
        <Sequence key={from} from={from} durationInFrames={dur}>
          <Component />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

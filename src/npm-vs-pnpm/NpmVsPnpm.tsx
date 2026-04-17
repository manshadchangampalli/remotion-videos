import React from 'react';
import { AbsoluteFill, Audio, Series, Sequence, staticFile } from 'remotion';
import { Captions } from './Captions';
import captionsData from '../../public/npm-vs-pnpm/captions.json';
import type { Caption } from '@remotion/captions';
import { Scene0Intro } from './scenes/Scene0Intro';
import { Scene1NpmInstall } from './scenes/Scene1NpmInstall';
import { Scene2StorageProblem } from './scenes/Scene2StorageProblem';
import { Scene3PnpmIntro } from './scenes/Scene3PnpmIntro';
import { Scene4PnpmFlow } from './scenes/Scene4PnpmFlow';
import { Scene5Benefits } from './scenes/Scene5Benefits';

// Audio narration: 49.77s = 1494 frames at 30fps
// Scene starts (cumulative):
// Scene0:  from=0    dur=165
// Scene1:  from=165  dur=260
// Scene2:  from=425  dur=295
// Scene3:  from=720  dur=80
// Scene4:  from=800  dur=487
// Scene5:  from=1287 dur=207

const SFX = {
  woosh:  'sound-effects/mixkit-air-woosh-1489.wav',
  zoom:   'sound-effects/mixkit-air-zoom-vacuum-2608.wav',
  arrow:  'sound-effects/mixkit-arrow-whoosh-1491.wav',
  bleeps: 'sound-effects/mixkit-clock-countdown-bleeps-916.wav',
  typing: 'sound-effects/mixkit-keyboard-typing-1386.wav',
  cheer:  'sound-effects/mixkit-small-group-cheer-and-applause-518.wav',
};

interface SfxProps { src: string; from: number; dur?: number; vol?: number; }
const Sfx: React.FC<SfxProps> = ({ src, from, dur = 60, vol = 0.4 }) => (
  <Sequence from={from} durationInFrames={dur}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const NpmVsPnpm: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Global narration track */}
      <Audio src={staticFile('npm-vs-pnpm/download.mp3')} />

      {/* ── Sound Effects ─────────────────────────────────────────────────
          Scene 0 — Intro: reveal sweep
          Scene 1 — npm install: keyboard typing (actual install command)
          Scene 2 — Storage problem: sharp discovery impact
          Scene 3 — pnpm intro: reveal sweep
          Scene 4 — pnpm flow: typing at T.TYPE1_START(15), MISS at T.MISS_SHOW(90),
                    request fires at T.REQ_START(102), store fills at T.STORE_FILL(188),
                    second project at T.PROJ2_APPEAR(272), cache HIT at T.HIT_SHOW(338),
                    symlink at T.SYM2_DONE(380)
          Scene 5 — Benefits: sweep reveal
      */}
      <Sfx src={SFX.woosh}  from={0}          dur={70}  vol={0.42} />
      <Sfx src={SFX.typing} from={165}         dur={90}  vol={0.35} />
      <Sfx src={SFX.zoom}   from={425}         dur={38}  vol={0.52} />
      <Sfx src={SFX.woosh}  from={720}         dur={70}  vol={0.40} />
      <Sfx src={SFX.typing} from={800 + 15}    dur={90}  vol={0.32} />
      <Sfx src={SFX.zoom}   from={800 + 90}    dur={38}  vol={0.50} />
      <Sfx src={SFX.arrow}  from={800 + 102}   dur={33}  vol={0.42} />
      <Sfx src={SFX.zoom}   from={800 + 188}   dur={38}  vol={0.52} />
      <Sfx src={SFX.woosh}  from={800 + 272}   dur={70}  vol={0.42} />
      <Sfx src={SFX.cheer}  from={800 + 338}   dur={45}  vol={0.32} />
      <Sfx src={SFX.arrow}  from={800 + 380}   dur={33}  vol={0.40} />
      <Sfx src={SFX.woosh}  from={1287}        dur={70}  vol={0.42} />

      <Series>
        <Series.Sequence durationInFrames={165} premountFor={30}>
          <Scene0Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={260} premountFor={30}>
          <Scene1NpmInstall />
        </Series.Sequence>

        <Series.Sequence durationInFrames={295} premountFor={30}>
          <Scene2StorageProblem />
        </Series.Sequence>

        <Series.Sequence durationInFrames={80} premountFor={30}>
          <Scene3PnpmIntro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={487} premountFor={30}>
          <Scene4PnpmFlow />
        </Series.Sequence>

        <Series.Sequence durationInFrames={207} premountFor={30}>
          <Scene5Benefits />
        </Series.Sequence>
      </Series>

      {/* ── Captions (always on top) ── */}
      <Captions captions={captionsData as Caption[]} />
    </AbsoluteFill>
  );
};

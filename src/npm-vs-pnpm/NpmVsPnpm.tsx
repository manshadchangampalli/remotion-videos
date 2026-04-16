import React from 'react';
import { AbsoluteFill, Audio, Series, staticFile } from 'remotion';
import { Scene0Intro } from './scenes/Scene0Intro';
import { Scene1NpmInstall } from './scenes/Scene1NpmInstall';
import { Scene2StorageProblem } from './scenes/Scene2StorageProblem';
import { Scene3PnpmIntro } from './scenes/Scene3PnpmIntro';
import { Scene4PnpmFlow } from './scenes/Scene4PnpmFlow';
import { Scene5Benefits } from './scenes/Scene5Benefits';

// Audio narration: 49.77s = 1494 frames at 30fps
// Segments mapped to scenes:
// [0.00–5.54s]   = 165f  Scene 0: "Everyone tells you PNPM is better than NPM..."
// [5.54–14.20s]  = 260f  Scene 1: "Standard NPM install works by reaching out to the registry..."
// [14.20–24.22s] = 295f  Scene 2: "But here's the catch. If you have 10 projects..."
// [24.22–26.64s] =  80f  Scene 3: "This is where PNPM changes the game."
// [26.64–42.86s] = 487f  Scene 4: "Instead of duplicating files, PNPM keeps a single copy..."
// [42.86–49.77s] = 207f  Scene 5: "Faster installs, efficient storage, and a cleaner Node modules."

export const NpmVsPnpm: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Global narration track — drives the full video */}
      <Audio src={staticFile('npm-vs-pnpm/download.mp3')} />

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
    </AbsoluteFill>
  );
};

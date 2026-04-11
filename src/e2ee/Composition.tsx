import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Reframe } from "./scenes/Scene2Reframe";
import { Scene3Encryption } from "./scenes/Scene3Encryption";
import { Scene4Interception } from "./scenes/Scene4Interception";
import { Scene5Unlock } from "./scenes/Scene5Unlock";
import { Scene6Outro } from "./scenes/Scene6Outro";

const SCENE_DUR = 200;

export const E2EEComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050A0F" }}>
      <Audio src={staticFile("whatsapp/whatsapp-encryption.wav")} />

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
    </AbsoluteFill>
  );
};

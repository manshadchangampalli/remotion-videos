import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "../components/palette";

// Scene 05 PEEL — show the real RFID label image only (150f / 5s)
export const Scene05Peel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const imgSpring = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 100 } });
  const imgScale = interpolate(imgSpring, [0, 1], [0.6, 1]);

  // Background transitions to white — fully white by local frame 15 (global 495)
  const whiteT = interpolate(frame, [8, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <AbsoluteFill style={{ background: "#ffffff", opacity: whiteT }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile("decathlon/RFID Label.png")}
          style={{
            width: 560,
            height: 420,
            objectFit: "contain",
            transform: `scale(${imgScale})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

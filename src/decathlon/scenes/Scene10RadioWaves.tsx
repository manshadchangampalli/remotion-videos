import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { RadioWaveRings } from "../components/RadioWaveRings";
import { palette, fonts } from "../components/palette";

// Scene 10 RADIO WAVES — "blasts an invisible radio wave" (120f / 4s)
export const Scene10RadioWaves: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kioskFade = interpolate(frame, [0, 15], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const labelOp = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      {/* faded kiosk in the back */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: kioskFade }}>
        <Img src={staticFile("decathlon/decathlone self checkout image.png")} style={{ width: 640, borderRadius: 18, filter: "blur(2px)" }} />
      </div>

      {/* expanding waves */}
      <RadioWaveRings count={5} size={500} cycleFrames={50} maxScale={3.6} />

      {/* central reader icon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.accent}, ${palette.blue})`,
            boxShadow: `0 0 80px ${palette.accent}, 0 0 160px ${palette.blue}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
            transform: `scale(${1 + Math.sin(frame / 4) * 0.07})`,
          }}
        >
          📡
        </div>
      </div>

      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 36, letterSpacing: 10 }}>
          BLASTS
        </div>
        <div style={{ color: palette.text, fontFamily: fonts.heading, fontWeight: 900, fontSize: 90, letterSpacing: -1, marginTop: 4, textShadow: `0 0 22px ${palette.accent}` }}>
          INVISIBLE WAVES
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelOp,
          color: palette.accent,
          fontFamily: fonts.mono,
          fontSize: 32,
          letterSpacing: 4,
          textShadow: `0 0 14px ${palette.accent}`,
        }}
      >
        ~ 865 MHz ~
      </div>
    </AbsoluteFill>
  );
};

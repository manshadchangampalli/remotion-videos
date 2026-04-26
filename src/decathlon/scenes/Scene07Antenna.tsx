import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { RFIDTag } from "../components/RFIDTag";
import { palette, fonts } from "../components/palette";

// Scene 07 ANTENNA — "flat, squiggly, aluminum antenna" (120f / 4s)
export const Scene07Antenna: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 40, letterSpacing: 8 }}>
          + SQUIGGLY
        </div>
        <div style={{ color: palette.text, fontFamily: fonts.heading, fontWeight: 900, fontSize: 96, letterSpacing: -2 }}>
          ALUMINUM ANTENNA
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RFIDTag size={820} startFrame={6} pulse />
      </div>

      {/* Arrows pointing to antenna */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 0,
          right: 0,
          textAlign: "center",
          color: palette.accent,
          fontFamily: fonts.mono,
          fontSize: 26,
          letterSpacing: 3,
          opacity: interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textShadow: `0 0 14px ${palette.accent}`,
        }}
      >
        ↑ ANTENNA CATCHES RADIO WAVES ↑
      </div>
    </AbsoluteFill>
  );
};

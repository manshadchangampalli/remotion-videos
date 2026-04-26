import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 09 READER KIOSK — "an RFID reader hidden inside the walls" (120f / 4s)
export const Scene09ReaderKiosk: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const kiosk = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 100 } });
  const kScale = interpolate(kiosk, [0, 1], [0.7, 1]);

  // highlight label reveal f40
  const highlightOp = interpolate(frame, [40, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wallGlow = 0.3 + Math.sin(frame / 6) * 0.25;

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 38, letterSpacing: 8 }}>
          RFID READER
        </div>
        <div style={{ color: palette.text, fontFamily: fonts.heading, fontWeight: 900, fontSize: 74, letterSpacing: -1, marginTop: 6 }}>
          HIDDEN IN THE WALLS
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
        <div
          style={{
            position: "relative",
            transform: `scale(${kScale})`,
            filter: `drop-shadow(0 0 40px ${palette.accent}${Math.floor(wallGlow * 99)})`,
          }}
        >
          <Img
            src={staticFile("decathlon/decathlone self checkout image.png")}
            style={{
              width: 720,
              borderRadius: 18,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6)`,
            }}
          />
          {/* pulsing "scan zone" highlight on the bin area */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "18%",
              right: "18%",
              height: "45%",
              borderRadius: 22,
              border: `3px dashed ${palette.accent}`,
              opacity: highlightOp * (0.6 + Math.sin(frame / 5) * 0.3),
              boxShadow: `inset 0 0 40px ${palette.accent}44, 0 0 30px ${palette.accent}77`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 240,
          left: 0,
          right: 0,
          textAlign: "center",
          color: palette.accent,
          fontFamily: fonts.mono,
          fontSize: 28,
          letterSpacing: 3,
          opacity: highlightOp,
          textShadow: `0 0 14px ${palette.accent}`,
        }}
      >
        ↑ ANTENNA ZONE ↑
      </div>
    </AbsoluteFill>
  );
};

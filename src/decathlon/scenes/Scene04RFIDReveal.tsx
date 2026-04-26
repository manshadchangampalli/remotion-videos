import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 04 RFID REVEAL — "It uses radio-frequency identification." (150f / 5s)
export const Scene04RFIDReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const letters = ["R", "F", "I", "D"];
  const meanings = ["RADIO", "FREQUENCY", "IDENTIF", "ICATION"];

  // big letters slam in
  const bigOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // expand to full words starting f50
  const expand = spring({ frame: frame - 55, fps, config: { damping: 18, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 42, letterSpacing: 10 }}>
          IT USES
        </div>

        <div style={{ display: "flex", gap: 20, opacity: bigOp }}>
          {letters.map((L, i) => {
            const letterSpring = spring({ frame: frame - 4 - i * 4, fps, config: { damping: 10, stiffness: 200 } });
            const s = interpolate(letterSpring, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: `scale(${s})`,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.heading,
                    fontWeight: 900,
                    fontSize: 280,
                    color: palette.text,
                    lineHeight: 1,
                    letterSpacing: -4,
                    textShadow: `0 0 30px ${palette.accent}, 0 0 60px ${palette.blue}88`,
                  }}
                >
                  {L}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    opacity: interpolate(expand, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(expand, [0, 1], [-10, 0])}px)`,
                    fontFamily: fonts.mono,
                    fontSize: 22,
                    color: palette.accent,
                    letterSpacing: 2,
                  }}
                >
                  {meanings[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

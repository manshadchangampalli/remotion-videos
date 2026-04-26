import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 15 UNIQUE INTRO — "not a generic barcode — a precise serial number" (120f / 4s)
export const Scene15UniqueIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const xSpring = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 180 } });
  const xProg = interpolate(xSpring, [0, 1], [0, 1]);

  const precSpring = spring({ frame: frame - 55, fps, config: { damping: 12, stiffness: 120 } });
  const precScale = interpolate(precSpring, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 }}>
        {/* Top row: NOT a barcode */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div
            style={{
              color: palette.danger,
              fontFamily: fonts.heading,
              fontWeight: 900,
              fontSize: 64,
              letterSpacing: 8,
              textShadow: `0 0 20px ${palette.danger}`,
              opacity: interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            NOT A BARCODE
          </div>
          <div
            style={{
              position: "relative",
              width: 260,
              height: 140,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                padding: "24px 32px",
                background: "#fff",
                display: "flex",
                gap: 3,
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              {[2, 5, 1, 7, 3, 6, 1, 4, 8, 2, 5, 3].map((w, i) => (
                <div key={i} style={{ width: w * 2, height: 80, background: i % 3 === 0 ? "#fff" : "#000" }} />
              ))}
            </div>
            <svg
              width={260}
              height={140}
              viewBox="0 0 260 140"
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
              <line
                x1={20}
                y1={20}
                x2={20 + 220 * xProg}
                y2={20 + 100 * xProg}
                stroke={palette.danger}
                strokeWidth={10}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 16px ${palette.danger})` }}
              />
            </svg>
          </div>
        </div>

        {/* Precise serial number — big */}
        <div style={{ transform: `scale(${precScale})`, textAlign: "center" }}>
          <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 32, letterSpacing: 8 }}>
            IT'S A
          </div>
          <div
            style={{
              marginTop: 10,
              color: palette.text,
              fontFamily: fonts.heading,
              fontWeight: 900,
              fontSize: 96,
              letterSpacing: -2,
              textShadow: `0 0 28px ${palette.accent}`,
              lineHeight: 1,
            }}
          >
            PRECISE<br />SERIAL NUMBER
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

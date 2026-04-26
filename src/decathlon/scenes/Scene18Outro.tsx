import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { DecathlonLogo } from "../components/DecathlonLogo";
import { palette, fonts } from "../components/palette";

// Scene 18 OUTRO — "Follow for more system architecture." (132f / 4.4s)
export const Scene18Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 10, 110, 132], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoSpring = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 120 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);

  const followSpring = spring({ frame: frame - 26, fps, config: { damping: 10, stiffness: 150 } });
  const followScale = interpolate(followSpring, [0, 1], [0.6, 1]);

  const arrowY = Math.sin(frame / 6) * 10;

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
        <div style={{ transform: `scale(${logoScale})` }}>
          <DecathlonLogo size={220} />
        </div>

        <div style={{ transform: `scale(${followScale})`, textAlign: "center" }}>
          <div
            style={{
              color: palette.accent,
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: 10,
              textShadow: `0 0 16px ${palette.accent}`,
            }}
          >
            FOLLOW FOR MORE
          </div>
          <div
            style={{
              marginTop: 10,
              color: palette.text,
              fontFamily: fonts.heading,
              fontWeight: 900,
              fontSize: 92,
              letterSpacing: -2,
              textShadow: `0 0 30px ${palette.blue}`,
            }}
          >
            SYSTEM<br />ARCHITECTURE
          </div>
        </div>

        <div
          style={{
            color: palette.accent,
            fontSize: 80,
            transform: `translateY(${arrowY}px)`,
            opacity: interpolate(frame, [55, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            textShadow: `0 0 20px ${palette.accent}`,
          }}
        >
          ↑
        </div>
      </div>
    </AbsoluteFill>
  );
};

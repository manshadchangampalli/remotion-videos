import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DecathlonLogo } from "../components/DecathlonLogo";
import { palette } from "../components/palette";

// Scene 01 HOOK — "You drop your clothes into a Decathlon checkout bin" (120f / 4s)
export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoSpring = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);

  // slow push-in on the real self-checkout kiosk photo
  const photoScale = interpolate(frame, [0, 120], [1.0, 1.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const clothes = ["👕", "👟", "🎽", "🧢", "🩳"];

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      {/* Real Decathlon self-checkout kiosk — full-bleed hero */}
      <AbsoluteFill>
        <Img
          src={staticFile("decathlon/decathlone self checkout image.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${photoScale})`,
            filter: "brightness(0.9) contrast(1.05) saturate(1.05)",
          }}
        />
      </AbsoluteFill>

      {/* Top gradient so the logo reads cleanly */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${palette.bg}ee 0%, ${palette.bg}55 28%, transparent 55%, ${palette.bg}22 85%, ${palette.bg}88 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${logoScale})`,
        }}
      >
        <DecathlonLogo size={180} />
      </div>

      {/* Falling clothes toward the kiosk bin */}
      {clothes.map((c, i) => {
        const start = 14 + i * 8;
        const t = Math.max(0, frame - start);
        const y = interpolate(t, [0, 55], [-240, 820], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const op = interpolate(t, [0, 10, 50, 60], [0, 1, 1, 0.2], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rot = interpolate(t, [0, 60], [0, i % 2 === 0 ? 35 : -35]);
        const x = 220 + i * 140;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: 480,
              transform: `translateY(${y}px) rotate(${rot}deg)`,
              fontSize: 120,
              opacity: op,
              filter: `drop-shadow(0 0 22px ${palette.accent}88)`,
            }}
          >
            {c}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

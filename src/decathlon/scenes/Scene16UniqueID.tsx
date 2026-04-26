import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 16 UNIQUE ID — "blue t-shirt, size medium, 4902115, unique in the world" (150f / 5s)
export const Scene16UniqueID: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardSpring = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 110 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.5, 1]);

  const rows = [
    { label: "PRODUCT", value: "BLUE T-SHIRT", start: 10 },
    { label: "SIZE", value: "MEDIUM", start: 30 },
    { label: "SN", value: "4902115", start: 50 },
  ];

  const uniqueOp = interpolate(frame, [95, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const uniqueScale = interpolate(frame, [95, 125], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${cardScale})`,
            width: 820,
            borderRadius: 24,
            background: `linear-gradient(145deg, ${palette.bgSoft}, ${palette.bg})`,
            border: `2px solid ${palette.accent}66`,
            boxShadow: `0 0 60px ${palette.accent}44`,
            padding: 48,
            fontFamily: fonts.heading,
          }}
        >
          <div style={{ color: palette.accent, fontSize: 26, letterSpacing: 6, fontWeight: 700, marginBottom: 16 }}>
            · ELECTRONIC PRODUCT CODE ·
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {rows.map((r, i) => {
              const opLocal = interpolate(frame, [r.start, r.start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const sx = spring({ frame: frame - r.start, fps, config: { damping: 14, stiffness: 170 } });
              const tx = interpolate(sx, [0, 1], [-40, 0]);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    borderBottom: `1px solid ${palette.accent}33`,
                    paddingBottom: 14,
                    opacity: opLocal,
                    transform: `translateX(${tx}px)`,
                  }}
                >
                  <div style={{ color: palette.textDim, fontSize: 28, letterSpacing: 4, fontWeight: 700 }}>{r.label}</div>
                  <div
                    style={{
                      color: palette.text,
                      fontSize: r.label === "SN" ? 70 : 46,
                      fontWeight: 900,
                      fontFamily: r.label === "SN" ? fonts.mono : fonts.heading,
                      letterSpacing: r.label === "SN" ? 4 : -1,
                      textShadow: `0 0 18px ${palette.accent}`,
                    }}
                  >
                    {r.value}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 30,
              textAlign: "center",
              opacity: uniqueOp,
              transform: `scale(${uniqueScale})`,
              color: palette.success,
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: 6,
              textShadow: `0 0 22px ${palette.success}`,
            }}
          >
            ✓ UNIQUE IN THE WORLD
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

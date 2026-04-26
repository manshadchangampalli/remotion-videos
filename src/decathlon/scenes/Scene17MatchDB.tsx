import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { ItemListRow } from "../components/ItemListRow";
import { palette, fonts } from "../components/palette";

// Scene 17 MATCH DB — "radar matches IDs to database, calculates total in milliseconds" (150f / 5s)
export const Scene17MatchDB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const items = [
    { icon: "👕", label: "T-Shirt Running", sn: "4902115", price: "₹299", appearFrame: 4 },
    { icon: "👟", label: "Trail Shoes", sn: "8831120", price: "₹1,499", appearFrame: 10 },
    { icon: "🎽", label: "Training Tank", sn: "2217745", price: "₹499", appearFrame: 16 },
    { icon: "🧢", label: "Sports Cap", sn: "6044201", price: "₹199", appearFrame: 22 },
  ];

  // Total ticks up
  const totalProgress = interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalTotal = 2496;
  const currentTotal = Math.round(finalTotal * totalProgress);

  const totalSpring = spring({ frame: frame - 88, fps, config: { damping: 10, stiffness: 180 } });
  const totalScale = interpolate(totalSpring, [0, 1], [1.25, 1]);

  // ms counter
  const ms = Math.max(0, 8 - Math.floor((frame - 40) / 6));

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", top: 180, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 32, letterSpacing: 10 }}>
          DATABASE LOOKUP
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 280,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {items.map((it, i) => (
          <ItemListRow key={i} {...it} />
        ))}
      </div>

      {/* Total card */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 820,
          padding: 32,
          borderRadius: 22,
          background: `linear-gradient(135deg, ${palette.success}22, ${palette.success}11)`,
          border: `2px solid ${palette.success}`,
          boxShadow: `0 0 50px ${palette.success}66`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: interpolate(frame, [34, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: palette.success, fontFamily: fonts.heading, fontWeight: 800, fontSize: 40, letterSpacing: 4 }}>
          TOTAL
        </div>
        <div
          style={{
            color: palette.text,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 88,
            letterSpacing: -3,
            textShadow: `0 0 22px ${palette.success}`,
            transform: `scale(${totalScale})`,
          }}
        >
          ₹{currentTotal.toLocaleString("en-IN")}
        </div>
      </div>

      {/* ms badge */}
      <div
        style={{
          position: "absolute",
          bottom: 240,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "16px 40px",
            borderRadius: 999,
            background: `${palette.accent}22`,
            border: `2px solid ${palette.accent}`,
            color: palette.accent,
            fontFamily: fonts.mono,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 3,
            textShadow: `0 0 16px ${palette.accent}`,
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {ms} ms
        </div>
      </div>
    </AbsoluteFill>
  );
};

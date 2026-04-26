import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 03 NO BARCODES — "No barcodes. How?" (90f / 3s)
export const Scene03NoBarcodes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bcSpring = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 130 } });
  const bcScale = interpolate(bcSpring, [0, 1], [0.6, 1]);

  const slashDraw = interpolate(frame, [22, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const qOp = interpolate(frame, [50, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qSpring = spring({ frame: frame - 50, fps, config: { damping: 10, stiffness: 180 } });
  const qScale = interpolate(qSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 80 }}>
        {/* Barcode with red slash */}
        <div
          style={{
            position: "relative",
            transform: `scale(${bcScale})`,
            width: 380,
            height: 300,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: "40px 48px",
              background: "#ffffff",
              display: "flex",
              gap: 3,
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {[2, 5, 1, 7, 3, 6, 1, 4, 8, 2, 5, 3, 7, 1, 6, 2, 4, 8, 1, 5].map((w, i) => (
              <div key={i} style={{ width: w * 2, height: 220, background: i % 3 === 0 ? "#fff" : "#000" }} />
            ))}
          </div>
          {/* Red slash — clipped to barcode bounds */}
          <svg
            width={380}
            height={300}
            viewBox="0 0 380 300"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <line
              x1={30}
              y1={30}
              x2={30 + 320 * slashDraw}
              y2={30 + 240 * slashDraw}
              stroke={palette.danger}
              strokeWidth={14}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 18px ${palette.danger})` }}
            />
          </svg>
        </div>

        <div
          style={{
            color: palette.danger,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 96,
            letterSpacing: 8,
            textShadow: `0 0 25px ${palette.danger}`,
            opacity: interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          NO BARCODES
        </div>

        <div
          style={{
            opacity: qOp,
            transform: `scale(${qScale})`,
            color: palette.accent,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 220,
            lineHeight: 1,
            textShadow: `0 0 40px ${palette.accent}`,
          }}
        >
          HOW?
        </div>
      </div>
    </AbsoluteFill>
  );
};

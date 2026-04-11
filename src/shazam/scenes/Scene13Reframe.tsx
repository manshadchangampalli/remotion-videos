import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";

export const Scene13Reframe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left panel slides in from left
  const leftSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const leftX = interpolate(leftSpring, [0, 1], [-600, 0]);

  // Right panel slides in from right
  const rightSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const rightX = interpolate(rightSpring, [0, 1], [600, 0]);

  // "PATTERN > MELODY" slams in
  const patternSpring = spring({
    frame: frame - 85,
    fps,
    config: { damping: 6, stiffness: 260 },
  });
  const patternY = interpolate(patternSpring, [0, 1], [-200, 0]);

  // Screen shake on slam
  const shakeX =
    frame >= 87 && frame <= 100
      ? Math.sin(frame * 5.5) * interpolate(frame, [87, 100], [10, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // NOT THIS label
  const notThisOp = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // THIS label
  const thisOp = interpolate(frame, [40, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Musical note fades out
  const noteOp = interpolate(frame, [50, 85], [1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sceneOp = interpolate(frame, [0, 15, 168, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textBotOp = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const PANEL_W = 440;
  const PANEL_H = 560;
  const PANEL_Y = 660;

  return (
    <AbsoluteFill
      style={{
        background: "#050505",
        opacity: sceneOp,
        transform: `translateX(${shakeX}px)`,
      }}
    >
      <CyberGrid opacity={0.2} />

      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: PANEL_Y - 20,
          width: 2,
          height: PANEL_H + 40,
          background: "rgba(255,255,255,0.12)",
          transform: "translateX(-50%)",
          opacity: Math.min(leftSpring, rightSpring),
        }}
      />

      {/* LEFT PANEL: Musical note */}
      <div
        style={{
          position: "absolute",
          left: 540 - PANEL_W - 20 + leftX,
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          background: "rgba(255,51,51,0.06)",
          border: "1.5px solid rgba(255,51,51,0.35)",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Musical note SVG */}
        <div style={{ opacity: noteOp }}>
          <svg width={160} height={160} viewBox="0 0 160 160">
            <text
              x={80}
              y={120}
              textAnchor="middle"
              fill="#ff3333"
              fontSize={120}
              fontFamily="serif"
              opacity={0.8}
            >
              ♪
            </text>
          </svg>
        </div>
        {/* NOT THIS label */}
        <div
          style={{
            opacity: notThisOp,
            background: "rgba(255,51,51,0.15)",
            border: "1.5px solid #ff3333",
            borderRadius: 8,
            padding: "8px 24px",
          }}
        >
          <span
            style={{
              color: "#ff3333",
              fontSize: 22,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              letterSpacing: 3,
            }}
          >
            NOT THIS
          </span>
        </div>
        <div
          style={{
            color: "rgba(255,51,51,0.5)",
            fontSize: 16,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            textAlign: "center",
            padding: "0 20px",
            opacity: notThisOp,
          }}
        >
          The melody
        </div>
      </div>

      {/* RIGHT PANEL: Hex fingerprint */}
      <div
        style={{
          position: "absolute",
          left: 540 + 20 + rightX,
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          background: "rgba(0,242,255,0.06)",
          border: "1.5px solid rgba(0,242,255,0.4)",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Hex grid visual */}
        <div
          style={{
            background: "rgba(0,242,255,0.08)",
            border: "1px solid rgba(0,242,255,0.3)",
            borderRadius: 12,
            padding: "16px 18px",
            boxShadow: `0 0 ${16 + Math.sin(frame / 9) * 8}px rgba(0,242,255,0.25)`,
          }}
        >
          {["A3F7 B2D1", "C8E4 96F0", "7B3A 5E12", "D904 8C6F"].map((line, i) => (
            <div
              key={i}
              style={{
                color: "#00f2ff",
                fontSize: 20,
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                letterSpacing: 2,
                opacity: 0.7 + Math.sin(frame / 8 + i) * 0.2,
                lineHeight: 1.8,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        {/* THIS label */}
        <div
          style={{
            opacity: thisOp,
            background: "rgba(0,242,255,0.12)",
            border: "1.5px solid #00f2ff",
            borderRadius: 8,
            padding: "8px 24px",
          }}
        >
          <span
            style={{
              color: "#00f2ff",
              fontSize: 22,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              letterSpacing: 3,
              textShadow: "0 0 10px rgba(0,242,255,0.5)",
            }}
          >
            THIS ✓
          </span>
        </div>
        <div
          style={{
            color: "rgba(0,242,255,0.5)",
            fontSize: 16,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            textAlign: "center",
            padding: "0 20px",
            opacity: thisOp,
          }}
        >
          The math pattern
        </div>
      </div>

      {/* PATTERN > MELODY slam */}
      <div
        style={{
          position: "absolute",
          top: 1310,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${patternY}px)`,
          opacity: patternSpring,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            color: "#fff",
            WebkitTextStroke: "2px #00f2ff",
            textShadow: "0 0 50px rgba(0,242,255,0.4)",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          PATTERN
        </div>
        <div
          style={{
            fontSize: 52,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            color: "#00f2ff",
            textShadow: "0 0 30px rgba(0,242,255,0.5)",
            letterSpacing: 4,
            marginTop: 4,
          }}
        >
          {">"} MELODY
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textBotOp,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 34,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.45,
          }}
        >
          Your phone didn't recognize the melody.
          <br />
          It recognized the{" "}
          <span style={{ color: "#00f2ff" }}>mathematical pattern</span>
          <br />
          hidden inside it.
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./fonts";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Soft background pulse
  const glowScale = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.4),
    [-1, 1],
    [0.9, 1.15]
  );

  // "MONOLITHIC" slides from left
  const monolithSpring = spring({ frame, fps, config: { damping: 80, stiffness: 150 } });
  const monolithX = interpolate(monolithSpring, [0, 1], [-500, 0]);
  const monolithOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // "vs" bounces in with overshoot
  const vsSpring = spring({ frame: frame - 20, fps, config: { damping: 8, stiffness: 250 } });
  const vsScale = interpolate(vsSpring, [0, 1], [0, 1]);
  const vsOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "MICROSERVICES" slides from right
  const microSpring = spring({ frame: frame - 38, fps, config: { damping: 80, stiffness: 150 } });
  const microX = interpolate(microSpring, [0, 1], [500, 0]);
  const microOpacity = interpolate(frame, [38, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider bar draws from center
  const dividerSpring = spring({ frame: frame - 65, fps, config: { damping: 80 } });
  const dividerWidth = interpolate(dividerSpring, [0, 1], [0, 320]);

  // Subtitle fades up
  const subtitleSpring = spring({ frame: frame - 88, fps, config: { damping: 80 } });
  const subtitleY = interpolate(subtitleSpring, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(frame, [88, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge pills slide up
  const badge1Spring = spring({ frame: frame - 125, fps, config: { damping: 12, stiffness: 150 } });
  const badge1Y = interpolate(badge1Spring, [0, 1], [60, 0]);
  const badge1Opacity = interpolate(frame, [125, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badge2Spring = spring({ frame: frame - 148, fps, config: { damping: 12, stiffness: 150 } });
  const badge2Y = interpolate(badge2Spring, [0, 1], [60, 0]);
  const badge2Opacity = interpolate(frame, [148, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* Background soft glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.06)",
          filter: "blur(100px)",
          transform: `scale(${glowScale})`,
        }}
      />

      <div
        style={{
          zIndex: 10,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 48px",
        }}
      >
        {/* MONOLITHIC */}
        <h1
          style={{
            fontSize: 104,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            margin: 0,
            color: "#111",
            transform: `translateX(${monolithX}px)`,
            opacity: monolithOpacity,
            fontFamily,
          }}
        >
          Monolithic
        </h1>

        {/* vs */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#3b82f6",
            fontStyle: "italic",
            margin: "14px 0",
            transform: `scale(${vsScale})`,
            opacity: vsOpacity,
            fontFamily,
          }}
        >
          vs
        </div>

        {/* MICROSERVICES */}
        <h1
          style={{
            fontSize: 104,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            margin: 0,
            color: "#111",
            transform: `translateX(${microX}px)`,
            opacity: microOpacity,
            fontFamily,
          }}
        >
          Microservices
        </h1>

        {/* Gradient divider */}
        <div
          style={{
            height: 6,
            background: "linear-gradient(to right, #3b82f6, #10b981)",
            borderRadius: 999,
            marginTop: 28,
            width: dividerWidth,
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            marginTop: 24,
            fontSize: 34,
            color: "#6b7280",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontFamily,
          }}
        >
          Architecture Deep Dive
        </p>
      </div>

      {/* Badge pills at bottom */}
      <div
        style={{
          position: "absolute",
          top: 100,
          display: "flex",
          gap: 32,
          zIndex: 10,
        }}
      >
        <div
          style={{
            transform: `translateY(${badge1Y}px)`,
            opacity: badge1Opacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(59,130,246,0.1)",
            border: "2px solid #3b82f6",
            borderRadius: 999,
            padding: "18px 36px",
          }}
        >
          <span style={{ fontSize: 36 }}>🧱</span>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#2563eb", fontFamily }}>
            MONOLITH
          </span>
        </div>
        <div
          style={{
            transform: `translateY(${badge2Y}px)`,
            opacity: badge2Opacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(16,185,129,0.1)",
            border: "2px solid #10b981",
            borderRadius: 999,
            padding: "18px 36px",
          }}
        >
          <span style={{ fontSize: 36 }}>⚡</span>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#059669", fontFamily }}>
            MICROSERVICES
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

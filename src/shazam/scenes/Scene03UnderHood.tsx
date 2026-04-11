import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IPhoneFrame } from "../components/IPhoneFrame";

export const Scene03UnderHood: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Violent spring zoom punching through phone
  const zoomSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 6, stiffness: 280 },
  });
  const zoomScale = interpolate(zoomSpring, [0, 1], [1, 8]);
  const phoneOp = interpolate(zoomSpring, [0, 0.55, 1], [1, 1, 0]);

  // Shockwave rings
  const shockwave1 = spring({
    frame: frame - 8,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const shockScale1 = interpolate(shockwave1, [0, 1], [0.5, 3]);
  const shockOp1 = interpolate(shockwave1, [0, 0.2, 1], [0, 0.8, 0]);

  const shockwave2 = spring({
    frame: frame - 14,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const shockScale2 = interpolate(shockwave2, [0, 1], [0.5, 4.5]);
  const shockOp2 = interpolate(shockwave2, [0, 0.15, 1], [0, 0.6, 0]);

  // Flash bursts
  const flash1 = interpolate(frame, [5, 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash2 = interpolate(frame, [18, 25], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash3 = interpolate(frame, [30, 36], [0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flashOp = Math.max(flash1, flash2, flash3);

  // Internal skeleton circuit lines appear
  const circuitOp = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Screen shake
  const shakeX = frame < 40 ? Math.sin(frame * 7.3) * interpolate(frame, [5, 30], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const shakeY = frame < 40 ? Math.cos(frame * 5.8) * interpolate(frame, [5, 30], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // Text
  const textOp = interpolate(frame, [52, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone screen — dark internal skeleton
  const skeletonScreen = (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#030303",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* Circuit trace lines */}
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={i}
            x1={Math.sin(i * 1.3) * 160 + 145}
            y1={i * 42 + 10}
            x2={Math.cos(i * 0.9 + 1) * 160 + 145}
            y2={i * 42 + 50}
            stroke="#00f2ff"
            strokeWidth={0.8}
            opacity={0.3 + Math.sin(frame / 5 + i) * 0.2}
          />
        ))}
        {/* Component dots */}
        {Array.from({ length: 8 }, (_, i) => (
          <circle
            key={i}
            cx={40 + (i % 4) * 75}
            cy={100 + Math.floor(i / 4) * 220}
            r={3}
            fill="#ff8c00"
            opacity={0.7}
          />
        ))}
      </svg>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {/* Flash overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          opacity: flashOp * 0.65,
          pointerEvents: "none",
        }}
      />

      {/* Circuit lines overlay (post-zoom) */}
      {circuitOp > 0 && (
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0, opacity: circuitOp, pointerEvents: "none" }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <line
              key={i}
              x1={Math.sin(i * 2.1) * 500 + 540}
              y1={Math.cos(i * 1.7) * 500 + 960}
              x2={Math.sin(i * 2.1 + 0.8) * 650 + 540}
              y2={Math.cos(i * 1.7 + 0.5) * 650 + 960}
              stroke="#00f2ff"
              strokeWidth={0.7}
              opacity={0.15 + Math.sin(frame / 8 + i) * 0.1}
            />
          ))}
        </svg>
      )}

      {/* Shockwave rings */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 640,
            borderRadius: 44,
            border: "4px solid #00f2ff",
            opacity: shockOp1,
            transform: `translate(-50%, -50%) scale(${shockScale1})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 640,
            borderRadius: 44,
            border: "2px solid #ff8c00",
            opacity: shockOp2,
            transform: `translate(-50%, -50%) scale(${shockScale2})`,
          }}
        />
      </div>

      {/* iPhone zooming in */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translate(${shakeX}px, ${shakeY}px) scale(${zoomScale})`,
            opacity: phoneOp,
            transformOrigin: "center center",
          }}
        >
          <IPhoneFrame
            width={320}
            height={640}
            glowColor="#00f2ff"
            screenContent={skeletonScreen}
          />
        </div>
      </div>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOp,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 46,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            lineHeight: 1.3,
            textShadow: "0 0 30px rgba(0,242,255,0.25)",
          }}
        >
          But here's what's actually happening{" "}
          <span style={{ color: "#00f2ff" }}>under the hood.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

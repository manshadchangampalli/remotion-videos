import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { IPhoneFrame } from "../components/IPhoneFrame";
import { MainHeading } from "../components/MainHeading";

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone floats in
  const phoneSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.6, 1]);
  const phoneOp = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slow camera arc: phone gently rocks left/right
  const arcAngle = Math.sin(frame / 28) * 6;
  const arcTiltY = Math.sin(frame / 40) * 4;
  const floatY = Math.sin(frame / 22) * 12;

  // Pulsing grid glow
  const gridOp = 0.55 + Math.sin(frame / 18) * 0.2;

  // Shazam app screen content
  const shazamScreen = (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #070a1a 0%, #040818 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Shazam-style blue ring */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, #1a6fff44 0%, #0047cc22 60%, transparent 100%)",
          border: "3px solid #1a6fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${20 + Math.sin(frame / 10) * 8}px #1a6fff66`,
        }}
      >
        <span style={{ fontSize: 62, fontWeight: 900, color: "#fff", fontFamily: "sans-serif" }}>S</span>
      </div>
      <div
        style={{
          color: "#ffffff",
          fontSize: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          opacity: 0.7,
          letterSpacing: 2,
        }}
      >
        SHAZAM
      </div>
      {/* Tap to Shazam hint */}
      <div
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 13,
          fontFamily: "sans-serif",
          marginTop: 8,
          opacity: 0.5 + Math.sin(frame / 12) * 0.3,
        }}
      >
        Tap to Shazam
      </div>
    </div>
  );

  // Hook text at bottom
  const textOp = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <CyberGrid opacity={gridOp} />

      <MainHeading />

      {/* Floating iPhone — positioned in lower half */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `
              scale(${phoneScale})
              rotateY(${arcAngle}deg)
              rotateX(${arcTiltY}deg)
              translateY(${floatY}px)
            `,
            opacity: phoneOp,
            perspective: "1200px",
          }}
        >
          <IPhoneFrame
            width={360}
            height={720}
            glowColor="#00f2ff"
            screenContent={shazamScreen}
          />
        </div>
      </div>

      {/* Hook text at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOp,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 40,
            fontFamily: "'Outfit', 'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.3,
            textShadow: "0 0 20px rgba(0,242,255,0.2)",
          }}
        >
          You tap a button...
        </div>
      </div>
    </AbsoluteFill>
  );
};

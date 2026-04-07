import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { Background } from "./Background";

const SHORT_URL = "bit.ly/3xK9mZ";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: URL appears (0-1s)
  const urlAppear = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });

  // Phase 2: URL shakes (0-2s = 0-60 frames)
  const shakeAmount = interpolate(frame, [0, 15, 55, 60], [0, 6, 6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 1.2) * shakeAmount;
  const shakeY = Math.cos(frame * 0.8) * shakeAmount * 0.4;

  // Phase 3: Collapse to short URL (2-3s = 60-90 frames)
  const snapProgress = interpolate(frame, [62, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Long URL fading out
  const longOpacity = interpolate(snapProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const longScale = interpolate(snapProgress, [0, 1], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Short URL appearing
  const shortOpacity = spring({
    frame: frame - 70,
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  const shortScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  // Short URL glow pulse (after it appears)
  const glowPulse =
    frame > 95
      ? Math.sin((frame - 95) * 0.15) * 0.35 + 0.65
      : 0;

  // Phase 4: Cursor appears and clicks (3.3-5s = 99-150 frames)
  const cursorOpacity = interpolate(frame, [99, 108], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(frame, [99, 128], [200, 490], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorY = interpolate(frame, [99, 128], [1100, 970], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorClick = interpolate(frame, [130, 138, 145], [1, 0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleScale = interpolate(frame, [130, 160], [0, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleOpacity = interpolate(frame, [130, 160], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5: Dive into screen (5-6.3s = 150-190 frames)
  const diveScale = interpolate(frame, [148, 190], [1, 9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });
  const diveOpacity = interpolate(frame, [165, 190], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: diveOpacity }}>
      <Background />

      {/* Ambient glow behind URL area */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)",
          transform: `translate(-50%, -50%) scale(${diveScale})`,
          opacity: urlAppear,
        }}
      />

      {/* Main content area - scales during dive */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          transform: `scale(${diveScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Long messy URL */}
        <div
          style={{
            opacity: longOpacity * urlAppear,
            transform: `translateX(${shakeX}px) translateY(${shakeY}px) scale(${longScale})`,
            width: 920,
            padding: "28px 36px",
            borderRadius: 16,
            border: "1px solid #1e3a5f",
            background: "rgba(8, 16, 35, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              color: "#475569",
              fontSize: 28,
              fontFamily: "'Courier New', monospace",
              wordBreak: "break-all",
              lineHeight: 1.4,
              letterSpacing: 0.3,
            }}
          >
            <span style={{ color: "#64748b" }}>https://</span>
            <span style={{ color: "#94a3b8" }}>www.example-website.com</span>
            <span style={{ color: "#475569" }}>
              /products/electronics/smartphones/latest-model-pro-max
            </span>
            <span style={{ color: "#334155" }}>
              ?ref=google&utm_source=cpc&utm_campaign=brand_awareness&utm_medium=paid_search
            </span>
          </div>
        </div>

        {/* Arrow indicating collapse */}
        <div
          style={{
            opacity: Math.min(longOpacity, shortOpacity) * urlAppear,
            color: "#00f5ff",
            fontSize: 42,
            lineHeight: 1,
          }}
        >
          ↓
        </div>

        {/* Short URL - the star */}
        <div
          style={{
            opacity: shortOpacity,
            transform: `scale(${shortScale})`,
            padding: "32px 70px",
            borderRadius: 20,
            border: `2.5px solid #00f5ff`,
            background: "rgba(0, 245, 255, 0.04)",
            boxShadow: `0 0 ${30 + glowPulse * 40}px rgba(0,245,255,${0.35 + glowPulse * 0.25}), 0 0 ${60 + glowPulse * 60}px rgba(0,245,255,${0.15 + glowPulse * 0.1}), inset 0 0 30px rgba(0,245,255,0.04)`,
          }}
        >
          <div
            style={{
              color: "#00f5ff",
              fontSize: 110,
              fontWeight: 900,
              fontFamily: "'Courier New', monospace",
              letterSpacing: 4,
              textShadow: `0 0 20px rgba(0,245,255,0.9), 0 0 40px rgba(0,245,255,0.5)`,
            }}
          >
            {SHORT_URL}
          </div>
        </div>

        {/* "One click. One redirect." tagline */}
        <div
          style={{
            opacity: interpolate(frame, [100, 116], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * shortOpacity,
            color: "#475569",
            fontSize: 28,
            fontFamily: "'Courier New', monospace",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          ONE CLICK. ENDLESS JOURNEY.
        </div>
      </div>

      {/* Mouse cursor */}
      <svg
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: cursorOpacity,
          transform: `scale(${cursorClick}) scale(${diveScale})`,
          transformOrigin: "top left",
          filter: "drop-shadow(0 0 12px rgba(0,245,255,0.9))",
          pointerEvents: "none",
        }}
        width="48"
        height="52"
        viewBox="0 0 48 52"
      >
        <path
          d="M 4 4 L 4 38 L 12 28 L 18 46 L 24 43 L 18 25 L 30 25 Z"
          fill="white"
          stroke="#00f5ff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Click ripple */}
      {rippleOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: cursorX + 8,
            top: cursorY + 8,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2.5px solid #00f5ff",
            transform: `translate(-50%, -50%) scale(${rippleScale})`,
            opacity: rippleOpacity,
            boxShadow: "0 0 20px rgba(0,245,255,0.4)",
          }}
        />
      )}

      {/* "CLICK!" text flash */}
      {frame >= 130 && frame <= 148 && (
        <div
          style={{
            position: "absolute",
            left: cursorX + 40,
            top: cursorY - 20,
            color: "#00f5ff",
            fontSize: 32,
            fontWeight: 900,
            fontFamily: "'Courier New', monospace",
            opacity: interpolate(frame, [130, 135, 145, 148], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            textShadow: "0 0 15px rgba(0,245,255,0.9)",
          }}
        >
          CLICK!
        </div>
      )}
    </AbsoluteFill>
  );
};

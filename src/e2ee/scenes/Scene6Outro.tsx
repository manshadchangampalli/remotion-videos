import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Grid } from "../components/Grid";

const STAGES = [
  { icon: "🔑", label: "KEY", color: "#FFD600", crossed: false },
  { icon: "🔒", label: "VAULT", color: "#FF1744", crossed: false },
  { icon: "🖥️", label: "SERVER", color: "#00E5FF", crossed: true },
  { icon: "🎭", label: "HACKER", color: "#FF6D00", crossed: true },
  { icon: "🔑", label: "KEY", color: "#FFD600", crossed: false },
  { icon: "💬", label: "MESSAGE", color: "#00E676", crossed: false },
];

export const Scene6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── PHASE 1: System overview scales in (0–60) ──
  const overviewScale = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const overviewS = interpolate(overviewScale, [0, 1], [0.6, 0.75]);

  // Stage icons spring in staggered
  const stageOps = STAGES.map((_, i) =>
    spring({
      frame: frame - (10 + i * 12),
      fps,
      config: { damping: 12, stiffness: 160 },
    })
  );

  // Connector lines between stages
  const connectorOp = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 2: "PRIVACY = MATH" slams in (80–120) ──
  const privacySpring = spring({
    frame: frame - 82,
    fps,
    config: { damping: 5, stiffness: 310 },
  });
  const privacyY = interpolate(privacySpring, [0, 1], [-250, 0]);
  const privacyOp = privacySpring;

  // Screen shake
  const shakeX =
    frame >= 84 && frame <= 96
      ? Math.sin(frame * 4.5) * interpolate(frame, [84, 96], [8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const shakeY =
    frame >= 84 && frame <= 96
      ? Math.cos(frame * 3.8) * interpolate(frame, [84, 96], [5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Impact flash
  const impactFlash = interpolate(frame, [82, 92], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle: "It's architecture, not a promise."
  const subtitleOp = interpolate(frame, [118, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 3: CTA pill pulsing (150–200) ──
  const ctaSpring = spring({
    frame: frame - 152,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const ctaY = interpolate(ctaSpring, [0, 1], [80, 0]);
  const ctaPulse = 0.85 + Math.sin(frame / 8) * 0.15;
  const ctaGlow = 0.4 + Math.sin(frame / 8) * 0.2;

  // Cursor animation
  const cursorX = interpolate(frame, [165, 180], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorClick = frame >= 182 && frame <= 192;
  const cursorScale = cursorClick
    ? interpolate(frame, [182, 186, 190, 192], [1, 0.75, 1.1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Click ripple
  const clickRipple = interpolate(frame, [183, 198], [0, 2.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clickRippleOp = interpolate(frame, [183, 198], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [192, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ICON_SPACING = 150;
  const ICONS_TOTAL_W = (STAGES.length - 1) * ICON_SPACING;
  const ICONS_START_X = 540 - ICONS_TOTAL_W / 2;

  return (
    <AbsoluteFill
      style={{
        background: "#050A0F",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <Grid />

      {/* Impact flash */}
      {frame >= 82 && frame <= 94 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "white",
            opacity: impactFlash * 0.45,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Fade out overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#050A0F",
          opacity: fadeOut,
          pointerEvents: "none",
        }}
      />

      {/* ── Journey overview: stage icons ── */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          right: 0,
          transform: `scale(${overviewS})`,
          transformOrigin: "center center",
        }}
      >
        {/* Stage icons */}
        {STAGES.map((stage, i) => {
          const iconX = ICONS_START_X + i * ICON_SPACING;
          const s = stageOps[i];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: iconX - 40,
                top: -60,
                width: 80,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                opacity: s,
                transform: `scale(${0.5 + s * 0.5}) translateY(${(1 - s) * 30}px)`,
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `rgba(5,10,20,0.9)`,
                  border: `2px solid ${stage.color}`,
                  boxShadow: `0 0 18px ${stage.color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  position: "relative",
                }}
              >
                {stage.icon}
                {/* Red X for crossed stages */}
                {stage.crossed && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width={72} height={72} viewBox="0 0 72 72">
                      <line
                        x1={14}
                        y1={14}
                        x2={58}
                        y2={58}
                        stroke="#FF1744"
                        strokeWidth={5}
                        strokeLinecap="round"
                      />
                      <line
                        x1={58}
                        y1={14}
                        x2={14}
                        y2={58}
                        stroke="#FF1744"
                        strokeWidth={5}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {/* Label */}
              <span
                style={{
                  color: stage.color,
                  fontSize: 15,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                {stage.label}
              </span>
            </div>
          );
        })}

        {/* Connector lines between stages */}
        <svg
          width={1080}
          height={40}
          style={{ position: "absolute", top: -24, left: 0, opacity: connectorOp }}
        >
          {STAGES.slice(0, -1).map((_, i) => {
            const x1 = ICONS_START_X + i * ICON_SPACING + 36;
            const x2 = ICONS_START_X + (i + 1) * ICON_SPACING - 36;
            return (
              <line
                key={i}
                x1={x1}
                y1={20}
                x2={x2}
                y2={20}
                stroke="rgba(0,229,255,0.5)"
                strokeWidth={1.5}
                strokeDasharray="8 5"
              />
            );
          })}
        </svg>
      </div>

      {/* ── "PRIVACY = MATH" ── */}
      <div
        style={{
          position: "absolute",
          top: 730,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${privacyY}px)`,
          opacity: privacyOp,
        }}
      >
        <div
          style={{
            fontSize: 128,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            letterSpacing: -4,
            color: "#FFFFFF",
            WebkitTextStroke: "3px #00E5FF",
            textShadow: `0 0 60px rgba(0,229,255,0.45), 0 0 120px rgba(0,229,255,0.2)`,
            lineHeight: 1,
          }}
        >
          PRIVACY
        </div>
        <div
          style={{
            fontSize: 128,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            letterSpacing: -4,
            color: "#FFFFFF",
            WebkitTextStroke: "3px #00E5FF",
            textShadow: `0 0 60px rgba(0,229,255,0.45)`,
            lineHeight: 1,
          }}
        >
          = MATH
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: subtitleOp,
        }}
      >
        <span
          style={{
            color: "rgba(180,200,220,0.8)",
            fontSize: 36,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            fontStyle: "italic",
            letterSpacing: 0.5,
          }}
        >
          It's architecture, not a promise.
        </span>
      </div>

      {/* ── CTA pill ── */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: ctaSpring,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        {/* Click ripple */}
        {frame >= 183 && (
          <div
            style={{
              position: "absolute",
              width: 400,
              height: 80,
              borderRadius: 40,
              border: "2px solid #00E5FF",
              opacity: clickRippleOp,
              transform: `scale(${clickRipple})`,
              pointerEvents: "none",
            }}
          />
        )}

        <div
          style={{
            background: "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(0,229,255,0.08))",
            border: `2px solid rgba(0,229,255,${ctaPulse * 0.8})`,
            borderRadius: 40,
            padding: "18px 48px",
            boxShadow: `0 0 30px rgba(0,229,255,${ctaGlow}), 0 0 60px rgba(0,229,255,${ctaGlow * 0.4})`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `scale(${ctaSpring * 0.05 + 0.95})`,
          }}
        >
          <span
            style={{
              color: "#00E5FF",
              fontSize: 26,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              letterSpacing: 2,
              textShadow: "0 0 16px rgba(0,229,255,0.6)",
            }}
          >
            FOLLOW FOR MORE SYSTEM DESIGN
          </span>

          {/* Animated cursor */}
          <div
            style={{
              position: "relative",
              transform: `translateX(${cursorX}px) scale(${cursorScale})`,
              opacity: ctaSpring,
            }}
          >
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <path
                d="M5 3L19 12L12 13.5L9 21L5 3Z"
                fill="#00E5FF"
                stroke="#00E5FF"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Decorative corner glows */}
      <div
        style={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

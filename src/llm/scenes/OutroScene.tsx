import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, staticFile, Img,
} from "remotion";

const C   = "#00f2ff";
const CO  = "#ff8c00";
const FH  = "'Montserrat', sans-serif";
const FL  = "'Inter', sans-serif";
const DUR = 75;  // 2.5s — audio ends at 126.5s, outro audio is 2:04-2:06

// Seeded random
const sr = (n: number) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x); };

// Background neural nodes
const NODES = Array.from({ length: 10 }, (_, i) => ({
  x: sr(i * 13) * 1080,
  y: sr(i * 17) * 1920,
  r: sr(i * 19) * 3 + 1.5,
  speed: sr(i * 23) * 0.02 + 0.01,
}));

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sIn  = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op   = sIn * sOut;
  const pulse = Math.sin(frame * 0.22) * 0.5 + 0.5;
  const gridY = (frame * 1.6) % 80;

  // "IT JUST" slams in from above
  const line1 = spring({ frame: frame - 8, fps, config: { damping: 7, stiffness: 320 } });

  // "PREDICTS." slams in — slightly after
  const line2 = spring({ frame: frame - 18, fps, config: { damping: 7, stiffness: 320 } });

  // "Follow for more" slides up
  const btnIn = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 200 } });

  // Shockwave ring when PREDICTS slams in
  const shockIn  = interpolate(frame, [18, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shockRad = interpolate(frame, [18, 55], [0, 800], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shockOp  = interpolate(frame, [18, 55], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Screen shake on slam
  const shakeX = frame >= 18 && frame <= 28
    ? Math.sin(frame * 11) * interpolate(frame, [18, 28], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Cursor animation: moves toward button, clicks
  const cursorX = interpolate(frame, [50, 65], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorY = interpolate(frame, [50, 65], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clickScale = frame > 65 && frame < 75
    ? interpolate(frame, [65, 70, 75], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ opacity: op, background: "#050505" }}>

      {/* Grid */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
        <defs>
          <pattern id="ot_g" width="80" height="80" patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${gridY})`}>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1d1d1d" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#ot_g)" />
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y + Math.sin(frame * n.speed) * 30} r={n.r} fill={C} opacity={0.18} />
            {NODES.slice(i + 1, i + 3).map((n2, j) => (
              <line key={j}
                x1={n.x}  y1={n.y  + Math.sin(frame * n.speed)  * 30}
                x2={n2.x} y2={n2.y + Math.sin(frame * n2.speed) * 30}
                stroke={C} strokeWidth={0.5} opacity={0.07} />
            ))}
          </g>
        ))}

        {/* Shockwave ring on PREDICTS slam */}
        {shockIn > 0 && (
          <circle cx={540} cy={960} r={shockRad}
            fill="none" stroke={CO} strokeWidth={2.5}
            opacity={shockOp} />
        )}
      </svg>

      {/* Central glow */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 800, height: 800, borderRadius: "50%",
        background: `radial-gradient(circle, ${C}14 0%, transparent 70%)`,
        transform: `translate(-50%, -50%) scale(${0.85 + pulse * 0.18})`,
        opacity: interpolate(frame, [0, 30], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        pointerEvents: "none",
      }} />

      {/* ── Main text slam ── */}
      <div style={{
        position: "absolute",
        top: 740,
        left: 0, right: 0,
        textAlign: "center",
        transform: `translateX(${shakeX}px)`,
      }}>
        {/* "IT JUST" */}
        <div style={{
          transform: `translateY(${(1 - line1) * -120}px) scale(${0.5 + line1 * 0.5})`,
          opacity: line1,
          lineHeight: 1,
          marginBottom: 4,
        }}>
          <span style={{
            color: "white",
            fontSize: 100,
            fontFamily: FH,
            fontWeight: 900,
            letterSpacing: -3,
            textShadow: "0 0 40px rgba(255,255,255,0.15)",
          }}>
            IT JUST
          </span>
        </div>

        {/* "PREDICTS." */}
        <div style={{
          transform: `translateY(${(1 - line2) * 120}px) scale(${0.5 + line2 * 0.5})`,
          opacity: line2,
          lineHeight: 1,
        }}>
          <span style={{
            color: CO,
            fontSize: 116,
            fontFamily: FH,
            fontWeight: 900,
            letterSpacing: -4,
            textShadow: `0 0 40px ${CO}, 0 0 80px ${CO}66`,
          }}>
            PREDICTS.
          </span>
        </div>
      </div>

      {/* ── Follow button ── */}
      {btnIn > 0 && (
        <div style={{
          position: "absolute",
          bottom: 340,
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
          opacity: btnIn,
          transform: `translateY(${(1 - btnIn) * 60}px)`,
        }}>
          <div style={{
            background: `linear-gradient(135deg, #0d1b2a, #1a2f4a)`,
            border: `2px solid rgba(0,242,255,${0.35 + pulse * 0.25})`,
            borderRadius: 60,
            padding: "22px 80px",
            boxShadow: `0 0 ${28 + pulse * 20}px rgba(0,242,255,0.28), inset 0 1px 0 rgba(0,242,255,0.12)`,
            position: "relative",
          }}>
            <span style={{ color: C, fontSize: 32, fontFamily: FH, fontWeight: 900, letterSpacing: 1 }}>
              Follow for more
            </span>

            {/* Cursor */}
            <div style={{
              position: "absolute",
              right: -20 + cursorX,
              bottom: -20 + cursorY,
              transform: `scale(${clickScale})`,
              pointerEvents: "none",
            }}>
              <Img
                src={staticFile("llm-working/mouse-cursor-icon.png")}
                style={{ width: 36, height: 36, objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom tagline */}
      {btnIn > 0.5 && (
        <div style={{
          position: "absolute", bottom: 280, left: 0, right: 0, textAlign: "center",
          opacity: Math.min(1, (btnIn - 0.5) * 2),
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 20, fontFamily: FL }}>
            More CS concepts explained simply →
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

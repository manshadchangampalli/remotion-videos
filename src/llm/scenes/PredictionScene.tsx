import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";

const C   = "#00f2ff";
const CO  = "#ff8c00";
const FH  = "'Montserrat', sans-serif";
const FC  = "'JetBrains Mono', 'Courier New', monospace";
const FL  = "'Inter', sans-serif";
const DUR = 1080;  // 36s — prediction segment 1:28-2:04

// Seeded random
const sr = (n: number) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x); };

// 150 background particles (within 300 max)
const BG_PARTICLES = Array.from({ length: 150 }, (_, i) => ({
  angle: sr(i * 4)     * Math.PI * 2,
  radius: sr(i * 4 + 1) * 340 + 80,
  r:      sr(i * 4 + 2) * 2.5 + 1,
  speed:  sr(i * 4 + 3) * 0.6 + 0.2,
  phase:  sr(i * 7)     * Math.PI * 2,
}));

// Slot words — cycle through these
const SLOT_WORDS = [
  "function", "method", "hook", "route", "handler",
  "type", "Comp", "Componen_", "Component",
];
const SLOT_H    = 90;  // height per slot item
const SLOT_VISIBLE = 3; // items visible at once

export const PredictionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sIn  = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sOut = interpolate(frame, [DUR - 28, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sphere rotation for particles
  const sphereRot = frame * 0.3;
  const pulse = Math.sin(frame * 0.13) * 0.5 + 0.5;

  // Heading
  const headIn = interpolate(frame, [12, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Slot machine slides up
  const slotIn = spring({ frame: frame - 55, fps, config: { damping: 13, stiffness: 140 } });
  const slotY  = (1 - slotIn) * 300;

  // Context text above slot
  const contextIn = interpolate(frame, [65, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Slot scroll:
  //   0-65:   machine entering
  //   65-360: fast spinning (cycles through all words)
  //   360-470: slowing down
  //   470-530: near-miss (Componen_ → Component)
  //   530-600: stop + badge

  const fastScroll = interpolate(frame, [65, 360], [0, SLOT_WORDS.length * SLOT_H * 3.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => t,
  });
  const slowScroll = interpolate(frame, [360, 490], [0, (SLOT_WORDS.length - 1) * SLOT_H], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Final resting position: "Component" is at index 8
  const finalOffset = 8 * SLOT_H;
  const totalScroll = frame < 360 ? fastScroll
    : frame < 490 ? fastScroll + slowScroll
    : fastScroll + (SLOT_WORDS.length - 1) * SLOT_H;

  // Current visible item index (center)
  const currentIdx = Math.round(totalScroll / SLOT_H) % SLOT_WORDS.length;

  // Badge appears after stop
  const badgeIn = spring({ frame: frame - 510, fps, config: { damping: 8, stiffness: 200 } });
  const pctIn   = spring({ frame: frame - 525, fps, config: { damping: 9, stiffness: 185 } });

  // Screen shake on stop
  const stopShake = frame > 490 && frame < 515
    ? Math.sin(frame * 11) * interpolate(frame, [490, 515], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const slotCenterY = 970;

  // Items to render in the slot (3 visible)
  const slotItems = [-1, 0, 1].map((offset) => {
    const idx = ((currentIdx + offset) % SLOT_WORDS.length + SLOT_WORDS.length) % SLOT_WORDS.length;
    return { word: SLOT_WORDS[idx], offset };
  });

  void finalOffset;

  return (
    <AbsoluteFill style={{ opacity: sIn * sOut, background: "#050505" }}>

      {/* ── Swirling particle sphere ── */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {BG_PARTICLES.map((p, i) => {
          const a = p.angle + sphereRot * p.speed * 0.015;
          const px = 540 + Math.cos(a) * p.radius * 0.9;
          const py = 960 + Math.sin(a) * p.radius * 0.45
                   + Math.sin(frame * p.speed * 0.03 + p.phase) * 12;
          return (
            <circle key={i} cx={px} cy={py} r={p.r}
              fill={i % 5 === 0 ? CO : C}
              opacity={0.18 + Math.sin(p.phase + frame * 0.05) * 0.06} />
          );
        })}

        {/* Center glow */}
        <circle cx={540} cy={960} r={200}
          fill="none" stroke={C}
          strokeWidth={0.5} opacity={0.12 + pulse * 0.08} />
        <circle cx={540} cy={960} r={340}
          fill="none" stroke={C}
          strokeWidth={0.5} opacity={0.06 + pulse * 0.04} />

        {/* Heading */}
        <g opacity={headIn}>
          <text x={540} y={295} textAnchor="middle"
            fill={C} fontSize={18} fontFamily={FL} letterSpacing={4} opacity={0.7}>STEP 4</text>
          <text x={540} y={352} textAnchor="middle"
            fill="white" fontSize={50} fontFamily={FH} fontWeight={900}>Next-Token Prediction</text>
          <text x={540} y={398} textAnchor="middle"
            fill="rgba(255,255,255,0.4)" fontSize={20} fontFamily={FL}>
            What comes next?
          </text>
        </g>
      </svg>

      {/* ── Slot Machine ── */}
      <div style={{
        position: "absolute",
        left: 190, right: 190,
        top: slotCenterY - SLOT_H * SLOT_VISIBLE / 2 - 10,
        transform: `translateY(${slotY}px) translateX(${stopShake}px)`,
        opacity: slotIn,
      }}>
        {/* Context prompt */}
        <div style={{ textAlign: "center", marginBottom: 14, opacity: contextIn }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontFamily: FC }}>
            {"<s>"} return ({"<"}
          </span>
          <span style={{ color: C, fontSize: 18, fontFamily: FC, fontWeight: 700 }}>
            ?
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontFamily: FC }}>
            {"/>"}
          </span>
        </div>

        {/* Slot frame */}
        <div style={{
          position: "relative",
          height: SLOT_H * SLOT_VISIBLE,
          background: "rgba(8,14,30,0.92)",
          border: `2px solid rgba(0,242,255,0.3)`,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: `0 0 ${20 + pulse * 15}px rgba(0,242,255,0.2)`,
        }}>
          {/* Top & bottom fade */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: `linear-gradient(to bottom,
              rgba(5,5,5,0.85) 0%,
              transparent 25%,
              transparent 75%,
              rgba(5,5,5,0.85) 100%)`,
          }} />

          {/* Center highlight bar */}
          <div style={{
            position: "absolute",
            top: SLOT_H,
            left: 0, right: 0,
            height: SLOT_H,
            background: "rgba(0,242,255,0.07)",
            borderTop: `1.5px solid rgba(0,242,255,0.3)`,
            borderBottom: `1.5px solid rgba(0,242,255,0.3)`,
            zIndex: 1,
          }} />

          {/* Scrolling words */}
          {slotItems.map(({ word, offset }) => (
            <div key={offset} style={{
              position: "absolute",
              left: 0, right: 0,
              top: (offset + 1) * SLOT_H,
              height: SLOT_H,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 3,
            }}>
              <span style={{
                color: offset === 0
                  ? (word === "Component" ? C : word === "Componen_" ? CO : "white")
                  : "rgba(255,255,255,0.2)",
                fontSize: offset === 0 ? 34 : 24,
                fontFamily: FC,
                fontWeight: offset === 0 ? 900 : 400,
                transition: "font-size 0.1s",
              }}>
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* 99% badge */}
        {badgeIn > 0 && frame > 500 && (
          <div style={{
            marginTop: 18,
            display: "flex", justifyContent: "center",
            transform: `scale(${badgeIn})`,
            transformOrigin: "center top",
          }}>
            <div style={{
              background: "rgba(0,200,100,0.15)",
              border: "2px solid #00c864",
              borderRadius: 50,
              padding: "12px 40px",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: `0 0 ${badgeIn * 24}px rgba(0,200,100,0.35)`,
            }}>
              <span style={{ color: "#00c864", fontSize: 28, fontFamily: FH, fontWeight: 900 }}>
                ✓ Component
              </span>
              <span style={{
                color: "#00c864",
                fontSize: 22, fontFamily: FL, fontWeight: 700,
                opacity: pctIn,
              }}>
                99%
              </span>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

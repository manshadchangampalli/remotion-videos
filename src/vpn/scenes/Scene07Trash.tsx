/**
 * Scene 07 – Thrown in the Trash  (frames 728–823, 3.17 s)
 * Audio: "sees the name, and throws your request in the trash."  →  local f0
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { ClickRipple } from "../components/ClickRipple";

const PARTS = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2 + i * 0.15;
  const s = 150 + (i % 5) * 48;
  return { vx: Math.cos(a) * s, vy: Math.sin(a) * s - 50, sz: 7 + (i % 4) * 5, id: i };
});

export const Scene07Trash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // EXPLODE at f5
  const EXPLODE = 5;
  const exT  = interpolate(frame, [EXPLODE, EXPLODE + 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [EXPLODE, EXPLODE + 12], [0.65, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Shake
  const shakeX = frame >= EXPLODE && frame <= EXPLODE + 24
    ? Math.sin(frame * 6) * interpolate(frame, [EXPLODE, EXPLODE + 24], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const shakeY = frame >= EXPLODE && frame <= EXPLODE + 24
    ? Math.cos(frame * 4.2) * interpolate(frame, [EXPLODE, EXPLODE + 24], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // "CONNECTION DROPPED" slams in at f25
  const textSpring = spring({ frame: frame - 25, fps, config: { damping: 5, stiffness: 300 } });
  const textOp   = interpolate(frame, [25, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textSc   = interpolate(textSpring, [0, 0.75, 1], [1.5, 0.9, 1]);
  const textFlash = interpolate(frame, [25, 36], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sub-label
  const subOp = interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn, transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <CyberGrid opacity={0.3} color="#2a0000" />
      {flash > 0.02 && <div style={{ position: "absolute", inset: 0, background: "#ff3333", opacity: flash * 0.45, pointerEvents: "none" }} />}
      {textFlash > 0.02 && <div style={{ position: "absolute", inset: 0, background: "#ff3333", opacity: textFlash * 0.28, pointerEvents: "none" }} />}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center 55%, rgba(255,51,51,0.16) 0%, transparent 60%)", pointerEvents: "none" }} />
      {/* Ripple when request gets blocked */}
      <ClickRipple frame={frame} triggerFrame={8} x={540} y={960} color="#ff3333" maxRadius={180} />

      {/* Explosion particles */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s7glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {PARTS.map((p) => {
          if (exT < 0.02) return null;
          const px  = 540 + p.vx * exT;
          const py  = 960 + p.vy * exT + 280 * exT * exT;
          const fad = interpolate(exT, [0.3, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <rect key={p.id} x={px - p.sz / 2} y={py - p.sz / 2}
              width={p.sz} height={p.sz * 0.65} rx={2} fill="#ff3333"
              opacity={fad * 0.9} filter="url(#s7glow)"
              transform={`rotate(${exT * p.id * 20}, ${px}, ${py})`} />
          );
        })}
        {/* Big X */}
        <g opacity={interpolate(frame, [EXPLODE + 4, EXPLODE + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} transform="translate(540,960)">
          <line x1={-60} y1={-60} x2={60} y2={60} stroke="#ff3333" strokeWidth={16} strokeLinecap="round" filter="url(#s7glow)" />
          <line x1={60} y1={-60} x2={-60} y2={60} stroke="#ff3333" strokeWidth={16} strokeLinecap="round" filter="url(#s7glow)" />
        </g>
      </svg>

      {/* CONNECTION DROPPED */}
      <div style={{ position: "absolute", top: 450, left: 40, right: 40, textAlign: "center", opacity: textOp, transform: `scale(${textSc})`, transformOrigin: "center" }}>
        <div style={{ color: "#ff3333", fontSize: 80, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, lineHeight: 1.05, textShadow: "0 0 40px #ff3333, 0 0 80px rgba(255,51,51,0.4)" }}>
          CONNECTION
        </div>
        <div style={{ color: "#ff3333", fontSize: 80, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, lineHeight: 1.05, textShadow: "0 0 40px #ff3333, 0 0 80px rgba(255,51,51,0.4)" }}>
          DROPPED
        </div>
      </div>

      {/* Sub label */}
      <div style={{ position: "absolute", bottom: 280, left: 50, right: 50, textAlign: "center", opacity: subOp }}>
        <div style={{ color: "rgba(255,80,80,0.65)", fontSize: 24, fontFamily: "monospace", letterSpacing: 2 }}>
          ERR_REQUEST_BLOCKED
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 24, fontFamily: "'Montserrat',sans-serif", marginTop: 8, fontStyle: "italic" }}>
          Thrown in the trash.
        </div>
      </div>
    </AbsoluteFill>
  );
};

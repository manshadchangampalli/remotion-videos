/**
 * Scene 02 – The Block  (frames 130–195, 2.17 s)
 * Audio: "It's blocked by the government."  →  starts at local f6 (global 136)
 *
 * SHORT scene — fast slam, maximum impact.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";

export const Scene02Block: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fades in
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Padlock slams DOWN hard
  const slamSpring = spring({ frame: frame - 2, fps, config: { damping: 5, stiffness: 300 } });
  const lockY      = interpolate(slamSpring, [0, 1], [-700, 0]);
  const lockScale  = interpolate(slamSpring, [0, 0.75, 1], [1.3, 0.88, 1]);

  // Impact shake at ~frame 8
  const IMPACT = 8;
  const shakeX = frame >= IMPACT && frame <= IMPACT + 18
    ? Math.sin(frame * 5.8) * interpolate(frame, [IMPACT, IMPACT + 18], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const shakeY = frame >= IMPACT && frame <= IMPACT + 18
    ? Math.cos(frame * 4.1) * interpolate(frame, [IMPACT, IMPACT + 18], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Red flash on impact
  const flashOp = interpolate(frame, [IMPACT, IMPACT + 10], [0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "BLOCKED" text
  const textSpring = spring({ frame: frame - 22, fps, config: { damping: 9, stiffness: 200 } });
  const textOp     = interpolate(frame, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textScale  = interpolate(textSpring, [0, 1], [0.6, 1]);

  // Padlock glow pulse
  const glow = 14 + Math.sin(frame / 6) * 6;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn, transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <CyberGrid opacity={0.3} color="#2a0000" />

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100%",
        width: "100%",
        gap: 100
      }}>
        {/* "BLOCKED BY THE GOVERNMENT" */}
        <div style={{ textAlign: "center", opacity: textOp, transform: `scale(${textScale})`, transformOrigin: "center" }}>
          <div style={{ color: "#ff3333", fontSize: 90, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: 2, lineHeight: 1, textShadow: "0 0 40px #ff3333, 0 0 80px rgba(255,51,51,0.4)" }}>
            BLOCKED
          </div>
          <div style={{ color: "rgba(255,100,100,0.75)", fontSize: 32, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, marginTop: 10, letterSpacing: 3 }}>
            BY THE GOVERNMENT
          </div>
        </div>

        {/* PADLOCK SVG */}
        <div style={{ display: "flex", justifyContent: "center", transform: `translateY(${lockY}px) scale(${lockScale})`, transformOrigin: "center" }}>
          <svg width={260} height={300} viewBox="0 0 260 300" overflow="visible">
            <defs>
              <filter id="s2lock" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={glow * 0.7} result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Shackle */}
            <path d="M 70 130 L 70 75 Q 70 18 130 18 Q 190 18 190 75 L 190 130" fill="none" stroke="#ff3333" strokeWidth={24} strokeLinecap="round" filter="url(#s2lock)" />
            {/* Body */}
            <rect x={12} y={122} width={236} height={162} rx={18} fill="#1a0000" stroke="#ff3333" strokeWidth={4} filter="url(#s2lock)" />
            {/* Keyhole */}
            <circle cx={130} cy={188} r={26} fill="#ff3333" opacity={0.95} />
            <rect x={116} y={198} width={28} height={44} rx={6} fill="#ff3333" opacity={0.95} />
          </svg>
        </div>
      </div>

      {/* Red flash */}
      {flashOp > 0.02 && <div style={{ position: "absolute", inset: 0, background: "#ff3333", opacity: flashOp * 0.4, pointerEvents: "none" }} />}

      {/* Red ambient */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center 55%, rgba(255,51,51,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/**
 * Scene 05 – The Gatekeeper  (frames 540–630, 3.0 s)
 * Audio: "Normally, your internet provider acts like a border guard."  →  local f2
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";

export const Scene05Gatekeeper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wall slams in from bottom
  const wallSpring = spring({ frame: frame - 3, fps, config: { damping: 10, stiffness: 100 } });
  const wallH    = interpolate(wallSpring, [0, 1], [0, 640]);
  const wallOp   = interpolate(frame, [3, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wallGlow = 12 + Math.sin(frame / 8) * 5;
  const wallVib  = Math.sin(frame * 3.5) * 0.4;

  // Labels
  const labelOp = interpolate(frame, [22, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "BORDER GUARD" text
  const textSpring = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 130 } });
  const textOp   = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY    = interpolate(textSpring, [0, 1], [-25, 0]);

  // Scanner sweep
  const scanY = 960 + Math.sin(frame / 10) * 240;
  const scanOp = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * 0.55;

  // ── ISP LOGOS "BOOM" EFFECT ──────────────────────────────────────────────
  // Triggered when text mentions "internet provider"
  const boomStart = 25;
  
  const jioSpring = spring({ frame: frame - boomStart, fps, config: { damping: 12, stiffness: 200 } });
  const airtelSpring = spring({ frame: frame - (boomStart + 5), fps, config: { damping: 12, stiffness: 200 } });
  const viSpring = spring({ frame: frame - (boomStart + 10), fps, config: { damping: 12, stiffness: 200 } });

  const logos = [
    { src: "vpn/jio.png", spring: jioSpring, x: 200, y: 700, rot: -15, size: 180 },
    { src: "vpn/airtel.png", spring: airtelSpring, x: 880, y: 1200, rot: 12, size: 190 },
    { src: "vpn/vi.png", spring: viSpring, x: 850, y: 650, rot: -8, size: 165 },
  ];

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.35} color="#2a0000" />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,51,51,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s5wall" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation={wallGlow * 0.6} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="s5scan" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Wall — simple solid barrier */}
        <rect x={460 + wallVib} y={960 - wallH / 2} width={160} height={wallH}
          fill="#180000" stroke="#ff3333" strokeWidth={4}
          filter="url(#s5wall)" opacity={wallOp} />
        {/* Ribs */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={460} y1={960 - wallH / 2 + wallH * f} x2={620} y2={960 - wallH / 2 + wallH * f}
            stroke="#ff3333" strokeWidth={2} opacity={wallOp * 0.5} />
        ))}
        {/* Scanner line */}
        <line x1={420} y1={scanY} x2={660} y2={scanY} stroke="#ff3333" strokeWidth={3}
          opacity={scanOp} filter="url(#s5scan)" />

        {/* "ISP FIREWALL" badge on wall */}
        <text x={540} y={620} textAnchor="middle" fill="#ff3333" fontSize={24}
          fontFamily="Montserrat,sans-serif" fontWeight={800} opacity={labelOp}
          style={{ textShadow: "0 0 15px #ff3333" }}>
          ISP FIREWALL
        </text>
        <text x={540} y={1330} textAnchor="middle" fill="#ff3333" fontSize={22}
          fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={labelOp * 0.7}>
          EVERY REQUEST CHECKED
        </text>
      </svg>

      {/* ISP Logos Boom */}
      {logos.map((logo, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: logo.y,
            left: logo.x,
            transform: `translate(-50%, -50%) scale(${logo.spring}) rotate(${logo.rot * logo.spring}deg)`,
            opacity: interpolate(logo.spring, [0, 0.1, 1], [0, 1, 1]),
            filter: `drop-shadow(0 0 ${20 * logo.spring}px rgba(255,51,51,0.45))`,
          }}
        >
          <Img src={staticFile(logo.src)} style={{ width: logo.size, height: logo.size }} />
        </div>
      ))}

      {/* Header text */}
      <div style={{ position: "absolute", top: 280, left: 50, right: 50, textAlign: "center", opacity: textOp, transform: `translateY(${textY}px)` }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 28, fontFamily: "'Montserrat',sans-serif", letterSpacing: 4 }}>your internet provider is</div>
        <div style={{ color: "#ff3333", fontSize: 80, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, lineHeight: 1.05, textShadow: "0 0 30px #ff3333" }}>A BORDER</div>
        <div style={{ color: "#ff3333", fontSize: 80, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, lineHeight: 1.05, textShadow: "0 0 30px #ff3333" }}>GUARD</div>
      </div>
    </AbsoluteFill>
  );
};

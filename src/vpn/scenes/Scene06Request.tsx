/**
 * Scene 06 – The Request  (frames 630–728, 3.27 s)
 * Audio: "When your phone asks for TikTok, the guard checks the ban list,"  →  local f1
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Phone } from "../components/Phone";

const PH_CX = 200;   // phone center x
const WL_X  = 540;   // wall center x
const Y     = 960;
const LEN   = WL_X - 70 - PH_CX;   // ~270

export const Scene06Request: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const elemOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Red laser draws from phone to wall (f14 → f42)
  const laserOff = interpolate(frame, [14, 42], [LEN, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const laserOp  = interpolate(frame, [14, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Data packet travels (f30 → f65)
  const packetT = interpolate(frame, [30, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packetX = PH_CX + 80 + packetT * LEN;
  const packetOp = interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wall scans (f60 → )
  const scanY  = Y + Math.sin((frame - 55) / 8) * 200;
  const scanOp = interpolate(frame, [60, 75, 95], [0, 0.6, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wall glow pulse
  const wg = 12 + Math.sin(frame / 8) * 5;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.35} color="#2a0000" />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,51,51,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s6glow" x="-30%" y="-200%" width="160%" height="500%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Wall */}
        <rect x={470} y={640} width={140} height={640} fill="#180000" stroke="#ff3333" strokeWidth={4}
          opacity={elemOp} style={{ filter: `drop-shadow(0 0 ${wg}px #ff3333)` }} />
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={470} y1={640 + 640 * f} x2={610} y2={640 + 640 * f}
            stroke="#ff3333" strokeWidth={2} opacity={elemOp * 0.45} />
        ))}

        {/* Red laser */}
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y}
          stroke="#ff3333" strokeWidth={5} strokeLinecap="round"
          strokeDasharray={`${LEN}`} strokeDashoffset={laserOff}
          opacity={laserOp} filter="url(#s6glow)" />
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y}
          stroke="#ff3333" strokeWidth={18}
          strokeDasharray={`${LEN}`} strokeDashoffset={laserOff}
          opacity={laserOp * 0.15} />

        {/* Packet label */}
        {packetOp > 0.05 && (
          <g opacity={packetOp}>
            <rect x={packetX - 72} y={Y - 32} width={144} height={64} rx={9}
              fill="#1a0000" stroke="#ff3333" strokeWidth={2.5} filter="url(#s6glow)" />
            <text x={packetX} y={Y - 10} textAnchor="middle" fill="rgba(255,100,100,0.7)"
              fontSize={14} fontFamily="monospace" fontWeight={700}>TARGET:</text>
            <text x={packetX} y={Y + 16} textAnchor="middle" fill="#ff3333"
              fontSize={18} fontFamily="monospace" fontWeight={900}>TIKTOK</text>
          </g>
        )}

        {/* Scanner sweep */}
        <line x1={430} y1={scanY} x2={650} y2={scanY}
          stroke="#ff3333" strokeWidth={3} opacity={scanOp} filter="url(#s6glow)" />

        {/* Labels */}
        <text x={PH_CX} y={1110} textAnchor="middle" fill="rgba(255,255,255,0.5)"
          fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={600} opacity={elemOp}>YOUR PHONE</text>
        <text x={540} y={605} textAnchor="middle" fill="#ff3333"
          fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={elemOp}>ISP FIREWALL</text>
      </svg>

      {/* Phone image */}
      <div style={{ position: "absolute", top: Y - 160, left: PH_CX - 100, opacity: elemOp }}>
        <Phone width={200} height={360} glowColor="rgba(255,51,51,0.35)" />
      </div>

      {/* Header */}
      <div style={{ position: "absolute", top: 320, left: 50, right: 50, textAlign: "center", opacity: elemOp }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 26, fontFamily: "'Montserrat',sans-serif", letterSpacing: 4 }}>Without VPN</div>
        <div style={{ color: "#ff3333", fontSize: 68, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 25px #ff3333" }}>REQUEST SENT</div>
      </div>

      {/* Bottom — guard checking */}
      <div style={{ position: "absolute", bottom: 320, left: 50, right: 50, textAlign: "center", opacity: scanOp / 0.6 }}>
        <div style={{ color: "#ff3333", fontSize: 32, fontFamily: "'Montserrat',sans-serif", fontWeight: 800, letterSpacing: 3, textShadow: "0 0 15px #ff3333" }}>SCANNING BAN LIST…</div>
      </div>
    </AbsoluteFill>
  );
};

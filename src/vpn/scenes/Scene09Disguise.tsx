/**
 * Scene 09 – The Disguise  (frames 1011–1160, 4.97 s)
 * Beat A — local f0–70    "Instead, it just asks the guard,"
 * Beat B — local f70–149  "connect me to this random server in Singapore."
 *   (Beat B = global 1080 = local 1080-1011 = 69 ≈ f69)
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Phone } from "../components/Phone";

const PH_CX = 200;
const WL_X  = 540;
const Y     = 960;
const LEN   = WL_X - 70 - PH_CX;

export const Scene09Disguise: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const elemOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cyan laser draws (f14 → f44)
  const laserOff = interpolate(frame, [14, 44], [LEN, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const laserOp  = interpolate(frame, [14, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat A text: "Instead, it just asks the guard" (f0)
  const beatA_Op = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Packet label "TARGET: SINGAPORE" travels (f42 → f82)
  const BEAT_B = 69;
  const packetT = interpolate(frame, [BEAT_B - 4, BEAT_B + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packetX = PH_CX + 80 + packetT * LEN;
  const packetOp = interpolate(frame, [BEAT_B - 4, BEAT_B + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat B text: "random server in Singapore" (f69)
  const beatB_Op = interpolate(frame, [BEAT_B, BEAT_B + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Hide beat A
  const beatA_Fade = interpolate(frame, [BEAT_B - 8, BEAT_B + 12], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wall looks confused ("???")
  const wallScan = 0.5 + Math.sin(frame / 7) * 0.35;
  const confusedOp = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const wg = 10 + Math.sin(frame / 9) * 4;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.4} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 22% 55%, rgba(0,242,255,0.09) 0%, transparent 55%)", pointerEvents: "none" }} />

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s9glow" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Wall */}
        <rect x={470} y={640} width={140} height={640} fill="#180000" stroke="#ff3333" strokeWidth={4}
          opacity={elemOp * 0.75} style={{ filter: `drop-shadow(0 0 ${wg}px #ff3333)` }} />
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={470} y1={640 + 640 * f} x2={610} y2={640 + 640 * f}
            stroke="#ff3333" strokeWidth={2} opacity={elemOp * 0.4} />
        ))}

        {/* Cyan laser */}
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y}
          stroke="#00f2ff" strokeWidth={6} strokeLinecap="round"
          strokeDasharray={`${LEN}`} strokeDashoffset={laserOff}
          opacity={laserOp} filter="url(#s9glow)" />
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y}
          stroke="#00f2ff" strokeWidth={22}
          strokeDasharray={`${LEN}`} strokeDashoffset={laserOff}
          opacity={laserOp * 0.14} />

        {/* SINGAPORE packet */}
        {packetOp > 0.05 && (
          <g opacity={packetOp}>
            {/* Shield ring */}
            <circle cx={packetX} cy={Y} r={42} fill="none" stroke="#00f2ff" strokeWidth={2.5}
              opacity={0.6 + Math.sin(frame / 5) * 0.2} filter="url(#s9glow)" />
            <rect x={packetX - 78} y={Y - 32} width={156} height={64} rx={10}
              fill="#001520" stroke="#00f2ff" strokeWidth={2.5} filter="url(#s9glow)" />
            <text x={packetX} y={Y - 8} textAnchor="middle" fill="rgba(0,242,255,0.6)"
              fontSize={13} fontFamily="monospace" fontWeight={700}>TARGET:</text>
            <text x={packetX} y={Y + 16} textAnchor="middle" fill="#00f2ff"
              fontSize={18} fontFamily="monospace" fontWeight={900}>SINGAPORE</text>
          </g>
        )}

        {/* Wall "???" when confused */}
        {confusedOp > 0.05 && (
          <g opacity={confusedOp}>
            <rect x={480} y={905} width={120} height={55} rx={8} fill="#1a0000" stroke="#ff3333" strokeWidth={2} />
            <text x={540} y={940} textAnchor="middle" fill="#ff6666"
              fontSize={26} fontFamily="monospace" fontWeight={900} opacity={wallScan}>???</text>
          </g>
        )}

        {/* Labels */}
        <text x={PH_CX} y={1110} textAnchor="middle" fill="rgba(255,255,255,0.5)"
          fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={600} opacity={elemOp}>YOUR PHONE</text>
        <text x={540} y={608} textAnchor="middle" fill="#ff3333"
          fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={elemOp * 0.8}>ISP FIREWALL</text>
      </svg>

      {/* Phone */}
      <div style={{ position: "absolute", top: Y - 180, left: PH_CX - 100, opacity: elemOp }}>
        <Phone width={200} height={360} glowColor="rgba(0,242,255,0.5)" />
      </div>

      {/* Beat A header */}
      <div style={{ position: "absolute", top: 280, left: 50, right: 50, textAlign: "center", opacity: beatA_Op * beatA_Fade }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 26, fontFamily: "'Montserrat',sans-serif", letterSpacing: 4 }}>With VPN — the disguise</div>
        <div style={{ color: "#00f2ff", fontSize: 68, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 25px #00f2ff" }}>INSTEAD</div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 30, fontFamily: "'Montserrat',sans-serif", marginTop: 8 }}>it just asks the guard…</div>
      </div>

      {/* Beat B text */}
      {beatB_Op > 0.05 && (
        <div style={{ position: "absolute", bottom: 268, left: 50, right: 50, textAlign: "center", opacity: beatB_Op }}>
          <div style={{ color: "#00f2ff", fontSize: 38, fontFamily: "'Montserrat',sans-serif", fontWeight: 800, textShadow: "0 0 18px #00f2ff", lineHeight: 1.3 }}>
            "Connect me to this
          </div>
          <div style={{ color: "#00f2ff", fontSize: 38, fontFamily: "'Montserrat',sans-serif", fontWeight: 800, textShadow: "0 0 18px #00f2ff", lineHeight: 1.3 }}>
            random server in Singapore."
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

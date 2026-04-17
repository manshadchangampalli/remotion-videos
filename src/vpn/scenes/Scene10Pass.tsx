/**
 * Scene 10 – The Pass  (frames 1160–1301, 4.7 s)
 * Beat A — local f0–69    "Singapore is not on the ban list,"
 * Beat B — local f70–141  "so the guard lets you right through."
 *   (Beat B = global 1229 = local 1229-1160 = 69)
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { ClickRipple } from "../components/ClickRipple";
import { Phone } from "../components/Phone";

const PH_CX = 200;
const WL_X  = 540;
const SV_CX = 880;
const Y     = 960;
const LEN_R = SV_CX - 80 - (WL_X + 70);

export const Scene10Pass: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const elemOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wall transitions red → green over Beat A (f0 → f60)
  const wallTransition = interpolate(frame, [10, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wR = Math.round(255 * (1 - wallTransition));
  const wG = Math.round(255 * wallTransition);
  const wB = Math.round(51 * (1 - wallTransition) + 204 * wallTransition);
  const wallColor = `rgb(${wR},${wG},${wB})`;
  const wallFill  = wallTransition > 0.5 ? "#001a0a" : "#180000";
  const wg = 12 + Math.sin(frame / 8) * 5;

  const FLASH_FRAME = 50;
  const bigFlash = interpolate(frame, [FLASH_FRAME, FLASH_FRAME + 10], [0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat B: laser pierces through (f70 → )
  const BEAT_B = 69;
  const pierceOff = interpolate(frame, [BEAT_B, BEAT_B + 40], [LEN_R, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pierceOp  = interpolate(frame, [BEAT_B, BEAT_B + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Server appears
  const serverOp = interpolate(frame, [BEAT_B + 5, BEAT_B + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // APPROVED badge
  const approvedSpring = spring({ frame: frame - BEAT_B - 8, fps, config: { damping: 8, stiffness: 200 } });
  const approvedOp = interpolate(frame, [BEAT_B + 8, BEAT_B + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const approvedSc = interpolate(approvedSpring, [0, 1], [0.5, 1]);

  // Left laser (already drawn from prev scene)
  const leftLaserOp = interpolate(frame, [5, 18], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.4} color={wallTransition > 0.5 ? "#0a1a0a" : "#1a0a0a"} />

      {bigFlash > 0.02 && <div style={{ position: "absolute", inset: 0, background: "#00ffcc", opacity: bigFlash * 0.35, pointerEvents: "none" }} />}

      {/* Ripple burst at wall-turns-green moment */}
      <ClickRipple frame={frame} triggerFrame={50} x={540} y={960} color="#00ffcc" maxRadius={200} />
      {/* Ripple at APPROVED badge */}
      <ClickRipple frame={frame} triggerFrame={77} x={540} y={535} color="#00ffcc" maxRadius={120} />

      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, rgba(${wR},${wG},${wB},0.1) 0%, transparent 60%)`, pointerEvents: "none" }} />

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s10glow" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Wall — color transitions */}
        <rect x={470} y={640} width={140} height={640} fill={wallFill} stroke={wallColor} strokeWidth={4}
          opacity={elemOp * 0.85} style={{ filter: `drop-shadow(0 0 ${wg}px ${wallColor})` }} />
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={470} y1={640 + 640 * f} x2={610} y2={640 + 640 * f}
            stroke={wallColor} strokeWidth={2} opacity={elemOp * 0.4} />
        ))}

        {/* Left laser (already present) */}
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y}
          stroke="#00f2ff" strokeWidth={5} opacity={leftLaserOp} filter="url(#s10glow)" />
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y}
          stroke="#00f2ff" strokeWidth={18} opacity={leftLaserOp * 0.12} />

        {/* Piercing laser: wall → server */}
        <line x1={WL_X + 70} y1={Y} x2={SV_CX - 80} y2={Y}
          stroke="#00f2ff" strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${LEN_R}`} strokeDashoffset={pierceOff}
          opacity={pierceOp} filter="url(#s10glow)" />
        <line x1={WL_X + 70} y1={Y} x2={SV_CX - 80} y2={Y}
          stroke="#00f2ff" strokeWidth={26}
          strokeDasharray={`${LEN_R}`} strokeDashoffset={pierceOff}
          opacity={pierceOp * 0.13} />

        {/* APPROVED on wall */}
        {approvedOp > 0.05 && (
          <g opacity={approvedOp} transform={`translate(540, 535) scale(${approvedSc})`}>
            <rect x={-80} y={-28} width={160} height={56} rx={10} fill="#001a0a" stroke="#00ffcc" strokeWidth={2.5} />
            <text x={0} y={8} textAnchor="middle" fill="#00ffcc"
              fontSize={24} fontFamily="Montserrat,sans-serif" fontWeight={900} letterSpacing={2}>✓ APPROVED</text>
          </g>
        )}

        {/* Labels */}
        <text x={PH_CX} y={1110} textAnchor="middle" fill="rgba(255,255,255,0.5)"
          fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={600} opacity={elemOp}>YOUR PHONE</text>
        <text x={540} y={608} textAnchor="middle" fill={wallColor}
          fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={elemOp * 0.9}>ISP FIREWALL</text>
        <text x={SV_CX} y={1110} textAnchor="middle" fill="#00f2ff"
          fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={serverOp}>VPN SERVER</text>
      </svg>

      {/* Phone */}
      <div style={{ position: "absolute", top: Y - 180, left: PH_CX - 100 }}>
        <Phone width={200} height={360} glowColor="rgba(0,242,255,0.4)" />
      </div>

      {/* Server */}
      <div style={{ position: "absolute", top: Y - 120, left: SV_CX - 120, opacity: serverOp }}>
        <Img src={staticFile("vpn/server.png")} style={{ width: 240, height: 240, filter: "drop-shadow(0 0 18px rgba(0,242,255,0.6))" }} />
      </div>

      {/* Top text */}
      <div style={{ position: "absolute", top: 280, left: 50, right: 50, textAlign: "center" }}>
        {/* Beat A */}
        <div style={{ opacity: interpolate(frame, [5, 18, BEAT_B - 5, BEAT_B + 12], [0, 1, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 26, fontFamily: "'Montserrat',sans-serif", letterSpacing: 4 }}>Singapore is</div>
          <div style={{ color: "#00ffcc", fontSize: 72, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 30px #00ffcc" }}>NOT BANNED</div>
        </div>
        {/* Beat B */}
        {pierceOp > 0.1 && (
          <div style={{ opacity: pierceOp, marginTop: 10 }}>
            <div style={{ color: "#00ffcc", fontSize: 68, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 30px #00ffcc" }}>LET THROUGH!</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

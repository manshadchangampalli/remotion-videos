/**
 * Scene 11 – The Fetch  (frames 1301–1449, 4.93 s)
 * Beat A — local f0–67    "Once your connection reaches Singapore,"
 * Beat B — local f68–148  "that VPN server does the work for you."
 *   (Beat B = global 1368 = local 1368-1301 = 67)
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";

const SV_CX = 780;   // server center on right
const Y     = 960;

export const Scene11Fetch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Laser travels from left across screen to server (f0 → f45)
  const LASER_LEN = SV_CX + 80;
  const laserOff  = interpolate(frame, [0, 45], [LASER_LEN, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const laserOp   = interpolate(frame, [0, 15, 60, 80], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Server spring-in (f28)
  const serverSpring = spring({ frame: frame - 28, fps, config: { damping: 11, stiffness: 110 } });
  const serverOp  = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const serverSc  = interpolate(serverSpring, [0, 1], [0.4, 1]);

  // Pulse rings emanate from server
  const pr1 = interpolate(frame, [40, 90], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const po1 = interpolate(frame, [40, 90], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pr2 = interpolate(frame, [55, 105], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const po2 = interpolate(frame, [55, 105], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pr3 = interpolate(frame, [70, 120], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const po3 = interpolate(frame, [70, 120], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat A text
  const beatAOp = interpolate(frame, [5, 20, 62, 78], [0, 1, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat B: server activates, does the work (f68)
  const BEAT_B = 67;
  const beatBOp  = interpolate(frame, [BEAT_B, BEAT_B + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const activateProgress = interpolate(frame, [BEAT_B, BEAT_B + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Server glow pulses
  const sg = 15 + activateProgress * 20 + Math.sin(frame / 7) * 8;

  // Processing dots
  const procDot = (frame - 80) % 24;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.4} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 78% 55%, rgba(0,242,255,${0.06 + activateProgress * 0.1}) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s11glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="s11laser" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Incoming laser */}
        <line x1={-20} y1={Y} x2={SV_CX} y2={Y}
          stroke="#00f2ff" strokeWidth={6}
          strokeDasharray={`${LASER_LEN}`} strokeDashoffset={laserOff}
          opacity={laserOp} filter="url(#s11laser)" />
        <line x1={-20} y1={Y} x2={SV_CX} y2={Y}
          stroke="#00f2ff" strokeWidth={22}
          strokeDasharray={`${LASER_LEN}`} strokeDashoffset={laserOff}
          opacity={laserOp * 0.12} />

        {/* Pulse rings */}
        <circle cx={SV_CX} cy={Y} r={pr1} fill="none" stroke="#00f2ff" strokeWidth={2.5} opacity={po1} filter="url(#s11glow)" />
        <circle cx={SV_CX} cy={Y} r={pr2} fill="none" stroke="#00f2ff" strokeWidth={2.5} opacity={po2} filter="url(#s11glow)" />
        <circle cx={SV_CX} cy={Y} r={pr3} fill="none" stroke="#00f2ff" strokeWidth={2.5} opacity={po3} filter="url(#s11glow)" />

        {/* Server lights (rack indicators) */}
        {serverOp > 0.3 &&
          Array.from({ length: 7 }, (_, i) => {
            const on = activateProgress > i / 7;
            const col = i % 3 === 0 ? "#00f2ff" : i % 3 === 1 ? "#00ffcc" : "#fff";
            return (
              <rect key={i} x={SV_CX + 78} y={Y - 60 + i * 22} width={14} height={12} rx={3}
                fill={col} opacity={on ? 0.9 + Math.sin(frame / 4 + i) * 0.1 : 0.1} />
            );
          })}

        {/* Server label */}
        <text x={SV_CX} y={1115} textAnchor="middle" fill="#00f2ff"
          fontSize={24} fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={serverOp}>
          VPN SERVER
        </text>
        <text x={SV_CX} y={1145} textAnchor="middle" fill="rgba(0,242,255,0.5)"
          fontSize={20} fontFamily="Montserrat,sans-serif" fontWeight={500} opacity={serverOp}>
          Singapore
        </text>
      </svg>

      {/* Server image */}
      <div style={{ position: "absolute", top: Y - 120, left: SV_CX - 120, opacity: serverOp, transform: `scale(${serverSc})`, transformOrigin: "center" }}>
        <Img src={staticFile("vpn/server.png")} style={{ width: 240, height: 240, filter: `drop-shadow(0 0 ${sg}px rgba(0,242,255,${0.5 + activateProgress * 0.4}))` }} />
      </div>

      {/* Beat A text */}
      <div style={{ position: "absolute", top: 280, left: 50, right: 50, textAlign: "center", opacity: beatAOp }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 26, fontFamily: "'Montserrat',sans-serif", letterSpacing: 4 }}>connection reaches</div>
        <div style={{ color: "#00f2ff", fontSize: 78, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 30px #00f2ff" }}>SINGAPORE</div>
      </div>

      {/* Beat B: server does the work */}
      {beatBOp > 0.05 && (
        <>
          <div style={{ position: "absolute", top: 280, left: 50, right: 50, textAlign: "center", opacity: beatBOp }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 26, fontFamily: "'Montserrat',sans-serif", letterSpacing: 4 }}>VPN server</div>
            <div style={{ color: "#00f2ff", fontSize: 72, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 30px #00f2ff" }}>DOES THE</div>
            <div style={{ color: "#00f2ff", fontSize: 72, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 30px #00f2ff" }}>WORK</div>
          </div>

          {/* Processing status */}
          <div style={{ position: "absolute", bottom: 280, left: SV_CX - 120, opacity: beatBOp }}>
            <div style={{ background: "rgba(0,10,20,0.92)", border: "1.5px solid #00f2ff", borderRadius: 12, padding: "14px 26px" }}>
              <div style={{ color: "#00f2ff", fontSize: 20, fontFamily: "monospace", fontWeight: 700, marginBottom: 10 }}>PROCESSING…</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[0, 8, 16].map((off, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: "#00f2ff", opacity: procDot > off && procDot < off + 12 ? 1 : 0.2 }} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/**
 * Scene 08 – VPN Shift  (frames 823–1011, 6.27 s)
 * Beat A — local f0–103   "But when you turn on a VPN and connect to Singapore,"
 * Beat B — local f103–188 "your phone completely stops asking for TikTok."
 *   (Beat B starts at global f924 = local 924-823 = 101 ≈ f101)
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { ClickRipple } from "../components/ClickRipple";
import { Phone } from "../components/Phone";

const PH_CX = 200;
const WL_X  = 540;
const Y     = 960;
const LEN_L = WL_X - 70 - PH_CX;

export const Scene08VPNShift: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat A: VPN connecting (f0–103) ──────────────────────────────────────
  const toggleSpring = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 110 } });
  const thumbX = interpolate(toggleSpring, [0, 1], [8, 94]);
  const trackOn = toggleSpring > 0.5;

  // "CONNECTING" UI card (f18)
  const cardSpring = spring({ frame: frame - 18, fps, config: { damping: 12, stiffness: 120 } });
  const cardOp  = interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardSc  = interpolate(cardSpring, [0, 1], [0.75, 1]);

  // Loading dot animation
  const dotF = (frame - 30) % 24;

  // Old red line (f5 → fades at f60)
  const redOp = interpolate(frame, [5, 20, 55, 72], [0, 0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat B: "Stops asking for TikTok" (f101 → f188) ─────────────────────
  const BEAT_B = 101;
  const beatBOp  = interpolate(frame, [BEAT_B, BEAT_B + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cyan line forms (f85 → f130)
  const cyanOff  = interpolate(frame, [85, 130], [LEN_L, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cyanOp   = interpolate(frame, [85, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Big "NOT ASKING FOR TIKTOK" text
  const notaskSpring = spring({ frame: frame - BEAT_B, fps, config: { damping: 9, stiffness: 160 } });
  const notaskSc = interpolate(notaskSpring, [0, 1], [0.6, 1]);
  const notaskY  = interpolate(notaskSpring, [0, 1], [30, 0]);

  const elemOp  = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cyanGlow = interpolate(frame, [70, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.4} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 22% 55%, rgba(0,242,255,${cyanGlow * 0.1}) 0%, transparent 55%)`, pointerEvents: "none" }} />

      {/* Toggle click ripple at f5 */}
      <ClickRipple frame={frame} triggerFrame={5} x={540} y={430} color="#00f2ff" maxRadius={110} />

      {/* ── VPN Toggle ── */}
      <div style={{ position: "absolute", top: 310, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 24, fontFamily: "'Montserrat',sans-serif", letterSpacing: 6 }}>VPN</div>
        <div style={{ width: 160, height: 80, borderRadius: 40, background: trackOn ? "#001520" : "#1a1a1a", border: `3px solid ${trackOn ? "#00f2ff" : "#444"}`, position: "relative", boxShadow: trackOn ? `0 0 ${18 + Math.sin(frame / 8) * 5}px rgba(0,242,255,0.5)` : "none" }}>
          <div style={{ position: "absolute", top: 8, left: thumbX, width: 58, height: 58, borderRadius: "50%", background: trackOn ? "radial-gradient(circle, #aafeff, #00f2ff)" : "#555", boxShadow: trackOn ? "0 0 18px #00f2ff" : "none" }} />
        </div>
      </div>

      {/* "CONNECTING" card — positioned at bottom so it doesn't overlap the wall */}
      <div style={{ position: "absolute", bottom: 260, left: 80, right: 80, opacity: cardOp, transform: `scale(${cardSc})`, transformOrigin: "center bottom" }}>
        <div style={{ background: "rgba(0,10,18,0.94)", border: "2px solid #00f2ff", borderRadius: 18, padding: "28px 36px", boxShadow: "0 0 28px rgba(0,242,255,0.28)" }}>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 20, fontFamily: "monospace", letterSpacing: 3, marginBottom: 10 }}>VPN STATUS</div>
          <div style={{ color: "#00f2ff", fontSize: 42, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 20px #00f2ff", marginBottom: 8 }}>CONNECTING…</div>
          <div style={{ color: "#fff", fontSize: 30, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, marginBottom: 18 }}>📍 Singapore</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[0, 8, 16].map((off, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: "#00f2ff", opacity: dotF > off && dotF < off + 14 ? 1 : 0.2 }} />
            ))}
          </div>
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s8glow" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="s8wall" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Wall */}
        <rect x={470} y={640} width={140} height={640} fill="#180000" stroke="#ff3333" strokeWidth={4} opacity={elemOp * 0.75} filter="url(#s8wall)" />
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={470} y1={640 + 640 * f} x2={610} y2={640 + 640 * f} stroke="#ff3333" strokeWidth={2} opacity={elemOp * 0.38} />
        ))}

        {/* Old red line fading out */}
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y} stroke="#ff3333" strokeWidth={5}
          strokeDasharray="12 8" opacity={redOp} filter="url(#s8glow)" />

        {/* New cyan line forming */}
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y} stroke="#00f2ff" strokeWidth={6}
          strokeDasharray={`${LEN_L}`} strokeDashoffset={cyanOff} opacity={cyanOp} filter="url(#s8glow)" />
        <line x1={PH_CX + 80} y1={Y} x2={WL_X - 70} y2={Y} stroke="#00f2ff" strokeWidth={22}
          strokeDasharray={`${LEN_L}`} strokeDashoffset={cyanOff} opacity={cyanOp * 0.14} />

        {/* Labels */}
        <text x={PH_CX} y={1110} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={600} opacity={elemOp}>YOUR PHONE</text>
        <text x={540} y={610} textAnchor="middle" fill="#ff3333" fontSize={22} fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={elemOp * 0.8}>ISP FIREWALL</text>
      </svg>

      {/* Phone */}
      <div style={{ position: "absolute", top: Y - 180, left: PH_CX - 100, opacity: elemOp }}>
        <Phone width={200} height={360} glowColor={`rgba(0,242,255,${0.3 + cyanGlow * 0.35})`} />
      </div>

      {/* Beat B: "Not asking for TikTok anymore" */}
      {beatBOp > 0.05 && (
        <div style={{ position: "absolute", bottom: 270, left: 50, right: 50, textAlign: "center", opacity: beatBOp, transform: `translateY(${notaskY}px) scale(${notaskSc})`, transformOrigin: "center" }}>
          <div style={{ color: "#00f2ff", fontSize: 42, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, textShadow: "0 0 20px #00f2ff", lineHeight: 1.2 }}>
            Phone stops asking
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 34, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, lineHeight: 1.2 }}>
            for TikTok.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

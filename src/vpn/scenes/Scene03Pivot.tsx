/**
 * Scene 03 – The Pivot  (frames 195–430, 7.83 s)
 * Beat A — local f0–144   "But you turn on a VPN and the video starts playing instantly."
 * Beat B — local f145–235 "How did you bypass a national firewall?"
 *   (sentence B starts global f340 = local 340-195 = 145)
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { ClickRipple } from "../components/ClickRipple";
import { Phone } from "../components/Phone";

// Padlock shatter particles (deterministic)
const PARTS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const s = 160 + (i % 4) * 50;
  return { vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, sz: 8 + (i % 4) * 5, id: i };
});

export const Scene03Pivot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat A: VPN toggle ON (f0 → f60) ─────────────────────────────────────
  const toggleSpring = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 110 } });
  const thumbX   = interpolate(toggleSpring, [0, 1], [8, 94]);
  const trackOn  = toggleSpring > 0.5;
  const vpnLabel = interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Padlock shatters at f22
  const SHATTER = 22;
  const shatterT = interpolate(frame, [SHATTER, SHATTER + 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lockOp   = interpolate(frame, [SHATTER, SHATTER + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shatterFlash = interpolate(frame, [SHATTER, SHATTER + 8], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phone with video playing (f45 → )
  const phoneSpring = spring({ frame: frame - 45, fps, config: { damping: 14, stiffness: 100 } });
  const phoneOp  = interpolate(frame, [45, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.5, 1]);
  const videoProgress = interpolate(frame, [60, 130], [0, 0.65], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat B: "HOW?" question (f145 → f235) ─────────────────────────────────
  const BEAT_B = 145;
  const howSpring = spring({ frame: frame - BEAT_B, fps, config: { damping: 7, stiffness: 220 } });
  const howOp    = interpolate(frame, [BEAT_B, BEAT_B + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const howY     = interpolate(howSpring, [0, 1], [-60, 0]);
  const howScale = interpolate(howSpring, [0, 1], [0.5, 1]);
  const howFlash = interpolate(frame, [BEAT_B, BEAT_B + 10], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Dim Beat A when Beat B fires
  const beatAOp  = interpolate(frame, [BEAT_B - 10, BEAT_B + 20], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.4} />

      {/* Toggle click ripple at f5 (toggle center: 540, 410) */}
      <ClickRipple frame={frame} triggerFrame={5} x={540} y={410} color="#00f2ff" maxRadius={100} />

      {/* Shatter flash */}
      {shatterFlash > 0.02 && <div style={{ position: "absolute", inset: 0, background: "#00f2ff", opacity: shatterFlash * 0.3, pointerEvents: "none" }} />}
      {howFlash > 0.02 && <div style={{ position: "absolute", inset: 0, background: "#ffffff", opacity: howFlash * 0.2, pointerEvents: "none" }} />}

      {/* Cyan ambient glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center 40%, rgba(0,242,255,0.07) 0%, transparent 60%)", opacity: toggleSpring, pointerEvents: "none" }} />

      {/* ── Beat A content ── */}
      <div style={{ opacity: beatAOp }}>
        {/* VPN Toggle */}
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 26, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, letterSpacing: 6 }}>VPN</div>
          {/* Track */}
          <div style={{
            width: 160, height: 80, borderRadius: 40,
            background: trackOn ? "#001520" : "#1a1a1a",
            border: `3px solid ${trackOn ? "#00f2ff" : "#444"}`,
            position: "relative",
            boxShadow: trackOn ? `0 0 ${20 + Math.sin(frame / 8) * 6}px rgba(0,242,255,0.5)` : "none",
          }}>
            <div style={{
              position: "absolute", top: 8, left: thumbX, width: 58, height: 58, borderRadius: "50%",
              background: trackOn ? "radial-gradient(circle, #aafeff, #00f2ff)" : "#666",
              boxShadow: trackOn ? "0 0 20px #00f2ff, 0 0 40px rgba(0,242,255,0.5)" : "0 2px 8px rgba(0,0,0,0.5)",
            }} />
          </div>
          <div style={{ color: "#00f2ff", fontSize: 36, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: 6, textShadow: "0 0 20px #00f2ff", opacity: vpnLabel }}>ON</div>
        </div>

        {/* Padlock (fades as it shatters) */}
        {lockOp > 0.05 && (
          <div style={{ position: "absolute", top: 800, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: lockOp }}>
            <svg width={90} height={100} viewBox="0 0 90 100">
              <path d="M 24 44 L 24 26 Q 24 7 45 7 Q 66 7 66 26 L 66 44" fill="none" stroke="#ff3333" strokeWidth={10} strokeLinecap="round" />
              <rect x={4} y={40} width={82} height={55} rx={8} fill="#1a0000" stroke="#ff3333" strokeWidth={3} />
            </svg>
          </div>
        )}

        {/* Shatter particles */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {PARTS.map((p) => {
            const t = shatterT;
            if (t < 0.02) return null;
            const px = 540 + p.vx * t;
            const py = 850 + p.vy * t + 280 * t * t;
            const fade = interpolate(t, [0.35, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <rect key={p.id} x={px - p.sz / 2} y={py - p.sz / 2} width={p.sz} height={p.sz * 0.7} rx={2}
                fill="#ff3333" opacity={fade * 0.85}
                transform={`rotate(${t * p.id * 22}, ${px}, ${py})`} />
            );
          })}
        </svg>

        {/* Phone with video playing */}
        <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: phoneOp, transform: `scale(${phoneScale})`, transformOrigin: "center top" }}>
          <Phone width={420} height={740} glowColor="rgba(0,255,204,0.6)">
            {/* Playing overlay - inside Phone children */}
            <div style={{ 
              width: "100%", 
              height: "100%", 
              background: "rgba(0,0,0,0.88)", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 12 
            }}>
              <svg width={80} height={80} viewBox="0 0 40 40"><polygon points="12,8 32,20 12,32" fill="#00ffcc" /></svg>
              <div style={{ width: "70%", height: 8, background: "#333", borderRadius: 4 }}>
                <div style={{ width: `${videoProgress * 100}%`, height: "100%", background: "#00ffcc", borderRadius: 4 }} />
              </div>
            </div>
          </Phone>
        </div>
      </div>

      {/* ── Beat B: HOW? ── */}
      {howOp > 0.02 && (
        <div style={{ position: "absolute", top: 430, left: 50, right: 50, textAlign: "center", opacity: howOp, transform: `translateY(${howY}px) scale(${howScale})`, transformOrigin: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 32, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, letterSpacing: 4 }}>
            But how?
          </div>
          <div style={{ color: "#ffffff", fontSize: 100, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, textShadow: "0 0 50px rgba(0,242,255,0.35)" }}>
            HOW DID YOU
          </div>
          <div style={{ color: "#00f2ff", fontSize: 100, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, textShadow: "0 0 50px #00f2ff" }}>
            BYPASS
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 42, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, marginTop: 8 }}>
            a national firewall?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

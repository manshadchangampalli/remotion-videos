/**
 * Scene 01 – The Problem  (frames 0–130, 4.33 s)
 * Audio: "You are in India. You open TikTok and nothing loads."  →  starts f0
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Phone } from "../components/Phone";

export const Scene01Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── fade in ──────────────────────────────────────────────────────────────
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── India map rises up (spring in) ───────────────────────────────────────
  const mapSpring = spring({ frame: frame - 5, fps, config: { damping: 15, stiffness: 80 } });
  const mapY   = interpolate(mapSpring, [0, 1], [60, 0]);
  const mapOp  = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── phone pops onto map ───────────────────────────────────────────────────
  const phoneSpring = spring({ frame: frame - 28, fps, config: { damping: 10, stiffness: 160 } });
  const phoneScale  = interpolate(phoneSpring, [0, 1], [0, 1]);

  // ── loading spinner ───────────────────────────────────────────────────────
  const spinAngle = frame * 10;
  const spinOp    = interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── "NOTHING LOADS" text ─────────────────────────────────────────────────
  const textOp = interpolate(frame, [60, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── map glow pulse ────────────────────────────────────────────────────────
  const mapGlow = 18 + Math.sin(frame / 14) * 7;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.4} />

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100%",
        width: "100%",
        gap: 140
      }}>
        {/* ── Top label ── */}
        <div style={{ textAlign: "center", opacity: mapOp }}>
          <div style={{ color: "#00f2ff", fontSize: 30, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, letterSpacing: 8 }}>
            YOU ARE IN
          </div>
          <div style={{ color: "#ffffff", fontSize: 100, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: -2, lineHeight: 1, textShadow: "0 0 40px rgba(0,242,255,0.4)" }}>
            INDIA
          </div>
        </div>

        {/* ── India map + phone ── */}
        <div style={{ display: "flex", justifyContent: "center", opacity: mapOp, transform: `translateY(${mapY}px)` }}>
          <div style={{ position: "relative" }}>
            <Img
              src={staticFile("vpn/indian-map.png")}
              style={{ width: 420, height: 420, filter: `drop-shadow(0 0 ${mapGlow}px #00f2ff) drop-shadow(0 0 ${mapGlow * 2}px rgba(0,242,255,0.2))` }}
            />
            {/* Phone icon on India */}
            <div style={{ position: "absolute", top: "28%", left: "42%", transform: `translate(-50%, -50%) scale(${phoneScale})`, transformOrigin: "center" }}>
              <Phone width={180} height={320} glowColor="rgba(0, 242, 255, 0.6)">
                {/* TikTok logo + loading overlay */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", position: "relative", background: "#000" }}>
                  {/* TikTok fades out as spinner appears */}
                  <Img src={staticFile("vpn/tik-tok.png")} style={{ width: 72, height: 72, opacity: 1 - spinOp * 0.85 }} />
                  {/* Dark overlay appears with spinner */}
                  <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${spinOp * 0.7})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {spinOp > 0.05 && (
                      <svg width={80} height={80} style={{ transform: `rotate(${spinAngle}deg)` }}>
                        <circle cx={40} cy={40} r={32} fill="none" stroke="#ff3333" strokeWidth={5} strokeDasharray="60 40" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </Phone>
            </div>
          </div>
        </div>

        {/* ── NOTHING LOADS ── */}
        <div style={{ textAlign: "center", opacity: textOp, minHeight: 60 }}>
          <div style={{ color: "#ff3333", fontSize: 52, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: 4, textShadow: "0 0 25px #ff3333, 0 0 50px rgba(255,51,51,0.35)" }}>
            NOTHING LOADS
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

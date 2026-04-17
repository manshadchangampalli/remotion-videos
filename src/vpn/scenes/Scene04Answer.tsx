/**
 * Scene 04 – The Answer  (frames 430–540, 3.67 s)
 * Audio: "You didn't. You just used a middleman."  →  starts local f2
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Phone } from "../components/Phone";

export const Scene04Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "YOU DIDN'T" slams in at f2
  const nope1Spring = spring({ frame: frame - 2, fps, config: { damping: 6, stiffness: 280 } });
  const nope1Sc  = interpolate(nope1Spring, [0, 0.8, 1], [1.5, 0.9, 1]);
  const nope1Op  = interpolate(frame, [2, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nopeFlash = interpolate(frame, [2, 14], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phone slides in from left, server from right (f25)
  const phoneSpring = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 90 } });
  const phoneX = interpolate(phoneSpring, [0, 1], [-200, 200]);    // absolute left
  const serverSpring = spring({ frame: frame - 32, fps, config: { damping: 14, stiffness: 90 } });
  const serverX = interpolate(serverSpring, [0, 1], [1280, 800]);  // absolute left

  const elemOp = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bridge draws (f40)
  const BRIDGE_LEN = 480;
  const bridgeOff = interpolate(frame, [40, 68], [BRIDGE_LEN, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bridgeOp  = interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bridgePulse = 0.8 + Math.sin(frame / 9) * 0.2;

  // "THE MIDDLEMAN" (f58)
  const midSpring = spring({ frame: frame - 58, fps, config: { damping: 9, stiffness: 160 } });
  const midOp    = interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const midY     = interpolate(midSpring, [0, 1], [30, 0]);

  // Moving data dot on bridge
  const dotT  = bridgeOp > 0.3 ? ((frame - 55) / 40) % 1 : 0;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeIn }}>
      <CyberGrid opacity={0.4} />

      {nopeFlash > 0.02 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: nopeFlash * 0.25, pointerEvents: "none" }} />}

      {/* ── "YOU DIDN'T." ── */}
      <div style={{ position: "absolute", top: 280, left: 50, right: 50, textAlign: "center", opacity: nope1Op, transform: `scale(${nope1Sc})`, transformOrigin: "center" }}>
        <div style={{ color: "#ff3333", fontSize: 88, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: -1, textShadow: "0 0 30px #ff3333" }}>
          YOU DIDN'T.
        </div>
      </div>

      {/* Bridge lines */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id="s4glow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Bridge */}
        <line x1={220} y1={960} x2={860} y2={960} stroke="#00f2ff" strokeWidth={4}
          strokeDasharray={`${640}`} strokeDashoffset={bridgeOff * (640 / BRIDGE_LEN)}
          opacity={bridgeOp * bridgePulse} filter="url(#s4glow)" />
        <line x1={220} y1={960} x2={860} y2={960} stroke="#00f2ff" strokeWidth={16}
          strokeDasharray={`${640}`} strokeDashoffset={bridgeOff * (640 / BRIDGE_LEN)}
          opacity={bridgeOp * 0.12} />
        {/* Moving dot */}
        {bridgeOp > 0.4 && <circle cx={220 + dotT * 640} cy={960} r={10} fill="#00f2ff" opacity={0.9} filter="url(#s4glow)" />}
        {/* Labels */}
        <text x={220} y={1140} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={24} fontFamily="Montserrat,sans-serif" fontWeight={600} opacity={elemOp}>YOUR PHONE</text>
        <text x={860} y={1140} textAnchor="middle" fill="#00f2ff" fontSize={24} fontFamily="Montserrat,sans-serif" fontWeight={700} opacity={elemOp}>VPN SERVER</text>
      </svg>

      {/* Phone */}
      <div style={{ position: "absolute", top: 820, left: phoneX, opacity: elemOp }}>
        <Phone width={160} height={280} glowColor="rgba(0,242,255,0.4)" />
      </div>

      {/* Server */}
      <div style={{ position: "absolute", top: 840, left: serverX, opacity: elemOp }}>
        <Img src={staticFile("vpn/server.png")} style={{ width: 240, height: 240, filter: `drop-shadow(0 0 ${14 + bridgePulse * 6}px rgba(0,242,255,0.5))` }} />
      </div>

      {/* "THE MIDDLEMAN" */}
      <div style={{ position: "absolute", top: 430, left: 50, right: 50, textAlign: "center", opacity: midOp, transform: `translateY(${midY}px)` }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 26, fontFamily: "'Montserrat',sans-serif", letterSpacing: 5 }}>you just used</div>
        <div style={{ color: "#00f2ff", fontSize: 86, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: -1, lineHeight: 1.05, textShadow: "0 0 40px #00f2ff, 0 0 80px rgba(0,242,255,0.3)" }}>
          THE
        </div>
        <div style={{ color: "#00f2ff", fontSize: 86, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, letterSpacing: -1, lineHeight: 1.05, textShadow: "0 0 40px #00f2ff, 0 0 80px rgba(0,242,255,0.3)" }}>
          MIDDLEMAN
        </div>
      </div>
    </AbsoluteFill>
  );
};

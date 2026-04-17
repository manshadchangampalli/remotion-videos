import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Phone } from "../components/Phone";

const PHONE_X = 170;
const WALL_X = 540;
const SERVER_X = 900;
const Y = 960;

export const Scene14Philosophy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zoom-out: everything scales down from close-up
  const zoomSpring = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 70 } });
  const zoomScale = interpolate(zoomSpring, [0, 1], [1.4, 1]);

  // Phone slides in
  const phoneOp = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wall materializes
  const wallOp = interpolate(frame, [15, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Server materializes with gold glow
  const serverOp = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Server golden glow
  const goldGlow = interpolate(frame, [35, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const goldPulse = 0.8 + Math.sin(frame / 9) * 0.2;

  // Full diagram connections
  const bridgeOp = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftBridgeLen = WALL_X - PHONE_X - 80;
  const rightBridgeLen = SERVER_X - WALL_X;

  // "THE OFFSHORE FRIEND" text
  const textSpring = spring({ frame: frame - 55, fps, config: { damping: 9, stiffness: 160 } });
  const textOp = interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = interpolate(textSpring, [0, 1], [30, 0]);

  // VPN label on server
  const serverLabelOp = interpolate(frame, [60, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Summary line
  const summaryOp = interpolate(frame, [80, 98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dataPacketT = ((frame - 50) / 35) % 1;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      <CyberGrid opacity={0.45} />

      {/* Gold ambient glow around server */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${SERVER_X + 90}px ${Y}px, rgba(255,200,50,${goldGlow * 0.12 * goldPulse}) 0%, transparent 40%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoomScale})`,
          transformOrigin: "center 55%",
        }}
      >
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <filter id="goldGlow14" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cyanGlow14" x="-20%" y="-300%" width="140%" height="700%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="wallGlow14" x="-30%" y="-10%" width="160%" height="120%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Wall */}
          {Array.from({ length: 10 }, (_, i) => {
            const barW = 1080 / 10;
            return (
              <rect
                key={i}
                x={i * barW + 4}
                y={700}
                width={barW - 8}
                height={520}
                fill="#1a0000"
                stroke="#ff3333"
                strokeWidth={i % 2 === 0 ? 2 : 1.5}
                filter="url(#wallGlow14)"
                opacity={wallOp * 0.75}
              />
            );
          })}
          {[700, 960, 1220].map((yy) => (
            <line key={yy} x1={0} y1={yy} x2={1080} y2={yy} stroke="#ff3333" strokeWidth={1.5} opacity={wallOp * 0.3} />
          ))}

          {/* Left bridge (phone → wall) */}
          <line
            x1={PHONE_X + 80}
            y1={Y}
            x2={WALL_X}
            y2={Y}
            stroke="#00f2ff"
            strokeWidth={3}
            strokeDasharray={`${leftBridgeLen}`}
            strokeDashoffset={0}
            opacity={bridgeOp * 0.8}
            filter="url(#cyanGlow14)"
          />

          {/* Right bridge (wall → server) */}
          <line
            x1={WALL_X}
            y1={Y}
            x2={SERVER_X + 90}
            y2={Y}
            stroke="#00f2ff"
            strokeWidth={3}
            strokeDasharray={`${rightBridgeLen}`}
            strokeDashoffset={0}
            opacity={bridgeOp * 0.8}
            filter="url(#cyanGlow14)"
          />

          {/* Moving packets */}
          {frame > 55 &&
            [0, 0.5].map((offset, i) => {
              const t = (dataPacketT + offset) % 1;
              const px = PHONE_X + 80 + t * (SERVER_X + 90 - PHONE_X - 80);
              const fade = Math.min(t * 4, 1) * Math.min((1 - t) * 4, 1);
              const pColor = t > 0.5 ? "#00ffcc" : "#00f2ff";
              return (
                <circle key={i} cx={px} cy={Y} r={8} fill={pColor} opacity={bridgeOp * fade} filter="url(#cyanGlow14)" />
              );
            })}

          {/* Gold glow ring around server */}
          <circle
            cx={SERVER_X + 90}
            cy={Y}
            r={100 + goldPulse * 15}
            fill="none"
            stroke="#ffc832"
            strokeWidth={3}
            opacity={goldGlow * 0.35}
            filter="url(#goldGlow14)"
          />
          <circle
            cx={SERVER_X + 90}
            cy={Y}
            r={130 + goldPulse * 20}
            fill="none"
            stroke="#ffc832"
            strokeWidth={1.5}
            opacity={goldGlow * 0.18}
          />

          {/* Labels */}
          <text x={PHONE_X + 20} y={1120} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={22} fontFamily="Montserrat, sans-serif" fontWeight={600} opacity={phoneOp}>
            YOUR PHONE
          </text>
          <text x={WALL_X} y={660} textAnchor="middle" fill="#ff3333" fontSize={20} fontFamily="Montserrat, sans-serif" fontWeight={700} opacity={wallOp * 0.9}>
            ISP FIREWALL
          </text>
          <text x={SERVER_X + 90} y={1120} textAnchor="middle" fill="#ffc832" fontSize={22} fontFamily="Montserrat, sans-serif" fontWeight={700} opacity={serverLabelOp}>
            VPN SERVER
          </text>
        </svg>

        {/* Phone */}
        <div style={{ position: "absolute", top: Y - 180, left: PHONE_X - 100, opacity: phoneOp }}>
          <Phone width={200} height={360} glowColor="rgba(0,242,255,0.4)" />
        </div>

        {/* Server with gold glow */}
        <div style={{ position: "absolute", top: Y - 120, left: SERVER_X - 20, opacity: serverOp }}>
          <Img
            src={staticFile("vpn/server.png")}
            style={{
              width: 220,
              height: 220,
              filter: `drop-shadow(0 0 ${15 + goldGlow * 25}px rgba(255,200,50,${goldGlow * goldPulse * 0.7})) drop-shadow(0 0 8px rgba(0,242,255,0.3))`,
            }}
          />
        </div>
      </div>

      {/* "THE OFFSHORE FRIEND" title */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOp,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 24, fontFamily: "'Montserrat', sans-serif", letterSpacing: 4 }}>
          Think of it as
        </div>
        <div
          style={{
            color: "#ffc832",
            fontSize: 72,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            letterSpacing: -1,
            textShadow: "0 0 30px rgba(255,200,50,0.6), 0 0 60px rgba(255,200,50,0.3)",
            lineHeight: 1.05,
          }}
        >
          THE OFFSHORE
        </div>
        <div
          style={{
            color: "#ffc832",
            fontSize: 72,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            letterSpacing: -1,
            textShadow: "0 0 30px rgba(255,200,50,0.6), 0 0 60px rgba(255,200,50,0.3)",
            lineHeight: 1.05,
          }}
        >
          FRIEND
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: summaryOp,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 27,
            fontFamily: "'Montserrat', sans-serif",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          A VPN doesn't break walls.
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 27,
            fontFamily: "'Montserrat', sans-serif",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          It hires a friend overseas
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 27,
            fontFamily: "'Montserrat', sans-serif",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          to do the shopping for you.
        </div>
      </div>
    </AbsoluteFill>
  );
};

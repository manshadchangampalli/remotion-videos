import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Phone } from "../components/Phone";

const PHONE_X = 160;
const WALL_X = 540;
const SERVER_X = 880;
const Y = 960;
const SERVER_TO_WALL = SERVER_X - WALL_X;
const WALL_TO_PHONE = WALL_X - PHONE_X - 80;

export const Scene13BlindReturn: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Green packet moves from server toward wall
  const seg1T = interpolate(frame, [8, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg1X = SERVER_X - seg1T * SERVER_TO_WALL;

  // Green laser server → wall
  const seg1_DashOffset = interpolate(frame, [8, 45], [SERVER_TO_WALL, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg1_Op = interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wall scan (red beam)
  const scanStart = 45;
  const scanOp = interpolate(frame, [scanStart, scanStart + 12, scanStart + 40, scanStart + 55], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanY = 960 + Math.sin((frame - scanStart) / 7) * 200;

  // Cyan shield on packet pulsing
  const shieldPulse = 0.7 + Math.sin(frame / 6) * 0.25;

  // "CONTENTS: ???" label on wall
  const contentsOp = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentsFade = interpolate(frame, [85, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Packet passes through wall — seg 2
  const seg2T = interpolate(frame, [80, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg2X = WALL_X - seg2T * WALL_TO_PHONE;
  const seg2_Op = interpolate(frame, [80, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const seg2_DashOffset = interpolate(frame, [80, 125], [WALL_TO_PHONE, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone receives packet
  const phoneGlow = interpolate(frame, [118, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "BLIND" text
  const blindOp = interpolate(frame, [70, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Header
  const headerOp = interpolate(frame, [8, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      <CyberGrid opacity={0.4} color="#0a1a0a" />

      {/* Green ambient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 20% 55%, rgba(0,255,204,0.07) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(255,51,51,0.06) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="greenGlow13" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wallGlow13" x="-30%" y="-10%" width="160%" height="120%">
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
              y={640}
              width={barW - 8}
              height={640}
              fill="#1a0000"
              stroke="#ff3333"
              strokeWidth={i % 2 === 0 ? 2 : 1.5}
              filter="url(#wallGlow13)"
              opacity={0.7}
            />
          );
        })}
        {[640, 960, 1280].map((yy) => (
          <line key={yy} x1={0} y1={yy} x2={1080} y2={yy} stroke="#ff3333" strokeWidth={1.5} opacity={0.3} />
        ))}

        {/* Seg 1 laser: server → wall */}
        <line
          x1={SERVER_X}
          y1={Y}
          x2={WALL_X}
          y2={Y}
          stroke="#00ffcc"
          strokeWidth={5}
          strokeDasharray={`${SERVER_TO_WALL}`}
          strokeDashoffset={seg1_DashOffset}
          opacity={seg1_Op}
          filter="url(#greenGlow13)"
        />
        <line
          x1={SERVER_X}
          y1={Y}
          x2={WALL_X}
          y2={Y}
          stroke="#00ffcc"
          strokeWidth={18}
          strokeDasharray={`${SERVER_TO_WALL}`}
          strokeDashoffset={seg1_DashOffset}
          opacity={seg1_Op * 0.12}
        />

        {/* Green packet with CYAN SHIELD (segment 1, server→wall) */}
        {seg1T > 0.05 && seg1T < 1.05 && (
          <g opacity={seg1_Op} transform={`translate(${seg1X}, ${Y})`}>
            {/* Shield ring */}
            <circle cx={0} cy={0} r={42} fill="none" stroke="#00f2ff" strokeWidth={3} opacity={shieldPulse * 0.8} filter="url(#greenGlow13)" />
            <circle cx={0} cy={0} r={52} fill="none" stroke="#00f2ff" strokeWidth={1} opacity={shieldPulse * 0.4} />
            {/* Green packet body */}
            <rect x={-52} y={-28} width={104} height={56} rx={10} fill="#001a0a" stroke="#00ffcc" strokeWidth={2.5} filter="url(#greenGlow13)" />
            <polygon points={`-14,-12 18,0 -14,12`} fill="#00ffcc" />
            <text x={20} y={6} fill="#00ffcc" fontSize={14} fontFamily="monospace" fontWeight={700}>
              DATA
            </text>
          </g>
        )}

        {/* Wall scan */}
        <line
          x1={0}
          y1={scanY}
          x2={1080}
          y2={scanY}
          stroke="#ff3333"
          strokeWidth={3}
          opacity={scanOp * 0.55}
          filter="url(#greenGlow13)"
        />

        {/* CONTENTS: ??? label on wall */}
        {contentsOp * contentsFade > 0.05 && (
          <g opacity={contentsOp * contentsFade} transform="translate(540, 530)">
            <rect x={-120} y={-32} width={240} height={65} rx={10} fill="#1a0000" stroke="#ff3333" strokeWidth={2} />
            <text x={0} y={-8} textAnchor="middle" fill="#ff3333" fontSize={18} fontFamily="monospace" fontWeight={700}>
              CONTENTS:
            </text>
            <text x={0} y={18} textAnchor="middle" fill="#ff6666" fontSize={22} fontFamily="monospace" fontWeight={900}>
              ???
            </text>
          </g>
        )}

        {/* Seg 2 laser: wall → phone */}
        <line
          x1={WALL_X}
          y1={Y}
          x2={PHONE_X + 80}
          y2={Y}
          stroke="#00ffcc"
          strokeWidth={5}
          strokeDasharray={`${WALL_TO_PHONE}`}
          strokeDashoffset={seg2_DashOffset}
          opacity={seg2_Op}
          filter="url(#greenGlow13)"
        />
        <line
          x1={WALL_X}
          y1={Y}
          x2={PHONE_X + 80}
          y2={Y}
          stroke="#00ffcc"
          strokeWidth={18}
          strokeDasharray={`${WALL_TO_PHONE}`}
          strokeDashoffset={seg2_DashOffset}
          opacity={seg2_Op * 0.12}
        />

        {/* Green packet segment 2 (wall→phone) */}
        {seg2_Op > 0.05 && (
          <g opacity={seg2_Op} transform={`translate(${seg2X}, ${Y})`}>
            <circle cx={0} cy={0} r={42} fill="none" stroke="#00f2ff" strokeWidth={3} opacity={shieldPulse * 0.8} filter="url(#greenGlow13)" />
            <rect x={-52} y={-28} width={104} height={56} rx={10} fill="#001a0a" stroke="#00ffcc" strokeWidth={2.5} filter="url(#greenGlow13)" />
            <polygon points={`-14,-12 18,0 -14,12`} fill="#00ffcc" />
            <text x={20} y={6} fill="#00ffcc" fontSize={14} fontFamily="monospace" fontWeight={700}>
              DATA
            </text>
          </g>
        )}

        {/* Labels */}
        <text x={PHONE_X + 20} y={1120} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={20} fontFamily="Montserrat, sans-serif" fontWeight={600}>
          YOUR PHONE
        </text>
        <text x={SERVER_X} y={1120} textAnchor="middle" fill="#00f2ff" fontSize={20} fontFamily="Montserrat, sans-serif" fontWeight={600}>
          VPN SERVER
        </text>
        <text x={WALL_X} y={590} textAnchor="middle" fill="#ff3333" fontSize={20} fontFamily="Montserrat, sans-serif" fontWeight={700}>
          ISP FIREWALL
        </text>
      </svg>

      {/* Phone */}
      <div style={{ position: "absolute", top: Y - 180, left: PHONE_X - 100 }}>
        <Phone 
          width={200} 
          height={360} 
          glowColor={`rgba(0,255,204,${0.3 + phoneGlow * 0.5})`} 
        />
      </div>

      {/* Server */}
      <div style={{ position: "absolute", top: Y - 120, left: SERVER_X - 110 }}>
        <Img src={staticFile("vpn/server.png")} style={{ width: 220, height: 220, filter: "drop-shadow(0 0 14px rgba(0,242,255,0.4))" }} />
      </div>

      {/* Header */}
      <div style={{ position: "absolute", top: 290, left: 60, right: 60, textAlign: "center", opacity: headerOp }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 24, fontFamily: "'Montserrat', sans-serif", letterSpacing: 4 }}>
          The firewall is
        </div>
        <div style={{ color: "#ff3333", fontSize: 68, fontFamily: "'Montserrat', sans-serif", fontWeight: 900, textShadow: "0 0 25px #ff3333", lineHeight: 1.1 }}>
          COMPLETELY
        </div>
        <div style={{ color: "#ff3333", fontSize: 68, fontFamily: "'Montserrat', sans-serif", fontWeight: 900, textShadow: "0 0 25px #ff3333", lineHeight: 1.1 }}>
          BLIND
        </div>
      </div>

      {/* "Encrypted" label */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: blindOp,
        }}
      >
        <div
          style={{
            color: "#00f2ff",
            fontSize: 28,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            textShadow: "0 0 15px #00f2ff",
          }}
        >
          The data is encrypted.
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 24,
            fontFamily: "'Montserrat', sans-serif",
            marginTop: 8,
          }}
        >
          The ISP just sees random data from Singapore.
        </div>
      </div>
    </AbsoluteFill>
  );
};

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

const SERVER_X = 700;
const TIKTOK_X = 960;
const PHONE_X = 160;
const Y = 960;

// Server to TikTok
const ST_LEN = TIKTOK_X - SERVER_X - 90;
// TikTok to phone (back through tunnel)
const TP_LEN = TIKTOK_X - PHONE_X - 90;

export const Scene12Download: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Server and phone present
  const serverOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Server → TikTok line draws
  const stLine_DashOffset = interpolate(frame, [15, 38], [ST_LEN, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stLine_Op = interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // TikTok icon pops up
  const tiktokSpring = spring({ frame: frame - 35, fps, config: { damping: 10, stiffness: 180 } });
  const tiktokScale = interpolate(tiktokSpring, [0, 1], [0, 1]);
  const tiktokOp = interpolate(frame, [35, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Green data packet pulled from TikTok and fired back
  const packetStart = 55;
  const packetT = interpolate(frame, [packetStart, packetStart + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Travels from TikTok (right) to phone (left)
  const packetX = TIKTOK_X - packetT * TP_LEN;
  const packetOp = interpolate(frame, [packetStart, packetStart + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Green tunnel (return path)
  const greenTunnel_Op = interpolate(frame, [packetStart - 5, packetStart + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const greenTunnel_DashOffset = interpolate(frame, [packetStart - 5, packetStart + 30], [TP_LEN, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "VIDEO DOWNLOADED" badge
  const downloadSpring = spring({ frame: frame - 88, fps, config: { damping: 9, stiffness: 180 } });
  const downloadOp = interpolate(frame, [88, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Header
  const headerOp = interpolate(frame, [8, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowPulse = 0.8 + Math.sin(frame / 9) * 0.2;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      <CyberGrid opacity={0.4} />

      {/* Green ambient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 80% 55%, rgba(0,255,204,0.08) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="greenGlow12" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cyanGlow12" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Server → TikTok cyan line */}
        <line
          x1={SERVER_X + 90}
          y1={Y}
          x2={TIKTOK_X}
          y2={Y}
          stroke="#00f2ff"
          strokeWidth={3}
          strokeDasharray={`${ST_LEN}`}
          strokeDashoffset={stLine_DashOffset}
          opacity={stLine_Op}
          filter="url(#cyanGlow12)"
        />

        {/* Green return tunnel (TikTok → Phone) */}
        <line
          x1={PHONE_X + 80}
          y1={Y}
          x2={TIKTOK_X}
          y2={Y}
          stroke="#00ffcc"
          strokeWidth={5}
          strokeDasharray={`${TP_LEN}`}
          strokeDashoffset={greenTunnel_DashOffset}
          opacity={greenTunnel_Op}
          filter="url(#greenGlow12)"
        />
        <line
          x1={PHONE_X + 80}
          y1={Y}
          x2={TIKTOK_X}
          y2={Y}
          stroke="#00ffcc"
          strokeWidth={18}
          strokeDasharray={`${TP_LEN}`}
          strokeDashoffset={greenTunnel_DashOffset}
          opacity={greenTunnel_Op * 0.12}
        />

        {/* Moving green data packet (video) */}
        {packetOp > 0.05 && (
          <g opacity={packetOp}>
            {/* Glow ring */}
            <circle
              cx={packetX}
              cy={Y}
              r={35}
              fill="none"
              stroke="#00ffcc"
              strokeWidth={2}
              opacity={0.35}
              filter="url(#greenGlow12)"
            />
            {/* Main packet */}
            <rect
              x={packetX - 55}
              y={Y - 28}
              width={110}
              height={56}
              rx={10}
              fill="#001a0e"
              stroke="#00ffcc"
              strokeWidth={2.5}
              filter="url(#greenGlow12)"
            />
            {/* Play icon */}
            <polygon
              points={`${packetX - 14},${Y - 12} ${packetX + 18},${Y} ${packetX - 14},${Y + 12}`}
              fill="#00ffcc"
            />
            {/* "VIDEO" label */}
            <text
              x={packetX + 20}
              y={Y + 6}
              fill="#00ffcc"
              fontSize={14}
              fontFamily="monospace"
              fontWeight={700}
            >
              VIDEO
            </text>
          </g>
        )}

        {/* Labels */}
        <text x={PHONE_X + 20} y={1120} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={20} fontFamily="Montserrat, sans-serif" fontWeight={600} opacity={phoneOp}>
          YOUR PHONE
        </text>
        <text x={SERVER_X} y={1120} textAnchor="middle" fill="#00f2ff" fontSize={20} fontFamily="Montserrat, sans-serif" fontWeight={600} opacity={serverOp}>
          VPN SERVER
        </text>
        <text x={TIKTOK_X} y={1120} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={20} fontFamily="Montserrat, sans-serif" fontWeight={600} opacity={tiktokOp}>
          TIKTOK
        </text>
      </svg>

      {/* Phone */}
      <div style={{ position: "absolute", top: Y - 180, left: PHONE_X - 100, opacity: phoneOp }}>
        <Phone width={200} height={360} glowColor="rgba(0,255,204,0.5)" />
      </div>

      {/* Server */}
      <div style={{ position: "absolute", top: Y - 120, left: SERVER_X - 110, opacity: serverOp }}>
        <Img src={staticFile("vpn/server.png")} style={{ width: 220, height: 220, filter: `drop-shadow(0 0 ${12 + glowPulse * 6}px rgba(0,242,255,0.5))` }} />
      </div>

      {/* TikTok icon */}
      <div
        style={{
          position: "absolute",
          top: Y - 90,
          left: TIKTOK_X - 80,
          opacity: tiktokOp,
          transform: `scale(${tiktokScale})`,
          transformOrigin: "center",
        }}
      >
        <Img src={staticFile("vpn/tik-tok.png")} style={{ width: 160, height: 160, filter: "drop-shadow(0 0 18px rgba(0,255,204,0.5))" }} />
      </div>

      {/* Header */}
      <div style={{ position: "absolute", top: 290, left: 60, right: 60, textAlign: "center", opacity: headerOp }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 24, fontFamily: "'Montserrat', sans-serif", letterSpacing: 4 }}>
          Server fetches the video
        </div>
        <div style={{ color: "#00ffcc", fontSize: 60, fontFamily: "'Montserrat', sans-serif", fontWeight: 900, textShadow: "0 0 25px #00ffcc" }}>
          DOWNLOADS IT
        </div>
      </div>

      {/* VIDEO DOWNLOADED badge */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: downloadOp,
          transform: `scale(${interpolate(downloadSpring, [0, 1], [0.7, 1])})`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0,20,12,0.9)",
            border: "2px solid #00ffcc",
            borderRadius: 50,
            padding: "16px 48px",
            boxShadow: "0 0 25px rgba(0,255,204,0.4)",
          }}
        >
          <span style={{ color: "#00ffcc", fontSize: 26, fontFamily: "'Montserrat', sans-serif", fontWeight: 900, letterSpacing: 3, textShadow: "0 0 15px #00ffcc" }}>
            ▶ STREAMING TO PHONE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

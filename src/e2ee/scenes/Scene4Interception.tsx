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
import { Grid } from "../components/Grid";
import { DataPacket } from "../components/DataPacket";
import { CipherText } from "../components/CipherText";

export const Scene4Interception: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── PHASE 1: Tunnel + traveling vault (0–40) ──
  const packetX = interpolate(frame, [0, 40], [200, 480], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tunnelRush = interpolate(frame, [0, 40], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Motion trail copies
  const trailCount = 4;

  // ── PHASE 2: Server slides in (40–100) ──
  const serverSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 13, stiffness: 130 },
  });
  const serverY = interpolate(serverSpring, [0, 1], [-350, 430]);
  const serverOp = interpolate(frame, [38, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Packet travels THROUGH server (left→right, 55–90)
  const throughX = interpolate(frame, [55, 90], [350, 730], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Server screen glitch text
  const GLITCH_STATES = ["READING DATA...", "????? ERROR", "ACCESS DENIED", "▓▓▓▓▓▓▓"];
  const glitchIdx = Math.floor(frame / 2) % GLITCH_STATES.length;

  // Red X over server (frame 88+)
  const serverXOp = interpolate(frame, [88, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 3: Hacker slides in (100–160) ──
  const hackerSpring = spring({
    frame: frame - 102,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const hackerX = interpolate(hackerSpring, [0, 1], [1300, 760]);
  const hackerOp = interpolate(frame, [100, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hacker arm extends toward packet then bounces back
  const armExtend = spring({
    frame: frame - 122,
    fps,
    config: { damping: 6, stiffness: 200 },
  });
  const armLength = interpolate(armExtend, [0, 1], [0, 90]);
  const armBounce =
    frame > 140
      ? spring({
          frame: frame - 140,
          fps,
          config: { damping: 8, stiffness: 180 },
        })
      : 0;
  const armX = armLength * (1 - armBounce);

  // Warning triangles
  const warnPulse = 0.5 + Math.sin(frame / 6) * 0.5;

  // Hacker X
  const hackerXOp = interpolate(frame, [148, 162], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 4: Vault continues right (160–200) ──
  const finalPacketX = interpolate(frame, [158, 198], [520, 920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text lines
  const text1Op = interpolate(frame, [50, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text2Op = interpolate(frame, [115, 142], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text3Op = interpolate(frame, [155, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mainPacketX = frame < 55 ? packetX : frame >= 158 ? finalPacketX : throughX;

  return (
    <AbsoluteFill style={{ background: "#050A0F" }}>
      <Grid />

      {/* SVG layer: tunnel lines + hacker silhouette */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="sc4Glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fiber optic tunnel lines */}
        {Array.from({ length: 6 }, (_, i) => {
          const ySpread = (i - 2.5) * 60;
          const dashOffset = -(tunnelRush + i * 40);
          return (
            <line
              key={i}
              x1={80}
              y1={960 + ySpread}
              x2={1000}
              y2={960}
              stroke="#00E5FF"
              strokeWidth={1}
              strokeDasharray="24 18"
              strokeDashoffset={dashOffset}
              opacity={0.18 + (i === 2 || i === 3 ? 0.1 : 0)}
              filter="url(#sc4Glow)"
            />
          );
        })}

        {/* Motion trail copies of packet */}
        {frame < 45 &&
          Array.from({ length: trailCount }, (_, i) => (
            <g
              key={i}
              transform={`translate(${packetX - (i + 1) * 20}, 960)`}
              opacity={(trailCount - i) / (trailCount * 3)}
            >
              <rect
                x={-20}
                y={-20}
                width={40}
                height={40}
                rx={6}
                fill="none"
                stroke="#FF1744"
                strokeWidth={1.5}
              />
            </g>
          ))}

        {/* Server rack SVG (simplified 3-unit rack) */}
        {serverOp > 0 && (
          <g
            transform={`translate(540, ${serverY})`}
            opacity={serverOp}
          >
            {/* Rack body */}
            <rect
              x={-130}
              y={-110}
              width={260}
              height={220}
              rx={10}
              fill="rgba(5,15,30,0.95)"
              stroke="#334"
              strokeWidth={2}
            />
            {/* 3 rack units */}
            {[0, 1, 2].map((u) => (
              <g key={u} transform={`translate(0, ${-70 + u * 72})`}>
                <rect
                  x={-118}
                  y={-24}
                  width={236}
                  height={46}
                  rx={5}
                  fill="rgba(10,20,40,0.9)"
                  stroke="#223"
                  strokeWidth={1}
                />
                {/* LED dots */}
                {[0, 1, 2, 3].map((d) => (
                  <circle
                    key={d}
                    cx={-95 + d * 14}
                    cy={0}
                    r={4}
                    fill={
                      u === 1 && frame > 58
                        ? "#FF1744"
                        : "#00E676"
                    }
                    opacity={0.9 + Math.sin(frame / 3 + d) * 0.1}
                  />
                ))}
              </g>
            ))}

            {/* Server screen / glitch display */}
            {frame > 55 && (
              <g>
                <rect
                  x={-80}
                  y={-8}
                  width={160}
                  height={44}
                  rx={4}
                  fill="rgba(0,0,0,0.85)"
                  stroke="#FF1744"
                  strokeWidth={1.5}
                />
                <text
                  x={0}
                  y={20}
                  textAnchor="middle"
                  fill="#FF1744"
                  fontSize={13}
                  fontFamily="'Courier New', monospace"
                  fontWeight={700}
                >
                  {GLITCH_STATES[glitchIdx]}
                </text>
              </g>
            )}

            {/* Red X over server */}
            {serverXOp > 0 && (
              <g opacity={serverXOp}>
                <line
                  x1={-50}
                  y1={-50}
                  x2={50}
                  y2={50}
                  stroke="#FF1744"
                  strokeWidth={6}
                  strokeLinecap="round"
                  filter="url(#sc4Glow)"
                />
                <line
                  x1={50}
                  y1={-50}
                  x2={-50}
                  y2={50}
                  stroke="#FF1744"
                  strokeWidth={6}
                  strokeLinecap="round"
                  filter="url(#sc4Glow)"
                />
              </g>
            )}
            {/* Label */}
            <text
              x={0}
              y={128}
              textAnchor="middle"
              fill="rgba(180,180,200,0.5)"
              fontSize={14}
              fontFamily="'Inter', sans-serif"
              letterSpacing={2}
            >
              WHATSAPP SERVERS
            </text>
          </g>
        )}

        {/* Hacker silhouette */}
        {hackerOp > 0 && (
          <g transform={`translate(${hackerX}, 980)`} opacity={hackerOp}>
            {/* Head */}
            <circle cx={0} cy={-95} r={36} fill="none" stroke="#FF1744" strokeWidth={3} />
            {/* Body */}
            <rect x={-32} y={-58} width={64} height={80} rx={10} fill="none" stroke="#FF1744" strokeWidth={3} />
            {/* Arm extending toward vault */}
            <line
              x1={-32}
              y1={-30}
              x2={-32 - armX}
              y2={-30}
              stroke="#FF1744"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Chain/lock between arm and packet */}
            {armX > 30 && (
              <g>
                <circle cx={-32 - armX * 0.5} cy={-30} r={10} fill="none" stroke="#FFD600" strokeWidth={2} opacity={0.7} />
                <line x1={-32 - armX * 0.3} y1={-30} x2={-32 - armX * 0.7} y2={-30} stroke="#FFD600" strokeWidth={2} strokeDasharray="6 4" opacity={0.7} />
              </g>
            )}
            {/* Warning triangles */}
            {[-55, 55].map((dx, i) => (
              <g key={i} transform={`translate(${dx}, -140)`} opacity={warnPulse}>
                <polygon points="0,-18 16,10 -16,10" fill="none" stroke="#FF6D00" strokeWidth={2.5} />
                <text x={0} y={6} textAnchor="middle" fill="#FF6D00" fontSize={12} fontWeight={900}>!</text>
              </g>
            ))}
            {/* Hacker X */}
            {hackerXOp > 0 && (
              <g opacity={hackerXOp}>
                <line x1={-44} y1={-110} x2={44} y2={-40} stroke="#FF1744" strokeWidth={5} strokeLinecap="round" filter="url(#sc4Glow)" />
                <line x1={44} y1={-110} x2={-44} y2={-40} stroke="#FF1744" strokeWidth={5} strokeLinecap="round" filter="url(#sc4Glow)" />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Data packet */}
      <DataPacket
        x={mainPacketX}
        y={960}
        glowColor="#FF1744"
        size={62}
      />

      {/* Cipher glitch on server screen (small) */}
      {frame >= 58 && frame <= 88 && (
        <div
          style={{
            position: "absolute",
            top: 494,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.85,
          }}
        >
          <CipherText text="▓▓▓" scramble frame={frame} fontSize={14} />
        </div>
      )}

      {/* Blind data server image */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: "50%",
          transform: `translateX(-50%) translateY(${serverY - 430 + 250}px)`,
          opacity: serverOp * 0.35,
          pointerEvents: "none",
        }}
      >
        <Img
          src={staticFile("whatsapp/blind-data-server.png")}
          style={{ width: 200, objectFit: "contain" }}
        />
      </div>

      {/* Text lines */}
      <div
        style={{
          position: "absolute",
          bottom: 420,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 46,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            opacity: text1Op,
            marginBottom: 16,
          }}
        >
          WhatsApp's servers?{" "}
          <span style={{ color: "#FF6D00" }}>Blind.</span>
        </div>
        <div
          style={{
            color: "#FF1744",
            fontSize: 44,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            opacity: text2Op,
            marginBottom: 16,
            textShadow: "0 0 20px rgba(255,29,68,0.35)",
          }}
        >
          Hackers? Also blind.
        </div>
        <div
          style={{
            color: "#00E5FF",
            fontSize: 52,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            opacity: text3Op,
            textShadow: "0 0 24px rgba(0,229,255,0.4)",
          }}
        >
          No key. No access.
        </div>
      </div>
    </AbsoluteFill>
  );
};

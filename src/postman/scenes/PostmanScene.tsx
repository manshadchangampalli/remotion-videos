import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";

export const PostmanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in / out
  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [360, 390], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title appears
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Postman label springs in (frame 15)
  const postmanLabelScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Beam draws from left to right (frame 30-90)
  const beamProgress = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // API Server appears at right when beam reaches (frame 90)
  const serverScale = spring({
    frame: frame - 88,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // "RAW HTTP REQUEST" badge (frame 100)
  const rawBadgeScale = spring({
    frame: frame - 100,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  // "GOLDEN RULE" banner (frame 150)
  const goldenScale = spring({
    frame: frame - 150,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // "NO CORS" checkmark (frame 185)
  const noCorsScale = spring({
    frame: frame - 185,
    fps,
    config: { damping: 8, stiffness: 180 },
  });

  // "No questions asked" (frame 220)
  const noQuestionsOpacity = interpolate(frame, [220, 245], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous packet animation (frame 100+)
  const packetProgress = frame > 100
    ? (((frame - 100) % 70) / 70)
    : -1;

  // Return packet (offset)
  const returnPacket = frame > 115
    ? (((frame - 115) % 70) / 70)
    : -1;

  // Beam glow pulse
  const beamPulse = frame > 90 ? Math.sin(frame * 0.14) * 0.3 + 0.7 : 1;

  // Node positions (mapped to the image layout)
  const POSTMAN_NODE = { x: 220, y: 960 };
  const API_NODE = { x: 860, y: 960 };

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* Full-screen background */}
      <Img
        src={staticFile("postman/postman-server-to-server.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(2,4,8,0.62)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="pGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6C37" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#00f5ff" stopOpacity={0.9} />
          </linearGradient>
        </defs>

        {/* Title bar */}
        <g opacity={titleOpacity}>
          <rect x={0} y={40} width={1080} height={80} fill="rgba(2,4,8,0.88)" />
          <text
            x={540} y={93}
            textAnchor="middle"
            fill="#FF6C37"
            fontSize={36}
            fontWeight="900"
            fontFamily="monospace"
            letterSpacing={2}
            filter="url(#pGlow)"
          >
            SERVER → SERVER  =  NO CORS
          </text>
          <line x1={0} y1={120} x2={1080} y2={120} stroke="#FF6C37" strokeWidth={1.5} strokeOpacity={0.4} />
        </g>

        {/* ─── POSTMAN NODE ─── */}
        <g transform={`translate(${POSTMAN_NODE.x}, ${POSTMAN_NODE.y}) scale(${postmanLabelScale})`} opacity={postmanLabelScale}>
          <circle cx={0} cy={0} r={100} fill="rgba(255,108,55,0.08)" stroke="#FF6C37" strokeWidth={2.5} filter="url(#pGlow)" />
          <circle cx={0} cy={0} r={72} fill="#FF6C37" />
          <text x={0} y={22} textAnchor="middle" fill="white" fontSize={64} fontWeight="900" fontFamily="serif">P</text>
        </g>
        {postmanLabelScale > 0.3 && (
          <g opacity={Math.min(1, (postmanLabelScale - 0.3) / 0.7)}>
            <text x={POSTMAN_NODE.x} y={POSTMAN_NODE.y + 140} textAnchor="middle"
              fill="#FF6C37" fontSize={26} fontWeight="900" fontFamily="monospace" filter="url(#pGlow)">
              POSTMAN
            </text>
            <text x={POSTMAN_NODE.x} y={POSTMAN_NODE.y + 172} textAnchor="middle"
              fill="rgba(255,108,55,0.65)" fontSize={18} fontFamily="monospace">
              your machine
            </text>
          </g>
        )}

        {/* ─── BEAM (drawing from Postman to API) ─── */}
        {beamProgress > 0 && (
          <g>
            {/* Glow trail */}
            <line
              x1={POSTMAN_NODE.x + 105} y1={POSTMAN_NODE.y}
              x2={POSTMAN_NODE.x + 105 + (API_NODE.x - POSTMAN_NODE.x - 210) * beamProgress} y2={API_NODE.y}
              stroke="url(#beamGrad)" strokeWidth={18} strokeOpacity={0.12} strokeLinecap="round"
            />
            <line
              x1={POSTMAN_NODE.x + 105} y1={POSTMAN_NODE.y}
              x2={POSTMAN_NODE.x + 105 + (API_NODE.x - POSTMAN_NODE.x - 210) * beamProgress} y2={API_NODE.y}
              stroke="url(#beamGrad)" strokeWidth={4} strokeLinecap="round"
              opacity={beamPulse}
              filter="url(#pGlow)"
            />
          </g>
        )}

        {/* ─── MOVING PACKETS ─── */}
        {packetProgress >= 0 && packetProgress <= 1 && (
          <g>
            <circle
              cx={POSTMAN_NODE.x + 105 + (API_NODE.x - POSTMAN_NODE.x - 210) * packetProgress}
              cy={POSTMAN_NODE.y}
              r={14} fill="#FF6C37" opacity={0.3} />
            <circle
              cx={POSTMAN_NODE.x + 105 + (API_NODE.x - POSTMAN_NODE.x - 210) * packetProgress}
              cy={POSTMAN_NODE.y}
              r={7} fill="#FF6C37" filter="url(#pGlow)"
              opacity={Math.sin(packetProgress * Math.PI)}
            />
          </g>
        )}
        {returnPacket >= 0 && returnPacket <= 1 && (
          <g>
            <circle
              cx={API_NODE.x - 105 - (API_NODE.x - POSTMAN_NODE.x - 210) * returnPacket}
              cy={POSTMAN_NODE.y}
              r={14} fill="#00f5ff" opacity={0.3} />
            <circle
              cx={API_NODE.x - 105 - (API_NODE.x - POSTMAN_NODE.x - 210) * returnPacket}
              cy={POSTMAN_NODE.y}
              r={7} fill="#00f5ff" filter="url(#pGlow)"
              opacity={Math.sin(returnPacket * Math.PI)}
            />
          </g>
        )}

        {/* ─── API SERVER NODE ─── */}
        <g transform={`translate(${API_NODE.x}, ${API_NODE.y}) scale(${serverScale})`} opacity={serverScale}>
          <circle cx={0} cy={0} r={100} fill="rgba(0,245,255,0.08)" stroke="#00f5ff" strokeWidth={2.5} filter="url(#pGlow)" />
          {/* Server stack icon */}
          {[-24, -6, 12].map((yOff, i) => (
            <g key={i}>
              <rect x={-38} y={yOff} width={76} height={14} rx={4} fill="rgba(0,245,255,0.18)" stroke="#00f5ff" strokeWidth={1.5} />
              <circle cx={30} cy={yOff + 7} r={5} fill="#00f5ff" opacity={0.9} />
            </g>
          ))}
          <text x={0} y={58} textAnchor="middle" fill="#00f5ff" fontSize={14} fontWeight="900" fontFamily="monospace">API</text>
        </g>
        {serverScale > 0.3 && (
          <g opacity={Math.min(1, (serverScale - 0.3) / 0.7)}>
            <text x={API_NODE.x} y={API_NODE.y + 140} textAnchor="middle"
              fill="#00f5ff" fontSize={26} fontWeight="900" fontFamily="monospace" filter="url(#pGlow)">
              API SERVER
            </text>
            <text x={API_NODE.x} y={API_NODE.y + 172} textAnchor="middle"
              fill="rgba(0,245,255,0.65)" fontSize={18} fontFamily="monospace">
              your backend
            </text>
          </g>
        )}

        {/* ─── RAW HTTP REQUEST badge ─── */}
        <g transform={`translate(540, 770) scale(${rawBadgeScale})`} opacity={rawBadgeScale}>
          <rect x={-260} y={-36} width={520} height={72} rx={16}
            fill="rgba(255,108,55,0.15)" stroke="#FF6C37" strokeWidth={2}
          />
          <text x={0} y={14} textAnchor="middle" fill="#FF6C37" fontSize={30}
            fontWeight="900" fontFamily="monospace" filter="url(#pGlow)">
            ⚡ RAW HTTP REQUEST
          </text>
        </g>

        {/* ─── GOLDEN RULE banner ─── */}
        <g transform={`translate(540, 1250) scale(${goldenScale})`} opacity={goldenScale}>
          <rect x={-440} y={-100} width={880} height={200} rx={24}
            fill="rgba(250,204,21,0.08)" stroke="#facc15" strokeWidth={2.5}
            filter="url(#pGlow)"
          />
          <text x={0} y={-35} textAnchor="middle" fill="#facc15" fontSize={28}
            fontWeight="900" fontFamily="monospace" letterSpacing={3} filter="url(#pGlow)">
            👑 GOLDEN RULE
          </text>
          <text x={0} y={10} textAnchor="middle" fill="#fde047" fontSize={26}
            fontWeight="800" fontFamily="monospace">
            SERVER → SERVER
          </text>
          <text x={0} y={50} textAnchor="middle" fill="#fde047" fontSize={26}
            fontWeight="800" fontFamily="monospace">
            DOES NOT HAVE CORS
          </text>
        </g>

        {/* ─── NO CORS checkmark ─── */}
        <g transform={`translate(540, 1520) scale(${noCorsScale})`} opacity={noCorsScale}>
          <rect x={-280} y={-50} width={560} height={100} rx={50}
            fill="#00ff88" filter="url(#pStrongGlow)"
          />
          <text x={0} y={18} textAnchor="middle" fill="#052e16" fontSize={46}
            fontWeight="900" fontFamily="monospace">
            ✅ NO CORS RULES
          </text>
        </g>

        {/* ─── "No questions asked" ─── */}
        <g opacity={noQuestionsOpacity}>
          <text x={540} y={1700} textAnchor="middle" fill="rgba(148,163,184,0.85)"
            fontSize={24} fontFamily="monospace">
            Server sends data · Postman displays it ·
          </text>
          <text x={540} y={1736} textAnchor="middle" fill="rgba(148,163,184,0.85)"
            fontSize={24} fontFamily="monospace">
            No questions asked.
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

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

export const PostmanOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title (frame 5)
  const titleOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "THE FIX" header (frame 10)
  const fixHeaderScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Code block reveals (frame 35)
  const codeBlockOpacity = interpolate(frame, [35, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Code lines stagger in
  const codeLine1 = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const codeLine2 = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const codeLine3 = interpolate(frame, [72, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ✅ Checkmark (frame 95)
  const checkScale = spring({
    frame: frame - 95,
    fps,
    config: { damping: 7, stiffness: 240 },
  });

  // "WHITELIST YOUR FRONTEND" badge (frame 120)
  const whitelistScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  // Connection restored animation (frame 140)
  const connectionOpacity = interpolate(frame, [140, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Moving packet (successful) (frame 150+)
  const successPacket = frame > 150
    ? (((frame - 150) % 60) / 60)
    : -1;
  const returnPacket = frame > 165
    ? (((frame - 165) % 60) / 60)
    : -1;

  // Subscribe CTA (frame 185)
  const subScale = spring({
    frame: frame - 185,
    fps,
    config: { damping: 10, stiffness: 130 },
  });
  const subPulse = frame > 210
    ? Math.sin((frame - 210) * 0.18) * 0.12 + 0.88
    : 1;

  const LAPTOP = { x: 200, y: 1060 };
  const API = { x: 880, y: 1060 };

  return (
    <AbsoluteFill style={{ opacity: sceneIn }}>
      {/* Full-screen background */}
      <Img
        src={staticFile("postman/response-back.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(2,4,8,0.65)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="oGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="oStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="successBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00f5ff" />
          </linearGradient>
        </defs>

        {/* Title bar */}
        <g opacity={titleOpacity}>
          <rect x={0} y={40} width={1080} height={80} fill="rgba(2,4,8,0.9)" />
          <text x={540} y={93}
            textAnchor="middle"
            fill="#00ff88"
            fontSize={36}
            fontWeight="900"
            fontFamily="monospace"
            letterSpacing={3}
            filter="url(#oGlow)"
          >
            ✅  THE FIX
          </text>
          <line x1={0} y1={120} x2={1080} y2={120} stroke="#00ff88" strokeWidth={1.5} strokeOpacity={0.4} />
        </g>

        {/* "THE FIX" header */}
        <g transform={`translate(540, 250) scale(${fixHeaderScale})`} opacity={fixHeaderScale}>
          <text x={0} y={0} textAnchor="middle" fill="#00ff88" fontSize={72}
            fontWeight="900" fontFamily="monospace" filter="url(#oStrongGlow)">
            THE FIX
          </text>
          <text x={0} y={50} textAnchor="middle" fill="rgba(0,255,136,0.6)" fontSize={24}
            fontFamily="monospace">
            Configure your backend to whitelist your frontend
          </text>
        </g>

        {/* Code block */}
        <g opacity={codeBlockOpacity}>
          <rect x={60} y={360} width={960} height={300} rx={20}
            fill="rgba(8,12,25,0.95)" stroke="rgba(0,255,136,0.35)" strokeWidth={2}
          />
          {/* Window dots */}
          <circle cx={92} cy={386} r={8} fill="#ff5f56" />
          <circle cx={116} cy={386} r={8} fill="#ffbd2e" />
          <circle cx={140} cy={386} r={8} fill="#27c93f" />
          <text x={540} y={386} textAnchor="middle" fill="#4b5563" fontSize={16} fontFamily="monospace">backend/server.js</text>
          <line x1={60} y1={400} x2={1020} y2={400} stroke="rgba(0,255,136,0.2)" strokeWidth={1} />

          <text x={90} y={440} fill="#94a3b8" fontSize={20} fontFamily="monospace" opacity={codeLine1}>
            <tspan fill="#60a5fa">app</tspan>
            <tspan fill="#e2e8f0">.use(cors({"{"}</tspan>
          </text>
          <text x={90} y={478} fill="#94a3b8" fontSize={20} fontFamily="monospace" opacity={codeLine2}>
            <tspan fill="#e2e8f0">{"  "}origin: </tspan>
            <tspan fill="#00ff88">'https://yourfrontend.com'</tspan>
            <tspan fill="#e2e8f0">,</tspan>
          </text>
          <text x={90} y={516} fill="#94a3b8" fontSize={20} fontFamily="monospace" opacity={codeLine2}>
            <tspan fill="#e2e8f0">{"  "}methods: </tspan>
            <tspan fill="#facc15">['GET', 'POST', 'PUT', 'DELETE']</tspan>
          </text>
          <text x={90} y={554} fill="#94a3b8" fontSize={20} fontFamily="monospace" opacity={codeLine3}>
            <tspan fill="#e2e8f0">{"  "}credentials: </tspan>
            <tspan fill="#a78bfa">true</tspan>
          </text>
          <text x={90} y={634} fill="#94a3b8" fontSize={20} fontFamily="monospace" opacity={codeLine3}>
            <tspan fill="#e2e8f0">{"})"});</tspan>
          </text>
        </g>

        {/* Big checkmark */}
        <g transform={`translate(540, 770) scale(${checkScale})`} opacity={checkScale}>
          <text x={0} y={0} textAnchor="middle" fontSize={100} filter="url(#oStrongGlow)">✅</text>
        </g>

        {/* WHITELIST YOUR FRONTEND badge */}
        <g transform={`translate(540, 890) scale(${whitelistScale})`} opacity={whitelistScale}>
          <rect x={-370} y={-48} width={740} height={96} rx={48}
            fill="#00ff88" filter="url(#oStrongGlow)"
          />
          <text x={0} y={18} textAnchor="middle" fill="#052e16" fontSize={38}
            fontWeight="900" fontFamily="monospace">
            WHITELIST YOUR FRONTEND
          </text>
        </g>

        {/* ─── SUCCESS CONNECTION ─── */}
        <g opacity={connectionOpacity}>
          {/* Browser */}
          <g transform={`translate(${LAPTOP.x}, ${LAPTOP.y})`}>
            <circle cx={0} cy={0} r={80} fill="rgba(0,255,136,0.08)" stroke="#00ff88" strokeWidth={2.5} filter="url(#oGlow)" />
            <text x={0} y={14} textAnchor="middle" fontSize={50}>💻</text>
            <text x={0} y={112} textAnchor="middle" fill="#00ff88" fontSize={20} fontWeight="800" fontFamily="monospace">YOUR SITE</text>
          </g>

          {/* Success beam */}
          <line
            x1={LAPTOP.x + 82} y1={LAPTOP.y}
            x2={API.x - 82} y2={API.y}
            stroke="url(#successBeam)" strokeWidth={16} strokeOpacity={0.12} strokeLinecap="round"
          />
          <line
            x1={LAPTOP.x + 82} y1={LAPTOP.y}
            x2={API.x - 82} y2={API.y}
            stroke="url(#successBeam)" strokeWidth={4} strokeLinecap="round"
            filter="url(#oGlow)"
          />

          {/* Moving success packets */}
          {successPacket >= 0 && successPacket <= 1 && (
            <g>
              <circle
                cx={LAPTOP.x + 82 + (API.x - LAPTOP.x - 164) * successPacket}
                cy={LAPTOP.y}
                r={12} fill="#00ff88" opacity={0.3}
              />
              <circle
                cx={LAPTOP.x + 82 + (API.x - LAPTOP.x - 164) * successPacket}
                cy={LAPTOP.y}
                r={6} fill="#00ff88" filter="url(#oGlow)"
                opacity={Math.sin(successPacket * Math.PI)}
              />
            </g>
          )}
          {returnPacket >= 0 && returnPacket <= 1 && (
            <g>
              <circle
                cx={API.x - 82 - (API.x - LAPTOP.x - 164) * returnPacket}
                cy={LAPTOP.y}
                r={12} fill="#00f5ff" opacity={0.3}
              />
              <circle
                cx={API.x - 82 - (API.x - LAPTOP.x - 164) * returnPacket}
                cy={LAPTOP.y}
                r={6} fill="#00f5ff" filter="url(#oGlow)"
                opacity={Math.sin(returnPacket * Math.PI)}
              />
            </g>
          )}

          {/* API Server */}
          <g transform={`translate(${API.x}, ${API.y})`}>
            <circle cx={0} cy={0} r={80} fill="rgba(0,245,255,0.08)" stroke="#00f5ff" strokeWidth={2.5} filter="url(#oGlow)" />
            {[-18, -2, 14].map((yOff, i) => (
              <g key={i}>
                <rect x={-30} y={yOff} width={60} height={11} rx={3} fill="rgba(0,245,255,0.2)" stroke="#00f5ff" strokeWidth={1.2} />
                <circle cx={24} cy={yOff + 5.5} r={4} fill="#00f5ff" opacity={0.9} />
              </g>
            ))}
            <text x={0} y={112} textAnchor="middle" fill="#00f5ff" fontSize={20} fontWeight="800" fontFamily="monospace">API SERVER</text>
          </g>

          {/* Header annotation on the line */}
          <rect x={360} y={LAPTOP.y - 65} width={360} height={50} rx={12}
            fill="rgba(0,255,136,0.12)" stroke="rgba(0,255,136,0.4)" strokeWidth={1.5}
          />
          <text x={540} y={LAPTOP.y - 33} textAnchor="middle" fill="#00ff88" fontSize={18}
            fontFamily="monospace" fontWeight="700">
            Access-Control-Allow-Origin ✓
          </text>
        </g>

        {/* ─── SUBSCRIBE CTA ─── */}
        <g transform={`translate(540, 1360) scale(${subScale * subPulse})`} opacity={subScale}>
          <rect x={-400} y={-90} width={800} height={180} rx={28}
            fill="rgba(255,0,0,0.85)" filter="url(#oStrongGlow)"
          />
          <text x={0} y={-15} textAnchor="middle" fill="white" fontSize={42}
            fontWeight="900" fontFamily="monospace">
            🔔 SUBSCRIBE
          </text>
          <text x={0} y={38} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={22}
            fontFamily="monospace">
            Instagram Like Button next →
          </text>
        </g>

        {/* Follow for more */}
        {subScale > 0.5 && (
          <g opacity={Math.min(1, (subScale - 0.5) * 2)}>
            <text x={540} y={1560} textAnchor="middle" fill="rgba(71,85,105,0.9)" fontSize={22}
              fontFamily="monospace" letterSpacing={3}>
              🔔 FOLLOW FOR MORE SYSTEM DESIGN
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

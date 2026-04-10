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

export const PreflightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in / out
  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [340, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title
  const titleOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Browser asks:" chat bubble (frame 10)
  const chatBubbleScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Question text types out (frame 30)
  const questionOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Backend responds: YES or NO (frame 85)
  // YES path (frame 85)
  const yesScale = spring({
    frame: frame - 85,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  // NO path (frame 110)
  const noScale = spring({
    frame: frame - 110,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // YES outcome: data flows (frame 120)
  const yesFlowOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // NO outcome: CORS BOMB drops (frame 150)
  const corsBombScale = spring({
    frame: frame - 150,
    fps,
    config: { damping: 5, stiffness: 280 },
  });
  const corsBombShake = frame > 160
    ? Math.sin(frame * 4) * interpolate(frame, [160, 185, 260, 310], [0, 12, 12, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // BOUNCER reveal (frame 200)
  const bouncerScale = spring({
    frame: frame - 200,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // "Blocks the data" (frame 250)
  const blocksOpacity = interpolate(frame, [250, 275], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const corsPulse = frame > 165 ? Math.sin(frame * 0.18) * 0.2 + 0.8 : 1;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* Background: CORS shield image with heavy red tint overlay */}
      <Img
        src={staticFile("postman/browser-cache.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,0,0,0.78)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="pfGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pfStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Title bar */}
        <g opacity={titleOpacity}>
          <rect x={0} y={40} width={1080} height={80} fill="rgba(10,0,0,0.9)" />
          <text x={540} y={93}
            textAnchor="middle"
            fill="#ff4444"
            fontSize={34}
            fontWeight="900"
            fontFamily="monospace"
            letterSpacing={2}
            filter="url(#pfGlow)"
          >
            🚪  THE BOUNCER CHECK
          </text>
          <line x1={0} y1={120} x2={1080} y2={120} stroke="#ff4444" strokeWidth={1.5} strokeOpacity={0.4} />
        </g>

        {/* ─── BROWSER'S QUESTION (Chat bubble) ─── */}
        <g transform={`translate(540, 310) scale(${chatBubbleScale})`} opacity={chatBubbleScale}>
          {/* Bubble */}
          <rect x={-420} y={-80} width={840} height={160} rx={28}
            fill="rgba(255,108,55,0.1)" stroke="#FF6C37" strokeWidth={2.5}
            filter="url(#pfGlow)"
          />
          {/* Bubble tail */}
          <polygon points="0,80 -25,120 25,80" fill="rgba(255,108,55,0.1)" stroke="#FF6C37" strokeWidth={2.5} />
          <text x={0} y={-20} textAnchor="middle" fill="#e2e8f0" fontSize={24}
            fontWeight="700" fontFamily="monospace">
            🌐 Browser asks your backend:
          </text>
          <text x={0} y={30} textAnchor="middle" fill="#FF6C37" fontSize={28}
            fontWeight="900" fontFamily="monospace" filter="url(#pfGlow)">
            "Do you recognize this website?"
          </text>
        </g>

        {/* OPTIONS request code */}
        <g opacity={questionOpacity}>
          <rect x={60} y={460} width={960} height={150} rx={20}
            fill="rgba(8,16,35,0.9)" stroke="rgba(250,204,21,0.35)" strokeWidth={1.5}
          />
          <text x={90} y={505} fill="#94a3b8" fontSize={18} fontFamily="monospace">OPTIONS /api/data HTTP/1.1</text>
          <text x={90} y={535} fill="#94a3b8" fontSize={18} fontFamily="monospace">
            <tspan fill="#64748b">Host: </tspan>
            <tspan fill="#e2e8f0">api.backend.com</tspan>
          </text>
          <text x={90} y={565} fill="#94a3b8" fontSize={18} fontFamily="monospace">
            <tspan fill="#64748b">Origin: </tspan>
            <tspan fill="#facc15">https://yourfrontend.com</tspan>
          </text>
          <text x={90} y={595} fill="#94a3b8" fontSize={18} fontFamily="monospace">
            <tspan fill="#64748b">Access-Control-Request-Method: </tspan>
            <tspan fill="#e2e8f0">GET</tspan>
          </text>
        </g>

        {/* ─── YES / NO FORK ─── */}

        {/* YES bubble (left) */}
        <g transform={`translate(240, 780) scale(${yesScale})`} opacity={yesScale}>
          <circle cx={0} cy={0} r={75} fill="#00ff88" filter="url(#pfStrongGlow)" />
          <text x={0} y={20} textAnchor="middle" fill="#052e16" fontSize={52}
            fontWeight="900" fontFamily="monospace">
            YES
          </text>
        </g>
        {yesScale > 0.3 && (
          <text x={240} y={890} textAnchor="middle" fill="rgba(0,255,136,0.8)" fontSize={18}
            fontFamily="monospace" opacity={Math.min(1, (yesScale - 0.3) / 0.7)}>
            Backend said YES ✓
          </text>
        )}

        {/* Fork line */}
        {yesScale > 0 && (
          <g opacity={Math.min(1, yesScale + noScale)}>
            <line x1={540} y1={660} x2={240} y2={705} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
            <line x1={540} y1={660} x2={840} y2={705} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
            <circle cx={540} cy={660} r={8} fill="rgba(255,255,255,0.3)" />
          </g>
        )}

        {/* NO bubble (right) */}
        <g transform={`translate(840, 780) scale(${noScale})`} opacity={noScale}>
          <circle cx={0} cy={0} r={75} fill="#ff1a1a" filter="url(#pfStrongGlow)" />
          <text x={0} y={20} textAnchor="middle" fill="white" fontSize={52}
            fontWeight="900" fontFamily="monospace">
            NO
          </text>
        </g>
        {noScale > 0.3 && (
          <text x={840} y={890} textAnchor="middle" fill="rgba(255,68,68,0.8)" fontSize={18}
            fontFamily="monospace" opacity={Math.min(1, (noScale - 0.3) / 0.7)}>
            Backend silent / no header ✗
          </text>
        )}

        {/* YES outcome: data flows */}
        <g opacity={yesFlowOpacity}>
          <rect x={60} y={930} width={420} height={72} rx={16}
            fill="rgba(0,255,136,0.1)" stroke="#00ff88" strokeWidth={2}
          />
          <text x={270} y={968} textAnchor="middle" fill="#00ff88" fontSize={22}
            fontWeight="800" fontFamily="monospace" filter="url(#pfGlow)">
            ✅ DATA FLOWS THROUGH
          </text>
          <text x={270} y={994} textAnchor="middle" fill="rgba(0,255,136,0.6)" fontSize={16}
            fontFamily="monospace">
            Browser allows the request
          </text>
        </g>

        {/* ─── CORS BOMB (NO outcome) ─── */}
        <g
          transform={`translate(${840 + corsBombShake}, 1080) scale(${corsBombScale * corsPulse})`}
          opacity={corsBombScale}
        >
          <rect x={-200} y={-58} width={400} height={116} rx={20}
            fill="#ff1a1a" filter="url(#pfStrongGlow)"
          />
          <text x={0} y={18} textAnchor="middle" fill="white" fontSize={48}
            fontWeight="900" fontFamily="monospace">
            💥 CORS!
          </text>
        </g>

        {/* ─── BOUNCER REVEAL ─── */}
        <g transform={`translate(540, 1280) scale(${bouncerScale})`} opacity={bouncerScale}>
          <rect x={-400} y={-100} width={800} height={200} rx={28}
            fill="rgba(255,68,68,0.08)" stroke="#ff4444" strokeWidth={2.5}
            filter="url(#pfGlow)"
          />
          <text x={0} y={-28} textAnchor="middle" fill="#ff4444" fontSize={34}
            fontWeight="900" fontFamily="monospace" filter="url(#pfGlow)">
            🚷 BROWSER = BOUNCER
          </text>
          <text x={0} y={20} textAnchor="middle" fill="rgba(255,68,68,0.8)" fontSize={22}
            fontFamily="monospace">
            No explicit YES from backend?
          </text>
          <text x={0} y={56} textAnchor="middle" fill="#ff3333" fontSize={24}
            fontWeight="800" fontFamily="monospace">
            YOU'RE NOT GETTING IN.
          </text>
        </g>

        {/* "Blocks data from reaching your screen" */}
        <g opacity={blocksOpacity}>
          <rect x={60} y={1520} width={960} height={80} rx={18}
            fill="rgba(255,68,68,0.08)" stroke="rgba(255,68,68,0.3)" strokeWidth={1.5}
          />
          <text x={540} y={1568} textAnchor="middle" fill="#fca5a5" fontSize={24}
            fontWeight="700" fontFamily="monospace">
            Giant red CORS error · Data blocked from your screen
          </text>
        </g>

        {/* Error console lines */}
        {blocksOpacity > 0.3 && (
          <g opacity={Math.min(1, (blocksOpacity - 0.3) / 0.7)}>
            {[
              "⛔ CORS policy: No 'Access-Control-Allow-Origin'",
              "⛔ Response to preflight blocked",
              "⛔ XMLHttpRequest cannot load",
            ].map((line, i) => (
              <text
                key={i}
                x={80} y={1650 + i * 40}
                fill="#ff444466"
                fontSize={18}
                fontFamily="monospace"
              >
                {line}
              </text>
            ))}
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

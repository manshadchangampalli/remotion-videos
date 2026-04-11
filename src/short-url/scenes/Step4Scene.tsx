import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Background } from "./Background";

const ServerIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      <rect x={-28} y={-32} width={56} height={64} rx={6} fill={`${color}15`} stroke={color} strokeWidth={2.5} />
      {[-20, -4, 12].map((y, i) => (
        <g key={i}>
          <rect x={-22} y={y} width={32} height={9} rx={2} fill={`${color}22`} stroke={color} strokeWidth={1} />
          <circle cx={18} cy={y + 4.5} r={4} fill={color} opacity={0.9} />
        </g>
      ))}
    </g>
  );
};

const LaptopIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      <rect x={-30} y={-22} width={60} height={42} rx={6} fill={`${color}18`} stroke={color} strokeWidth={2.5} />
      <rect x={-22} y={-15} width={44} height={28} rx={3} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <line x1={-14} y1={-8} x2={14} y2={-8} stroke={color} strokeWidth={1.5} strokeOpacity={0.6} />
      <line x1={-14} y1={-1} x2={8} y2={-1} stroke={color} strokeWidth={1.5} strokeOpacity={0.4} />
      <line x1={-40} y1={20} x2={40} y2={20} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <rect x={-12} y={20} width={24} height={5} rx={2.5} fill={color} />
    </g>
  );
};

const SERVER = { x: 800, y: 400 };
const LAPTOP = { x: 280, y: 400 };
const lineLen = Math.sqrt((SERVER.x - LAPTOP.x) ** 2 + (SERVER.y - LAPTOP.y) ** 2);

// Card positions
const CARD_301 = { x: 100, y: 960 };
const CARD_302 = { x: 640, y: 960 };
const CARD_W = 340;
const CARD_H = 520;

export const Step4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Nodes appear (frame 2-25)
  const serverScale = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 180 } });
  const laptopScale = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 180 } });

  // Purple line: Server → Laptop (frame 20-45)
  const mainLineProgress = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineDashOffset = lineLen * (1 - Math.max(0, Math.min(1, mainLineProgress)));

  // "HTTP STATUS CODE" label (frame 35-50)
  const statusLabelOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Comparison cards appear
  // 301 card (frame 50-80)
  const card301Scale = spring({ frame: frame - 50, fps, config: { damping: 10, stiffness: 180 } });
  const card301Opacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 302 card (frame 80-110)
  const card302Scale = spring({ frame: frame - 80, fps, config: { damping: 10, stiffness: 180 } });
  const card302Opacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "302 WINS" highlight pulse (frame 160+)
  const card302Pulse = frame > 160
    ? Math.sin((frame - 160) * 0.15) * 0.25 + 0.75
    : 1;

  // Moving packet animation
  const packetProgress = frame > 80 ? ((frame - 80) % 70) / 70 : -1;

  // "vs" divider appears (frame 128)
  const vsOpacity = interpolate(frame, [128, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Analytics chart bars (frame 200+)
  const chartProgress = interpolate(frame, [200, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chartBars = [0.35, 0.55, 0.72, 0.88, 1.0];

  return (
    <AbsoluteFill style={{ opacity: sceneIn }}>
      <Background />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* STEP 4 title */}
        <text
          x="540" y="80"
          textAnchor="middle"
          fill="#a78bfa"
          fontSize="52"
          fontWeight="900"
          fontFamily="monospace"
          filter="url(#glow)"
        >
          STEP 4 — THE REDIRECT
        </text>

        {/* ===== NODES ===== */}
        {/* Server */}
        <g transform={`translate(${SERVER.x}, ${SERVER.y}) scale(${serverScale * 1.4})`}>
          <circle cx={0} cy={0} r={78} fill="#a78bfa08" stroke="#a78bfa" strokeWidth={2} filter="url(#glow)" />
          <ServerIcon color="#a78bfa" size={84} />
        </g>
        <text x={SERVER.x} y={SERVER.y + 180} textAnchor="middle" fill="#a78bfa" fontSize="32" fontWeight="800" fontFamily="monospace" opacity={serverScale} filter="url(#glow)">
          WEB SERVER
        </text>
 
        {/* Laptop */}
        <g transform={`translate(${LAPTOP.x}, ${LAPTOP.y}) scale(${laptopScale * 1.4})`}>
          <circle cx={0} cy={0} r={78} fill="#00f5ff08" stroke="#00f5ff" strokeWidth={2} filter="url(#glow)" />
          <LaptopIcon color="#00f5ff" size={84} />
        </g>
        <text x={LAPTOP.x} y={LAPTOP.y + 180} textAnchor="middle" fill="#00f5ff" fontSize={32} fontWeight="800" fontFamily="monospace" opacity={laptopScale} filter="url(#glow)">
          YOUR BROWSER
        </text>

        {/* ===== PURPLE LINE: Server → Laptop ===== */}
        {mainLineProgress > 0 && (
          <g>
            <line
              x1={SERVER.x - 80} y1={SERVER.y}
              x2={LAPTOP.x + 80} y2={LAPTOP.y}
              stroke="#a78bfa" strokeWidth={16} strokeOpacity={0.1}
              strokeLinecap="round"
            />
            <line
              x1={SERVER.x - 80} y1={SERVER.y}
              x2={LAPTOP.x + 80} y2={LAPTOP.y}
              stroke="#a78bfa" strokeWidth={5}
              strokeDasharray={`${lineLen}`}
              strokeDashoffset={lineDashOffset}
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </g>
        )}

        {/* Moving packet Server → Laptop */}
        {packetProgress >= 0 && mainLineProgress > 0.5 && (
          <g>
            <circle
              cx={SERVER.x - 80 + (LAPTOP.x + 80 - SERVER.x + 80) * packetProgress}
              cy={SERVER.y}
              r={12} fill="#a78bfa30" stroke="#a78bfa" strokeWidth={1.5}
            />
            <circle
              cx={SERVER.x - 80 + (LAPTOP.x + 80 - SERVER.x + 80) * packetProgress}
              cy={SERVER.y}
              r={5} fill="#a78bfa" filter="url(#glow)"
            />
          </g>
        )}

        {/* HTTP Status label on the line */}
        {statusLabelOpacity > 0 && (
          <g opacity={statusLabelOpacity}>
            <rect x={320} y={280} width={440} height={60} rx={10} fill="#a78bfa18" stroke="#a78bfa44" strokeWidth={1.5} />
            <text x={540} y={318} textAnchor="middle" fill="#a78bfa" fontSize={30} fontFamily="monospace" fontWeight="700" filter="url(#softGlow)">
              HTTP Status Code →
            </text>
          </g>
        )}

        {/* ===== VS DIVIDER ===== */}
        {vsOpacity > 0 && (
          <g opacity={vsOpacity}>
            <line x1={540} y1={900} x2={540} y2={1840} stroke="#334155" strokeWidth={1.5} strokeDasharray="8,5" />
            <rect x={500} y={1150} width={80} height={44} rx={22} fill="#1e293b" stroke="#334155" strokeWidth={1.5} />
            <text x={540} y={1178} textAnchor="middle" fill="#94a3b8" fontSize={24} fontWeight="900" fontFamily="monospace">
              VS
            </text>
          </g>
        )}

        {/* ===== 301 CARD ===== */}
        {card301Opacity > 0 && (
          <g opacity={card301Opacity} transform={`translate(${CARD_301.x}, ${CARD_301.y}) scale(${card301Scale})`}>
            {/* Card bg */}
            <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={20}
              fill="#1c0a0a" stroke="#ef444466" strokeWidth={2}
            />
            {/* Header band */}
            <rect x={0} y={0} width={CARD_W} height={70} rx={20} fill="#ef444418" />
            <rect x={0} y={50} width={CARD_W} height={20} fill="#ef444418" />

            {/* 301 badge */}
            <rect x={20} y={16} width={120} height={44} rx={10} fill="#ef4444" />
            <text x={80} y={48} textAnchor="middle" fill="white" fontSize={28} fontWeight="900" fontFamily="monospace">
              301
            </text>
            <text x={220} y={48} textAnchor="middle" fill="#ef4444" fontSize={22} fontWeight="700" fontFamily="monospace">
              PERMANENT
            </text>

            {/* Padlock icon */}
            <g transform="translate(170, 160)">
              <rect x={-30} y={5} width={60} height={50} rx={8} fill="#ef444422" stroke="#ef4444" strokeWidth={2.5} />
              <path d="M -18 5 Q -18 -30 0 -30 Q 18 -30 18 5" fill="none" stroke="#ef4444" strokeWidth={2.5} />
              <circle cx={0} cy={26} r={8} fill="#ef4444" opacity={0.8} />
              <line x1={0} y1={26} x2={0} y2={38} stroke="#ef4444" strokeWidth={2.5} />
            </g>

            {/* Local folder */}
            <g transform="translate(170, 290)">
              <rect x={-35} y={-8} width={70} height={50} rx={6} fill="#ef444422" stroke="#ef4444" strokeWidth={2} />
              <rect x={-35} y={-20} width={30} height={16} rx={4} fill="#ef444433" stroke="#ef4444" strokeWidth={1.5} />
              <line x1={-22} y1={12} x2={22} y2={12} stroke="#ef4444" strokeWidth={1.5} strokeOpacity={0.6} />
              <line x1={-22} y1={22} x2={14} y2={22} stroke="#ef4444" strokeWidth={1.5} strokeOpacity={0.4} />
            </g>

            {/* Description text */}
            <text x={170} y={380} textAnchor="middle" fill="#ef4444cc" fontSize={19} fontFamily="monospace">Browser caches redirect</text>
            <text x={170} y={406} textAnchor="middle" fill="#ef4444aa" fontSize={19} fontFamily="monospace">locally. Never hits</text>
            <text x={170} y={432} textAnchor="middle" fill="#ef4444aa" fontSize={19} fontFamily="monospace">your server again.</text>

            {/* ❌ */}
            <text x={170} y={480} textAnchor="middle" fill="#ef4444" fontSize={32} filter="url(#glow)">❌ Lose tracking</text>

            {/* Crossed out analytics */}
            <rect x={20} y={445} width={CARD_W - 40} height={58} rx={10} fill="#ef444415" stroke="#ef444430" strokeWidth={1} />
            <line x1={20} y1={474} x2={CARD_W - 20} y2={474} stroke="#ef4444" strokeWidth={2} strokeOpacity={0.5} />
          </g>
        )}

        {/* ===== 302 CARD ===== */}
        {card302Opacity > 0 && (
          <g opacity={card302Opacity} transform={`translate(${CARD_302.x}, ${CARD_302.y}) scale(${card302Scale})`}>
            {/* Glow aura for winner */}
            <rect x={-8} y={-8} width={CARD_W + 16} height={CARD_H + 16} rx={24}
              fill="none" stroke="#22c55e" strokeWidth={3}
              opacity={card302Pulse * 0.6}
              filter="url(#glow)"
            />

            {/* Card bg */}
            <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={20}
              fill="#0a1c0e" stroke="#22c55e88" strokeWidth={2}
            />
            {/* Header band */}
            <rect x={0} y={0} width={CARD_W} height={70} rx={20} fill="#22c55e18" />
            <rect x={0} y={50} width={CARD_W} height={20} fill="#22c55e18" />

            {/* 302 badge */}
            <rect x={20} y={16} width={120} height={44} rx={10} fill="#22c55e" filter="url(#glow)" />
            <text x={80} y={48} textAnchor="middle" fill="white" fontSize={28} fontWeight="900" fontFamily="monospace">
              302
            </text>
            <text x={220} y={48} textAnchor="middle" fill="#22c55e" fontSize={22} fontWeight="700" fontFamily="monospace">
              TEMPORARY
            </text>

            {/* Refresh arrow icon */}
            <g transform="translate(170, 165)">
              <circle cx={0} cy={0} r={38} fill="#22c55e15" stroke="#22c55e" strokeWidth={2.5} />
              <path d="M -22 -12 Q -30 0 -22 14 Q -10 25 6 25" fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" />
              <path d="M 22 12 Q 30 0 22 -14 Q 10 -25 -6 -25" fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" />
              <polygon points="-4,22 10,30 10,14" fill="#22c55e" />
              <polygon points="4,-22 -10,-30 -10,-14" fill="#22c55e" />
            </g>

            {/* Analytics rising chart */}
            <g transform="translate(50, 280)">
              {chartBars.map((h, i) => {
                const barH = Math.min(h, chartProgress) * 70;
                const barX = i * 48;
                const barY = 70 - barH;
                return (
                  <g key={i}>
                    <rect
                      x={barX} y={barY}
                      width={36} height={barH}
                      rx={4}
                      fill="#22c55e"
                      opacity={0.3 + h * 0.5}
                      filter="url(#softGlow)"
                    />
                  </g>
                );
              })}
              <line x1={0} y1={72} x2={240} y2={72} stroke="#22c55e44" strokeWidth={1.5} />
              <text x={120} y={94} textAnchor="middle" fill="#22c55e" fontSize={14} fontFamily="monospace">
                ANALYTICS TRACKING
              </text>
            </g>

            {/* "$" dollar sign — monetization */}
            <text x={170} y={430} textAnchor="middle" fill="#22c55e" fontSize={44} fontWeight="900" filter="url(#glow)" opacity={card302Pulse}>
              💰
            </text>

            {/* Description text */}
            <text x={170} y={470} textAnchor="middle" fill="#22c55ecc" fontSize={19} fontFamily="monospace">Every click hits server.</text>
            <text x={170} y={496} textAnchor="middle" fill="#22c55eaa" fontSize={19} fontFamily="monospace">Full analytics + revenue.</text>

            {/* ✓ */}
            <text x={170} y={530} textAnchor="middle" fill="#22c55e" fontSize={28} fontWeight="900" fontFamily="monospace" filter="url(#glow)">
              ✓ ALWAYS USE 302
            </text>
          </g>
        )}

        {/* "USE THIS" arrow pointing to 302 */}
        {card302Opacity > 0.8 && (
          <g opacity={Math.min(1, (card302Opacity - 0.8) * 5) * card302Pulse}>
            <text x={880} y={855} textAnchor="middle" fill="#22c55e" fontSize={28} filter="url(#glow)">
              ↗
            </text>
            <text x={880} y={888} textAnchor="middle" fill="#22c55e" fontSize={19} fontFamily="monospace" fontWeight="700" filter="url(#softGlow)">
              USE THIS
            </text>
          </g>
        )}

        {/* "NOT THIS" label over 301 */}
        {card301Opacity > 0.8 && card302Opacity > 0 && (
          <g opacity={Math.min(1, card302Opacity) * 0.8}>
            <text x={350} y={855} textAnchor="middle" fill="#ef4444" fontSize={19} fontFamily="monospace" fontWeight="700">
              AVOID THIS ↗
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

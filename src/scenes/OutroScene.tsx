import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Background } from "./Background";

// Compact icons for the overview
const MiniLaptop: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <rect x={-20} y={-14} width={40} height={28} rx={4} fill={`${color}18`} stroke={color} strokeWidth={2} />
    <rect x={-14} y={-9} width={28} height={18} rx={2} fill={`${color}22`} />
    <line x1={-26} y1={14} x2={26} y2={14} stroke={color} strokeWidth={3} strokeLinecap="round" />
  </g>
);

const MiniLB: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <circle cx={0} cy={-10} r={9} fill={`${color}22`} stroke={color} strokeWidth={2} />
    <text x={0} y={-7} textAnchor="middle" fill={color} fontSize={8} fontWeight="900" fontFamily="monospace">LB</text>
    {[-14, 0, 14].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy={12} r={6} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
        <line x1={0} y1={-1} x2={x} y2={6} stroke={color} strokeWidth={1.5} strokeDasharray="3,2" />
      </g>
    ))}
  </g>
);

const MiniServer: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <rect x={-18} y={-20} width={36} height={40} rx={4} fill={`${color}15`} stroke={color} strokeWidth={1.8} />
    {[-12, -2, 8].map((y, i) => (
      <g key={i}>
        <rect x={-13} y={y} width={20} height={6} rx={1.5} fill={`${color}22`} stroke={color} strokeWidth={0.8} />
        <circle cx={12} cy={y + 3} r={3} fill={color} opacity={0.9} />
      </g>
    ))}
  </g>
);

const MiniRedis: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill={`${color}18`} stroke={color} strokeWidth={2} />
    <text x={0} y={3} textAnchor="middle" fill={color} fontSize={8} fontWeight="900" fontFamily="monospace">REDIS</text>
  </g>
);

const MiniDB: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <ellipse cx={0} cy={-18} rx={22} ry={8} fill={`${color}25`} stroke={color} strokeWidth={2} />
    <rect x={-22} y={-18} width={44} height={36} fill={`${color}15`} />
    <ellipse cx={0} cy={18} rx={22} ry={8} fill={`${color}20`} stroke={color} strokeWidth={2} />
    <line x1={-22} y1={-18} x2={-22} y2={18} stroke={color} strokeWidth={2} />
    <line x1={22} y1={-18} x2={22} y2={18} stroke={color} strokeWidth={2} />
  </g>
);

// Spinning loading indicator for laptop
const LoadingSpinner: React.FC<{ x: number; y: number; progress: number; color: string }> = ({ x, y, progress, color }) => {
  const arcEnd = progress * 360;
  const r = 22;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const endX = x + r * Math.cos(toRad(arcEnd - 90));
  const endY = y + r * Math.sin(toRad(arcEnd - 90));
  const largeArc = arcEnd > 180 ? 1 : 0;
  return (
    <g filter="url(#glow)">
      <circle cx={x} cy={y} r={r} fill="none" stroke={`${color}22`} strokeWidth={4} />
      <path
        d={`M ${x} ${y - r} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  );
};

// Positions for the miniaturized full architecture
const O_LAPTOP = { x: 540, y: 220 };
const O_LB = { x: 540, y: 550 };
const O_SERVERS = [
  { x: 180, y: 870 },
  { x: 360, y: 870 },
  { x: 540, y: 870 },
  { x: 720, y: 870 },
  { x: 900, y: 870 },
];
const O_REDIS = { x: 340, y: 1200 };
const O_DB = { x: 740, y: 1200 };

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in entire scene
  const sceneIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Everything appears together (spring reveal)
  const revealScale = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });

  // Pulsing animation for all lines (sinusoidal)
  const pulse = Math.sin(frame * 0.12) * 0.35 + 0.65;
  const pulse2 = Math.sin(frame * 0.12 + Math.PI) * 0.35 + 0.65;

  // Laptop loading → redirect animation
  const loadingProgress = interpolate(frame, [15, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkmarkOpacity = interpolate(frame, [68, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Moving packets on all routes simultaneously
  const globalPacket1 = ((frame * 1.2) % 80) / 80;
  const globalPacket2 = ((frame * 1.2 + 30) % 80) / 80;
  const globalPacket3 = ((frame * 1.2 + 55) % 80) / 80;

  // "302 REDIRECT" final banner (frame 60+)
  const bannerOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const serverColors = ["#06b6d4", "#22d3ee", "#38bdf8", "#60a5fa", "#818cf8"];

  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, pulseVal: number, strokeWidth = 2) => {
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const offset = (frame * 2) % (len * 0.4);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth + 6} strokeOpacity={0.08 * pulseVal} strokeLinecap="round" />
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${len * 0.15},${len * 0.25}`}
          strokeDashoffset={-offset}
          strokeLinecap="round"
          opacity={pulseVal}
          filter="url(#glow)"
        />
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: sceneIn }}>
      <Background />

      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(540, 960) scale(${revealScale}) translate(-540, -960)`}>
          {/* ===== CONNECTION LINES (drawn first, behind nodes) ===== */}

          {/* Laptop → Load Balancer */}
          {drawLine(O_LAPTOP.x, O_LAPTOP.y + 52, O_LB.x, O_LB.y - 55, "#00f5ff", pulse, 2.5)}

          {/* Load Balancer → each Server */}
          {O_SERVERS.map((srv, i) =>
            drawLine(O_LB.x + (srv.x - O_LB.x) * 0.1, O_LB.y + 52, srv.x, srv.y - 42, serverColors[i], pulse2, 2)
          )}

          {/* Servers → Redis (center server) */}
          {drawLine(O_SERVERS[2].x, O_SERVERS[2].y + 42, O_REDIS.x, O_REDIS.y - 44, "#f97316", pulse, 2)}

          {/* Servers → DB (center server) */}
          {drawLine(O_SERVERS[2].x, O_SERVERS[2].y + 42, O_DB.x, O_DB.y - 44, "#22c55e", pulse2, 2)}

          {/* ===== MOVING PACKETS ===== */}
          {/* Laptop → LB packet */}
          {(() => {
            const p = globalPacket1;
            const cx = O_LAPTOP.x + (O_LB.x - O_LAPTOP.x) * p;
            const cy = (O_LAPTOP.y + 52) + (O_LB.y - 55 - O_LAPTOP.y - 52) * p;
            return <circle cx={cx} cy={cy} r={5} fill="#00f5ff" filter="url(#glow)" opacity={Math.sin(p * Math.PI)} />;
          })()}

          {/* LB → Server 3 packet */}
          {(() => {
            const srv = O_SERVERS[2];
            const p = globalPacket2;
            const cx = O_LB.x + (srv.x - O_LB.x) * p;
            const cy = (O_LB.y + 52) + (srv.y - 42 - O_LB.y - 52) * p;
            return <circle cx={cx} cy={cy} r={5} fill="#38bdf8" filter="url(#glow)" opacity={Math.sin(p * Math.PI)} />;
          })()}

          {/* Server → Redis packet */}
          {(() => {
            const srv = O_SERVERS[2];
            const p = globalPacket3;
            const cx = srv.x + (O_REDIS.x - srv.x) * p;
            const cy = (srv.y + 42) + (O_REDIS.y - 44 - srv.y - 42) * p;
            return <circle cx={cx} cy={cy} r={4} fill="#f97316" filter="url(#glow)" opacity={Math.sin(p * Math.PI)} />;
          })()}

          {/* ===== NODES ===== */}

          {/* Laptop with loading/redirect animation */}
          <g transform={`translate(${O_LAPTOP.x}, ${O_LAPTOP.y})`}>
            <circle cx={0} cy={0} r={52} fill="#00f5ff0a" stroke="#00f5ff" strokeWidth={2} filter="url(#glow)" />
            <MiniLaptop color="#00f5ff" />
            {/* Loading spinner overlaid */}
            {loadingProgress < 1 && (
              <LoadingSpinner x={0} y={-45} progress={loadingProgress} color="#00f5ff" />
            )}
            {/* Checkmark when done */}
            {checkmarkOpacity > 0 && (
              <text x={0} y={-32} textAnchor="middle" fill="#00ff88" fontSize={28} fontWeight="900" opacity={checkmarkOpacity} filter="url(#glow)">
                ✓
              </text>
            )}
          </g>
          <text x={O_LAPTOP.x} y={O_LAPTOP.y + 72} textAnchor="middle" fill="#00f5ff" fontSize={16} fontWeight="800" fontFamily="monospace" filter="url(#glow)">
            BROWSER
          </text>

          {/* Load Balancer */}
          <g transform={`translate(${O_LB.x}, ${O_LB.y})`}>
            <circle cx={0} cy={0} r={55} fill="#facc1508" stroke="#facc15" strokeWidth={2} filter="url(#glow)" />
            <MiniLB color="#facc15" />
          </g>
          <text x={O_LB.x} y={O_LB.y + 74} textAnchor="middle" fill="#facc15" fontSize={15} fontWeight="800" fontFamily="monospace" filter="url(#glow)">
            LOAD BALANCER
          </text>

          {/* 5 Web Servers */}
          {O_SERVERS.map((srv, i) => (
            <g key={i}>
              <g transform={`translate(${srv.x}, ${srv.y})`}>
                <circle cx={0} cy={0} r={44} fill={`${serverColors[i]}0a`} stroke={serverColors[i]} strokeWidth={1.5} filter="url(#glow)" />
                <MiniServer color={serverColors[i]} />
              </g>
              <text x={srv.x} y={srv.y + 60} textAnchor="middle" fill={serverColors[i]} fontSize={12} fontWeight="700" fontFamily="monospace">
                SRV {i + 1}
              </text>
            </g>
          ))}

          {/* Redis */}
          <g transform={`translate(${O_REDIS.x}, ${O_REDIS.y})`}>
            <circle cx={0} cy={0} r={50} fill="#ff222208" stroke="#ff4444" strokeWidth={1.8} filter="url(#glow)" />
            <MiniRedis color="#ff4444" />
          </g>
          <text x={O_REDIS.x} y={O_REDIS.y + 68} textAnchor="middle" fill="#ff4444" fontSize={14} fontWeight="800" fontFamily="monospace" filter="url(#glow)">
            REDIS
          </text>

          {/* Database */}
          <g transform={`translate(${O_DB.x}, ${O_DB.y})`}>
            <circle cx={0} cy={0} r={50} fill="#22c55e08" stroke="#22c55e" strokeWidth={1.8} filter="url(#glow)" />
            <MiniDB color="#22c55e" />
          </g>
          <text x={O_DB.x} y={O_DB.y + 68} textAnchor="middle" fill="#22c55e" fontSize={14} fontWeight="800" fontFamily="monospace" filter="url(#glow)">
            NoSQL DB
          </text>
        </g>

        {/* ===== FINAL BANNER: 302 REDIRECT ===== */}
        {bannerOpacity > 0 && (
          <g opacity={bannerOpacity}>
            <rect x={80} y={1380} width={920} height={90} rx={20}
              fill="#a78bfa18" stroke="#a78bfa" strokeWidth={2}
              filter="url(#glow)"
            />
            <text x={540} y={1427} textAnchor="middle" fill="#a78bfa" fontSize={30} fontWeight="900" fontFamily="monospace" filter="url(#glow)">
              302 REDIRECT → USER ARRIVES ✓
            </text>
            <text x={540} y={1458} textAnchor="middle" fill="#a78bfa88" fontSize={19} fontFamily="monospace">
              analytics tracked · redirect fired · server stays in control
            </text>
          </g>
        )}

        {/* "FOLLOW for more System Design" outro text */}
        {bannerOpacity > 0 && (
          <g opacity={bannerOpacity}>
            <text x={540} y={1560} textAnchor="middle" fill="#475569" fontSize={22} fontFamily="monospace" letterSpacing={3}>
              🔔 FOLLOW FOR MORE
            </text>
            <text x={540} y={1596} textAnchor="middle" fill="#334155" fontSize={19} fontFamily="monospace" letterSpacing={2}>
              SYSTEM DESIGN EXPLAINED
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

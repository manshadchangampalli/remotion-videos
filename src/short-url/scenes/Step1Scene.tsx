import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Background } from "./Background";

// Node icon components
const LaptopIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      <rect x={-30} y={-22} width={60} height={42} rx={6} fill={`${color}18`} stroke={color} strokeWidth={2.5} />
      <rect x={-22} y={-15} width={44} height={28} rx={3} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      {/* Screen content lines */}
      <line x1={-14} y1={-8} x2={14} y2={-8} stroke={color} strokeWidth={1.5} strokeOpacity={0.6} />
      <line x1={-14} y1={-1} x2={8} y2={-1} stroke={color} strokeWidth={1.5} strokeOpacity={0.4} />
      <line x1={-14} y1={6} x2={10} y2={6} stroke={color} strokeWidth={1.5} strokeOpacity={0.4} />
      {/* Base */}
      <line x1={-40} y1={20} x2={40} y2={20} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <rect x={-12} y={20} width={24} height={5} rx={2.5} fill={color} />
    </g>
  );
};

const LoadBalancerIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      {/* Central hub */}
      <circle cx={0} cy={-16} r={14} fill={`${color}22`} stroke={color} strokeWidth={2.5} />
      <text x={0} y={-12} textAnchor="middle" fill={color} fontSize={13} fontWeight="900" fontFamily="monospace">LB</text>
      {/* Distribution dots */}
      {[-24, 0, 24].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={22} r={9} fill={`${color}22`} stroke={color} strokeWidth={1.8} />
          <line x1={0} y1={-2} x2={x} y2={13} stroke={color} strokeWidth={1.8} strokeDasharray="4,2.5" />
        </g>
      ))}
    </g>
  );
};

const ServerIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      <rect x={-28} y={-32} width={56} height={64} rx={6} fill={`${color}15`} stroke={color} strokeWidth={2.5} />
      {/* Server rows */}
      {[-20, -4, 12].map((y, i) => (
        <g key={i}>
          <rect x={-22} y={y} width={32} height={9} rx={2} fill={`${color}22`} stroke={color} strokeWidth={1} />
          <circle cx={18} cy={y + 4.5} r={4} fill={color} opacity={0.9} />
        </g>
      ))}
      <line x1={-22} y1={28} x2={22} y2={28} stroke={color} strokeWidth={1.2} strokeOpacity={0.5} />
    </g>
  );
};

// Animated line that draws from start to end
interface AnimLineProps {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  progress: number;
  strokeWidth?: number;
}

const AnimLine: React.FC<AnimLineProps> = ({ x1, y1, x2, y2, color, progress, strokeWidth = 3 }) => {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dashOffset = len * (1 - Math.max(0, Math.min(1, progress)));
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth + 10} strokeOpacity={0.1} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth + 4} strokeOpacity={0.18} strokeLinecap="round" />
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${len}`} strokeDashoffset={dashOffset}
        strokeLinecap="round"
        filter="url(#glow)"
      />
    </g>
  );
};

// Moving packet dot along a line
const MovingPacket: React.FC<{ x1: number; y1: number; x2: number; y2: number; progress: number; color: string }> = ({
  x1, y1, x2, y2, progress, color,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const cx = x1 + (x2 - x1) * p;
  const cy = y1 + (y2 - y1) * p;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.25} />
      <circle cx={cx} cy={cy} r={5} fill={color} filter="url(#glow)" />
    </g>
  );
};

// Layout constants
const LAPTOP = { x: 540, y: 260 };
const LB = { x: 540, y: 820 };
const SERVERS = [
  { x: 180, y: 1430 },
  { x: 360, y: 1430 },
  { x: 540, y: 1430 },
  { x: 720, y: 1430 },
  { x: 900, y: 1430 },
];

export const Step1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Laptop appears (frame 8-28)
  const laptopScale = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 120 } });

  // CHAOS PHASE (frame 20-90): Many red lines hit a single "OVERLOADED" server
  const chaosVisible = frame >= 20 && frame <= 108;
  const chaosOpacity = interpolate(frame, [20, 30, 95, 108], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Chaos server shaking
  const chaosShakeX = chaosVisible ? Math.sin(frame * 2.5) * interpolate(frame, [20, 40, 95, 108], [0, 10, 12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) : 0;
  const chaosShakeY = chaosVisible ? Math.cos(frame * 1.8) * 4 : 0;

  // CORRECTION PHASE: Load Balancer appears (frame 80-110)
  const lbScale = spring({ frame: frame - 82, fps, config: { damping: 10, stiffness: 180 } });
  const lbOpacity = interpolate(frame, [82, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
 
  // Line from Laptop → Load Balancer (frame 105-135)
  const laptopToLBProgress = interpolate(frame, [105, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const laptopToLBPacket = interpolate(frame, [135, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Five servers appear (staggered from frame 140-190)
  const serverScales = SERVERS.map((_, i) =>
    spring({ frame: frame - (140 + i * 10), fps, config: { damping: 10, stiffness: 200 } })
  );
  const serverOpacities = SERVERS.map((_, i) =>
    interpolate(frame, [140 + i * 10, 152 + i * 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Lines from Load Balancer → each server (staggered from frame 170-220)
  const lbToServerProgress = SERVERS.map((_, i) =>
    interpolate(frame, [170 + i * 12, 195 + i * 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Moving packets along established lines (frame 290+)
  const packetPhase = interpolate(frame, [290, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const packetProgress = frame > 310
    ? (((frame - 310) % 60) / 60)
    : 0;

  // Label texts timing
  const labelOpacity = interpolate(frame, [158, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "STEP 1" title
  const titleOpacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          <filter id="redGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* STEP 1 title */}
        <text
          x="540"
          y="80"
          textAnchor="middle"
          fill="#00f5ff"
          fontSize="36"
          fontWeight="900"
          fontFamily="monospace"
          opacity={titleOpacity}
          filter="url(#glow)"
        >
          STEP 1 — THE REQUEST
        </text>

        {/* ===== CHAOS PHASE ===== */}
        {chaosVisible && (
          <g opacity={chaosOpacity}>
            {/* Chaos server (will be replaced by LB+servers) */}
            <g transform={`translate(${540 + chaosShakeX}, ${680 + chaosShakeY})`}>
              <circle cx={0} cy={0} r={60} fill="#ff000022" stroke="#ff3333" strokeWidth={2} filter="url(#redGlow)" />
              <ServerIcon color="#ff3333" size={65} />
              <text x={0} y={110} textAnchor="middle" fill="#ff3333" fontSize={20} fontWeight="900" fontFamily="monospace">
                SINGLE SERVER
              </text>
              <text x={0} y={115} textAnchor="middle" fill="#ff4444" fontSize={16} fontFamily="monospace" opacity={0.8}>
                ⚠ OVERLOADING...
              </text>
            </g>

            {/* Multiple red attack lines from laptop area */}
            {[...Array(6)].map((_, i) => {
              const angle = (i - 2.5) * 0.25;
              const startX = LAPTOP.x + Math.sin(angle) * 100;
              const startY = LAPTOP.y + 40;
              const t = ((frame - 20 + i * 8) % 30) / 30;
              return (
                <g key={i}>
                  <line
                    x1={startX} y1={startY}
                    x2={540 + Math.sin(angle) * 40} y2={625}
                    stroke="#ff3333"
                    strokeWidth={3}
                    strokeOpacity={Math.max(0, Math.sin(t * Math.PI))}
                    strokeDasharray="8,5"
                    strokeDashoffset={-t * 80}
                    filter="url(#redGlow)"
                  />
                </g>
              );
            })}

            {/* "CRASH!" text */}
            {frame > 45 && frame < 100 && (
              <text
                x={540 + chaosShakeX}
                y={555}
                textAnchor="middle"
                fill="#ff3333"
                fontSize={38}
                fontWeight="900"
                fontFamily="monospace"
                opacity={Math.sin((frame - 45) * 0.18) * 0.5 + 0.5}
                filter="url(#redGlow)"
              >
                💥 MELTING DOWN
              </text>
            )}
          </g>
        )}

        {/* ===== PROPER FLOW ===== */}

        {/* Laptop node */}
        <g transform={`translate(${LAPTOP.x}, ${LAPTOP.y}) scale(${laptopScale})`}>
          <circle cx={0} cy={0} r={68} fill="#00f5ff0a" stroke="#00f5ff" strokeWidth={2} filter="url(#glow)" />
          <LaptopIcon color="#00f5ff" size={80} />
        </g>
        <text
          x={LAPTOP.x}
          y={LAPTOP.y + 150}
          textAnchor="middle"
          fill="#00f5ff"
          fontSize={22}
          fontWeight="800"
          fontFamily="monospace"
          opacity={laptopScale}
          filter="url(#glow)"
        >
          YOUR BROWSER
        </text>

        {/* Laptop → Load Balancer line */}
        {laptopToLBProgress > 0 && (
          <AnimLine
            x1={LAPTOP.x} y1={LAPTOP.y + 70}
            x2={LB.x} y2={LB.y - 72}
            color="#00f5ff" progress={laptopToLBProgress} strokeWidth={3.5}
          />
        )}

        {/* Moving packet on laptop→LB line */}
        {laptopToLBPacket > 0 && (
          <MovingPacket
            x1={LAPTOP.x} y1={LAPTOP.y + 70}
            x2={LB.x} y2={LB.y - 72}
            progress={packetProgress} color="#00f5ff"
          />
        )}

        {/* Load Balancer node */}
        <g transform={`translate(${LB.x}, ${LB.y}) scale(${lbScale})`} opacity={lbOpacity}>
          <circle cx={0} cy={0} r={72} fill="#facc1508" stroke="#facc15" strokeWidth={2} filter="url(#glow)" />
          <LoadBalancerIcon color="#facc15" size={85} />
        </g>
        {lbOpacity > 0 && (
          <text
            x={LB.x}
            y={LB.y + 160}
            textAnchor="middle"
            fill="#facc15"
            fontSize={22}
            fontWeight="800"
            fontFamily="monospace"
            opacity={lbOpacity}
            filter="url(#glow)"
          >
            LOAD BALANCER
          </text>
        )}

        {/* "TRAFFIC COP" label */}
        {labelOpacity > 0 && (
          <g opacity={labelOpacity}>
            <rect x={LB.x - 145} y={LB.y - 130} width={290} height={40} rx={10} fill="#facc1520" stroke="#facc1555" strokeWidth={1.5} />
            <text x={LB.x} y={LB.y - 104} textAnchor="middle" fill="#facc15" fontSize={18} fontFamily="monospace" fontWeight="700">
              🚦 Traffic Cop — Routes your click
            </text>
          </g>
        )}

        {/* ===== FIVE WEB SERVERS ===== */}
        {SERVERS.map((srv, i) => {
          const colors = ["#06b6d4", "#22d3ee", "#38bdf8", "#60a5fa", "#818cf8"];
          const c = colors[i];
          return (
            <g key={i}>
              {/* LB → Server lines */}
              {lbToServerProgress[i] > 0 && (
                <AnimLine
                  x1={LB.x + (srv.x - LB.x) * 0.12}
                  y1={LB.y + 72}
                  x2={srv.x}
                  y2={srv.y - 65}
                  color={c}
                  progress={lbToServerProgress[i]}
                  strokeWidth={2.5}
                />
              )}
              {/* Moving packets per server */}
              {packetPhase > 0 && (
                <MovingPacket
                  x1={LB.x + (srv.x - LB.x) * 0.12}
                  y1={LB.y + 72}
                  x2={srv.x}
                  y2={srv.y - 65}
                  progress={((packetProgress + i * 0.18) % 1)}
                  color={c}
                />
              )}
              {/* Server node */}
              <g
                transform={`translate(${srv.x}, ${srv.y}) scale(${serverScales[i]})`}
                opacity={serverOpacities[i]}
              >
                <circle cx={0} cy={0} r={62} fill={`${c}0a`} stroke={c} strokeWidth={1.8} filter="url(#glow)" />
                <ServerIcon color={c} size={68} />
              </g>
              <text
                x={srv.x}
                y={srv.y + 140}
                textAnchor="middle"
                fill={c}
                fontSize={17}
                fontWeight="700"
                fontFamily="monospace"
                opacity={serverOpacities[i]}
              >
                SERVER {i + 1}
              </text>
            </g>
          );
        })}

        {/* "Viral link = millions of clicks" annotation */}
        {frame > 60 && frame < 110 && (
          <g opacity={chaosOpacity}>
            <rect x={60} y={400} width={440} height={72} rx={12} fill="#ff333318" stroke="#ff333344" strokeWidth={1.5} />
            <text x={280} y={428} textAnchor="middle" fill="#ff5555" fontSize={18} fontFamily="monospace" fontWeight="700">
              ⚠ LINK GOES VIRAL
            </text>
            <text x={280} y={454} textAnchor="middle" fill="#ff444488" fontSize={16} fontFamily="monospace">
              Millions of clicks → single server MELTS
            </text>
          </g>
        )}

        {/* "Least busy server" annotation after LB appears */}
        {lbOpacity > 0.8 && labelOpacity > 0 && (
          <g opacity={Math.min(1, lbOpacity * labelOpacity)}>
            <rect x={60} y={1320} width={420} height={50} rx={10} fill="#22d3ee18" stroke="#22d3ee44" strokeWidth={1} />
            <text x={270} y={1350} textAnchor="middle" fill="#22d3ee" fontSize={17} fontFamily="monospace">
              Routes to least busy server
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

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

const RedisCubeIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      {/* Cube top face */}
      <polygon
        points="0,-38 33,-19 33,19 0,38 -33,19 -33,-19"
        fill={`${color}18`} stroke={color} strokeWidth={2.5}
      />
      {/* Inner diamond for Redis logo feel */}
      <polygon
        points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
        fill={`${color}30`} stroke={color} strokeWidth={1.5}
      />
      {/* REDIS label */}
      <text x={0} y={5} textAnchor="middle" fill={color} fontSize={13} fontWeight="900" fontFamily="monospace">
        REDIS
      </text>
    </g>
  );
};

// Layout
const SERVER = { x: 540, y: 360 };
const REDIS = { x: 540, y: 1320 };

export const Step2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Server zooms in (simulates "camera zooms into one server")
  const serverScale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 100 } });

  // "IN-MEMORY CACHE" subtitle
  const subtitleOpacity = interpolate(frame, [12, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Redis cube appears (frame 20-50)
  const redisScale = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 110 } });
  const redisOpacity = interpolate(frame, [20, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Orange line: Server → Redis (frame 50-90)
  const lineToRedisProgress = interpolate(frame, [52, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineLength = Math.sqrt((REDIS.x - SERVER.x) ** 2 + (REDIS.y - SERVER.y) ** 2);
  const lineDashOffset = lineLength * (1 - Math.max(0, Math.min(1, lineToRedisProgress)));

  // HIT! badge appears (frame 92-160)
  const hitOpacity = interpolate(frame, [92, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hitScale = spring({ frame: frame - 92, fps, config: { damping: 8, stiffness: 200 } });
  // Hit badge pulse
  const hitPulse = frame > 105
    ? Math.sin((frame - 105) * 0.2) * 0.15 + 0.85
    : hitScale;

  // Return line: Redis → Server (frame 108-145)
  const lineBackProgress = interpolate(frame, [108, 143], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Return line goes from Redis to Server (reverse)
  const lineBackDashOffset = lineLength * (1 - Math.max(0, Math.min(1, lineBackProgress)));

  // "LIGHTNING FAST" label (frame 148+)
  const fastLabelOpacity = interpolate(frame, [148, 162], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Redis glow pulse
  const redisPulse = frame > 92
    ? Math.sin((frame - 92) * 0.15) * 0.4 + 0.6
    : 1;

  // Moving packet Server→Redis
  const packetToRedis = frame >= 52 && frame <= 110
    ? interpolate(frame, [52, 94], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : -1;

  // Moving packet Redis→Server
  const packetBack = frame >= 108 && frame <= 160
    ? interpolate(frame, [108, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : -1;

  // Continuous ping animation after everything is set up (frame 180+)
  const pingPhase = frame > 200 ? ((frame - 200) % 80) / 80 : -1;

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
          <filter id="hitGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="redisGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5e5e" stopOpacity={0.3 * redisPulse} />
            <stop offset="100%" stopColor="#ff2222" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* STEP 2 title */}
        <text
          x="540" y="80"
          textAnchor="middle"
          fill="#f97316"
          fontSize="36"
          fontWeight="900"
          fontFamily="monospace"
          opacity={subtitleOpacity}
          filter="url(#glow)"
        >
          STEP 2 — THE CACHE
        </text>

        {/* "Zoom into one web server" context */}
        <text
          x="540" y="128"
          textAnchor="middle"
          fill="#64748b"
          fontSize="21"
          fontFamily="monospace"
          opacity={subtitleOpacity}
        >
          [ zooming into Web Server #3 ]
        </text>

        {/* ===== WEB SERVER ===== */}
        <g transform={`translate(${SERVER.x}, ${SERVER.y}) scale(${serverScale})`}>
          <circle cx={0} cy={0} r={90} fill="#38bdf808" stroke="#38bdf8" strokeWidth={2} filter="url(#glow)" />
          <ServerIcon color="#38bdf8" size={95} />
        </g>
        <text
          x={SERVER.x} y={SERVER.y + 165}
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="24"
          fontWeight="800"
          fontFamily="monospace"
          opacity={serverScale}
          filter="url(#glow)"
        >
          WEB SERVER
        </text>

        {/* "Checking cache first..." annotation */}
        {frame > 40 && lineToRedisProgress > 0 && (
          <g opacity={Math.min(1, lineToRedisProgress * 3)}>
            <rect x={580} y={300} width={400} height={46} rx={10} fill="#f9731620" stroke="#f9731640" strokeWidth={1.5} />
            <text x={780} y={328} textAnchor="middle" fill="#f97316" fontSize={19} fontFamily="monospace" fontWeight="700">
              🔍 Checking cache first...
            </text>
          </g>
        )}

        {/* ===== CONNECTION LINE: Server → Redis ===== */}
        {lineToRedisProgress > 0 && (
          <g>
            {/* Glow layer */}
            <line
              x1={SERVER.x} y1={SERVER.y + 92}
              x2={REDIS.x} y2={REDIS.y - 82}
              stroke="#f97316" strokeWidth={14} strokeOpacity={0.12}
              strokeLinecap="round"
            />
            {/* Main line */}
            <line
              x1={SERVER.x} y1={SERVER.y + 92}
              x2={REDIS.x} y2={REDIS.y - 82}
              stroke="#f97316" strokeWidth={4}
              strokeDasharray={`${lineLength}`}
              strokeDashoffset={lineDashOffset}
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </g>
        )}

        {/* Moving packet Server → Redis */}
        {packetToRedis >= 0 && packetToRedis <= 1 && (
          <g>
            <circle
              cx={SERVER.x + (REDIS.x - SERVER.x) * packetToRedis}
              cy={SERVER.y + 92 + (REDIS.y - 82 - SERVER.y - 92) * packetToRedis}
              r={12} fill="#f97316" opacity={0.3}
            />
            <circle
              cx={SERVER.x + (REDIS.x - SERVER.x) * packetToRedis}
              cy={SERVER.y + 92 + (REDIS.y - 82 - SERVER.y - 92) * packetToRedis}
              r={6} fill="#f97316" filter="url(#glow)"
            />
          </g>
        )}

        {/* ===== RETURN LINE: Redis → Server ===== */}
        {lineBackProgress > 0 && (
          <g>
            <line
              x1={REDIS.x} y1={REDIS.y - 82}
              x2={SERVER.x} y2={SERVER.y + 92}
              stroke="#00ff88" strokeWidth={14} strokeOpacity={0.12}
              strokeLinecap="round"
            />
            <line
              x1={REDIS.x} y1={REDIS.y - 82}
              x2={SERVER.x} y2={SERVER.y + 115}
              stroke="#00ff88" strokeWidth={4}
              strokeDasharray={`${lineLength}`}
              strokeDashoffset={lineBackDashOffset}
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </g>
        )}

        {/* Moving packet back */}
        {packetBack >= 0 && packetBack <= 1 && (
          <g>
            <circle
              cx={REDIS.x + (SERVER.x - REDIS.x) * packetBack}
              cy={REDIS.y - 82 + (SERVER.y + 115 - REDIS.y + 82) * packetBack}
              r={12} fill="#00ff88" opacity={0.3}
            />
            <circle
              cx={REDIS.x + (SERVER.x - REDIS.x) * packetBack}
              cy={REDIS.y - 82 + (SERVER.y + 115 - REDIS.y + 82) * packetBack}
              r={6} fill="#00ff88" filter="url(#glow)"
            />
          </g>
        )}

        {/* Continuous ping animation */}
        {pingPhase >= 0 && (
          <g>
            <circle
              cx={SERVER.x + (REDIS.x - SERVER.x) * pingPhase}
              cy={SERVER.y + 115 + (REDIS.y - 82 - SERVER.y - 110) * pingPhase}
              r={6} fill="#f97316" filter="url(#glow)"
              opacity={Math.sin(pingPhase * Math.PI) * 0.8}
            />
          </g>
        )}

        {/* ===== REDIS CACHE ===== */}
        {/* Glow aura behind Redis */}
        <circle cx={REDIS.x} cy={REDIS.y} r={160} fill="url(#redisGrad)" />

        <g transform={`translate(${REDIS.x}, ${REDIS.y}) scale(${redisScale})`} opacity={redisOpacity}>
          <circle cx={0} cy={0} r={95} fill={`#ff222208`} stroke="#ff4444" strokeWidth={2.2} filter="url(#glow)" />
          <RedisCubeIcon color="#ff4444" size={100} />
        </g>
        <text
          x={REDIS.x} y={REDIS.y + 175}
          textAnchor="middle"
          fill="#ff4444"
          fontSize="24"
          fontWeight="800"
          fontFamily="monospace"
          opacity={redisOpacity}
          filter="url(#glow)"
        >
          REDIS CACHE
        </text>
        <text
          x={REDIS.x} y={REDIS.y + 215}
          textAnchor="middle"
          fill="#ff444488"
          fontSize="19"
          fontFamily="monospace"
          opacity={redisOpacity}
        >
          in-memory • nanosecond access
        </text>

        {/* ===== "HIT!" BADGE ===== */}
        {hitOpacity > 0 && (
          <g opacity={hitOpacity}>
            {/* Explosion circles */}
            <circle cx={REDIS.x} cy={REDIS.y - 140} r={55 * hitPulse} fill="#00ff8808" stroke="#00ff8840" strokeWidth={2} />
            <circle cx={REDIS.x} cy={REDIS.y - 140} r={35 * hitPulse} fill="#00ff8815" stroke="#00ff88" strokeWidth={1.5} filter="url(#glow)" />
            {/* HIT badge */}
            <rect
              x={REDIS.x - 90} y={REDIS.y - 220}
              width={180} height={64}
              rx={16}
              fill="#00ff88"
              opacity={hitPulse}
              filter="url(#hitGlow)"
            />
            <text
              x={REDIS.x} y={REDIS.y - 178}
              textAnchor="middle"
              fill="#052e16"
              fontSize="38"
              fontWeight="900"
              fontFamily="monospace"
            >
              ⚡ CACHE HIT!
            </text>
            {/* Stars/sparks */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const r = 110;
              const sx = REDIS.x + Math.cos((angle * Math.PI) / 180) * r;
              const sy = REDIS.y - 140 + Math.sin((angle * Math.PI) / 180) * r * 0.5;
              return (
                <text key={i} x={sx} y={sy} textAnchor="middle" fill="#00ff88" fontSize={20} opacity={hitPulse * 0.7} filter="url(#glow)">
                  ✦
                </text>
              );
            })}
          </g>
        )}

        {/* "LIGHTNING FAST" label */}
        {fastLabelOpacity > 0 && (
          <g opacity={fastLabelOpacity}>
            <rect x={160} y={830} width={760} height={58} rx={14} fill="#00ff8815" stroke="#00ff8840" strokeWidth={1.5} />
            <text x={540} y={867} textAnchor="middle" fill="#00ff88" fontSize={24} fontWeight="900" fontFamily="monospace" filter="url(#glow)">
              ⚡ REDIRECT IN MILLISECONDS
            </text>
          </g>
        )}

        {/* Speed indicator */}
        {lineBackProgress > 0.5 && (
          <g opacity={Math.min(1, (lineBackProgress - 0.5) * 3)}>
            <text x={660} y={860} fill="#00ff88" fontSize={18} fontFamily="monospace" opacity={0.7}>
              ~0.3ms
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

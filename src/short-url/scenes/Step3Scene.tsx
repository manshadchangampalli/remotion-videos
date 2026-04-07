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
      <polygon points="0,-38 33,-19 33,19 0,38 -33,19 -33,-19" fill={`${color}18`} stroke={color} strokeWidth={2.5} />
      <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill={`${color}30`} stroke={color} strokeWidth={1.5} />
      <text x={0} y={5} textAnchor="middle" fill={color} fontSize={13} fontWeight="900" fontFamily="monospace">REDIS</text>
    </g>
  );
};

const DatabaseIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      {/* Top ellipse */}
      <ellipse cx={0} cy={-28} rx={34} ry={12} fill={`${color}30`} stroke={color} strokeWidth={2.5} />
      {/* Body */}
      <rect x={-34} y={-28} width={68} height={56} fill={`${color}15`} />
      {/* Bottom ellipse */}
      <ellipse cx={0} cy={28} rx={34} ry={12} fill={`${color}25`} stroke={color} strokeWidth={2.5} />
      {/* Side lines */}
      <line x1={-34} y1={-28} x2={-34} y2={28} stroke={color} strokeWidth={2.5} />
      <line x1={34} y1={-28} x2={34} y2={28} stroke={color} strokeWidth={2.5} />
      {/* Data lines */}
      <ellipse cx={0} cy={-10} rx={34} ry={12} fill="none" stroke={color} strokeWidth={1.2} strokeDasharray="5,3" />
      <ellipse cx={0} cy={10} rx={34} ry={12} fill="none" stroke={color} strokeWidth={1.2} strokeDasharray="5,3" />
    </g>
  );
};

// Layout constants
const SERVER = { x: 540, y: 290 };
const REDIS = { x: 240, y: 960 };
const DB = { x: 840, y: 960 };
const TABLE_Y = 570;

// Key-value table entries
const TABLE_ENTRIES = [
  { key: "abc123", value: "https://youtube.com/watch?v=...", active: false },
  { key: "xK9mZ", value: "https://amazon.com/product/...", active: true },
  { key: "h7Rp2", value: "https://github.com/user/repo", active: false },
];

export const Step3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Server appears (frame 5-30)
  const serverScale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 110 } });

  // Redis (dim, bypassed) appears (frame 20-45)
  const redisScale = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 110 } });
  const redisOpacity = interpolate(frame, [20, 42], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Database appears (frame 25-52)
  const dbScale = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 110 } });
  const dbOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "MISS" line from server — goes toward Redis but diverts to DB (frame 55-120)
  // First, draw a dotted "miss" line toward Redis
  const missProgress = interpolate(frame, [55, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const missOpacity = interpolate(frame, [55, 70, 120, 135], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "MISS" badge on Redis
  const missBadgeOpacity = interpolate(frame, [88, 100, 130, 145], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line Server → Database (frame 100-140)
  const lineToDBProgress = interpolate(frame, [100, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Database lights up (frame 140+)
  const dbGlow = interpolate(frame, [138, 158], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Holographic table appears (frame 148-185)
  const tableOpacity = interpolate(frame, [148, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tableScale = spring({ frame: frame - 148, fps, config: { damping: 14, stiffness: 110 } });

  // "FOUND IT!" (frame 190-230)
  const foundOpacity = interpolate(frame, [190, 204], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line DB → Redis (saving to cache) (frame 218-255)
  const lineDBToRedisProgress = interpolate(frame, [218, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Redis lights up after save
  const redisSavedOpacity = interpolate(frame, [250, 268], [0.45, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line DB → Server (return) (frame 268-305)
  const lineDBToServerProgress = interpolate(frame, [268, 305], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "CACHED FOR NEXT USER" label (frame 305+)
  const cachedLabelOpacity = interpolate(frame, [305, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Helpers: line lengths
  const serverToRedisLen = Math.sqrt((REDIS.x - SERVER.x) ** 2 + (REDIS.y - SERVER.y) ** 2);
  const serverToDBLen = Math.sqrt((DB.x - SERVER.x) ** 2 + (DB.y - SERVER.y) ** 2);
  const dbToRedisLen = Math.sqrt((DB.x - REDIS.x) ** 2 + (DB.y - REDIS.y) ** 2);
  const dbToServerLen = Math.sqrt((SERVER.x - DB.x) ** 2 + (SERVER.y - DB.y) ** 2);

  // Data packet: DB → Redis
  const packetDBRedis = lineDBToRedisProgress >= 0 && lineDBToRedisProgress <= 1
    ? lineDBToRedisProgress
    : -1;

  // Data packet: DB → Server
  const packetDBServer = lineDBToServerProgress >= 0 && lineDBToServerProgress <= 1
    ? lineDBToServerProgress
    : -1;

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
          <filter id="tableGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* STEP 3 title */}
        <text
          x="540" y="80"
          textAnchor="middle"
          fill="#22d3ee"
          fontSize="36"
          fontWeight="900"
          fontFamily="monospace"
          filter="url(#glow)"
        >
          STEP 3 — THE DATABASE
        </text>

        {/* ===== MISS LINE: Server → Redis (dotted, bypassed) ===== */}
        {missProgress > 0 && (
          <g opacity={missOpacity}>
            <line
              x1={SERVER.x} y1={SERVER.y + 75}
              x2={REDIS.x + 60} y2={REDIS.y - 72}
              stroke="#f97316" strokeWidth={3}
              strokeDasharray="12,8"
              strokeDashoffset={-serverToRedisLen * (1 - missProgress)}
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* X mark at Redis side */}
            {missProgress > 0.8 && (
              <text x={REDIS.x + 80} y={REDIS.y - 60} fill="#ff4444" fontSize={34} fontWeight="900" opacity={missOpacity} filter="url(#glow)">
                ✕
              </text>
            )}
          </g>
        )}

        {/* "CACHE MISS" badge on Redis */}
        {missBadgeOpacity > 0 && (
          <g opacity={missBadgeOpacity}>
            <rect x={REDIS.x - 90} y={REDIS.y - 185} width={180} height={44} rx={10} fill="#ff444422" stroke="#ff4444" strokeWidth={1.5} />
            <text x={REDIS.x} y={REDIS.y - 156} textAnchor="middle" fill="#ff4444" fontSize={20} fontWeight="900" fontFamily="monospace" filter="url(#glow)">
              CACHE MISS
            </text>
          </g>
        )}

        {/* ===== LINE: Server → Database ===== */}
        {lineToDBProgress > 0 && (
          <g>
            <line
              x1={SERVER.x} y1={SERVER.y + 75}
              x2={DB.x - 60} y2={DB.y - 72}
              stroke="#f97316" strokeWidth={14} strokeOpacity={0.1}
              strokeLinecap="round"
            />
            <line
              x1={SERVER.x} y1={SERVER.y + 75}
              x2={DB.x - 60} y2={DB.y - 72}
              stroke="#f97316" strokeWidth={4}
              strokeDasharray={`${serverToDBLen}`}
              strokeDashoffset={serverToDBLen * (1 - lineToDBProgress)}
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* Moving packet */}
            {lineToDBProgress > 0 && lineToDBProgress < 1 && (
              <circle
                cx={SERVER.x + (DB.x - 60 - SERVER.x) * lineToDBProgress}
                cy={SERVER.y + 75 + (DB.y - 72 - SERVER.y - 75) * lineToDBProgress}
                r={7} fill="#f97316" filter="url(#glow)"
              />
            )}
          </g>
        )}

        {/* ===== LINE: DB → Redis (saving data packet) ===== */}
        {lineDBToRedisProgress > 0 && (
          <g>
            <line
              x1={DB.x - 60} y1={DB.y}
              x2={REDIS.x + 60} y2={REDIS.y}
              stroke="#00ff88" strokeWidth={14} strokeOpacity={0.1}
              strokeLinecap="round"
            />
            <line
              x1={DB.x - 60} y1={DB.y}
              x2={REDIS.x + 60} y2={REDIS.y}
              stroke="#00ff88" strokeWidth={3.5}
              strokeDasharray={`${dbToRedisLen}`}
              strokeDashoffset={dbToRedisLen * (1 - lineDBToRedisProgress)}
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* Glowing data packet */}
            {packetDBRedis >= 0 && (
              <g>
                <circle
                  cx={DB.x - 60 + (REDIS.x + 60 - DB.x + 60) * packetDBRedis}
                  cy={DB.y + (REDIS.y - DB.y) * packetDBRedis}
                  r={14} fill="#00ff8820" stroke="#00ff88" strokeWidth={1.5}
                />
                <circle
                  cx={DB.x - 60 + (REDIS.x + 60 - DB.x + 60) * packetDBRedis}
                  cy={DB.y + (REDIS.y - DB.y) * packetDBRedis}
                  r={6} fill="#00ff88" filter="url(#glow)"
                />
                <text
                  x={DB.x - 60 + (REDIS.x + 60 - DB.x + 60) * packetDBRedis}
                  y={DB.y + (REDIS.y - DB.y) * packetDBRedis - 22}
                  textAnchor="middle"
                  fill="#00ff88"
                  fontSize={14}
                  fontFamily="monospace"
                  filter="url(#glow)"
                >
                  data
                </text>
              </g>
            )}
          </g>
        )}

        {/* ===== LINE: DB → Server (return result) ===== */}
        {lineDBToServerProgress > 0 && (
          <g>
            <line
              x1={DB.x - 60} y1={DB.y - 72}
              x2={SERVER.x} y2={SERVER.y + 75}
              stroke="#a78bfa" strokeWidth={14} strokeOpacity={0.1}
              strokeLinecap="round"
            />
            <line
              x1={DB.x - 60} y1={DB.y - 72}
              x2={SERVER.x} y2={SERVER.y + 75}
              stroke="#a78bfa" strokeWidth={4}
              strokeDasharray={`${dbToServerLen}`}
              strokeDashoffset={dbToServerLen * (1 - lineDBToServerProgress)}
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {packetDBServer >= 0 && (
              <circle
                cx={DB.x - 60 + (SERVER.x - DB.x + 60) * packetDBServer}
                cy={DB.y - 72 + (SERVER.y + 75 - DB.y + 72) * packetDBServer}
                r={6} fill="#a78bfa" filter="url(#glow)"
              />
            )}
          </g>
        )}

        {/* ===== WEB SERVER ===== */}
        <g transform={`translate(${SERVER.x}, ${SERVER.y}) scale(${serverScale})`}>
          <circle cx={0} cy={0} r={82} fill="#38bdf808" stroke="#38bdf8" strokeWidth={2} filter="url(#glow)" />
          <ServerIcon color="#38bdf8" size={88} />
        </g>
        <text
          x={SERVER.x} y={SERVER.y + 160}
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="22"
          fontWeight="800"
          fontFamily="monospace"
          opacity={serverScale}
          filter="url(#glow)"
        >
          WEB SERVER
        </text>

        {/* ===== REDIS (dim/bypassed initially) ===== */}
        <g transform={`translate(${REDIS.x}, ${REDIS.y}) scale(${redisScale})`} opacity={Math.max(redisOpacity, redisSavedOpacity)}>
          <circle cx={0} cy={0} r={80} fill="#ff222208" stroke="#ff4444" strokeWidth={1.8} filter="url(#glow)" />
          <RedisCubeIcon color="#ff4444" size={88} />
        </g>
        <text
          x={REDIS.x} y={REDIS.y + 155}
          textAnchor="middle"
          fill="#ff4444"
          fontSize="21"
          fontWeight="800"
          fontFamily="monospace"
          opacity={Math.max(redisOpacity, redisSavedOpacity)}
          filter="url(#glow)"
        >
          REDIS CACHE
        </text>

        {/* "CACHED FOR NEXT USER" label on Redis */}
        {cachedLabelOpacity > 0 && (
          <g opacity={cachedLabelOpacity}>
            <rect x={REDIS.x - 115} y={REDIS.y - 195} width={230} height={52} rx={10} fill="#00ff8818" stroke="#00ff8840" strokeWidth={1.5} />
            <text x={REDIS.x} y={REDIS.y - 179} textAnchor="middle" fill="#00ff88" fontSize={16} fontFamily="monospace" fontWeight="700">
              ✓ SAVED FOR
            </text>
            <text x={REDIS.x} y={REDIS.y - 158} textAnchor="middle" fill="#00ff88" fontSize={16} fontFamily="monospace" fontWeight="700">
              NEXT VISITOR
            </text>
          </g>
        )}

        {/* ===== DATABASE ===== */}
        <g transform={`translate(${DB.x}, ${DB.y}) scale(${dbScale})`} opacity={dbOpacity}>
          <circle cx={0} cy={0} r={88}
            fill={dbGlow > 0 ? `rgba(34,197,94,${0.06 + dbGlow * 0.08})` : "#16a34a08"}
            stroke={dbGlow > 0 ? "#22c55e" : "#16a34a"}
            strokeWidth={dbGlow > 0 ? 2.5 : 1.8}
            filter="url(#glow)"
          />
          <DatabaseIcon color={dbGlow > 0 ? "#22c55e" : "#16a34a"} size={90} />
        </g>
        <text
          x={DB.x} y={DB.y + 168}
          textAnchor="middle"
          fill={dbGlow > 0 ? "#22c55e" : "#16a34a"}
          fontSize="21"
          fontWeight="800"
          fontFamily="monospace"
          opacity={dbOpacity}
          filter="url(#glow)"
        >
          NoSQL DATABASE
        </text>
        <text
          x={DB.x} y={DB.y + 205}
          textAnchor="middle"
          fill="#16a34a88"
          fontSize="17"
          fontFamily="monospace"
          opacity={dbOpacity}
        >
          key • value store
        </text>

        {/* ===== HOLOGRAPHIC KEY-VALUE TABLE ===== */}
        {tableOpacity > 0 && (
          <g
            opacity={tableOpacity}
            transform={`translate(${DB.x}, ${TABLE_Y}) scale(${tableScale})`}
          >
            {/* Table container */}
            <rect x={-220} y={-120} width={440} height={240} rx={16}
              fill="#001a0a" stroke="#22c55e" strokeWidth={2} filter="url(#tableGlow)"
            />
            {/* Table header */}
            <rect x={-220} y={-120} width={440} height={44} rx={16} fill="#22c55e18" />
            <line x1={-220} y1={-76} x2={220} y2={-76} stroke="#22c55e" strokeWidth={1} strokeOpacity={0.5} />
            <text x={-110} y={-92} textAnchor="middle" fill="#22c55e" fontSize={16} fontWeight="900" fontFamily="monospace">
              SHORT-CODE
            </text>
            <text x={90} y={-92} textAnchor="middle" fill="#22c55e" fontSize={16} fontWeight="900" fontFamily="monospace">
              LONG-URL
            </text>
            <line x1={-10} y1={-120} x2={-10} y2={120} stroke="#22c55e" strokeWidth={1} strokeOpacity={0.3} />

            {/* Table rows */}
            {TABLE_ENTRIES.map((entry, i) => {
              const rowY = -56 + i * 56;
              const rowOpacity = tableOpacity > 0 ? interpolate(frame, [148 + i * 10, 165 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) : 0;
              return (
                <g key={i} opacity={rowOpacity}>
                  {entry.active && (
                    <rect x={-220} y={rowY - 16} width={440} height={38} rx={6}
                      fill="#22c55e22" stroke="#22c55e44" strokeWidth={1}
                    />
                  )}
                  <text x={-110} y={rowY + 8} textAnchor="middle"
                    fill={entry.active ? "#4ade80" : "#22c55e99"}
                    fontSize={15} fontFamily="monospace" fontWeight={entry.active ? "900" : "400"}
                  >
                    {entry.key}
                  </text>
                  <text x={90} y={rowY + 8} textAnchor="middle"
                    fill={entry.active ? "#bbf7d0" : "#22c55e66"}
                    fontSize={13} fontFamily="monospace"
                  >
                    {entry.value.slice(0, 22)}...
                  </text>
                  {entry.active && (
                    <text x={185} y={rowY + 8} textAnchor="middle" fill="#4ade80" fontSize={18} filter="url(#glow)">
                      ←
                    </text>
                  )}
                </g>
              );
            })}

            {/* "DICTIONARY" label */}
            <text x={0} y={142} textAnchor="middle" fill="#22c55e55" fontSize={14} fontFamily="monospace">
              MASSIVE KEY-VALUE DICTIONARY
            </text>
          </g>
        )}

        {/* "FOUND IT!" badge */}
        {foundOpacity > 0 && (
          <g opacity={foundOpacity}>
            <rect x={DB.x - 95} y={DB.y - 210} width={190} height={52} rx={12}
              fill="#22c55e" filter="url(#glow)"
            />
            <text x={DB.x} y={DB.y - 177} textAnchor="middle"
              fill="#052e16" fontSize={26} fontWeight="900" fontFamily="monospace"
            >
              ✓ FOUND!
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

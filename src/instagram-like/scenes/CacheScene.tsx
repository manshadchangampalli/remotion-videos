import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const CacheScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [545, 579], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Duration: 579 frames (~19.3s)

  // Event stream (left side) appears
  const streamScale = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 130 } });

  // Beam draws from stream to cache
  const beamProgress = interpolate(frame, [40, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cache board appears
  const cacheScale = spring({ frame: frame - 95, fps, config: { damping: 10, stiffness: 140 } });

  // Counter updates
  const cachedCount = Math.floor(interpolate(frame, [110, 520], [4200000, 5000000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t,
  }));

  // Worker appears
  const workerScale = spring({ frame: frame - 30, fps, config: { damping: 11, stiffness: 140 } });

  // Badge
  const badgeScale = spring({ frame: frame - 200, fps, config: { damping: 10, stiffness: 130 } });

  // INSTANT READ flash
  const instantOpacity = interpolate(frame, [130, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Data packets from stream to cache
  const STREAM_X = 200;
  const STREAM_Y = 900;
  const CACHE_X = 860;
  const CACHE_Y = 700;
  const WORKER_X = 540;
  const WORKER_Y = 780;

  const packetCycle = frame > 100 ? frame - 100 : -1;
  const PACKET_LEN = 38;

  const beamPulse = Math.sin(frame * 0.14) * 0.25 + 0.75;

  // Display tick animation
  const displayTick = frame > 110
    ? Math.abs(Math.sin((frame - 110) * 0.08)) * 8
    : 0;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 70% 35%, rgba(252,175,69,0.12) 0%, rgba(5,9,20,1) 65%)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="cacheGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cacheStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="22" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cacheGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCAF45" />
            <stop offset="100%" stopColor="#F77737" />
          </linearGradient>
          <linearGradient id="beamCacheGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C13584" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#FCAF45" stopOpacity={0.9} />
          </linearGradient>
        </defs>

        {/* Title */}
        <rect x={0} y={30} width={1080} height={120} fill="rgba(5,9,20,0.9)" />
        <text x={540} y={85} textAnchor="middle"
          fill="url(#cacheGrad)" fontSize={52}
          fontWeight="900" fontFamily="monospace" letterSpacing={3}
          filter="url(#cacheGlow)"
        >
          REDIS CACHE
        </text>
        <text x={540} y={130} textAnchor="middle"
          fill="rgba(252,175,69,0.7)" fontSize={24} fontFamily="monospace">
          (Sub-millisecond reads — permanent leaderboard)
        </text>
        <line x1={0} y1={150} x2={1080} y2={150} stroke="url(#cacheGrad)" strokeWidth={2} strokeOpacity={0.6} />

        {/* ─── EVENT STREAM NODE (left) ─── */}
        <g transform={`translate(${STREAM_X}, ${STREAM_Y}) scale(${streamScale * 1.1})`} opacity={streamScale}>
          <rect x={-85} y={-110} width={170} height={220} rx={12}
            fill="rgba(193,53,132,0.10)"
            stroke="#C13584" strokeWidth={2.5}
            filter="url(#cacheGlow)"
          />
          {/* Log lines */}
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i}
              x={-65} y={-90 + i * 26}
              width={130 - (i % 3) * 20} height={14} rx={4}
              fill="rgba(193,53,132,0.25)"
            />
          ))}
          <text x={0} y={135} textAnchor="middle"
            fill="#C13584" fontSize={26}
            fontWeight="900" fontFamily="monospace"
            filter="url(#cacheGlow)"
          >
            THE QUEUE
          </text>
          <text x={0} y={152} textAnchor="middle"
            fill="rgba(193,53,132,0.6)" fontSize={16}
            fontFamily="monospace"
          >
            endless log
          </text>
        </g>

        {/* ─── FAST WORKER ─── */}
        <g transform={`translate(${WORKER_X}, ${WORKER_Y}) scale(${workerScale * 1.3})`} opacity={workerScale}>
          <circle cx={0} cy={0} r={60}
            fill="rgba(252,175,69,0.15)"
            stroke="#FCAF45" strokeWidth={3}
            filter="url(#cacheGlow)"
          />
          <text x={0} y={22} textAnchor="middle" fontSize={64}>⚡</text>
          <text x={0} y={90} textAnchor="middle"
            fill="#FCAF45" fontSize={22}
            fontWeight="800" fontFamily="monospace"
          >
            FAST WORKER
          </text>
        </g>

        {/* ─── BEAM: Stream → Worker → Cache ─── */}
        {beamProgress > 0 && (
          <g>
            {/* Stream to Worker */}
            <line
              x1={STREAM_X + 85}
              y1={STREAM_Y}
              x2={STREAM_X + 85 + (WORKER_X - STREAM_X - 140) * Math.min(1, beamProgress * 2)}
              y2={STREAM_Y + (WORKER_Y - STREAM_Y) * Math.min(1, beamProgress * 2)}
              stroke="url(#beamCacheGrad)" strokeWidth={14} strokeOpacity={0.1} strokeLinecap="round"
            />
            <line
              x1={STREAM_X + 85} y1={STREAM_Y}
              x2={STREAM_X + 85 + (WORKER_X - STREAM_X - 140) * Math.min(1, beamProgress * 2)}
              y2={STREAM_Y + (WORKER_Y - STREAM_Y) * Math.min(1, beamProgress * 2)}
              stroke="url(#beamCacheGrad)" strokeWidth={2.5} strokeLinecap="round"
              opacity={0.7} strokeDasharray="8,5"
              filter="url(#cacheGlow)"
            />
            {/* Worker to Cache */}
            {beamProgress > 0.5 && (
              <>
                <line
                  x1={WORKER_X + 55} y1={WORKER_Y}
                  x2={WORKER_X + 55 + (CACHE_X - WORKER_X - 110) * ((beamProgress - 0.5) * 2)}
                  y2={WORKER_Y + (CACHE_Y - WORKER_Y) * ((beamProgress - 0.5) * 2)}
                  stroke="url(#beamCacheGrad)" strokeWidth={14} strokeOpacity={0.1} strokeLinecap="round"
                />
                <line
                  x1={WORKER_X + 55} y1={WORKER_Y}
                  x2={WORKER_X + 55 + (CACHE_X - WORKER_X - 110) * ((beamProgress - 0.5) * 2)}
                  y2={WORKER_Y + (CACHE_Y - WORKER_Y) * ((beamProgress - 0.5) * 2)}
                  stroke="url(#beamCacheGrad)" strokeWidth={2.5} strokeLinecap="round"
                  opacity={beamPulse * 0.8} strokeDasharray="8,5"
                  filter="url(#cacheGlow)"
                />
              </>
            )}
          </g>
        )}

        {/* ─── Traveling packets ─── */}
        {packetCycle >= 0 && (
          <>
            {/* Stream → Worker packet */}
            {(() => {
              const p1 = ((packetCycle) % PACKET_LEN) / PACKET_LEN;
              const p1End = p1 * 0.5; // first half of path
              return p1End <= 0.5 ? (
                <g>
                  <circle
                    cx={STREAM_X + 85 + (WORKER_X - STREAM_X - 140) * (p1End / 0.5)}
                    cy={STREAM_Y + (WORKER_Y - STREAM_Y) * (p1End / 0.5)}
                    r={12} fill="#C13584" opacity={0.25}
                  />
                  <circle
                    cx={STREAM_X + 85 + (WORKER_X - STREAM_X - 140) * (p1End / 0.5)}
                    cy={STREAM_Y + (WORKER_Y - STREAM_Y) * (p1End / 0.5)}
                    r={6} fill="#E1306C"
                    filter="url(#cacheGlow)"
                    opacity={Math.sin(p1End * Math.PI * 2)}
                  />
                </g>
              ) : null;
            })()}

            {/* Worker → Cache packet */}
            {(() => {
              const p2 = ((packetCycle + PACKET_LEN / 2) % PACKET_LEN) / PACKET_LEN;
              return (
                <g>
                  <circle
                    cx={WORKER_X + 55 + (CACHE_X - WORKER_X - 110) * p2}
                    cy={WORKER_Y + (CACHE_Y - WORKER_Y) * p2}
                    r={12} fill="#FCAF45" opacity={0.25}
                  />
                  <circle
                    cx={WORKER_X + 55 + (CACHE_X - WORKER_X - 110) * p2}
                    cy={WORKER_Y + (CACHE_Y - WORKER_Y) * p2}
                    r={6} fill="#FCAF45"
                    filter="url(#cacheGlow)"
                    opacity={Math.sin(p2 * Math.PI)}
                  />
                </g>
              );
            })()}
          </>
        )}

        {/* ─── CACHE / WHITEBOARD (right) ─── */}
        <g transform={`translate(${CACHE_X}, ${CACHE_Y}) scale(${cacheScale})`} opacity={cacheScale}>
          {/* Outer glow aura */}
          <rect x={-130} y={-160} width={260} height={320} rx={20}
            fill="none" stroke="#FCAF45" strokeWidth={1.5} opacity={0.2}
            filter="url(#cacheStrongGlow)"
          />
          {/* Main cache board */}
          <rect x={-110} y={-140} width={220} height={280} rx={16}
            fill="rgba(252,175,69,0.08)"
            stroke="#FCAF45" strokeWidth={3}
            filter="url(#cacheGlow)"
          />
          {/* Header */}
          <rect x={-110} y={-140} width={220} height={50} rx={16}
            fill="rgba(252,175,69,0.2)"
          />
          <rect x={-110} y={-108} width={220} height={18} fill="rgba(252,175,69,0.2)" />
          <text x={0} y={-108} textAnchor="middle"
            fill="#FCAF45" fontSize={22}
            fontWeight="900" fontFamily="monospace"
          >
            REDIS
          </text>

          {/* The big counter */}
          <text x={0} y={-40 - displayTick} textAnchor="middle"
            fill="white" fontSize={54}
            fontWeight="900" fontFamily="monospace"
            filter="url(#cacheStrongGlow)"
          >
            {(cachedCount / 1000000).toFixed(1)}M
          </text>

          {/* Label */}
          <text x={0} y={20} textAnchor="middle"
            fill="rgba(252,175,69,0.8)" fontSize={20}
            fontWeight="700" fontFamily="monospace"
          >
            ❤ LIKES
          </text>

          {/* Updating status */}
          <rect x={-80} y={40} width={160} height={36} rx={18}
            fill="rgba(0,220,100,0.12)" stroke="rgba(0,220,100,0.5)" strokeWidth={1.5}
          />
          <text x={0} y={64} textAnchor="middle"
            fill="rgba(0,220,100,0.9)" fontSize={17}
            fontFamily="monospace" fontWeight="700"
          >
            ⚡ LIVE
          </text>

          {/* Update flash */}
          {displayTick > 2 && (
            <circle cx={90} cy={-40} r={16}
              fill="#FCAF45" opacity={displayTick / 8}
              filter="url(#cacheStrongGlow)"
            />
          )}
        </g>

        {/* Cache label */}
        {cacheScale > 0.4 && (
          <g opacity={Math.min(1, (cacheScale - 0.4) * 1.7)}>
            <text x={CACHE_X} y={CACHE_Y + 175} textAnchor="middle"
              fill="#FCAF45" fontSize={22}
              fontWeight="900" fontFamily="monospace"
              filter="url(#cacheGlow)"
            >
              WHITEBOARD
            </text>
            <text x={CACHE_X} y={CACHE_Y + 202} textAnchor="middle"
              fill="rgba(252,175,69,0.6)" fontSize={16}
              fontFamily="monospace"
            >
              always up to date
            </text>
          </g>
        )}

        {/* INSTANT READ badge */}
        <g opacity={instantOpacity}>
          <rect x={640} y={1050} width={360} height={64} rx={32}
            fill="rgba(252,175,69,0.15)" stroke="#FCAF45" strokeWidth={2}
            filter="url(#cacheGlow)"
          />
          <text x={820} y={1091} textAnchor="middle"
            fill="#FCAF45" fontSize={26}
            fontWeight="900" fontFamily="monospace"
          >
            ⚡ INSTANT READ
          </text>
        </g>

        {/* Architecture note */}
        <g opacity={interpolate(frame, [250, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <rect x={40} y={1150} width={600} height={140} rx={16}
            fill="rgba(8,12,25,0.85)" stroke="rgba(252,175,69,0.2)" strokeWidth={1.5}
          />
          <text x={72} y={1192} fill="rgba(252,175,69,0.9)" fontSize={20}
            fontFamily="monospace" fontWeight="700"
          >
            Famous posts (e.g. Cristiano's):
          </text>
          <text x={72} y={1222} fill="rgba(148,163,184,0.8)" fontSize={18}
            fontFamily="monospace"
          >
            → Counter lives in cache permanently
          </text>
          <text x={72} y={1252} fill="rgba(148,163,184,0.8)" fontSize={18}
            fontFamily="monospace"
          >
            → Read in &lt;1ms · No database query needed
          </text>
        </g>

        {/* Badge */}
        <g transform={`translate(540, 1500) scale(${badgeScale})`} opacity={badgeScale}>
          <rect x={-360} y={-50} width={720} height={100} rx={50}
            fill="url(#cacheGrad)" filter="url(#cacheStrongGlow)"
          />
          <text x={0} y={16} textAnchor="middle" fill="white" fontSize={44}
            fontWeight="900" fontFamily="monospace"
          >
            ⚡ REDIS (INSTANT READ)
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

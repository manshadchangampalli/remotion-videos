import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const DatabaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [650, 683], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Duration: 683 frames (~22.8s)

  const STREAM_X = 200;
  const STREAM_Y = 780;
  const CLERK_X = 540;
  const CLERK_Y = 880;
  const DB_X = 840;
  const DB_Y = 680;

  // Event stream appears
  const streamScale = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 130 } });

  // Clerk appears
  const clerkScale = spring({ frame: frame - 25, fps, config: { damping: 11, stiffness: 130 } });

  // Beam stream → clerk
  const beam1Progress = interpolate(frame, [40, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bundles forming
  const bundleProgress = interpolate(frame, [90, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Number of bundled packets
  const bundleCount = Math.floor(bundleProgress * 8);

  // Beam clerk → DB
  const beam2Progress = interpolate(frame, [200, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // DB vault appears
  const dbScale = spring({ frame: frame - 255, fps, config: { damping: 8, stiffness: 110 } });

  // DB "thud" effect
  const dbThud = interpolate(frame, [265, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dbShake = frame >= 265 && frame <= 285
    ? Math.sin((frame - 265) * 1.5) * interpolate(frame, [265, 285], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Counter of likes saved
  const savedCount = Math.floor(interpolate(frame, [270, 640], [0, 4980000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => Math.pow(t, 0.7),
  }));

  // Badge
  const badgeScale = spring({ frame: frame - 350, fps, config: { damping: 10, stiffness: 120 } });

  // Batch cycle: every 90 frames, bundle gets inserted
  const batchPhase = frame > 200 ? ((frame - 200) % 110) / 110 : -1;

  const beamPulse = Math.sin(frame * 0.12) * 0.25 + 0.75;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 75% 35%, rgba(64,93,230,0.12) 0%, rgba(5,9,20,1) 65%)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="dbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dbStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="22" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#405DE6" />
            <stop offset="100%" stopColor="#00f5ff" />
          </linearGradient>
          <linearGradient id="dbVaultGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(64,93,230,0.25)" />
            <stop offset="100%" stopColor="rgba(0,245,255,0.12)" />
          </linearGradient>
        </defs>

        {/* Title */}
        <rect x={0} y={30} width={1080} height={120} fill="rgba(5,9,20,0.9)" />
        <text x={540} y={85} textAnchor="middle"
          fill="url(#dbGrad)" fontSize={52}
          fontWeight="900" fontFamily="monospace" letterSpacing={3}
          filter="url(#dbGlow)"
        >
          THE DATABASE
        </text>
        <text x={540} y={130} textAnchor="middle"
          fill="rgba(64,93,230,0.7)" fontSize={24} fontFamily="monospace">
          (The source of truth — persistent & secured)
        </text>
        <line x1={0} y1={150} x2={1080} y2={150} stroke="url(#dbGrad)" strokeWidth={2} strokeOpacity={0.6} />

        {/* ─── EVENT STREAM (left) ─── */}
        <g transform={`translate(${STREAM_X}, ${STREAM_Y}) scale(${streamScale})`} opacity={streamScale}>
          <rect x={-80} y={-100} width={160} height={200} rx={12}
            fill="rgba(193,53,132,0.10)"
            stroke="#C13584" strokeWidth={2.5}
            filter="url(#dbGlow)"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i}
              x={-58} y={-78 + i * 28}
              width={116 - (i % 3) * 20} height={14} rx={4}
              fill="rgba(193,53,132,0.25)"
            />
          ))}
          <text x={0} y={120} textAnchor="middle"
            fill="#C13584" fontSize={18}
            fontWeight="900" fontFamily="monospace"
            filter="url(#dbGlow)"
          >
            EVENT STREAM
          </text>
        </g>

        {/* ─── BEAM Stream → Clerk ─── */}
        {beam1Progress > 0 && (
          <g>
            <line
              x1={STREAM_X + 82} y1={STREAM_Y}
              x2={STREAM_X + 82 + (CLERK_X - STREAM_X - 140) * beam1Progress}
              y2={STREAM_Y + (CLERK_Y - STREAM_Y) * beam1Progress}
              stroke="#C13584" strokeWidth={12} strokeOpacity={0.08} strokeLinecap="round"
            />
            <line
              x1={STREAM_X + 82} y1={STREAM_Y}
              x2={STREAM_X + 82 + (CLERK_X - STREAM_X - 140) * beam1Progress}
              y2={STREAM_Y + (CLERK_Y - STREAM_Y) * beam1Progress}
              stroke="#C13584" strokeWidth={2} strokeLinecap="round"
              opacity={0.65} strokeDasharray="8,5"
            />
          </g>
        )}

        {/* Streaming data packets toward clerk */}
        {frame > 40 && frame < 200 && Array.from({ length: 4 }, (_, i) => {
          const offset = i * 22;
          const p = ((frame - 40 + offset) % 55) / 55;
          return (
            <circle key={i}
              cx={STREAM_X + 82 + (CLERK_X - STREAM_X - 140) * p}
              cy={STREAM_Y + (CLERK_Y - STREAM_Y) * p}
              r={8}
              fill="#C13584"
              opacity={Math.sin(p * Math.PI) * 0.9}
              filter="url(#dbGlow)"
            />
          );
        })}

        {/* ─── CLERK / WORKER ─── */}
        <g transform={`translate(${CLERK_X}, ${CLERK_Y}) scale(${clerkScale * 1.3})`} opacity={clerkScale}>
          <circle cx={0} cy={0} r={65}
            fill="rgba(64,93,230,0.15)"
            stroke="#405DE6" strokeWidth={3}
            filter="url(#dbGlow)"
          />
          <text x={0} y={22} textAnchor="middle" fontSize={64}>📋</text>
          <text x={0} y={95} textAnchor="middle"
            fill="#405DE6" fontSize={22}
            fontWeight="800" fontFamily="monospace"
          >
            STEADY CLERK
          </text>
          <text x={0} y={122} textAnchor="middle"
            fill="rgba(64,93,230,0.6)" fontSize={18}
            fontFamily="monospace"
          >
            batch processor
          </text>
        </g>

        {/* ─── BUNDLE FORMING ─── */}
        {bundleCount > 0 && (
          <g opacity={Math.min(1, bundleProgress * 3)}>
            {Array.from({ length: Math.min(bundleCount, 6) }, (_, i) => (
              <rect key={i}
                x={CLERK_X - 70 + i * 22}
                y={CLERK_Y - 160 - i * 8}
                width={50} height={35} rx={6}
                fill={`rgba(64,93,230,${0.15 + i * 0.04})`}
                stroke={`rgba(64,93,230,${0.4 + i * 0.06})`}
                strokeWidth={2}
                filter="url(#dbGlow)"
              />
            ))}
            {bundleCount >= 4 && (
              <text x={CLERK_X} y={CLERK_Y - 200} textAnchor="middle"
                fill="rgba(64,93,230,0.8)" fontSize={18}
                fontFamily="monospace" fontWeight="700"
              >
                bundling {bundleCount * 850}+ likes...
              </text>
            )}
          </g>
        )}

        {/* ─── BEAM Clerk → DB ─── */}
        {beam2Progress > 0 && (
          <g>
            <line
              x1={CLERK_X + 62} y1={CLERK_Y - 20}
              x2={CLERK_X + 62 + (DB_X - CLERK_X - 120) * beam2Progress}
              y2={(CLERK_Y - 20) + (DB_Y - CLERK_Y + 20) * beam2Progress}
              stroke="#405DE6" strokeWidth={16} strokeOpacity={0.08} strokeLinecap="round"
            />
            <line
              x1={CLERK_X + 62} y1={CLERK_Y - 20}
              x2={CLERK_X + 62 + (DB_X - CLERK_X - 120) * beam2Progress}
              y2={(CLERK_Y - 20) + (DB_Y - CLERK_Y + 20) * beam2Progress}
              stroke="url(#dbGrad)" strokeWidth={3} strokeLinecap="round"
              opacity={beamPulse * 0.8}
              filter="url(#dbGlow)"
            />
          </g>
        )}

        {/* Batch packet flying toward DB */}
        {batchPhase >= 0 && batchPhase <= 0.7 && (
          <g>
            {/* Bundle block */}
            <rect
              x={CLERK_X + 62 + (DB_X - CLERK_X - 120) * (batchPhase / 0.7) - 28}
              y={(CLERK_Y - 20) + (DB_Y - CLERK_Y + 20) * (batchPhase / 0.7) - 18}
              width={56} height={36} rx={8}
              fill="rgba(64,93,230,0.8)"
              stroke="#00f5ff"
              strokeWidth={2}
              filter="url(#dbStrongGlow)"
              opacity={Math.sin((batchPhase / 0.7) * Math.PI)}
            />
            <text
              x={CLERK_X + 62 + (DB_X - CLERK_X - 120) * (batchPhase / 0.7)}
              y={(CLERK_Y - 20) + (DB_Y - CLERK_Y + 20) * (batchPhase / 0.7) + 5}
              textAnchor="middle"
              fill="white" fontSize={14} fontFamily="monospace" fontWeight="700"
              opacity={Math.sin((batchPhase / 0.7) * Math.PI)}
            >
              BATCH
            </text>
          </g>
        )}

        {/* ─── DATABASE VAULT (right) ─── */}
        <g transform={`translate(${DB_X + dbShake}, ${DB_Y}) scale(${dbScale * 1.25})`} opacity={dbScale}>
          {/* Vault outer ring glow */}
          <rect x={-140} y={-200} width={280} height={400} rx={22}
            fill="none" stroke="#405DE6" strokeWidth={1.5} opacity={0.2}
            filter="url(#dbStrongGlow)"
          />
          {/* Vault main body */}
          <rect x={-120} y={-180} width={240} height={360} rx={18}
            fill="url(#dbVaultGrad)"
            stroke="#405DE6" strokeWidth={3.5}
            filter="url(#dbGlow)"
          />
          {/* Vault door handle */}
          <circle cx={0} cy={0} r={65}
            fill="rgba(0,245,255,0.05)"
            stroke="#00f5ff" strokeWidth={2.5}
          />
          <circle cx={0} cy={0} r={45}
            fill="rgba(0,245,255,0.08)"
            stroke="#00f5ff" strokeWidth={1.5}
          />
          {/* Spokes */}
          {[0, 60, 120, 180, 240, 300].map(angle => {
            const rot = interpolate(frame, [260, 450], [0, 360]);
            return (
              <line key={angle}
                x1={0} y1={0}
                x2={Math.cos(((angle + rot) * Math.PI) / 180) * 60}
                y2={Math.sin(((angle + rot) * Math.PI) / 180) * 60}
                stroke="#00f5ff" strokeWidth={2.5} opacity={0.7}
              />
            );
          })}
          {/* Lock icon */}
          <text x={0} y={15} textAnchor="middle" fontSize={36}>🔒</text>

          {/* DB header */}
          <text x={0} y={-140} textAnchor="middle"
            fill="#00f5ff" fontSize={22}
            fontWeight="900" fontFamily="monospace"
          >
            PERMANENT VAULT
          </text>

          {/* Saved count */}
          {dbThud > 0.3 && (
            <text x={0} y={105} textAnchor="middle"
              fill="white" fontSize={38}
              fontWeight="900" fontFamily="monospace"
              filter="url(#dbGlow)"
              opacity={Math.min(1, (dbThud - 0.3) * 1.5)}
            >
              {(savedCount / 1000000).toFixed(2)}M
            </text>
          )}
          {dbThud > 0.5 && (
            <text x={0} y={135} textAnchor="middle"
              fill="rgba(0,245,255,0.7)" fontSize={20}
              fontFamily="monospace"
              opacity={Math.min(1, (dbThud - 0.5) * 2)}
            >
              ❤ likes secured
            </text>
          )}
        </g>

        {/* DB label */}
        {dbScale > 0.4 && (
          <g opacity={Math.min(1, (dbScale - 0.4) * 1.7)}>
            <text x={DB_X} y={DB_Y + 200} textAnchor="middle"
              fill="#405DE6" fontSize={22}
              fontWeight="900" fontFamily="monospace"
              filter="url(#dbGlow)"
            >
              DATABASE
            </text>
            <text x={DB_X} y={DB_Y + 228} textAnchor="middle"
              fill="rgba(64,93,230,0.6)" fontSize={16}
              fontFamily="monospace"
            >
              permanent storage
            </text>
          </g>
        )}

        {/* Batch note */}
        <g opacity={interpolate(frame, [200, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <rect x={40} y={1150} width={720} height={110} rx={16}
            fill="rgba(8,12,25,0.85)" stroke="rgba(64,93,230,0.2)" strokeWidth={1.5}
          />
          <text x={72} y={1193} fill="rgba(64,93,230,0.9)" fontSize={20}
            fontFamily="monospace" fontWeight="700"
          >
            Batch write strategy:
          </text>
          <text x={72} y={1223} fill="rgba(148,163,184,0.8)" fontSize={18}
            fontFamily="monospace"
          >
            → Gather thousands of likes every few seconds
          </text>
          <text x={72} y={1248} fill="rgba(148,163,184,0.8)" fontSize={18}
            fontFamily="monospace"
          >
            → Write them together = far less DB pressure
          </text>
        </g>

        {/* Badge */}
        <g transform={`translate(540, 1480) scale(${badgeScale})`} opacity={badgeScale}>
          <rect x={-400} y={-50} width={800} height={100} rx={50}
            fill="rgba(64,93,230,0.15)" stroke="#405DE6" strokeWidth={2.5}
            filter="url(#dbGlow)"
          />
          <text x={0} y={16} textAnchor="middle" fill="#405DE6" fontSize={34}
            fontWeight="900" fontFamily="monospace"
            filter="url(#dbGlow)"
          >
            🗄️ THE DATABASE (PERMANENT VAULT)
          </text>
        </g>

        {/* "Slow but certain" annotation */}
        <g opacity={interpolate(frame, [400, 430], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <text x={540} y={1640} textAnchor="middle"
            fill="rgba(148,163,184,0.8)" fontSize={22}
            fontFamily="monospace"
          >
            Slower · But every like is permanently secured
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

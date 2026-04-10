import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const BottleneckScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [340, 370], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 1 (0-160): Single door getting crushed
  // Phase 2 (160-370): Multiple doors revealed

  const phase2Start = 160;
  const phase2 = interpolate(frame, [phase2Start, phase2Start + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Single door shatter
  const doorShake = frame > 80 && frame < phase2Start
    ? Math.sin(frame * 0.35) * interpolate(frame, [80, 120, 150, phase2Start], [0, 14, 14, 20], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const doorCrack = interpolate(frame, [100, phase2Start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Door shatters at phase2
  const doorShatter = interpolate(frame, [phase2Start, phase2Start + 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Crowd particles
  const particleCount = 60;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: 80 + (i % 12) * 80,
    y: 300 + Math.floor(i / 12) * 90,
    speed: 0.8 + (i % 5) * 0.15,
    phase: i * 7,
  }));

  // Badge
  const badgeScale = spring({ frame: frame - 200, fps, config: { damping: 10, stiffness: 140 } });
  const badge2Scale = spring({ frame: frame - 250, fps, config: { damping: 10, stiffness: 140 } });

  const DOOR_X = 540;
  const DOOR_Y = 1050;
  const DOOR_W = 120;
  const DOOR_H = 220;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 60%, rgba(131,58,180,0.12) 0%, #050914 70%)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="bnGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bnStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="100%" stopColor="#E1306C" />
          </linearGradient>
        </defs>

        {/* Title bar */}
        <rect x={0} y={40} width={1080} height={78} fill="rgba(5,9,20,0.9)" />
        <text x={540} y={91} textAnchor="middle"
          fill="url(#bnGrad)" fontSize={36}
          fontWeight="900" fontFamily="monospace" letterSpacing={2}
          filter="url(#bnGlow)"
        >
          THE BOTTLENECK PROBLEM
        </text>
        <line x1={0} y1={118} x2={1080} y2={118} stroke="url(#bnGrad)" strokeWidth={1.5} strokeOpacity={0.4} />

        {/* ─── PHASE 1: Single door being overwhelmed ─── */}
        <g opacity={1 - phase2}>
          {/* Crowd particles swarming toward door */}
          {particles.map((p) => {
            const progress = interpolate(frame, [0, 140], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            // Particles move toward the door
            const targetX = DOOR_X + (Math.sin(p.phase) * 20);
            const startX = p.x;
            const startY = p.y;
            const targetY = DOOR_Y - DOOR_H / 2;

            const px = startX + (targetX - startX) * progress * p.speed;
            const py = startY + (targetY - startY) * progress * p.speed;
            const pOpacity = interpolate(frame, [0, 15, 130, 155], [0, 0.9, 0.9, 0.2], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <circle key={p.id}
                cx={px} cy={py}
                r={8}
                fill={`hsl(${280 + (p.id % 30) * 3}, 70%, 70%)`}
                opacity={pOpacity}
                filter="url(#bnGlow)"
              />
            );
          })}

          {/* Single fragile door */}
          <g transform={`translate(${DOOR_X + doorShake}, ${DOOR_Y})`} opacity={doorShatter}>
            {/* Door frame */}
            <rect
              x={-DOOR_W / 2 - 12} y={-DOOR_H - 12}
              width={DOOR_W + 24} height={DOOR_H + 12}
              rx={4}
              fill="rgba(131,58,180,0.15)"
              stroke="rgba(131,58,180,0.6)"
              strokeWidth={3}
              filter="url(#bnGlow)"
            />
            {/* Door panel */}
            <rect
              x={-DOOR_W / 2} y={-DOOR_H}
              width={DOOR_W} height={DOOR_H}
              rx={2}
              fill={`rgba(193,53,132,${0.15 + doorCrack * 0.1})`}
              stroke={`rgba(193,53,132,${0.5 + doorCrack * 0.4})`}
              strokeWidth={2}
            />
            {/* Crack lines appear */}
            {doorCrack > 0.2 && (
              <g opacity={doorCrack} stroke="#E1306C" strokeWidth={2} strokeLinecap="round">
                <line x1={-10} y1={-DOOR_H * 0.8} x2={20} y2={-DOOR_H * 0.5} />
                <line x1={20} y1={-DOOR_H * 0.5} x2={-15} y2={-DOOR_H * 0.2} />
                <line x1={10} y1={-DOOR_H * 0.6} x2={-20} y2={-DOOR_H * 0.4} />
                <line x1={5} y1={-DOOR_H * 0.9} x2={-25} y2={-DOOR_H * 0.7} />
              </g>
            )}
            {/* Door label */}
            <text x={0} y={-DOOR_H / 2 + 10} textAnchor="middle"
              fill="rgba(193,53,132,0.9)" fontSize={22}
              fontWeight="900" fontFamily="monospace"
            >
              1 DOOR
            </text>
          </g>

          {/* CRASH label */}
          {doorCrack > 0.6 && (
            <g opacity={doorCrack - 0.6}>
              <text x={DOOR_X} y={DOOR_Y - DOOR_H - 50} textAnchor="middle"
                fill="#E1306C" fontSize={72}
                fontWeight="900" fontFamily="monospace"
                filter="url(#bnStrongGlow)"
                transform={`rotate(${Math.sin(frame * 0.4) * 4}, ${DOOR_X}, ${DOOR_Y - DOOR_H - 50})`}
              >
                💥 CRASH
              </text>
            </g>
          )}
        </g>

        {/* ─── PHASE 2: Multiple doors ─── */}
        <g opacity={phase2}>
          {/* Row of doors */}
          {Array.from({ length: 7 }, (_, i) => {
            const doorX = 100 + i * 140;
            const doorY = 960;
            const dScale = spring({ frame: frame - phase2Start - 10 - i * 8, fps, config: { damping: 12, stiffness: 120 } });
            return (
              <g key={i} transform={`translate(${doorX}, ${doorY}) scale(${dScale})`} opacity={dScale}>
                <rect x={-50} y={-180} width={100} height={180} rx={3}
                  fill={`rgba(131,58,180,0.12)`}
                  stroke={`hsl(${270 + i * 15}, 70%, 65%)`}
                  strokeWidth={2.5}
                  filter="url(#bnGlow)"
                />
                <rect x={-42} y={-165} width={84} height={150} rx={2}
                  fill={`rgba(193,53,132,0.08)`}
                  stroke={`hsl(${270 + i * 15}, 60%, 55%)`}
                  strokeWidth={1.5}
                />
                <text x={0} y={-80} textAnchor="middle"
                  fill={`hsl(${270 + i * 15}, 80%, 75%)`}
                  fontSize={16} fontFamily="monospace" fontWeight="700"
                >
                  {i + 1}
                </text>
                {/* Green checkmark on each door */}
                {dScale > 0.5 && (
                  <text x={0} y={24} textAnchor="middle" fontSize={22}
                    opacity={Math.min(1, (dScale - 0.5) * 2)}
                  >
                    ✓
                  </text>
                )}
              </g>
            );
          })}

          {/* Particles now flowing smoothly through all doors */}
          {particles.slice(0, 42).map((p, i) => {
            const doorIdx = i % 7;
            const targetX = 100 + doorIdx * 140;
            const flowProgress = interpolate(frame, [phase2Start + 30, phase2Start + 120], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const pOpacity = interpolate(frame, [phase2Start + 15, phase2Start + 45], [0, 0.85], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const startX = p.x;
            const startY = p.y - 200;
            const px = startX + (targetX - startX) * flowProgress;
            const py = startY + (960 - 200 - startY) * flowProgress;

            return (
              <circle key={p.id}
                cx={px} cy={py}
                r={7}
                fill={`hsl(${280 + (p.id % 30) * 3}, 70%, 70%)`}
                opacity={pOpacity}
                filter="url(#bnGlow)"
              />
            );
          })}

          {/* "SCALE" label */}
          <g transform={`translate(540, 1220) scale(${badge2Scale})`} opacity={badge2Scale}>
            <text x={0} y={0} textAnchor="middle"
              fill="#00ff88" fontSize={60}
              fontWeight="900" fontFamily="monospace"
              filter="url(#bnStrongGlow)"
            >
              ✅ SCALES!
            </text>
          </g>
        </g>

        {/* Badge: 1 Door = Crash */}
        <g transform={`translate(300, 1380) scale(${badgeScale})`} opacity={badgeScale * (1 - phase2)}>
          <rect x={-220} y={-44} width={440} height={88} rx={44}
            fill="rgba(225,48,108,0.15)" stroke="#E1306C" strokeWidth={2.5}
            filter="url(#bnGlow)"
          />
          <text x={0} y={14} textAnchor="middle" fill="#E1306C" fontSize={32}
            fontWeight="900" fontFamily="monospace"
          >
            1 DOOR = CRASH
          </text>
        </g>

        {/* Badge: 100s of Doors = Scale */}
        <g transform={`translate(540, 1500) scale(${badge2Scale * phase2})`} opacity={badge2Scale * phase2}>
          <rect x={-370} y={-48} width={740} height={96} rx={48}
            fill="url(#bnGrad)" filter="url(#bnStrongGlow)"
          />
          <text x={0} y={16} textAnchor="middle" fill="white" fontSize={36}
            fontWeight="900" fontFamily="monospace"
          >
            100s OF DOORS = SCALE
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Node positions for the architecture diagram
const LB_NODE    = { x: 540, y: 440 };
const STREAM_NODE = { x: 540, y: 760 };
const CACHE_NODE  = { x: 200, y: 1040 };
const DB_NODE     = { x: 880, y: 1040 };

export const BigPictureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Duration: ~748 frames (24.9s)

  // Camera pull-back: starts zoomed in at the database, pulls back to full architecture
  const camScale = interpolate(frame, [0, 60], [1.4, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const camX = interpolate(frame, [0, 60], [-340, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const camY = interpolate(frame, [0, 60], [-450, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Title
  const titleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Staggered node appearances
  const lbScale    = spring({ frame: frame - 10, fps, config: { damping: 11, stiffness: 130 } });
  const streamScale = spring({ frame: frame - 45, fps, config: { damping: 11, stiffness: 130 } });
  const cacheScale  = spring({ frame: frame - 80, fps, config: { damping: 11, stiffness: 130 } });
  const dbScale     = spring({ frame: frame - 95, fps, config: { damping: 11, stiffness: 130 } });

  // Connection lines
  const line1Progress = interpolate(frame, [25, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Progress = interpolate(frame, [55, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Progress = interpolate(frame, [85, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line4Progress = interpolate(frame, [90, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulse animation traveling through the system
  const pulseStart = 140;
  const pulseCycle = frame > pulseStart ? (frame - pulseStart) % 160 : -1;

  // Label appearances
  const labelsOpacity = interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Eventual Consistency" badge
  const ecScale = spring({ frame: frame - 280, fps, config: { damping: 9, stiffness: 120 } });

  // Subscribe CTA
  const subScale = spring({ frame: frame - 480, fps, config: { damping: 10, stiffness: 110 } });
  const subPulse = frame > 510 ? Math.sin((frame - 510) * 0.16) * 0.1 + 0.9 : 1;

  // Flowing pulse through pipeline
  const getPathPoint = (t: number): { x: number; y: number } => {
    // Path: LB → Stream → split to Cache AND DB
    if (t < 0.25) {
      const p = t / 0.25;
      return {
        x: LB_NODE.x + (STREAM_NODE.x - LB_NODE.x) * p,
        y: LB_NODE.y + 60 + (STREAM_NODE.y - LB_NODE.y - 60) * p,
      };
    } else if (t < 0.55) {
      const p = (t - 0.25) / 0.3;
      return {
        x: STREAM_NODE.x + (CACHE_NODE.x - STREAM_NODE.x) * p,
        y: STREAM_NODE.y + 55 + (CACHE_NODE.y - STREAM_NODE.y - 55) * p,
      };
    } else {
      const p = (t - 0.55) / 0.45;
      return {
        x: CACHE_NODE.x + (DB_NODE.x - CACHE_NODE.x) * p,
        y: CACHE_NODE.y + (DB_NODE.y - CACHE_NODE.y) * p,
      };
    }
  };

  const pulseT = pulseCycle >= 0 ? (pulseCycle / 160) : -1;
  const pulsePoint = pulseT >= 0 && pulseT <= 1 ? getPathPoint(pulseT) : null;

  // Second branch pulse (LB → Stream → DB directly)
  const pulse2T = pulseCycle >= 0 ? ((pulseCycle + 80) % 160) / 160 : -1;
  const pulse2Point = pulse2T >= 0 && pulse2T <= 1 ? getPathPoint(pulse2T) : null;

  const beamPulse = Math.sin(frame * 0.1) * 0.2 + 0.8;

  return (
    <AbsoluteFill style={{ opacity: sceneIn }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 55%, rgba(131,58,180,0.15) 0%, #050914 70%)",
        }}
      />

      <svg width="1080" height="1920"
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
          transformOrigin: "center center",
        }}>
        <defs>
          <filter id="bpGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bpStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="22" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#405DE6" />
            <stop offset="33%" stopColor="#833AB4" />
            <stop offset="66%" stopColor="#C13584" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
          <linearGradient id="bpPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCAF45" stopOpacity={0} />
            <stop offset="50%" stopColor="#FCAF45" stopOpacity={1} />
            <stop offset="100%" stopColor="#FCAF45" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Title bar shifted down to accommodate global Dynamic Island */}
        <g opacity={titleOpacity}>
          <rect x={0} y={85} width={1080} height={120} fill="rgba(5,9,20,0.9)" />
          <text x={540} y={140} textAnchor="middle"
            fill="url(#bpGrad)" fontSize={52}
            fontWeight="900" fontFamily="monospace" letterSpacing={3}
            filter="url(#bpGlow)"
          >
            THE FULL ARCHITECTURE
          </text>
          <line x1={0} y1={205} x2={1080} y2={205} stroke="url(#bpGrad)" strokeWidth={2} strokeOpacity={0.6} />
        </g>

        {/* Incoming users label */}
        <g opacity={lbScale}>
          <text x={540} y={310} textAnchor="middle"
            fill="rgba(255,255,255,0.6)" fontSize={22}
            fontFamily="monospace" letterSpacing={2}
          >
            5,000,000 USERS
          </text>
          {[0, 1, 2, 3, 4].map(i => {
            const arrowY = 340 + Math.sin(frame * 0.08 + i) * 6;
            return (
              <line key={i}
                x1={380 + i * 65} y1={arrowY}
                x2={380 + i * 65} y2={arrowY + 42}
                stroke={`hsl(${270 + i * 15}, 65%, 60%)`}
                strokeWidth={2.5} strokeLinecap="round" opacity={0.65}
              />
            );
          })}
        </g>

        {/* ─── CONNECTIONS ─── */}
        {/* LB → Stream */}
        {line1Progress > 0 && (
          <g>
            <line
              x1={LB_NODE.x} y1={LB_NODE.y + 62}
              x2={LB_NODE.x} y2={LB_NODE.y + 62 + (STREAM_NODE.y - LB_NODE.y - 130) * line1Progress}
              stroke="url(#bpGrad)" strokeWidth={14} strokeOpacity={0.1} strokeLinecap="round"
            />
            <line
              x1={LB_NODE.x} y1={LB_NODE.y + 62}
              x2={LB_NODE.x} y2={LB_NODE.y + 62 + (STREAM_NODE.y - LB_NODE.y - 130) * line1Progress}
              stroke="url(#bpGrad)" strokeWidth={2.5} strokeLinecap="round"
              opacity={beamPulse * 0.7}
              filter="url(#bpGlow)"
            />
          </g>
        )}

        {/* Stream → Cache */}
        {line2Progress > 0 && (
          <g>
            <line
              x1={STREAM_NODE.x - 60 * line2Progress} y1={STREAM_NODE.y + 55}
              x2={CACHE_NODE.x + (STREAM_NODE.x - 60 * line2Progress - CACHE_NODE.x) * (1 - line2Progress)}
              y2={STREAM_NODE.y + 55 + (CACHE_NODE.y - STREAM_NODE.y - 55) * line2Progress}
              stroke="#C13584" strokeWidth={14} strokeOpacity={0.08} strokeLinecap="round"
            />
            <line
              x1={STREAM_NODE.x} y1={STREAM_NODE.y + 55}
              x2={STREAM_NODE.x + (CACHE_NODE.x - STREAM_NODE.x) * line2Progress}
              y2={STREAM_NODE.y + 55 + (CACHE_NODE.y - STREAM_NODE.y - 55) * line2Progress}
              stroke="#C13584" strokeWidth={2.5} strokeLinecap="round"
              opacity={0.6} strokeDasharray="8,5"
              filter="url(#bpGlow)"
            />
          </g>
        )}

        {/* Stream → DB */}
        {line3Progress > 0 && (
          <g>
            <line
              x1={STREAM_NODE.x} y1={STREAM_NODE.y + 55}
              x2={STREAM_NODE.x + (DB_NODE.x - STREAM_NODE.x) * line3Progress}
              y2={STREAM_NODE.y + 55 + (DB_NODE.y - STREAM_NODE.y - 55) * line3Progress}
              stroke="#405DE6" strokeWidth={14} strokeOpacity={0.08} strokeLinecap="round"
            />
            <line
              x1={STREAM_NODE.x} y1={STREAM_NODE.y + 55}
              x2={STREAM_NODE.x + (DB_NODE.x - STREAM_NODE.x) * line3Progress}
              y2={STREAM_NODE.y + 55 + (DB_NODE.y - STREAM_NODE.y - 55) * line3Progress}
              stroke="#405DE6" strokeWidth={2.5} strokeLinecap="round"
              opacity={0.6} strokeDasharray="8,5"
              filter="url(#bpGlow)"
            />
          </g>
        )}

        {/* Cache ← DB (bidirectional note line) */}
        {line4Progress > 0 && (
          <line
            x1={CACHE_NODE.x + 80} y1={CACHE_NODE.y}
            x2={CACHE_NODE.x + 80 + (DB_NODE.x - CACHE_NODE.x - 160) * line4Progress}
            y2={DB_NODE.y}
            stroke="rgba(131,58,180,0.3)" strokeWidth={1.5}
            strokeDasharray="6,8" strokeLinecap="round"
          />
        )}

        {/* ─── LOAD BALANCER NODE ─── */}
        <g transform={`translate(${LB_NODE.x}, ${LB_NODE.y}) scale(${lbScale * 1.3})`} opacity={lbScale}>
          <circle cx={0} cy={0} r={85}
            fill="rgba(64,93,230,0.15)"
            stroke="#405DE6" strokeWidth={4}
            filter="url(#bpGlow)"
          />
          <circle cx={0} cy={0} r={60} fill="rgba(64,93,230,0.25)" />
          <text x={0} y={22} textAnchor="middle" fontSize={58}>🚦</text>
        </g>
        <g opacity={labelsOpacity}>
          <text x={LB_NODE.x} y={LB_NODE.y + 130} textAnchor="middle"
            fill="#405DE6" fontSize={32}
            fontWeight="900" fontFamily="monospace"
            filter="url(#bpGlow)"
          >
            LOAD BALANCER
          </text>
          <text x={LB_NODE.x} y={LB_NODE.y + 126} textAnchor="middle"
            fill="rgba(64,93,230,0.6)" fontSize={16}
            fontFamily="monospace"
          >
            splits the crowd
          </text>
        </g>

        {/* ─── EVENT STREAM NODE ─── */}
        <g transform={`translate(${STREAM_NODE.x}, ${STREAM_NODE.y}) scale(${streamScale * 1.4})`} opacity={streamScale}>
          <rect x={-75} y={-60} width={150} height={120} rx={16}
            fill="rgba(193,53,132,0.15)"
            stroke="#C13584" strokeWidth={3.5}
            filter="url(#bpGlow)"
          />
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={i}
              x={-50} y={-34 + i * 22}
              width={100 - (i % 2) * 24} height={12} rx={4}
              fill="rgba(193,53,132,0.28)"
            />
          ))}
        </g>
        <g opacity={labelsOpacity}>
          <text x={STREAM_NODE.x} y={STREAM_NODE.y - 110} textAnchor="middle"
            fill="#C13584" fontSize={32}
            fontWeight="900" fontFamily="monospace"
            filter="url(#bpGlow)"
          >
            MESSAGE QUEUE
          </text>
          <text x={STREAM_NODE.x} y={STREAM_NODE.y - 46} textAnchor="middle"
            fill="rgba(193,53,132,0.6)" fontSize={15}
            fontFamily="monospace"
          >
            catches the tsunami
          </text>
        </g>

        {/* ─── CACHE NODE ─── */}
        <g transform={`translate(${CACHE_NODE.x}, ${CACHE_NODE.y}) scale(${cacheScale * 1.4})`} opacity={cacheScale}>
          <rect x={-85} y={-70} width={170} height={140} rx={18}
            fill="rgba(252,175,69,0.15)"
            stroke="#FCAF45" strokeWidth={3.5}
            filter="url(#bpGlow)"
          />
          <text x={0} y={16} textAnchor="middle" fontSize={44}>⚡</text>
          <text x={0} y={-20} textAnchor="middle"
            fill="#FCAF45" fontSize={22}
            fontWeight="900" fontFamily="monospace"
          >
            4.8M
          </text>
        </g>
        <g opacity={labelsOpacity}>
          <text x={CACHE_NODE.x} y={CACHE_NODE.y + 130} textAnchor="middle"
            fill="#FCAF45" fontSize={30}
            fontWeight="900" fontFamily="monospace"
            filter="url(#bpGlow)"
          >
            REDIS CACHE
          </text>
          <text x={CACHE_NODE.x} y={CACHE_NODE.y + 106} textAnchor="middle"
            fill="rgba(252,175,69,0.6)" fontSize={15}
            fontFamily="monospace"
          >
            shows fast count
          </text>
        </g>

        {/* ─── DATABASE NODE ─── */}
        <g transform={`translate(${DB_NODE.x}, ${DB_NODE.y}) scale(${dbScale * 1.4})`} opacity={dbScale}>
          <rect x={-85} y={-95} width={170} height={190} rx={22}
            fill="rgba(64,93,230,0.15)"
            stroke="#405DE6" strokeWidth={3.5}
            filter="url(#bpGlow)"
          />
          <circle cx={0} cy={-10} r={40}
            fill="rgba(0,245,255,0.06)"
            stroke="#00f5ff" strokeWidth={2}
          />
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <line key={angle}
              x1={0} y1={-10}
              x2={Math.cos((angle * Math.PI) / 180) * 36}
              y2={-10 + Math.sin((angle * Math.PI) / 180) * 36}
              stroke="#00f5ff" strokeWidth={1.5} opacity={0.5}
            />
          ))}
          <text x={0} y={58} textAnchor="middle"
            fill="#00f5ff" fontSize={16}
            fontWeight="700" fontFamily="monospace"
          >
            🔒
          </text>
        </g>
        <g opacity={labelsOpacity}>
          <text x={DB_NODE.x} y={DB_NODE.y + 130} textAnchor="middle"
            fill="#405DE6" fontSize={30}
            fontWeight="900" fontFamily="monospace"
            filter="url(#bpGlow)"
          >
            DATABASE
          </text>
          <text x={DB_NODE.x} y={DB_NODE.y + 126} textAnchor="middle"
            fill="rgba(64,93,230,0.6)" fontSize={15}
            fontFamily="monospace"
          >
            permanent record
          </text>
        </g>

        {/* ─── ANIMATED PULSE ─── */}
        {pulsePoint && (
          <g>
            <circle cx={pulsePoint.x} cy={pulsePoint.y} r={22}
              fill="#FCAF45" opacity={0.15}
              filter="url(#bpStrongGlow)"
            />
            <circle cx={pulsePoint.x} cy={pulsePoint.y} r={10}
              fill="#FCAF45"
              filter="url(#bpStrongGlow)"
              opacity={0.9}
            />
          </g>
        )}
        {pulse2Point && (
          <g>
            <circle cx={pulse2Point.x} cy={pulse2Point.y} r={18}
              fill="#C13584" opacity={0.15}
              filter="url(#bpGlow)"
            />
            <circle cx={pulse2Point.x} cy={pulse2Point.y} r={8}
              fill="#C13584"
              filter="url(#bpGlow)"
              opacity={0.8}
            />
          </g>
        )}

        {/* ─── EVENTUAL CONSISTENCY BADGE ─── */}
        <g transform={`translate(540, 1310) scale(${ecScale})`} opacity={ecScale}>
          <rect x={-430} y={-70} width={860} height={140} rx={28}
            fill="rgba(131,58,180,0.12)" stroke="url(#bpGrad)" strokeWidth={3}
            filter="url(#bpStrongGlow)"
          />
          <text x={0} y={-14} textAnchor="middle"
            fill="rgba(255,255,255,0.5)" fontSize={20}
            fontFamily="monospace" letterSpacing={4}
          >
            THE OFFICIAL TERM
          </text>
          <text x={0} y={38} textAnchor="middle"
            fill="white" fontSize={52}
            fontWeight="900" fontFamily="monospace"
            filter="url(#bpStrongGlow)"
          >
            Eventual Consistency
          </text>
        </g>

        {/* Explanation */}
        {ecScale > 0.5 && (
          <g opacity={Math.min(1, (ecScale - 0.5) * 2)}>
            <text x={540} y={1450} textAnchor="middle"
              fill="rgba(148,163,184,0.85)" fontSize={22}
              fontFamily="monospace"
            >
              Fast count shown immediately · Official record
            </text>
            <text x={540} y={1480} textAnchor="middle"
              fill="rgba(148,163,184,0.85)" fontSize={22}
              fontFamily="monospace"
            >
              catches up a little later. You never notice.
            </text>
          </g>
        )}

        {/* ─── SUBSCRIBE CTA ─── */}
        <g transform={`translate(540, 1620) scale(${subScale * subPulse})`} opacity={subScale}>
          <rect x={-400} y={-88} width={800} height={176} rx={28}
            fill="rgba(193,53,132,0.85)" filter="url(#bpStrongGlow)"
          />
          <text x={0} y={-18} textAnchor="middle" fill="white" fontSize={42}
            fontWeight="900" fontFamily="monospace"
          >
            🔔 SUBSCRIBE
          </text>
          <text x={0} y={34} textAnchor="middle"
            fill="rgba(255,255,255,0.85)" fontSize={22}
            fontFamily="monospace"
          >
            More system design every week →
          </text>
        </g>

        {subScale > 0.5 && (
          <g opacity={Math.min(1, (subScale - 0.5) * 2)}>
            <text x={540} y={1820} textAnchor="middle"
              fill="rgba(71,85,105,0.9)" fontSize={20}
              fontFamily="monospace" letterSpacing={3}
            >
              🔔 FOLLOW FOR MORE SYSTEM DESIGN
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

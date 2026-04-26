import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const SERVER_POSITIONS = [
  { x: 120, y: 1300 },
  { x: 270, y: 1200 },
  { x: 420, y: 1320 },
  { x: 540, y: 1180 },
  { x: 660, y: 1320 },
  { x: 810, y: 1200 },
  { x: 960, y: 1300 },
];

export const LoadBalancerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [260, 293], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const LB_X = 540;
  const LB_Y = 680;

  // Load balancer node springs in
  const lbScale = spring({ frame: frame - 8, fps, config: { damping: 11, stiffness: 130 } });

  // Connection lines draw out
  const linesProgress = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Server nodes spring in staggered
  const serverScales = SERVER_POSITIONS.map((_, i) =>
    spring({ frame: frame - 75 - i * 8, fps, config: { damping: 12, stiffness: 130 } })
  );

  // Packet animation: cycling through servers
  const packetCycle = frame > 90 ? frame - 90 : -1;
  const PACKET_CYCLE_LENGTH = 45;

  // Label badge
  const badgeScale = spring({ frame: frame - 120, fps, config: { damping: 10, stiffness: 140 } });

  // Traffic cop badge appears when audio says it
  const copBadgeIn = spring({ frame: frame - 150, fps, config: { damping: 9, stiffness: 160 } });
  
  // Radar/Pulse effect for the Load Balancer
  const radarPulse = (frame % 30) / 30;
  const radarOpacity = interpolate(radarPulse, [0, 0.5, 1], [0, 0.4, 0]);
  const radarScale = interpolate(radarPulse, [0, 1], [0.8, 1.8]);

  const lbPulse = Math.sin(frame * 0.12) * 0.15 + 0.85;

  // Annotation
  const annotOpacity = interpolate(frame, [160, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 35%, rgba(64,93,230,0.15) 0%, rgba(5,9,20,1) 65%)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="lbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lbStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#405DE6" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
          <linearGradient id="lbBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#405DE6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#C13584" stopOpacity={0.5} />
          </linearGradient>
        </defs>

        {/* Title bar shifted down to accommodate global Dynamic Island */}
        <rect x={0} y={90} width={1080} height={78} fill="rgba(5,9,20,0.9)" />
        <text x={540} y={141} textAnchor="middle"
          fill="url(#lbGrad)" fontSize={36}
          fontWeight="900" fontFamily="monospace" letterSpacing={2}
          filter="url(#lbGlow)"
        >
          THE LOAD BALANCER
        </text>
        <line x1={0} y1={168} x2={1080} y2={168} stroke="url(#lbGrad)" strokeWidth={1.5} strokeOpacity={0.4} />

        {/* Incoming crowd label */}
        <g opacity={lbScale}>
          <text x={540} y={300} textAnchor="middle"
            fill="rgba(255,255,255,0.7)" fontSize={26}
            fontFamily="monospace" letterSpacing={2}
          >
            5,000,000 USERS
          </text>
        </g>

        {/* Incoming traffic arrows */}
        {lbScale > 0.3 && Array.from({ length: 5 }, (_, i) => {
          const arrowY = interpolate(frame, [0, 90], [360, LB_Y - 80], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const arrowOpacity = interpolate(frame, [0, 20], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <circle key={i}
              cx={400 + i * 70}
              cy={arrowY + Math.sin(frame * 0.08 + i) * 20}
              r={9}
              fill={`hsl(${260 + i * 18}, 70%, 70%)`}
              opacity={arrowOpacity}
              filter="url(#lbGlow)"
            />
          );
        })}

        {/* ─── LOAD BALANCER NODE ─── */}
        <g transform={`translate(${LB_X}, ${LB_Y}) scale(${lbScale})`} opacity={lbScale}>
          {/* RADAR EFFECT */}
          {frame > 90 && (
            <g>
              <circle 
                cx={0} cy={0} 
                r={120 * radarScale} 
                fill="none" 
                stroke="url(#lbGrad)" 
                strokeWidth={4} 
                opacity={radarOpacity} 
              />
              {/* Radiating split lines */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <line 
                  key={angle}
                  x1={0} y1={0}
                  x2={Math.cos(angle * Math.PI / 180) * 140 * radarScale}
                  y2={Math.sin(angle * Math.PI / 180) * 140 * radarScale}
                  stroke="url(#lbGrad)"
                  strokeWidth={3}
                  opacity={radarOpacity * 0.5}
                />
              ))}
            </g>
          )}

          {/* Outer aura ring */}
          <circle cx={0} cy={0} r={120 * lbPulse} fill="none"
            stroke="url(#lbGrad)" strokeWidth={2} opacity={0.25}
            filter="url(#lbGlow)"
          />
          {/* Main node */}
          <circle cx={0} cy={0} r={75}
            fill="rgba(64,93,230,0.15)"
            stroke="url(#lbGrad)" strokeWidth={3.5}
            filter="url(#lbGlow)"
          />
          {/* Inner circle */}
          <circle cx={0} cy={0} r={52} fill="rgba(64,93,230,0.25)" />
          {/* Icon */}
          <text x={0} y={18} textAnchor="middle" fontSize={50}>🚦</text>
        </g>

        {/* TRAFFIC COP BADGE */}
        <g transform={`translate(${LB_X + 110}, ${LB_Y - 90}) scale(${copBadgeIn})`} opacity={copBadgeIn}>
          <rect x={-80} y={-22} width={160} height={44} rx={22} 
            fill="#405DE6" stroke="#fff" strokeWidth={2} filter="url(#lbStrongGlow)" />
          <text x={0} y={6} textAnchor="middle" fill="#fff" fontSize={16} fontWeight="900" fontFamily="monospace">
            👮 TRAFFIC COP
          </text>
        </g>

        {/* LB Label */}
        {lbScale > 0.4 && (
          <g opacity={Math.min(1, (lbScale - 0.4) * 1.7)}>
            <text x={LB_X} y={LB_Y + 110} textAnchor="middle"
              fill="#405DE6" fontSize={26}
              fontWeight="900" fontFamily="monospace"
              filter="url(#lbGlow)"
            >
              LOAD BALANCER
            </text>
            <text x={LB_X} y={LB_Y + 142} textAnchor="middle"
              fill="rgba(64,93,230,0.6)" fontSize={18}
              fontFamily="monospace"
            >
              traffic cop
            </text>
          </g>
        )}

        {/* ─── CONNECTION LINES to servers ─── */}
        {SERVER_POSITIONS.map((srv, i) => {
          const lineEndX = LB_X + (srv.x - LB_X) * linesProgress;
          const lineEndY = LB_Y + (srv.y - LB_Y) * linesProgress;
          return (
            <g key={i}>
              <line
                x1={LB_X} y1={LB_Y + 75}
                x2={lineEndX} y2={lineEndY}
                stroke={`hsl(${260 + i * 15}, 65%, 60%)`}
                strokeWidth={14}
                strokeOpacity={0.08}
                strokeLinecap="round"
              />
              <line
                x1={LB_X} y1={LB_Y + 75}
                x2={lineEndX} y2={lineEndY}
                stroke={`hsl(${260 + i * 15}, 65%, 60%)`}
                strokeWidth={2.5}
                strokeOpacity={0.6}
                strokeLinecap="round"
                strokeDasharray="8,5"
                filter="url(#lbGlow)"
              />
            </g>
          );
        })}

        {/* ─── SERVER NODES ─── */}
        {SERVER_POSITIONS.map((srv, i) => {
          const sc = serverScales[i];
          // Animated packet for this server
          const packetOffset = (i * (PACKET_CYCLE_LENGTH / SERVER_POSITIONS.length));
          const cyclePos = packetCycle >= 0
            ? ((packetCycle + packetOffset) % PACKET_CYCLE_LENGTH) / PACKET_CYCLE_LENGTH
            : -1;

          return (
            <g key={i}>
              {/* Traveling packet */}
              {cyclePos >= 0 && cyclePos <= 0.6 && (
                <g>
                  <circle
                    cx={LB_X + (srv.x - LB_X) * (cyclePos / 0.6)}
                    cy={(LB_Y + 75) + (srv.y - LB_Y - 75) * (cyclePos / 0.6)}
                    r={12}
                    fill={`hsl(${260 + i * 15}, 70%, 65%)`}
                    opacity={0.25}
                  />
                  <circle
                    cx={LB_X + (srv.x - LB_X) * (cyclePos / 0.6)}
                    cy={(LB_Y + 75) + (srv.y - LB_Y - 75) * (cyclePos / 0.6)}
                    r={6}
                    fill={`hsl(${260 + i * 15}, 80%, 70%)`}
                    filter="url(#lbGlow)"
                    opacity={Math.sin(cyclePos * Math.PI)}
                  />
                </g>
              )}

              {/* Server node */}
              <g transform={`translate(${srv.x}, ${srv.y}) scale(${sc})`} opacity={sc}>
                <circle cx={0} cy={0} r={52}
                  fill={`rgba(131,58,180,0.12)`}
                  stroke={`hsl(${260 + i * 15}, 60%, 55%)`}
                  strokeWidth={2.5}
                  filter="url(#lbGlow)"
                />
                {/* Server stack icon */}
                {[-12, -2, 8].map((yo, j) => (
                  <g key={j}>
                    <rect x={-22} y={yo} width={44} height={8} rx={3}
                      fill={`rgba(131,58,180,0.2)`}
                      stroke={`hsl(${260 + i * 15}, 60%, 55%)`}
                      strokeWidth={1.2}
                    />
                    <circle cx={17} cy={yo + 4} r={3}
                      fill={`hsl(${260 + i * 15}, 80%, 70%)`}
                      opacity={0.9}
                    />
                  </g>
                ))}
              </g>
              {sc > 0.4 && (
                <text x={srv.x} y={srv.y + 72} textAnchor="middle"
                  fill={`hsl(${260 + i * 15}, 70%, 60%)`}
                  fontSize={15} fontWeight="800" fontFamily="monospace"
                  opacity={Math.min(1, (sc - 0.4) * 1.7)}
                >
                  SRV {i + 1}
                </text>
              )}
            </g>
          );
        })}

        {/* Badge: The Load Balancer */}
        <g transform={`translate(540, 1620) scale(${badgeScale})`} opacity={badgeScale}>
          <rect x={-380} y={-50} width={760} height={100} rx={50}
            fill="rgba(64,93,230,0.15)" stroke="#405DE6" strokeWidth={2.5}
            filter="url(#lbGlow)"
          />
          <text x={0} y={16} textAnchor="middle" fill="#405DE6" fontSize={36}
            fontWeight="900" fontFamily="monospace"
            filter="url(#lbGlow)"
          >
            🚦 THE LOAD BALANCER
          </text>
        </g>

        {/* Annotation */}
        <g opacity={annotOpacity}>
          <text x={540} y={1760} textAnchor="middle"
            fill="rgba(148,163,184,0.85)" fontSize={22}
            fontFamily="monospace"
          >
            Splits traffic evenly · No single point of failure
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

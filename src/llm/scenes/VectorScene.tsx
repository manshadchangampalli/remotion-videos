import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";

const C   = "#00f2ff";
const CO  = "#ff8c00";
const FH  = "'Montserrat', sans-serif";
const FL  = "'Inter', sans-serif";
const DUR = 420;  // 14s — vector segment 0:23-0:37

// Seeded deterministic random (no Math.random)
const sr = (n: number) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x); };

// 200 particles pre-computed (within 300 max)
const PARTICLES = Array.from({ length: 200 }, (_, i) => ({
  x: sr(i * 3)     * 1080,
  y: sr(i * 3 + 1) * 1400 + 300,
  r: sr(i * 3 + 2) * 3 + 1.5,
  speed: sr(i * 7) * 0.8 + 0.3,
  phase: sr(i * 11) * Math.PI * 2,
  hue:  i % 4 === 0 ? CO : C,
}));

// Word positions in semantic space (spread out to prevent overlap at 1.5x scale)
const WORDS = [
  { label: "King",  x: 240, y: 780, size: 26, color: "#FFD700", group: 0 },
  { label: "Queen", x: 480, y: 660, size: 26, color: "#FFD700", group: 0 },
  { label: "Man",   x: 160, y: 1020, size: 20, color: C,        group: 1 },
  { label: "Women", x: 420, y: 920, size: 20, color: C,        group: 1 },
  { label: "Car",   x: 820, y: 640, size: 22, color: CO,       group: 2 },
  { label: "Bus",   x: 940, y: 780, size: 18, color: CO,       group: 2 },
];

export const VectorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sIn  = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sOut = interpolate(frame, [DUR - 28, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Camera dive: scale up and shift for "diving in" effect
  const camScale = interpolate(frame, [0, 120], [0.75, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const camY = interpolate(frame, [0, 120], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Word appearances
  const wordIn = (i: number) =>
    spring({ frame: frame - 130 - i * 22, fps, config: { damping: 11, stiffness: 175 } });

  // Connection line King ↔ Queen
  const lineProgress = interpolate(frame, [280, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // King-Queen label
  const kqLabelIn = interpolate(frame, [370, 410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Head text
  const headIn = interpolate(frame, [15, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: sIn * sOut, background: "#050505" }}>

      <svg width="1080" height="1920"
        style={{
          position: "absolute", inset: 0,
          transform: `scale(${camScale}) translateY(${camY}px)`,
          transformOrigin: "center center",
        }}>
        <defs>
          <filter id="vc_g" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="vc_sg" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="vc_bg" cx="50%" cy="50%">
            <stop offset="0%"   stopColor="rgba(0,242,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <rect width="1080" height="1920" fill="url(#vc_bg)" />

        {/* Perspective floor grid — manual vanishing-point lines */}
        <g opacity={0.22}>
          {/* Horizontal recession lines */}
          {Array.from({ length: 18 }, (_, i) => {
            const prog = i / 17;
            const spread = prog * 550;
            const y = 1550 - prog * 900;
            return <line key={i} x1={540 - spread} y1={y} x2={540 + spread} y2={y}
              stroke={C} strokeWidth={0.6} />;
          })}
          {/* Vertical convergence lines */}
          {Array.from({ length: 13 }, (_, i) => {
            const xBot = (i / 12) * 1080;
            return <line key={i} x1={xBot} y1={1550} x2={540} y2={650}
              stroke={C} strokeWidth={0.5} />;
          })}
        </g>

        {/* ── Floating particles (200, seeded) ── */}
        {PARTICLES.map((p, i) => {
          const floatY = Math.sin(frame * p.speed * 0.04 + p.phase) * 8;
          return (
            <circle key={i}
              cx={p.x} cy={p.y + floatY}
              r={p.r}
              fill={p.hue} opacity={0.22}
            />
          );
        })}

        {/* ── Heading ── */}
        <g opacity={headIn}>
          <text x={540} y={230} textAnchor="middle"
            fill={C} fontSize={24} fontFamily={FL} letterSpacing={6} opacity={0.8}>STEP 2</text>
          <text x={540} y={310} textAnchor="middle"
            fill="white" fontSize={72} fontFamily={FH} fontWeight={900} filter="url(#vc_sg)">Vector Space</text>
          <text x={540} y={370} textAnchor="middle"
            fill="rgba(255,255,255,0.6)" fontSize={28} fontFamily={FL}>
            Words translated into math (embeddings)
          </text>
        </g>

        {/* ── Digital Soul / Floating Vectors (Margins layer) ── */}
        {frame > 100 && (
          <g opacity={interpolate(frame, [100, 150], [0, 0.22])}>
            {/* Top margin */}
            {Array.from({ length: 7 }, (_, i) => (
              <text key={`top-${i}`} x={40} y={150 + i * 50} fill={C} fontSize={14} fontFamily="monospace" opacity={0.12}>
                {`[${Array.from({length: 8}, (_, j) => (sr(i*10+j) * 2 - 1).toFixed(3)).join(", ")}]`}
              </text>
            ))}
            {/* Bottom margin */}
            {Array.from({ length: 7 }, (_, i) => (
              <text key={`bot-${i}`} x={40} y={1350 + i * 50} fill={C} fontSize={14} fontFamily="monospace" opacity={0.12}>
                {`[${Array.from({length: 8}, (_, j) => (sr(i*30+j) * 2 - 1).toFixed(3)).join(", ")}]`}
              </text>
            ))}
          </g>
        )}

        {/* ── King ↔ Queen connection line ── */}
        {lineProgress > 0 && (
          <line
            x1={WORDS[0].x} y1={WORDS[0].y}
            x2={WORDS[0].x + (WORDS[1].x - WORDS[0].x) * lineProgress}
            y2={WORDS[0].y + (WORDS[1].y - WORDS[0].y) * lineProgress}
            stroke="#FFD700" strokeWidth={3}
            strokeDasharray="8,4"
            opacity={0.85}
            filter="url(#vc_g)"
          />
        )}
        {/* Distance label */}
        {kqLabelIn > 0 && (
          <g opacity={kqLabelIn}>
            <rect x={320} y={690} width={108} height={28} rx={8}
              fill="rgba(255,215,0,0.12)" stroke="#FFD700" strokeWidth={1} />
            <text x={374} y={709} textAnchor="middle"
              fill="#FFD700" fontSize={14} fontFamily={FL} fontWeight={700}>
              similar ✓
            </text>
          </g>
        )}

        {/* ── Word labels ── */}
        {WORDS.map((w, i) => {
          const ws = wordIn(i);
          const pillH = w.size * 2.2;
          const pillW = Math.max(pillH, w.label.length * w.size * 0.85 + 30);

          return (
            <g key={i} transform={`translate(${w.x}, ${w.y}) scale(${ws * 1.5})`} opacity={ws}>
              <rect
                x={-pillW / 2} y={-pillH / 2}
                width={pillW} height={pillH}
                rx={pillH / 2}
                fill={`${w.color}18`} stroke={w.color} strokeWidth={2}
                filter="url(#vc_g)"
              />
              <text x={0} y={w.size * 0.3} textAnchor="middle"
                fill="white" fontSize={w.size * 1.2}
                fontFamily={FH} fontWeight={900}
                filter="url(#vc_sg)">
                {w.label}
              </text>
              {/* Embedding numbers next to word */}
              {ws > 0.8 && (
                <text x={pillW / 2 + 12} y={0} fill={w.color} fontSize={14} fontFamily="monospace" opacity={0.6}>
                  [0.{Math.floor(sr(i)*99)}, -0.{Math.floor(sr(i+5)*99)}, ...]
                </text>
              )}
            </g>
          );
        })}

        {/* "Car" distance note */}
        {wordIn(4) > 0.5 && (
          <g opacity={Math.min(1, (wordIn(4) - 0.5) * 2)}>
            <line x1={WORDS[4].x} y1={WORDS[4].y} x2={WORDS[0].x + 80} y2={WORDS[0].y - 40}
              stroke="rgba(255,80,80,0.3)" strokeWidth={1.5} strokeDasharray="6,6" />
            <text x={580} y={650} textAnchor="middle"
              fill="rgba(255,80,80,0.6)" fontSize={16} fontFamily={FL}>
              far away (different concept)
            </text>
          </g>
        )}

      </svg>
    </AbsoluteFill>
  );
};

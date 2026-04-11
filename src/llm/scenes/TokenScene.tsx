import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";

const C   = "#00f2ff";
const CO  = "#ff8c00";
const FH  = "'Montserrat', sans-serif";
const FC  = "'JetBrains Mono', 'Courier New', monospace";
const FL  = "'Inter', sans-serif";
const DUR = 240;  // 8s — token segment 0:15-0:23

// BPE-style tokens for "Large Language Models are amazing."
const TOKENS = [
  { text: "Large",  w: 5 },
  { text: " Lan",   w: 4 },
  { text: "guage",  w: 5 },
  { text: " Mo",    w: 3 },
  { text: "dels",   w: 4 },
  { text: " are",   w: 4 },
  { text: " am",    w: 3 },
  { text: "az",     w: 2 },
  { text: "ing",    w: 3 },
  { text: ".",      w: 1 },
];

const CHAR_PX = 21.6; // px per char at fontSize 36 JetBrains Mono
const TOTAL_W = TOKENS.reduce((s, t) => s + t.w * CHAR_PX, 0);
const START_X = (1080 - TOTAL_W) / 2;

// Pre-compute absolute x positions
const TOKEN_X: number[] = [];
let _cx = START_X;
TOKENS.forEach((t) => { TOKEN_X.push(_cx); _cx += t.w * CHAR_PX; });

const TOKEN_COLORS = [C, C, CO, C, CO, C, CO, CO, CO, C];
const TOKEN_IDS    = ["#1","#2","#3","#4","#5","#6","#7","#8","#9","#10"];

const LASER_SF = 32;
const LASER_EF = 175;

export const TokenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sIn  = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sOut = interpolate(frame, [DUR - 25, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gridY = (frame * 1.6) % 80;

  const textIn  = interpolate(frame, [18, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headIn  = interpolate(frame, [10, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelsIn = interpolate(frame, [LASER_EF + 12, LASER_EF + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const laserX = interpolate(frame, [LASER_SF, LASER_EF], [START_X - 12, START_X + TOTAL_W + 12], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const laserOp = interpolate(frame, [LASER_EF, LASER_EF + 28], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Token bounce springs — one per token
  const t0 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[0] + TOKENS[0].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t1 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[1] + TOKENS[1].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t2 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[2] + TOKENS[2].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t3 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[3] + TOKENS[3].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t4 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[4] + TOKENS[4].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t5 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[5] + TOKENS[5].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t6 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[6] + TOKENS[6].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t7 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[7] + TOKENS[7].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t8 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[8] + TOKENS[8].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const t9 = spring({ frame: frame - (LASER_SF + ((TOKEN_X[9] + TOKENS[9].w*CHAR_PX*0.5 - START_X)/TOTAL_W)*(LASER_EF-LASER_SF)), fps, config: { damping: 7, stiffness: 400 } });
  const tokenSprings = [t0,t1,t2,t3,t4,t5,t6,t7,t8,t9];

  return (
    <AbsoluteFill style={{ opacity: sIn * sOut, background: "#050505" }}>

      {/* Grid */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tk_g" width="80" height="80" patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${gridY})`}>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1d1d1d" strokeWidth="1" />
          </pattern>
          <filter id="tk_glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="1080" height="1920" fill="url(#tk_g)" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={(i/8)*1080} y1={0} x2={540} y2={2200}
            stroke={C} strokeWidth={0.4} opacity={0.08} />
        ))}

        {/* ── Heading ── */}
        <g opacity={headIn}>
          <text x={540} y={318} textAnchor="middle"
            fill={C} fontSize={18} fontFamily={FL} letterSpacing={4} opacity={0.7}>STEP 1</text>
          <text x={540} y={376} textAnchor="middle"
            fill="white" fontSize={52} fontFamily={FH} fontWeight={900}>Tokenization</text>
          <text x={540} y={422} textAnchor="middle"
            fill="rgba(255,255,255,0.4)" fontSize={20} fontFamily={FL}>
            Breaking text into chunks the AI understands
          </text>
        </g>

        {/* ── Token labels ── */}
        {TOKENS.map((t, i) => {
          const cx = TOKEN_X[i] + (t.w * CHAR_PX) / 2;
          return (
            <g key={i} opacity={textIn}>
              {/* Token bounce frame */}
              {laserX > TOKEN_X[i] + (t.w * CHAR_PX) * 0.5 && (
                <g transform={`translate(${cx}, 820) scale(${1 + (tokenSprings[i] - 1) * 0.11})`}>
                  <rect
                    x={-(t.w * CHAR_PX) / 2 - 4} y={-36}
                    width={t.w * CHAR_PX + 8} height={46}
                    rx={7}
                    fill={`${TOKEN_COLORS[i]}0c`}
                    stroke={TOKEN_COLORS[i]}
                    strokeWidth={1.5}
                    filter="url(#tk_glow)"
                    opacity={Math.min(1, tokenSprings[i])}
                  />
                  {/* Token ID above */}
                  {labelsIn > 0 && (
                    <text
                      x={0} y={-52}
                      textAnchor="middle"
                      fill={TOKEN_COLORS[i]}
                      fontSize={16} fontFamily={FL} fontWeight={600}
                      opacity={labelsIn}>
                      {TOKEN_IDS[i]}
                    </text>
                  )}
                </g>
              )}
              {/* Text */}
              <text
                x={cx} y={820}
                textAnchor="middle"
                fill={laserX > TOKEN_X[i] + (t.w * CHAR_PX) * 0.5
                  ? TOKEN_COLORS[i]
                  : "rgba(255,255,255,0.45)"}
                fontSize={36}
                fontFamily={FC}>
                {t.text}
              </text>
            </g>
          );
        })}

        {/* ── Laser line ── */}
        {frame >= LASER_SF && (
          <g opacity={laserOp}>
            <line x1={laserX} y1={700} x2={laserX} y2={890}
              stroke={C} strokeWidth={2.5} />
            <line x1={laserX} y1={700} x2={laserX} y2={890}
              stroke={C} strokeWidth={14} opacity={0.18} />
            {/* Laser head glow */}
            <circle cx={laserX} cy={795} r={8} fill={C} opacity={0.5} />
          </g>
        )}

        {/* ── Takeaway ── */}
        {labelsIn > 0 && (
          <g opacity={labelsIn}>
            <rect x={60} y={900} width={960} height={60} rx={30}
              fill="rgba(0,242,255,0.07)" stroke="rgba(0,242,255,0.2)" strokeWidth={1.5} />
            <text x={540} y={938} textAnchor="middle"
              fill="rgba(255,255,255,0.55)" fontSize={20} fontFamily={FL}>
              10 tokens · model sees IDs, not letters · same word = same ID
            </text>
          </g>
        )}

        {/* ── Token count badge ── */}
        {labelsIn > 0.5 && (
          <g transform={`translate(540, 1100) scale(${interpolate(labelsIn, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`}
            opacity={labelsIn}>
            <rect x={-170} y={-42} width={340} height={84} rx={42}
              fill={CO} />
            <text x={0} y={14} textAnchor="middle"
              fill="white" fontSize={32} fontFamily={FH} fontWeight={900}>
              10 Tokens
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

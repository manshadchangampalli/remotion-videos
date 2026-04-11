import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, staticFile, Img,
} from "remotion";

const C      = "#00f2ff";
const CO     = "#ff8c00";
const RED    = "#ff4444";
const GREEN  = "#00d97e";
const FH     = "'Montserrat', sans-serif";
const FL     = "'Inter', sans-serif";
const DUR    = 1530;  // 51s — transformer segment 0:37-1:28

// ── Audio-synced phase boundaries (local frames, 0 = start of TransformerScene = 0:37 audio) ──
const OLD_START  = 120;   // 0:41 "Older AI used to read left to right"
const OLD_END    = 390;   // 0:50 "A transformer doesn't read left to right"
const NEW_START  = 390;   // 0:50
const NEW_END    = 810;   // 1:04 "Take the phrase the server crashed"
const ATTN_START = 810;   // 1:04

// ── Sentence for OLD AI / NEW AI demos ──
const WORDS = ["I", "visited", "Paris", "and", "it", "was", "beautiful"];
const N = WORDS.length;
const SLOT_W = 128;
const TOTAL_W = N * SLOT_W;
const SENT_X = (1080 - TOTAL_W) / 2;   // ~52px
const wordCX = (i: number) => SENT_X + i * SLOT_W + SLOT_W / 2;
const WORD_Y = 900;  // baseline y in SVG

// ── Attention words for phase 4 ──
const ATTN_WORDS = [
  { label: "The",     x: 200, y: 920 },
  { label: "server",  x: 540, y: 920 },
  { label: "crashed", x: 880, y: 920 },
];

// Seeded random
const sr = (n: number) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x); };

export const TransformerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sIn  = interpolate(frame, [0, 22], [0, 1],       { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sOut = interpolate(frame, [DUR - 28, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gridY = (frame * 1.6) % 80;
  const pulse = Math.sin(frame * 0.11) * 0.5 + 0.5;

  // ── Phase 1: Intro heading ──
  const headIn  = interpolate(frame, [10, 50],                [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headOut = interpolate(frame, [OLD_START, OLD_START + 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase 2: OLD AI ──
  const p2In  = interpolate(frame, [OLD_START,       OLD_START + 20],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2Out = interpolate(frame, [OLD_END - 20,    OLD_END],         [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2Op  = Math.min(p2In, p2Out);

  // Word springs — sequential (one per word, cannot use hook in loop)
  const WF = (i: number) => OLD_START + i * 28; // appear frame for word i
  const ws0 = spring({ frame: frame - WF(0), fps, config: { damping: 9, stiffness: 220 } });
  const ws1 = spring({ frame: frame - WF(1), fps, config: { damping: 9, stiffness: 220 } });
  const ws2 = spring({ frame: frame - WF(2), fps, config: { damping: 9, stiffness: 220 } });
  const ws3 = spring({ frame: frame - WF(3), fps, config: { damping: 9, stiffness: 220 } });
  const ws4 = spring({ frame: frame - WF(4), fps, config: { damping: 9, stiffness: 220 } });
  const ws5 = spring({ frame: frame - WF(5), fps, config: { damping: 9, stiffness: 220 } });
  const ws6 = spring({ frame: frame - WF(6), fps, config: { damping: 9, stiffness: 220 } });
  const wordSprings = [ws0, ws1, ws2, ws3, ws4, ws5, ws6];

  // After last word (WF(6) = 120+168 = 288), words drift upward and fade (forgetting)
  const FORGET_F = WF(N - 1) + 15;  // = 303
  const wordDrift = (i: number) => {
    const elapsed = frame - WF(i);
    if (elapsed < 0) return 0;
    return Math.min(elapsed * 0.28, 70);  // drift up to 70px
  };
  const wordFade = (i: number) => interpolate(
    frame, [FORGET_F + i * 14, FORGET_F + i * 14 + 35], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Reading cursor beam sweeps left → right across all words
  const cursorX = interpolate(
    frame,
    [OLD_START, WF(N - 1) + 28],
    [SENT_X - 10, SENT_X + TOTAL_W + 10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cursorOp = interpolate(
    frame,
    [OLD_START, OLD_START + 12, FORGET_F, FORGET_F + 18],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "Context lost!" appears after forgetting starts
  const ctxLostIn = spring({ frame: frame - (FORGET_F + 40), fps, config: { damping: 12, stiffness: 155 } });

  // ── Phase 3: NEW AI / TRANSFORMER ──
  const p3In  = interpolate(frame, [NEW_START,      NEW_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3Out = interpolate(frame, [NEW_END - 20,   NEW_END],        [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3Op  = Math.min(p3In, p3Out);

  // ALL words appear simultaneously — single spring
  const newAllIn = spring({ frame: frame - (NEW_START + 15), fps, config: { damping: 11, stiffness: 160 } });

  // Words "explode" in from center: scale + position spring
  const newWordScale = (i: number) => spring({
    frame: frame - (NEW_START + 12 + Math.abs(i - 3) * 4),
    fps, config: { damping: 10, stiffness: 250 },
  });
  const ns0 = newWordScale(0);
  const ns1 = newWordScale(1);
  const ns2 = newWordScale(2);
  const ns3 = newWordScale(3);
  const ns4 = newWordScale(4);
  const ns5 = newWordScale(5);
  const ns6 = newWordScale(6);
  const newWordSprings = [ns0, ns1, ns2, ns3, ns4, ns5, ns6];

  // Web of connections between all word pairs, appear staggered
  const CONN_F = NEW_START + 55;
  const connOp = (idx: number) => interpolate(
    frame, [CONN_F + idx * 5, CONN_F + idx * 5 + 22], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // All pairs: 21 total for 7 words
  type Pair = [number, number];
  const ALL_PAIRS: Pair[] = [];
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++)
      ALL_PAIRS.push([i, j]);

  // "Full context ✓" badge
  const fullCtxIn = spring({ frame: frame - (NEW_START + 190), fps, config: { damping: 12, stiffness: 145 } });

  // ── Phase 4: Self-Attention "server crashed" ──
  const p4In = interpolate(frame, [ATTN_START, ATTN_START + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const aw0 = spring({ frame: frame - (ATTN_START + 20), fps, config: { damping: 12, stiffness: 170 } });
  const aw1 = spring({ frame: frame - (ATTN_START + 32), fps, config: { damping: 12, stiffness: 170 } });
  const aw2 = spring({ frame: frame - (ATTN_START + 44), fps, config: { damping: 12, stiffness: 170 } });
  const attnWS = [aw0, aw1, aw2];

  // Heading for phase 4 (inline with the attention scene)
  const attnHeadIn = interpolate(frame, [ATTN_START + 10, ATTN_START + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "server" ambiguity (1:06 audio = local frame 870)
  const ambigIn = interpolate(frame, [ATTN_START + 60, ATTN_START + 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "crashed" highlight (1:10 audio = local frame 990)
  const crashedHL = interpolate(frame, [ATTN_START + 175, ATTN_START + 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Attention arc "server → crashed" (1:13 = local 1080)
  const attnArc = interpolate(frame, [ATTN_START + 265, ATTN_START + 315], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Waiter fades out (1:18 = local 1230)
  const waiterFade = interpolate(frame, [ATTN_START + 405, ATTN_START + 455], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Server rack brightens
  const rackBright = interpolate(frame, [ATTN_START + 425, ATTN_START + 465], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Context understood!" badge (1:22 = local 1350)
  const understoodIn = spring({ frame: frame - (ATTN_START + 530), fps, config: { damping: 11, stiffness: 155 } });

  // Key pulse for attention arc
  const keyPulse = attnArc > 0 ? Math.sin(frame * 0.22) * 0.35 + 0.65 : 0;

  // Attention arc path between two ATTN_WORDS
  const arcPath = (a: number, b: number, offset = 0) => {
    const x1 = ATTN_WORDS[a].x, y1 = ATTN_WORDS[a].y;
    const x2 = ATTN_WORDS[b].x, y2 = ATTN_WORDS[b].y;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - 150 - offset;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  };

  // Prevent TS unused warning
  void sr; void GREEN;

  return (
    <AbsoluteFill style={{ opacity: sIn * sOut, background: "#050505" }}>

      {/* ── Background grid (always) ── */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <pattern id="tf_g" width="80" height="80" patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${gridY})`}>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1a1a1a" strokeWidth="1" />
          </pattern>
          <filter id="tf_glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="1080" height="1920" fill="url(#tf_g)" />
      </svg>

      {/* ─────────────────────────────────────────────── */}
      {/* PHASE 1 — Intro Title (frames 0-120)           */}
      {/* ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 820, left: 0, right: 0, textAlign: "center",
        opacity: headIn * headOut,
      }}>
        <div style={{ color: C, fontSize: 20, fontFamily: FL, letterSpacing: 6, opacity: 0.7, marginBottom: 14 }}>
          STEP 3
        </div>
        <div style={{ color: "white", fontSize: 72, fontFamily: FH, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
          The Transformer
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 28, fontFamily: FL, marginTop: 16 }}>
          The brain of the operation
        </div>
      </div>

      {/* ─────────────────────────────────────────────── */}
      {/* PHASE 2 — OLD AI (frames 120-390)              */}
      {/* ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, opacity: p2Op, pointerEvents: "none" }}>

        {/* OLD AI badge */}
        <div style={{
          position: "absolute", top: 380, left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}>
          <div style={{
            background: "rgba(255,60,60,0.12)",
            border: "2px solid rgba(255,60,60,0.55)",
            borderRadius: 50, padding: "10px 40px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <span style={{ color: RED, fontSize: 28, fontFamily: FH, fontWeight: 800 }}>
              OLD AI
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          position: "absolute", top: 468, left: 0, right: 0, textAlign: "center",
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 24, fontFamily: FL }}>
            Reads left → right, one word at a time
          </span>
        </div>

        {/* SVG: words + cursor beam */}
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          {/* Reading cursor beam */}
          {cursorOp > 0 && (
            <g opacity={cursorOp}>
              <line x1={cursorX} y1={840} x2={cursorX} y2={970}
                stroke={C} strokeWidth={3} />
              <line x1={cursorX} y1={840} x2={cursorX} y2={970}
                stroke={C} strokeWidth={16} opacity={0.15} />
              <circle cx={cursorX} cy={905} r={8} fill={C} opacity={0.6} />
            </g>
          )}

          {/* Words — appear left to right, drift upward and fade */}
          {WORDS.map((word, i) => {
            const ws = wordSprings[i];
            const drift = wordDrift(i);
            const fade  = wordFade(i);
            const isCurrent = cursorX >= wordCX(i) - SLOT_W / 2 && cursorX < wordCX(i) + SLOT_W / 2;
            const cx = wordCX(i);
            const cy = WORD_Y - drift;
            const wordColor = isCurrent ? C : (fade < 0.7 ? `rgba(255,80,80,${fade})` : "white");

            return (
              <g key={i}
                transform={`translate(${cx}, ${cy}) scale(${ws})`}
                opacity={ws * fade}
              >
                <rect x={-52} y={-32} width={104} height={56} rx={10}
                  fill={isCurrent ? `${C}18` : "rgba(255,255,255,0.04)"}
                  stroke={isCurrent ? C : "rgba(255,255,255,0.15)"}
                  strokeWidth={isCurrent ? 2 : 1}
                />
                <text x={0} y={10} textAnchor="middle"
                  fill={wordColor}
                  fontSize={30} fontFamily={FH} fontWeight={700}>
                  {word}
                </text>
              </g>
            );
          })}

          {/* Drift arrows showing words floating up */}
          {WORDS.map((_, i) => {
            const drift = wordDrift(i);
            if (drift < 5) return null;
            const fade = wordFade(i);
            return (
              <text key={`up-${i}`}
                x={wordCX(i)} y={WORD_Y - drift - 18}
                textAnchor="middle"
                fill={`rgba(255,80,80,${fade * 0.5})`}
                fontSize={18}>
                ↑
              </text>
            );
          })}
        </svg>

        {/* "Context lost" warning (appears after forgetting) */}
        {ctxLostIn > 0.05 && (
          <div style={{
            position: "absolute", top: 1040, left: 0, right: 0,
            display: "flex", justifyContent: "center",
            opacity: ctxLostIn,
            transform: `scale(${0.6 + ctxLostIn * 0.4})`,
          }}>
            <div style={{
              background: "rgba(255,40,40,0.1)",
              border: "2px solid rgba(255,40,40,0.5)",
              borderRadius: 60, padding: "16px 50px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 28 }}>🧠</span>
              <span style={{ color: RED, fontSize: 26, fontFamily: FH, fontWeight: 800 }}>
                Context Lost!
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, fontFamily: FL }}>
                (beginning forgotten)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────── */}
      {/* PHASE 3 — TRANSFORMER (frames 390-810)         */}
      {/* ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, opacity: p3Op, pointerEvents: "none" }}>

        {/* TRANSFORMER badge */}
        <div style={{
          position: "absolute", top: 380, left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}>
          <div style={{
            background: `${C}14`,
            border: `2px solid ${C}88`,
            borderRadius: 50, padding: "10px 40px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: `0 0 ${20 + pulse * 14}px ${C}22`,
          }}>
            <span style={{ color: C, fontSize: 28, fontFamily: FH, fontWeight: 800 }}>
              ⚡ TRANSFORMER
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          position: "absolute", top: 468, left: 0, right: 0, textAlign: "center",
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 24, fontFamily: FL }}>
            Sees your entire prompt at the same millisecond
          </span>
        </div>

        {/* SVG: all words + connection web */}
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          {/* Connection web between ALL word pairs */}
          {ALL_PAIRS.map(([a, b], idx) => {
            const x1 = wordCX(a), x2 = wordCX(b);
            const yMid = WORD_Y - 80 - (idx % 4) * 20;
            const op = connOp(idx);
            if (op <= 0) return null;
            return (
              <path key={idx}
                d={`M ${x1} ${WORD_Y} Q ${(x1+x2)/2} ${yMid} ${x2} ${WORD_Y}`}
                fill="none"
                stroke={idx % 3 === 0 ? CO : C}
                strokeWidth={1.2}
                opacity={op * 0.35}
                strokeDasharray="5,5"
              />
            );
          })}

          {/* All words appear simultaneously — slight stagger from center outward */}
          {WORDS.map((word, i) => {
            const ns = newWordSprings[i];
            return (
              <g key={i}
                transform={`translate(${wordCX(i)}, ${WORD_Y}) scale(${ns})`}
                opacity={ns * newAllIn}
              >
                <rect x={-56} y={-34} width={112} height={60} rx={12}
                  fill={`${C}14`}
                  stroke={C}
                  strokeWidth={1.8}
                  filter="url(#tf_glow)"
                />
                <text x={0} y={10} textAnchor="middle"
                  fill="white"
                  fontSize={30} fontFamily={FH} fontWeight={700}>
                  {word}
                </text>
              </g>
            );
          })}

          {/* Center "SIMULTANEOUS" label */}
          {newAllIn > 0.8 && (
            <g opacity={Math.min(1, (newAllIn - 0.8) * 5)}>
              <text x={540} y={1010} textAnchor="middle"
                fill={C} fontSize={18} fontFamily={FL} letterSpacing={4} opacity={0.6}>
                ALL AT ONCE
              </text>
            </g>
          )}
        </svg>

        {/* "Full context ✓" badge */}
        {fullCtxIn > 0.05 && (
          <div style={{
            position: "absolute", top: 1040, left: 0, right: 0,
            display: "flex", justifyContent: "center",
            opacity: fullCtxIn,
            transform: `scale(${0.6 + fullCtxIn * 0.4})`,
          }}>
            <div style={{
              background: "rgba(0,200,100,0.1)",
              border: "2px solid rgba(0,200,100,0.55)",
              borderRadius: 60, padding: "16px 50px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 28 }}>🧠</span>
              <span style={{ color: "#00d97e", fontSize: 26, fontFamily: FH, fontWeight: 800 }}>
                Full Context Retained
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }}>✓</span>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────── */}
      {/* PHASE 4 — Attention "server crashed" (810-1530) */}
      {/* ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, opacity: p4In, pointerEvents: "none" }}>

        {/* Phase 4 heading */}
        <div style={{
          position: "absolute", top: 350, left: 0, right: 0, textAlign: "center",
          opacity: attnHeadIn,
        }}>
          <div style={{ color: C, fontSize: 18, fontFamily: FL, letterSpacing: 5, opacity: 0.7, marginBottom: 10 }}>
            SELF-ATTENTION IN ACTION
          </div>
          <div style={{ color: "white", fontSize: 46, fontFamily: FH, fontWeight: 900 }}>
            "The server crashed"
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 22, fontFamily: FL, marginTop: 10 }}>
            Which meaning of "server"?
          </div>
        </div>

        {/* SVG: attention diagram */}
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id="attn_glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="attn_kq" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={CO} />
              <stop offset="100%" stopColor="#ff4444" />
            </linearGradient>
          </defs>

          {/* All connections (dim) — appears with words */}
          {attnWS[0] > 0.5 && (
            <g opacity={0.18 * attnWS[0]}>
              <path d={arcPath(0, 1, 0)} fill="none" stroke={C} strokeWidth={1} strokeDasharray="5,5" />
              <path d={arcPath(1, 2, 0)} fill="none" stroke={C} strokeWidth={1} strokeDasharray="5,5" />
              <path d={arcPath(0, 2, 40)} fill="none" stroke={C} strokeWidth={1} strokeDasharray="5,5" />
            </g>
          )}

          {/* Highlighted attention arc: server ← crashed */}
          {attnArc > 0 && (
            <path
              d={arcPath(1, 2)}
              fill="none"
              stroke="url(#attn_kq)"
              strokeWidth={3.5 + keyPulse * 2.5}
              opacity={attnArc * 0.95}
              filter="url(#attn_glow)"
            />
          )}

          {/* Weight label on arc */}
          {attnArc > 0.7 && (
            <g opacity={(attnArc - 0.7) * 3.3}>
              <rect x={648} y={748} width={100} height={34} rx={10}
                fill="rgba(255,140,0,0.15)" stroke={CO} strokeWidth={1.5} />
              <text x={698} y={771} textAnchor="middle"
                fill={CO} fontSize={17} fontFamily={FL} fontWeight={700}>
                HIGH ↑
              </text>
            </g>
          )}

          {/* Word nodes */}
          {ATTN_WORDS.map((w, i) => {
            const isServer   = i === 1;
            const isCrashed  = i === 2;
            const borderColor = isCrashed && crashedHL > 0.5 ? CO
              : isServer && attnArc > 0.5 ? C : C;
            const bw = isServer && attnArc > 0.5 ? 3 : isCrashed && crashedHL > 0.5 ? 3 : 1.5;
            return (
              <g key={i}
                transform={`translate(${w.x}, ${w.y}) scale(${attnWS[i]})`}
                opacity={attnWS[i]}
              >
                <rect x={-72} y={-32} width={144} height={64} rx={14}
                  fill={isCrashed && crashedHL > 0.5
                    ? `${CO}18`
                    : isServer && rackBright > 0.5
                    ? `${C}18`
                    : "rgba(255,255,255,0.05)"}
                  stroke={borderColor}
                  strokeWidth={bw}
                  filter="url(#attn_glow)"
                />
                <text x={0} y={10} textAnchor="middle"
                  fill={isCrashed && crashedHL > 0.5 ? CO
                    : isServer && rackBright > 0.5 ? C : "white"}
                  fontSize={30} fontFamily={FH} fontWeight={900}>
                  {w.label}
                </text>
              </g>
            );
          })}

          {/* "server" disambiguation label */}
          {ambigIn > 0 && (
            <g opacity={ambigIn * (1 - attnArc * 0.4)}>
              <text x={540} y={820} textAnchor="middle"
                fill="rgba(255,255,255,0.35)" fontSize={18} fontFamily={FL}>
                server =  waiter?   or   computer?
              </text>
            </g>
          )}

          {/* "crashed" context label */}
          {crashedHL > 0.6 && attnArc > 0.5 && (
            <g opacity={Math.min(1, (attnArc - 0.5) * 2)}>
              <rect x={310} y={990} width={460} height={54} rx={14}
                fill="rgba(255,140,0,0.1)" stroke={CO} strokeWidth={1.5} />
              <text x={540} y={1024} textAnchor="middle"
                fill={CO} fontSize={21} fontFamily={FL} fontWeight={700}>
                "server" ← strong signal ← "crashed"
              </text>
            </g>
          )}
        </svg>

        {/* Waiter icon (fades out — wrong meaning eliminated) */}
          <div style={{
            position: "absolute", left: 140, top: 1060,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            opacity: ambigIn * waiterFade,
            transform: `scale(${0.7 + ambigIn * 0.3})`,
            transformOrigin: "center top",
          }}>
            <div style={{ position: "relative" }}>
              <Img src={staticFile("llm-working/waiter-icon.png")}
                style={{ width: 150, height: 150, objectFit: "contain", opacity: 0.7 }} />
              {waiterFade < 0.7 && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 105, color: RED, fontWeight: 900,
                  opacity: 1 - waiterFade,
                }}>✕</div>
              )}
            </div>
            <span style={{ color: `rgba(255,255,255,${0.5 * waiterFade})`, fontSize: 22, fontFamily: FL }}>
              Waiter?
            </span>
          </div>

        {/* Server rack (brightens — correct meaning) */}
          <div style={{
            position: "absolute", right: 140, top: 1060,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            opacity: ambigIn,
            transform: `scale(${0.7 + ambigIn * 0.3})`,
            transformOrigin: "center top",
          }}>
            <div style={{ position: "relative" }}>
              <Img src={staticFile("llm-working/server-rack.png")}
                style={{ width: 150, height: 150, objectFit: "contain",
                  filter: rackBright > 0.3 ? `drop-shadow(0 0 24px ${C})` : "none",
                }} />
              {rackBright > 0.3 && (
                <div style={{
                  position: "absolute", bottom: -6, right: -6,
                  width: 50, height: 50, borderRadius: "50%",
                  background: "#00c878",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, color: "white", fontWeight: 900,
                  opacity: rackBright,
                  boxShadow: `0 0 20px #00c87888`,
                }}>✓</div>
              )}
            </div>
            <span style={{ color: rackBright > 0.3 ? C : "rgba(255,255,255,0.5)", fontSize: 22, fontFamily: FL, fontWeight: rackBright > 0.3 ? 700 : 400 }}>
              Computer ✓
            </span>
          </div>

        {/* "Context understood!" badge */}
        {understoodIn > 0.05 && (
          <div style={{
            position: "absolute", bottom: 420, left: 0, right: 0,
            display: "flex", justifyContent: "center",
            opacity: understoodIn,
            transform: `scale(${0.6 + understoodIn * 0.4})`,
          }}>
            <div style={{
              background: `${C}12`,
              border: `2px solid ${C}88`,
              borderRadius: 60, padding: "18px 60px",
              boxShadow: `0 0 ${24 + pulse * 16}px ${C}28`,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ color: C, fontSize: 28, fontFamily: FH, fontWeight: 900 }}>
                ✓ Context understood
              </span>
            </div>
          </div>
        )}
      </div>

    </AbsoluteFill>
  );
};

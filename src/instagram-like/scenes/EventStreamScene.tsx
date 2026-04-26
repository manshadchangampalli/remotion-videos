import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ── Audio-synced phase boundaries (scene-local frames) ─────────────────────
// 0–209f   "Can't write 5M likes to a database one by one"
// 209–343f "The system would choke, Instagram doesn't even try"
// 343–487f "You tap the heart, your phone turns it red immediately"
// 487–715f "Written down line by line in a massive, fast-moving logbook"
// 715–799f "It's just an endless list of actions"
// 799–872f "No rushing, no crashing"
// 872–966f "That logbook is an event stream"

const P1 = { s: 0, e: 220 };
const P2 = { s: 202, e: 350 };
const P3 = { s: 333, e: 495 };
const P4 = { s: 478, e: 722 };
const P5 = { s: 705, e: 808 };
const P6 = { s: 792, e: 882 };
const P7 = { s: 864, e: 966 };

// Phase opacity — crossfades 10 frames at each boundary
const po = (f: number, s: number, e: number, fi = 10, fo = 10) =>
  interpolate(f, [s, s + fi, e - fo, e], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Pre-computed DB particles (Phase 1)
const PARTICLE_CYCLE = 58;
const DB_PARTICLES = Array.from({ length: 44 }, (_, i) => {
  const angle = (i / 44) * Math.PI * 2;
  const r = 295 + (i % 6) * 36;
  return {
    sx: Math.round(540 + Math.cos(angle) * r),
    sy: Math.round(890 + Math.sin(angle) * 190),
    cycleOffset: (i * 9) % PARTICLE_CYCLE,
    hue: 195 + (i % 30) * 5,
    size: 6.5 + (i % 4) * 2.5,
  };
});

// Log entry usernames (Phase 4 / 5)
const LOG_USERS = [
  "user_8372941","cr7_fan_bra","football_uk","user_2910482","insta_pro_x",
  "messi_rival_","user_1192847","global_fan_3","user_8847261","cr7_forever_",
  "user_4482910","sportz_daily","user_9918372","real_madrid_","user_3827410",
  "user_2948271","user_7193820","username_551","footballlife","user_0918273",
  "cr7_juventus","user_1827364","user_9182736","footy_fan_99","user_5523819",
  "user_3841920","SIUUU_fan23_","user_8291047","global_score","user_4719283",
  "user_3827491","user_9172838","ronaldo_army","user_7281930","cr7_united__",
  "user_1928374","user_8473920","footy_daily_","user_3948271","cr7_10_goat_",
];

const LOG_ENTRIES = LOG_USERS.map((user, i) => ({
  user,
  min: String(Math.floor(i / 10)).padStart(2, "0"),
  sec: String((i * 7) % 60).padStart(2, "0"),
  ms:  String((i * 137) % 1000).padStart(3, "0"),
}));

const ENTRY_H = 58;
const VISIBLE_ROWS = 11;

export const EventStreamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn  = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneOut = interpolate(frame, [930, 966], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase visibility
  const p1Op = po(frame, P1.s, P1.e);
  const p2Op = po(frame, P2.s, P2.e);
  const p3Op = po(frame, P3.s, P3.e);
  const p4Op = po(frame, P4.s, P4.e);
  const p5Op = po(frame, P5.s, P5.e);
  const p6Op = po(frame, P6.s, P6.e);
  const p7Op = po(frame, P7.s, P7.e);

  // ── PHASE 1: Database overload ───────────────────────────────────────────
  const DB_X = 540, DB_Y = 890;
  const dbStress = interpolate(frame, [P1.s + 15, P1.e - 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dbShake  = dbStress > 0.5 ? Math.sin(frame * 1.5) * (dbStress - 0.5) * 30 : 0;
  const dbR = Math.round(64  + dbStress * 168);
  const dbG = Math.round(93  - dbStress * 75);
  const dbB = Math.round(230 - dbStress * 200);
  const dbStroke  = `rgb(${dbR},${dbG},${dbB})`;
  const dbFill    = `rgba(${dbR},${dbG},${dbB},0.12)`;
  const meterFill = interpolate(frame, [P1.s + 10, P1.e - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const meterColor = meterFill < 0.55 ? "#00ff88" : meterFill < 0.82 ? "#facc15" : "#ff3333";
  const writeCount = Math.floor(interpolate(frame, [P1.s + 10, P1.e - 20], [0, 4980000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const p1LabelScale  = spring({ frame: frame - P1.s - 8, fps, config: { damping: 10, stiffness: 185 } });
  const p1Label2Scale = spring({ frame: frame - P1.s - 75, fps, config: { damping: 9, stiffness: 180 } });

  // ── PHASE 2: Choke ───────────────────────────────────────────────────────
  const p2Local     = Math.max(0, frame - P2.s);
  const chokePop    = spring({ frame: p2Local - 6, fps, config: { damping: 5, stiffness: 300 } });
  const p2Shake     = Math.sin(p2Local * 2.2) * Math.max(0, 1 - p2Local / 40) * 22;
  const dontTryScale = spring({ frame: p2Local - 38, fps, config: { damping: 9, stiffness: 200 } });

  // ── PHASE 3: Phone + instant heart ──────────────────────────────────────
  const p3Local    = Math.max(0, frame - P3.s);
  const phoneIn    = spring({ frame: p3Local, fps, config: { damping: 14, stiffness: 180 } });
  const phoneY     = (1 - phoneIn) * 220;
  const TAP        = 55;
  const heartBounce = spring({ frame: p3Local - TAP, fps, config: { damping: 4, stiffness: 500 } });
  const heartScale = interpolate(heartBounce, [0, 0.42, 1], [1, 1.65, 1.0]);
  const heartFilled = p3Local >= TAP + 4;
  const dtHScale   = spring({ frame: p3Local - TAP, fps, config: { damping: 4, stiffness: 500 } });
  const dtHOp      = interpolate(p3Local, [TAP, TAP + 8, TAP + 40, TAP + 62], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rip1R      = interpolate(p3Local, [TAP, TAP + 64], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rip1O      = interpolate(p3Local, [TAP, TAP + 64], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rip2R      = interpolate(p3Local, [TAP + 14, TAP + 78], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rip2O      = interpolate(p3Local, [TAP + 14, TAP + 78], [0.32, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const instantBadge = spring({ frame: p3Local - TAP - 4, fps, config: { damping: 9, stiffness: 210 } });
  const pendingOp  = interpolate(p3Local, [TAP + 4, TAP + 18, TAP + 55, TAP + 68], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const confirmedOp = interpolate(p3Local, [TAP + 64, TAP + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const optUiOp    = interpolate(p3Local, [TAP + 30, TAP + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phone mini hearts floating up
  const phoneHearts = [
    { ox: -48, delay: TAP + 6,  size: 0.38 },
    { ox:  55, delay: TAP + 12, size: 0.32 },
    { ox:  -8, delay: TAP + 9,  size: 0.42 },
  ];

  // ── PHASE 4: Fast logbook ────────────────────────────────────────────────
  const p4Local    = Math.max(0, frame - P4.s);
  const scrollY    = interpolate(p4Local, [12, P4.e - P4.s - 12], [0, ENTRY_H * 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loggedCount = Math.floor(interpolate(p4Local, [18, P4.e - P4.s - 18], [0, 4250000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const p4BadgeIn  = spring({ frame: p4Local - 22, fps, config: { damping: 10, stiffness: 190 } });

  // ── PHASE 5: Endless list ────────────────────────────────────────────────
  const p5Local    = Math.max(0, frame - P5.s);
  const p5Scroll   = interpolate(p5Local, [0, P5.e - P5.s], [0, ENTRY_H * 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const totalLogged = Math.floor(interpolate(p5Local, [0, P5.e - P5.s], [4250000, 4900000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const infScale   = spring({ frame: p5Local - 10, fps, config: { damping: 9, stiffness: 170 } });

  // ── PHASE 6: No rushing, no crashing ────────────────────────────────────
  const p6Local    = Math.max(0, frame - P6.s);
  // Conveyor: 7 items moving left-to-right
  const ITEM_W = 175, ITEM_GAP = 195;
  const beltOffset = (p6Local * 6.5) % ITEM_GAP;
  const calm1Scale = spring({ frame: p6Local - 6, fps, config: { damping: 10, stiffness: 195 } });
  const calm2Scale = spring({ frame: p6Local - 28, fps, config: { damping: 10, stiffness: 195 } });

  // ── PHASE 7: Event stream reveal ────────────────────────────────────────
  const p7Local    = Math.max(0, frame - P7.s);
  const revealScale = spring({ frame: p7Local - 6, fps, config: { damping: 7, stiffness: 175 } });
  const subScale   = spring({ frame: p7Local - 22, fps, config: { damping: 9, stiffness: 180 } });
  const kafkaPulse = Math.sin(p7Local * 0.24) * 0.12 + 0.88;
  const ringIn     = interpolate(p7Local, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Shared scroll for P4+P5
  const activeScroll = p4Op > p5Op ? scrollY : p5Scroll + scrollY;

  const LOG_CONTAINER_Y = 200;
  const LOG_CONTAINER_H = ENTRY_H * VISIBLE_ROWS + 48;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* ── Dynamic background tint per phase ──────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, background: "#050914" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(220,50,50,${0.10 * p1Op + 0.12 * p2Op}) 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(193,53,132,${0.14 * p3Op}) 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(0,200,120,${0.08 * p6Op + 0.06 * p7Op}) 0%, transparent 65%)` }} />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="esG" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="esSG" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="esIgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#405DE6" />
            <stop offset="50%" stopColor="#C13584" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
          <linearGradient id="esMeterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={meterColor} />
            <stop offset="100%" stopColor={meterColor} stopOpacity={0.6} />
          </linearGradient>
          <clipPath id="esLogClip">
            <rect x={30} y={LOG_CONTAINER_Y + 44} width={1020} height={LOG_CONTAINER_H - 44} />
          </clipPath>
          <clipPath id="esP5LogClip">
            <rect x={30} y={LOG_CONTAINER_Y + 44} width={1020} height={LOG_CONTAINER_H - 44} />
          </clipPath>
        </defs>

        {/* ── TITLE BAR (persistent) shifted down for Dynamic Island ─────── */}
        <rect x={0} y={85} width={1080} height={120} fill="rgba(5,9,20,0.95)" />
        <text x={540} y={140} textAnchor="middle" fill="url(#esIgGrad)"
          fontSize={52} fontWeight="900" fontFamily="monospace" letterSpacing={3}
          filter="url(#esG)">
          THE MESSAGE QUEUE
        </text>
        <text x={540} y={185} textAnchor="middle"
          fill="rgba(193,53,132,0.7)" fontSize={24} fontFamily="monospace">
          (Write now, process later — decoupled & fast)
        </text>
        <line x1={0} y1={205} x2={1080} y2={205} stroke="url(#esIgGrad)" strokeWidth={2} strokeOpacity={0.6} />

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 1 — "5M writes? Database can't handle it"
        ═══════════════════════════════════════════════════════════════════ */}
        <g opacity={p1Op}>
          {/* Question label */}
          <g transform={`translate(540, 230) scale(${p1LabelScale})`} opacity={p1LabelScale}>
            <rect x={-380} y={-44} width={760} height={88} rx={44}
              fill="rgba(220,50,50,0.12)" stroke="#ff3333" strokeWidth={2} filter="url(#esG)" />
            <text x={0} y={14} textAnchor="middle" fill="#ff3333" fontSize={32}
              fontWeight="900" fontFamily="monospace">
              WRITE 5,000,000 ROWS TO DATABASE?
            </text>
          </g>

          {/* Particles cycling toward DB */}
          {DB_PARTICLES.map((p, i) => {
            const cf = (frame + p.cycleOffset) % PARTICLE_CYCLE;
            const progress = interpolate(cf, [0, PARTICLE_CYCLE * 0.68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const pOp = interpolate(cf, [0, 6, PARTICLE_CYCLE * 0.62, PARTICLE_CYCLE * 0.74], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const px = p.sx + (DB_X - p.sx) * progress;
            const py = p.sy + (DB_Y - p.sy) * progress;
            return (
              <circle key={i} cx={px} cy={py} r={p.size}
                fill={`hsl(${p.hue},70%,65%)`} opacity={pOp}
                filter="url(#esG)"
              />
            );
          })}

          {/* DB Cylinder */}
          <g transform={`translate(${DB_X + dbShake}, 0)`}>
            {/* Body */}
            <rect x={DB_X - 115} y={DB_Y - 175} width={230} height={350} rx={0}
              fill={dbFill} stroke={dbStroke} strokeWidth={2.5} filter="url(#esG)" />
            {/* Fill level inside (stress) */}
            <rect x={DB_X - 112} y={DB_Y - 175 + 350 * (1 - meterFill * 0.9)} width={224} height={350 * meterFill * 0.9}
              fill={`rgba(${dbR},${dbG},${dbB},0.22)`} />
            {/* Horizontal stack lines */}
            {[0.25, 0.5, 0.75].map((ratio, i) => (
              <line key={i}
                x1={DB_X - 115} y1={DB_Y - 175 + ratio * 350}
                x2={DB_X + 115} y2={DB_Y - 175 + ratio * 350}
                stroke={dbStroke} strokeWidth={1} strokeOpacity={0.3}
              />
            ))}
            {/* Top ellipse */}
            <ellipse cx={DB_X} cy={DB_Y - 175} rx={115} ry={30}
              fill={dbFill} stroke={dbStroke} strokeWidth={2.5} filter="url(#esG)" />
            {/* Bottom ellipse */}
            <ellipse cx={DB_X} cy={DB_Y + 175} rx={115} ry={30}
              fill={dbFill} stroke={dbStroke} strokeWidth={2.5} />
            {/* DB label */}
            <text x={DB_X} y={DB_Y + 12} textAnchor="middle"
              fill={dbStroke} fontSize={22} fontWeight="900" fontFamily="monospace"
              filter="url(#esG)">
              🗄 DATABASE
            </text>
            {/* Stress warning */}
            {dbStress > 0.65 && (
              <text x={DB_X} y={DB_Y + 50} textAnchor="middle"
                fill="#ff3333" fontSize={18} fontFamily="monospace"
                opacity={Math.min(1, (dbStress - 0.65) * 3)}>
                ⚠ OVERLOADING...
              </text>
            )}
          </g>

          {/* Write queue meter (right side) */}
          <rect x={780} y={620} width={50} height={300} rx={10}
            fill="rgba(8,12,25,0.85)" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5}
          />
          <rect x={782} y={620 + 300 * (1 - meterFill)} width={46} height={300 * meterFill}
            fill="url(#esMeterGrad)" rx={8}
          />
          <text x={805} y={610} textAnchor="middle" fill={meterColor} fontSize={16}
            fontFamily="monospace" fontWeight="700" filter="url(#esG)">
            QUEUE
          </text>
          <text x={805} y={940} textAnchor="middle" fill={meterColor} fontSize={15}
            fontFamily="monospace">
            {Math.floor(meterFill * 100)}%
          </text>

          {/* Write counter */}
          <text x={540} y={1140} textAnchor="middle" fill="white"
            fontSize={56} fontWeight="900" fontFamily="monospace">
            {writeCount.toLocaleString()}
          </text>
          <text x={540} y={1194} textAnchor="middle"
            fill="rgba(255,80,80,0.8)" fontSize={22} fontFamily="monospace">
            pending writes backing up...
          </text>

          {/* "Can't keep up" badge */}
          <g transform={`translate(540, 1360) scale(${p1Label2Scale})`} opacity={p1Label2Scale}>
            <rect x={-300} y={-44} width={600} height={88} rx={44}
              fill="#ff3333" filter="url(#esSG)" />
            <text x={0} y={14} textAnchor="middle" fill="white" fontSize={32}
              fontWeight="900" fontFamily="monospace">
              💀 CAN'T KEEP UP
            </text>
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 2 — "System would choke — Instagram doesn't even try"
        ═══════════════════════════════════════════════════════════════════ */}
        <g opacity={p2Op}>
          {/* Overloaded DB (same position) */}
          <g transform={`translate(${DB_X + p2Shake}, 0)`}>
            <rect x={DB_X - 115} y={DB_Y - 175} width={230} height={350}
              fill="rgba(220,50,50,0.15)" stroke="#ff3333" strokeWidth={3}
              filter="url(#esG)" />
            <ellipse cx={DB_X} cy={DB_Y - 175} rx={115} ry={30}
              fill="rgba(220,50,50,0.2)" stroke="#ff3333" strokeWidth={3} filter="url(#esG)" />
            <ellipse cx={DB_X} cy={DB_Y + 175} rx={115} ry={30}
              fill="rgba(220,50,50,0.15)" stroke="#ff3333" strokeWidth={3} />
            <text x={DB_X} y={DB_Y + 12} textAnchor="middle"
              fill="#ff3333" fontSize={22} fontWeight="900" fontFamily="monospace">
              🗄 DATABASE
            </text>
          </g>

          {/* CHOKED overlay — pops in */}
          <g transform={`translate(540, 760) scale(${chokePop})`} opacity={Math.min(1, chokePop)}>
            <rect x={-320} y={-68} width={640} height={136} rx={20}
              fill="#ff1a1a" filter="url(#esSG)" />
            <text x={0} y={-8} textAnchor="middle" fill="white" fontSize={52}
              fontWeight="900" fontFamily="monospace">
              ⛔ SYSTEM CHOKED
            </text>
            <text x={0} y={44} textAnchor="middle"
              fill="rgba(255,255,255,0.85)" fontSize={24} fontFamily="monospace">
              Queue overflowed · Requests dropped
            </text>
          </g>

          {/* Big X over the DB write concept */}
          <g opacity={Math.min(1, chokePop)}>
            <line x1={380} y1={620} x2={700} y2={1060}
              stroke="#ff3333" strokeWidth={12} strokeLinecap="round"
              opacity={0.85} filter="url(#esG)" />
            <line x1={700} y1={620} x2={380} y2={1060}
              stroke="#ff3333" strokeWidth={12} strokeLinecap="round"
              opacity={0.85} filter="url(#esG)" />
          </g>

          {/* "Instagram doesn't even try" */}
          <g transform={`translate(540, 1240) scale(${dontTryScale})`} opacity={dontTryScale}>
            <rect x={-440} y={-58} width={880} height={116} rx={28}
              fill="rgba(8,12,30,0.95)" stroke="rgba(225,48,108,0.6)" strokeWidth={2.5}
              filter="url(#esG)" />
            <text x={0} y={-8} textAnchor="middle" fill="white" fontSize={30}
              fontWeight="900" fontFamily="monospace">
              So Instagram doesn't even try to write
            </text>
            <text x={0} y={34} textAnchor="middle"
              fill="#C13584" fontSize={30} fontWeight="900" fontFamily="monospace"
              filter="url(#esG)">
              5M rows directly to the database.
            </text>
          </g>

          {/* Arrow down to what they do instead */}
          {dontTryScale > 0.5 && (
            <g opacity={Math.min(1, (dontTryScale - 0.5) * 2)}>
              <text x={540} y={1440} textAnchor="middle"
                fill="rgba(148,163,184,0.8)" fontSize={24} fontFamily="monospace">
                Instead... 👇
              </text>
            </g>
          )}
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 3 — "You tap the heart — phone turns red INSTANTLY"
        ═══════════════════════════════════════════════════════════════════ */}
        <g opacity={p3Op}>
          <g transform={`translate(0, ${phoneY})`}>
            {/* Phone body */}
            <rect x={390} y={310} width={300} height={590} rx={44}
              fill="#111118" stroke="rgba(255,255,255,0.18)" strokeWidth={2.5}
              filter="url(#esG)" />
            {/* Side button */}
            <rect x={688} y={450} width={6} height={70} rx={3} fill="rgba(255,255,255,0.2)" />
            <rect x={386} y={420} width={6} height={50} rx={3} fill="rgba(255,255,255,0.2)" />
            <rect x={386} y={488} width={6} height={50} rx={3} fill="rgba(255,255,255,0.2)" />
            {/* Dynamic island notch */}
            <rect x={497} y={322} width={86} height={24} rx={12} fill="#000" />
            {/* Screen */}
            <rect x={392} y={360} width={296} height={524} rx={28} fill="#0a0a10" />

            {/* ── INSTAGRAM UI inside screen ── */}
            {/* Status bar */}
            <text x={420} y={390} fill="white" fontSize={16} fontFamily="monospace" fontWeight="700">12:37</text>
            <text x={640} y={390} fill="white" fontSize={16} fontFamily="monospace">5G📶🔋</text>

            {/* Profile header */}
            <circle cx={420} cy={424} r={18}
              fill="none" stroke="url(#esIgGrad)" strokeWidth={2.5} />
            <circle cx={420} cy={424} r={14} fill="#1a1a2e" />
            <text x={420} y={429} textAnchor="middle" fill="white" fontSize={10} fontWeight="900" fontFamily="monospace">CR7</text>
            <text x={448} y={420} fill="white" fontSize={16} fontWeight="700" fontFamily="monospace">cristiano</text>
            {/* Verified */}
            <circle cx={530} cy={416} r={8} fill="#0095F6" />
            <path d="M527,416 L530,419 L534,413" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <text x={660} y={430} fill="rgba(255,255,255,0.5)" fontSize={22} fontFamily="monospace">···</text>

            {/* Chess photo placeholder */}
            <rect x={392} y={444} width={296} height={296} fill="#0d1525" />
            <rect x={392} y={444} width={296} height={296}
              fill="none" />
            {/* Chess board hint */}
            {Array.from({ length: 4 }, (_, ri) =>
              Array.from({ length: 4 }, (_, ci) => (
                <rect key={`${ri}-${ci}`}
                  x={392 + ci * 37} y={444 + ri * 37}
                  width={37} height={37}
                  fill={(ri + ci) % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.15)"}
                />
              ))
            )}
            <text x={540} y={578} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={52}>♟</text>
            <text x={540} y={620} textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize={20} fontFamily="monospace">Louis Vuitton × CR7</text>

            {/* Action bar */}
            <rect x={392} y={740} width={296} height={68} fill="#0a0a10" />
            {/* Heart icon */}
            <g transform={`translate(430, 774) scale(${heartScale * 1.35})`}>
              <path
                d="M0,-10.5 C-0.7,-12.8 -3.8,-14.2 -6.6,-14.2 C-11,-14.2 -13.8,-10.5 -13.8,-6.9 C-13.8,0.5 0,11.5 0,11.5 C0,11.5 13.8,0.5 13.8,-6.9 C13.8,-10.5 11,-14.2 6.6,-14.2 C3.8,-14.2 0.7,-12.8 0,-10.5 Z"
                fill={heartFilled ? "#ED4956" : "none"}
                stroke={heartFilled ? "#ED4956" : "rgba(255,255,255,0.8)"}
                strokeWidth={heartFilled ? 0 : 1.5}
                filter={heartFilled ? "url(#esSG)" : undefined}
              />
            </g>
            {/* Comment */}
            <path d="M462,760 Q462,755 467,755 L490,755 Q495,755 495,760 L495,776 Q495,781 490,781 L478,781 L472,787 L472,781 L467,781 Q462,781 462,776 Z"
              fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1.4} />
            {/* Send */}
            <path d="M506,773 L522,765 M506,773 L509,781 M506,773 L522,765 L514,786 L509,781 L506,773"
              fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1.4} strokeLinejoin="round" />
            {/* Bookmark (right) */}
            <path d="M672,757 L672,782 L664,776 L656,782 L656,757 Z"
              fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1.4} strokeLinejoin="round" />

            {/* Like count */}
            <text x={420} y={825}
              fill="white" fontSize={15} fontWeight="700" fontFamily="monospace">
              {heartFilled ? "36,478,771" : "36,478,770"} likes
            </text>

            {/* Double-tap heart overlay in photo */}
            {dtHOp > 0 && (
              <g transform={`translate(540, 592) scale(${dtHScale * 0.55})`} opacity={dtHOp}>
                <path
                  d="M0,-75 C-5,-90 -28,-100 -50,-100 C-82,-100 -100,-75 -100,-48 C-100,5 0,85 0,85 C0,85 100,5 100,-48 C100,-75 82,-100 50,-100 C28,-100 5,-90 0,-75 Z"
                  fill="white"
                  filter="url(#esSG)"
                />
              </g>
            )}
            {/* Ripple rings in photo */}
            {rip1R > 0 && (
              <circle cx={540} cy={592} r={rip1R}
                fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={2} opacity={rip1O} />
            )}
            {rip2R > 0 && (
              <circle cx={540} cy={592} r={rip2R}
                fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} opacity={rip2O} />
            )}

            {/* Mini hearts floating up from heart button */}
            {phoneHearts.map((h, i) => {
              const localF = Math.max(0, p3Local - h.delay);
              const rise = interpolate(localF, [0, 75], [0, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const hop = interpolate(localF, [0, 10, 55, 76], [0, 0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <g key={i}
                  transform={`translate(${430 + h.ox}, ${774 - rise}) scale(${h.size})`}
                  opacity={hop}>
                  <path d="M0,-75 C-5,-90 -28,-100 -50,-100 C-82,-100 -100,-75 -100,-48 C-100,5 0,85 0,85 C0,85 100,5 100,-48 C100,-75 82,-100 50,-100 C28,-100 5,-90 0,-75 Z"
                    fill="#ED4956" filter="url(#esG)" />
                </g>
              );
            })}

            {/* Pending / Confirmed indicators */}
            {pendingOp > 0 && (
              <g opacity={pendingOp}>
                <rect x={420} y={838} width={150} height={28} rx={14}
                  fill="rgba(250,204,21,0.15)" stroke="rgba(250,204,21,0.5)" strokeWidth={1} />
                <text x={495} y={857} textAnchor="middle" fill="#facc15" fontSize={13} fontFamily="monospace">
                  ⏳ sending...
                </text>
              </g>
            )}
            {confirmedOp > 0 && (
              <g opacity={confirmedOp}>
                <rect x={420} y={838} width={150} height={28} rx={14}
                  fill="rgba(0,220,100,0.15)" stroke="rgba(0,220,100,0.5)" strokeWidth={1} />
                <text x={495} y={857} textAnchor="middle" fill="#00dc64" fontSize={13} fontFamily="monospace">
                  ✓ confirmed
                </text>
              </g>
            )}
          </g>

          {/* "INSTANTLY" badge above phone */}
          <g transform={`translate(540, 205) scale(${instantBadge})`} opacity={Math.min(1, instantBadge)}>
            <rect x={-260} y={-46} width={520} height={92} rx={46}
              fill="#ED4956" filter="url(#esSG)" />
            <text x={0} y={16} textAnchor="middle" fill="white" fontSize={40}
              fontWeight="900" fontFamily="monospace">
              ❤ INSTANTLY
            </text>
          </g>

          {/* Optimistic UI label */}
          <g opacity={optUiOp}>
            <rect x={40} y={1060} width={1000} height={110} rx={18}
              fill="rgba(8,12,30,0.9)" stroke="rgba(193,53,132,0.3)" strokeWidth={1.5} />
            <text x={540} y={1102} textAnchor="middle"
              fill="rgba(193,53,132,0.9)" fontSize={32} fontWeight="700" fontFamily="monospace">
              OPTIMISTIC UI
            </text>
            <text x={540} y={1148} textAnchor="middle"
              fill="rgba(148,163,184,0.85)" fontSize={26} fontFamily="monospace">
              Phone says ❤ BEFORE the server processes it
            </text>
          </g>

          {/* Client vs Server labels */}
          {optUiOp > 0.5 && (
            <g opacity={Math.min(1, (optUiOp - 0.5) * 2)}>
              <text x={540} y={1230} textAnchor="middle"
                fill="rgba(148,163,184,0.7)" fontSize={20} fontFamily="monospace">
                Your device: instant feedback ✓ · Server: still catching up →
              </text>
            </g>
          )}
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 4 + 5 (shared) — Scrolling logbook
        ═══════════════════════════════════════════════════════════════════ */}
        <g opacity={Math.max(p4Op, p5Op)}>
          {/* Terminal frame */}
          <rect x={30} y={LOG_CONTAINER_Y} width={1020} height={LOG_CONTAINER_H}
            rx={18} fill="rgba(6,10,24,0.97)"
            stroke="rgba(193,53,132,0.3)" strokeWidth={2} />
          {/* Terminal header */}
          <rect x={30} y={LOG_CONTAINER_Y} width={1020} height={46} rx={18}
            fill="rgba(14,20,40,0.98)" />
          <rect x={30} y={LOG_CONTAINER_Y + 26} width={1020} height={20}
            fill="rgba(14,20,40,0.98)" />
          <circle cx={62} cy={LOG_CONTAINER_Y + 22} r={7} fill="#ff5f56" />
          <circle cx={86} cy={LOG_CONTAINER_Y + 22} r={7} fill="#ffbd2e" />
          <circle cx={110} cy={LOG_CONTAINER_Y + 22} r={7} fill="#27c93f" />
          <text x={540} y={LOG_CONTAINER_Y + 28} textAnchor="middle"
            fill="#4b5563" fontSize={14} fontFamily="monospace">
            redis-stream://likes-queue · [LIVE QUEUE]
          </text>
          <line x1={30} y1={LOG_CONTAINER_Y + 44} x2={1050} y2={LOG_CONTAINER_Y + 44}
            stroke="rgba(193,53,132,0.22)" strokeWidth={1} />

          {/* Scrolling entries */}
          <g clipPath="url(#esLogClip)">
            <g transform={`translate(0, ${-(p4Op > p5Op ? scrollY : activeScroll)})`}>
              {LOG_ENTRIES.map((entry, i) => {
                const ey = LOG_CONTAINER_Y + 48 + i * ENTRY_H;
                const entryOp = interpolate(frame, [P4.s + i * 4, P4.s + i * 4 + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <g key={i} opacity={entryOp}>
                    <rect x={32} y={ey - 2} width={1016} height={ENTRY_H - 6}
                      fill={i % 2 === 0 ? "rgba(193,53,132,0.03)" : "transparent"} rx={4} />
                    <line x1={52} y1={ey + ENTRY_H - 8} x2={1028} y2={ey + ENTRY_H - 8}
                      stroke="rgba(255,255,255,0.04)" strokeWidth={1} />

                    {/* Timestamp */}
                    <text x={58} y={ey + 28}
                      fill="rgba(90,110,135,0.85)" fontSize={16} fontFamily="monospace">
                      {`10:${entry.min}:${entry.sec}.${entry.ms}`}
                    </text>

                    {/* LIKE badge */}
                    <rect x={248} y={ey + 8} width={70} height={28} rx={7}
                      fill="rgba(237,73,86,0.16)" stroke="#ED4956" strokeWidth={1} />
                    <text x={283} y={ey + 28} textAnchor="middle"
                      fill="#ED4956" fontSize={14} fontWeight="700" fontFamily="monospace">
                      ❤ LIKE
                    </text>

                    {/* User */}
                    <text x={336} y={ey + 28}
                      fill={`hsl(${270 + (i % 24) * 6},65%,65%)`}
                      fontSize={16} fontFamily="monospace">
                      {entry.user}
                    </text>

                    {/* Post */}
                    <text x={600} y={ey + 28}
                      fill="rgba(148,163,184,0.65)" fontSize={16} fontFamily="monospace">
                      → post:C7_chess_2022
                    </text>

                    {/* Logged status */}
                    <text x={940} y={ey + 28}
                      fill="rgba(0,220,100,0.75)" fontSize={14} fontFamily="monospace">
                      ✓ appended
                    </text>
                  </g>
                );
              })}
            </g>
          </g>

          {/* Fade top (infinite scroll illusion) */}
          <defs>
            <linearGradient id="fadeLogTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06090a" stopOpacity={1} />
              <stop offset="100%" stopColor="#06090a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fadeLogBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06090a" stopOpacity={0} />
              <stop offset="100%" stopColor="#06090a" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <rect x={30} y={LOG_CONTAINER_Y + 44} width={1020} height={60}
            fill="url(#fadeLogTop)" />
          <rect x={30} y={LOG_CONTAINER_Y + LOG_CONTAINER_H - 70} width={1020} height={70}
            fill="url(#fadeLogBot)" />

          {/* Live event counter (P4) */}
          <g opacity={p4Op}>
            <text x={540} y={LOG_CONTAINER_Y + LOG_CONTAINER_H + 80} textAnchor="middle"
              fill="white" fontSize={58} fontWeight="900" fontFamily="monospace">
              {loggedCount.toLocaleString()}
            </text>
            <text x={540} y={LOG_CONTAINER_Y + LOG_CONTAINER_H + 120} textAnchor="middle"
              fill="rgba(193,53,132,0.75)" fontSize={22} fontFamily="monospace">
              ❤ events appended · no waiting
            </text>

            {/* "Fast append" badge */}
            <g transform={`translate(540, ${LOG_CONTAINER_Y + LOG_CONTAINER_H + 230}) scale(${p4BadgeIn})`}
              opacity={p4BadgeIn}>
              <rect x={-340} y={-48} width={680} height={96} rx={48}
                fill="rgba(193,53,132,0.15)" stroke="#C13584" strokeWidth={2.5}
                filter="url(#esG)" />
              <text x={0} y={16} textAnchor="middle" fill="#C13584" fontSize={32}
                fontWeight="900" fontFamily="monospace">
                📋 QUEUE IT · NO BLOCKING
              </text>
            </g>
          </g>

          {/* Endless infinity badge (P5) */}
          <g opacity={p5Op}>
            <g transform={`translate(540, ${LOG_CONTAINER_Y + LOG_CONTAINER_H + 80}) scale(${infScale})`}
              opacity={infScale}>
              <text x={0} y={0} textAnchor="middle" fill="white" fontSize={110}
                fontWeight="900" fontFamily="monospace" filter="url(#esSG)">
                ∞
              </text>
            </g>
            <text x={540} y={LOG_CONTAINER_Y + LOG_CONTAINER_H + 200} textAnchor="middle"
              fill="rgba(148,163,184,0.8)" fontSize={24} fontFamily="monospace">
              {totalLogged.toLocaleString()} events · growing every millisecond
            </text>
            <text x={540} y={LOG_CONTAINER_Y + LOG_CONTAINER_H + 240} textAnchor="middle"
              fill="rgba(148,163,184,0.5)" fontSize={20} fontFamily="monospace">
              ↑ more above · more below ↓
            </text>
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 6 — "No rushing, no crashing" — Conveyor belt
        ═══════════════════════════════════════════════════════════════════ */}
        <g opacity={p6Op}>
          <text x={540} y={320} textAnchor="middle"
            fill="rgba(148,163,184,0.85)" fontSize={38} fontWeight="900" fontFamily="monospace" letterSpacing={4}>
            QUEUE IN ACTION
          </text>

          {/* Conveyor belt track */}
          <rect x={0} y={865} width={1080} height={24} rx={12}
            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Animated track dashes */}
          {Array.from({ length: 14 }, (_, i) => {
            const dashX = ((i * 90 - (p6Local * 8.5) % 90) + 1080) % 1080;
            return (
              <rect key={i} x={dashX} y={869} width={50} height={16} rx={4}
                fill="rgba(255,255,255,0.08)" />
            );
          })}
          {/* Support legs */}
          {[120, 360, 600, 840].map((lx, i) => (
            <rect key={i} x={lx - 4} y={877} width={8} height={80} rx={4}
              fill="rgba(255,255,255,0.12)" />
          ))}

          {/* Moving event boxes */}
          {Array.from({ length: 7 }, (_, i) => {
            const baseX = i * ITEM_GAP - beltOffset;
            const x = ((baseX % (ITEM_GAP * 7)) + ITEM_GAP * 7 + 200) % (ITEM_GAP * 7 + 200) - 180;
            if (x < -180 || x > 1180) return null;
            const hasCheck = x < 750 && x > 80;
            const checkScale = hasCheck
              ? spring({ frame: Math.max(0, p6Local - Math.floor(x / 60)), fps, config: { damping: 8, stiffness: 280 } })
              : 0;
            return (
              <g key={i} transform={`translate(${x}, 820)`}>
                <rect x={0} y={0} width={ITEM_W} height={80} rx={14}
                  fill={`rgba(${hasCheck ? "0,200,120" : "131,58,180"},0.12)`}
                  stroke={hasCheck ? "rgba(0,200,120,0.6)" : "rgba(131,58,180,0.4)"}
                  strokeWidth={2}
                  filter="url(#esG)"
                />
                <text x={ITEM_W / 2} y={32} textAnchor="middle"
                  fill={hasCheck ? "#00c878" : "#C13584"}
                  fontSize={18} fontWeight="900" fontFamily="monospace">
                  ❤ LIKE
                </text>
                <text x={ITEM_W / 2} y={56} textAnchor="middle"
                  fill="rgba(148,163,184,0.7)" fontSize={13} fontFamily="monospace">
                  {`user_${(i * 847293 + 182947) % 10000000}`}
                </text>
                {/* Green checkmark */}
                {checkScale > 0 && (
                  <g transform={`translate(${ITEM_W - 28}, 12) scale(${checkScale})`} opacity={checkScale}>
                    <circle cx={0} cy={0} r={14} fill="#00c878" filter="url(#esG)" />
                    <path d="M-7,0 L-2,5 L8,-6" stroke="white" strokeWidth={2.5}
                      strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Stats below belt */}
          <text x={540} y={1050} textAnchor="middle"
            fill="rgba(148,163,184,0.6)" fontSize={20} fontFamily="monospace">
            Events processed in order · Every single one ✓
          </text>

          {/* NO RUSHING badge */}
          <g transform={`translate(300, 1180) scale(${calm1Scale})`} opacity={calm1Scale}>
            <rect x={-220} y={-46} width={440} height={92} rx={46}
              fill="rgba(0,200,120,0.12)" stroke="#00c878" strokeWidth={2.5}
              filter="url(#esG)" />
            <text x={0} y={16} textAnchor="middle" fill="#00c878" fontSize={30}
              fontWeight="900" fontFamily="monospace">
              ✓ NO RUSHING
            </text>
          </g>

          {/* NO CRASHING badge */}
          <g transform={`translate(780, 1180) scale(${calm2Scale})`} opacity={calm2Scale}>
            <rect x={-220} y={-46} width={440} height={92} rx={46}
              fill="rgba(0,200,120,0.12)" stroke="#00c878" strokeWidth={2.5}
              filter="url(#esG)" />
            <text x={0} y={16} textAnchor="middle" fill="#00c878" fontSize={30}
              fontWeight="900" fontFamily="monospace">
              ✓ NO CRASHING
            </text>
          </g>

          {/* Summary */}
          {calm2Scale > 0.4 && (
            <g opacity={Math.min(1, (calm2Scale - 0.4) * 1.7)}>
              <text x={540} y={1350} textAnchor="middle"
                fill="rgba(148,163,184,0.8)" fontSize={22} fontFamily="monospace">
                Append to queue = instant · No waiting for DB locks
              </text>
              <text x={540} y={1386} textAnchor="middle"
                fill="rgba(252,175,69,0.75)" fontSize={19} fontFamily="monospace">
                Redis keeps this queue in memory → blazing fast ⚡
              </text>
            </g>
          )}
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 7 — "That logbook IS the Event Stream" — Big reveal
        ═══════════════════════════════════════════════════════════════════ */}
        <g opacity={p7Op}>
          {/* Kafka-style topic rings */}
          {[220, 180, 140, 100].map((r, i) => (
            <circle key={i} cx={540} cy={760}
              r={r * kafkaPulse}
              fill="none"
              stroke={`hsl(${280 + i * 20},65%,55%)`}
              strokeWidth={2 - i * 0.3}
              strokeDasharray={`${12 + i * 8},${8 + i * 4}`}
              strokeDashoffset={-(p7Local * (9 + i * 3))}
              opacity={(ringIn * (0.5 - i * 0.1))}
              filter="url(#esG)"
            />
          ))}

          {/* Central topic node */}
          <circle cx={540} cy={760} r={80 * kafkaPulse}
            fill="rgba(131,58,180,0.12)"
            stroke="#833AB4" strokeWidth={3}
            filter="url(#esSG)"
          />
          <text x={540} y={748} textAnchor="middle" fontSize={44}>📋</text>
          <text x={540} y={790} textAnchor="middle"
            fill="#C13584" fontSize={14} fontWeight="900" fontFamily="monospace">
            TOPIC
          </text>

          {/* Partition indicators around ring */}
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2 + p7Local * 0.01;
            const px = 540 + Math.cos(a) * 260;
            const py = 760 + Math.sin(a) * 200;
            const pScale = spring({ frame: p7Local - 8 - i * 5, fps, config: { damping: 9, stiffness: 195 } });
            return (
              <g key={i} transform={`translate(${px}, ${py}) scale(${pScale})`} opacity={pScale}>
                <rect x={-32} y={-18} width={64} height={36} rx={8}
                  fill={`rgba(131,58,180,0.2)`}
                  stroke={`hsl(${270 + i * 18},60%,55%)`}
                  strokeWidth={1.5}
                />
                <text x={0} y={8} textAnchor="middle"
                  fill={`hsl(${270 + i * 18},70%,65%)`}
                  fontSize={12} fontWeight="700" fontFamily="monospace">
                  P-{i}
                </text>
              </g>
            );
          })}

          {/* Main MESSAGE QUEUE label */}
          <g transform={`translate(540, 1060) scale(${revealScale * 1.1})`} opacity={revealScale}>
            <rect x={-440} y={-75} width={880} height={150} rx={32}
              fill="rgba(8,12,30,0.95)"
              stroke="url(#esIgGrad)" strokeWidth={3}
              filter="url(#esSG)"
            />
            <text x={0} y={5} textAnchor="middle" fill="white" fontSize={64}
              fontWeight="900" fontFamily="monospace" letterSpacing={2}
              filter="url(#esSG)">
              MESSAGE QUEUE
            </text>
            <text x={0} y={50} textAnchor="middle"
              fill="rgba(193,53,132,0.8)" fontSize={28} fontFamily="monospace">
              (Write now, process later)
            </text>
          </g>

          {/* Four properties */}
          <g transform={`translate(540, 1280) scale(${subScale})`} opacity={subScale}>
            {[
              { label: "⚡ FAST WRITES",   color: "#FCAF45", x: -340 },
              { label: "📋 ORDERED",        color: "#C13584", x: -110 },
              { label: "♾ ENDLESS",        color: "#833AB4", x: 110  },
              { label: "✓ RELIABLE",        color: "#405DE6", x: 330  },
            ].map((item, i) => (
              <g key={i} transform={`translate(${item.x}, 0)`}>
                <text x={0} y={0} textAnchor="middle"
                  fill={item.color} fontSize={22}
                  fontWeight="900" fontFamily="monospace"
                  filter="url(#esG)">
                  {item.label}
                </text>
              </g>
            ))}
          </g>

          {/* Kafka credit */}
          {subScale > 0.5 && (
            <g opacity={Math.min(1, (subScale - 0.5) * 2)}>
              <rect x={100} y={1420} width={880} height={85} rx={16}
                fill="rgba(8,12,30,0.92)" stroke="rgba(252,175,69,0.2)" strokeWidth={2}
              />
              <text x={540} y={1452} textAnchor="middle"
                fill="rgba(252,175,69,0.95)" fontSize={20} fontWeight="700" fontFamily="monospace">
                Instagram uses: Redis Streams (fast queue)
              </text>
              <text x={540} y={1485} textAnchor="middle"
                fill="rgba(148,163,184,0.7)" fontSize={18} fontFamily="monospace">
                Also: Apache Kafka · Amazon Kinesis
              </text>
            </g>
          )}
        </g>

      </svg>
    </AbsoluteFill>
  );
};

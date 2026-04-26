import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import { MONITOR_COLORS } from '../components/Monitor';

const BG_GRADIENT = `radial-gradient(circle at center, ${MONITOR_COLORS.BG_LIGHT} 0%, ${MONITOR_COLORS.BG_DARK} 100%)`;
const CARD = '#ffffff';
const BORDER = '#e2e8f0';
const TEXT = MONITOR_COLORS.TEXT_MAIN;
const DIM = MONITOR_COLORS.TEXT_DIM;
const GREEN = '#2ecc71';
const RED = '#e74c3c';
const PNPM = '#f39c12';

// 9:16 canvas: 1080 × 1920
const PROJ_CX = 265;    
const RIGHT_CX = 790;   

const PROJ1_CY = 480;   
const PROJ2_CY = 1020;  
const STORE_CY = 750;   
const SERVER_CY = 1550; 

const ARROW_X1 = 485;  // Right edge of projects
const ARROW_X2 = 570;  // Left edge of store/server

const VARROW_Y1 = 1050;   // bottom of store card
const VARROW_Y2 = 1450;  // top of server card

// Timing (frames, 30fps) — scene is 487 frames = 16.22s
// Narration sync:
//   0–163f   "Instead of duplicating files, PNPM keeps a single copy in a global central store."
//              → project 1 types → check store → miss → request registry → download → store fills
//   176–259f "Each project then simply links to that central version."
//              → symlink arrow from store to project 1
//   273–384f "This means your second project starts instantly with zero duplication."
//              → project 2 appears → checks store → HIT! → symlink
//   397–487f "No more wasted disk space, just pure speed."
//              → final state holds
const T = {
  APPEAR: 10,
  TYPE1_START: 15,
  TYPE1_END: 45,
  CHECK1_START: 52,
  CHECK1_END: 85,
  MISS_SHOW: 90,
  REQ_START: 102,
  REQ_END: 140,
  DL_START: 148,
  DL_END: 185,
  STORE_FILL: 188,  // store fills — "keeps a single copy in global store"
  SYM1_START: 195,
  SYM1_END: 230,
  SYM1_DONE: 232,
  PROJ2_APPEAR: 272, // "second project starts instantly" at 273f
  TYPE2_START: 280,
  TYPE2_END: 305,
  CHECK2_START: 312,
  CHECK2_END: 335,
  HIT_SHOW: 338,    // cache HIT — "starts instantly with zero duplication"
  SYM2_START: 345,
  SYM2_END: 378,
  SYM2_DONE: 380,
};

interface HArrowProps {
  x1: number; x2: number; y: number;
  color: string; startFrame: number; endFrame: number;
  label?: string; dashed?: boolean;
}

const HArrow: React.FC<HArrowProps> = ({ x1, x2, y, color, startFrame, endFrame, label, dashed }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  if (progress <= 0) return null;

  const goRight = x2 > x1;
  const totalLen = Math.abs(x2 - x1);
  const drawnLen = totalLen * progress;
  const lineX = goRight ? x1 : x2 + totalLen * (1 - progress);

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: lineX, top: y - 1, width: drawnLen, height: 3,
        backgroundColor: dashed ? 'transparent' : color,
        backgroundImage: dashed
          ? `repeating-linear-gradient(90deg,${color} 0,${color} 8px,transparent 8px,transparent 16px)`
          : 'none',
        borderRadius: 2,
      }} />
      {progress > 0.88 && (
        <div style={{
          position: 'absolute',
          left: goRight ? x2 - 12 : x2,
          top: y - 8, width: 0, height: 0,
          borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
          ...(goRight ? { borderLeft: `12px solid ${color}` } : { borderRight: `12px solid ${color}` }),
        }} />
      )}
      {label && progress > 0.5 && (
        <div style={{
          position: 'absolute',
          left: (x1 + x2) / 2 - 65, top: y - 32,
          color, fontSize: 16, fontFamily: 'system-ui, sans-serif', fontWeight: 700, textAlign: 'center',
          width: 130, backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: 10,
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: `1px solid ${color}22`,
        }}>{label}</div>
      )}
    </div>
  );
};

interface VArrowProps {
  x: number; y1: number; y2: number;
  color: string; startFrame: number; endFrame: number;
  label?: string; dashed?: boolean;
}

const VArrow: React.FC<VArrowProps> = ({ x, y1, y2, color, startFrame, endFrame, label, dashed }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  if (progress <= 0) return null;

  const goDown = y2 > y1;
  const totalLen = Math.abs(y2 - y1);
  const drawnLen = totalLen * progress;
  const lineY = goDown ? y1 : y2 + totalLen * (1 - progress);

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: x - 1, top: lineY, width: 3, height: drawnLen,
        backgroundColor: dashed ? 'transparent' : color,
        backgroundImage: dashed
          ? `repeating-linear-gradient(180deg,${color} 0,${color} 8px,transparent 8px,transparent 16px)`
          : 'none',
        borderRadius: 2,
      }} />
      {progress > 0.88 && (
        <div style={{
          position: 'absolute', left: x - 8,
          top: goDown ? y2 - 12 : y2,
          width: 0, height: 0,
          borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          ...(goDown ? { borderTop: `12px solid ${color}` } : { borderBottom: `12px solid ${color}` }),
        }} />
      )}
      {label && progress > 0.5 && (
        <div style={{
          position: 'absolute', left: x + 15,
          top: (y1 + y2) / 2 - 16,
          color, fontSize: 16, fontFamily: 'system-ui, sans-serif', fontWeight: 700,
          backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: 10,
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: `1px solid ${color}22`, whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
    </div>
  );
};

interface HDotProps { x1: number; x2: number; y: number; color: string; startFrame: number; endFrame: number; }
const HMovingDot: React.FC<HDotProps> = ({ x1, x2, y, color, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const mid = (startFrame + endFrame) / 2;
  const fadeInEnd = Math.min(startFrame + 8, mid - 1);
  const fadeOutStart = Math.max(endFrame - 8, mid + 1);
  const op = interpolate(frame, [startFrame, fadeInEnd, fadeOutStart, endFrame], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const dotX = interpolate(frame, [startFrame, endFrame], [x1, x2], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  if (op <= 0) return null;
  return (
    <div style={{
      position: 'absolute', left: dotX - 10, top: y - 10,
      width: 20, height: 20, borderRadius: '50%',
      backgroundColor: color, opacity: op, boxShadow: `0 0 15px ${color}`,
    }} />
  );
};

interface VDotProps { x: number; y1: number; y2: number; color: string; startFrame: number; endFrame: number; }
const VMovingDot: React.FC<VDotProps> = ({ x, y1, y2, color, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const mid = (startFrame + endFrame) / 2;
  const fadeInEnd = Math.min(startFrame + 8, mid - 1);
  const fadeOutStart = Math.max(endFrame - 8, mid + 1);
  const op = interpolate(frame, [startFrame, fadeInEnd, fadeOutStart, endFrame], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const dotY = interpolate(frame, [startFrame, endFrame], [y1, y2], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  if (op <= 0) return null;
  return (
    <div style={{
      position: 'absolute', left: x - 10, top: dotY - 10,
      width: 20, height: 20, borderRadius: '50%',
      backgroundColor: color, opacity: op, boxShadow: `0 0 15px ${color}`,
    }} />
  );
};

const CMD = 'pnpm add react';

export const Scene4PnpmFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = interpolate(frame, [0, T.APPEAR], [0, 1], { extrapolateRight: 'clamp' });

  // Project 1 typing
  const chars1 = Math.floor(interpolate(frame, [T.TYPE1_START, T.TYPE1_END], [0, CMD.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const cursor1 = frame >= T.TYPE1_START && frame < T.CHECK1_START && Math.floor(frame / 15) % 2 === 0;

  // Project 2 typing
  const chars2 = Math.floor(interpolate(frame, [T.TYPE2_START, T.TYPE2_END], [0, CMD.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const cursor2 = frame >= T.TYPE2_START && frame < T.CHECK2_START && Math.floor(frame / 15) % 2 === 0;

  const storeHasReact = frame >= T.STORE_FILL;
  const storeGlow = interpolate(frame, [T.STORE_FILL, T.STORE_FILL + 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const srvGlow = interpolate(frame, [T.REQ_END, T.REQ_END + 5, T.DL_START, T.DL_START + 20], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const missOp = interpolate(frame, [T.MISS_SHOW, T.MISS_SHOW + 10, T.REQ_START - 1, T.REQ_START], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const hitGlow = interpolate(frame, [T.HIT_SHOW, T.HIT_SHOW + 16], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const hitPulse = interpolate(
    (frame - T.HIT_SHOW) % 30, [0, 15, 30], [1, 1.2, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const storeSp = spring({ frame: frame - T.APPEAR, fps, config: { damping: 11, stiffness: 160 } });
  const storeScale = interpolate(storeSp, [0, 1], [0.5, 1]);
  const storeEntranceOp = interpolate(storeSp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const pkgSp = spring({ frame: frame - T.STORE_FILL, fps, config: { damping: 12, stiffness: 200 } });
  const pkgSlide = interpolate(pkgSp, [0, 1], [40, 0]);
  const pkgOp = interpolate(pkgSp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const sym1Op = interpolate(frame, [T.SYM1_DONE, T.SYM1_DONE + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const sym2Op = interpolate(frame, [T.SYM2_DONE, T.SYM2_DONE + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const proj2Sp = spring({ frame: frame - T.PROJ2_APPEAR, fps, config: { damping: 200 } });
  const proj2Op = interpolate(proj2Sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
  const proj2Slide = interpolate(proj2Sp, [0, 1], [50, 0]);

  const cardBase: React.CSSProperties = {
    backgroundColor: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    padding: '24px 28px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  };

  return (
    <AbsoluteFill style={{ background: BG_GRADIENT, opacity: sceneOp }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 170, left: 0, right: 0,
        textAlign: 'center', fontFamily: 'system-ui, sans-serif',
        fontSize: 42, fontWeight: 900, color: PNPM,
      }}>
        How pnpm works
      </div>

      {/* Column labels */}
      <div style={{
        position: 'absolute', top: 230, left: PROJ_CX - 120, width: 240,
        textAlign: 'center', color: MONITOR_COLORS.TEXT_DIM, fontSize: 16, fontFamily: 'system-ui, sans-serif',
        fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2,
      }}>Projects</div>
      <div style={{
        position: 'absolute', top: 230, left: RIGHT_CX - 120, width: 240,
        textAlign: 'center', color: PNPM, fontSize: 16, fontFamily: 'system-ui, sans-serif',
        fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2,
      }}>pnpm store</div>

      {/* ── Project 1 ── */}
      <div style={{
        position: 'absolute',
        left: 45, top: PROJ1_CY - 100, width: 440,
        ...cardBase, border: `1px solid ${PNPM}44`,
      }}>
        <div style={{ color: TEXT, fontWeight: 800, marginBottom: 12, fontSize: 20 }}>📁 my-app</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: MONITOR_COLORS.TEXT_MAIN, fontSize: 20, fontFamily: 'monospace' }}>
          <span style={{ color: GREEN, fontWeight: 900 }}>$</span>
          <span>{CMD.slice(0, chars1)}</span>
          {cursor1 && <div style={{ width: 12, height: 24, backgroundColor: TEXT, borderRadius: 2 }} />}
        </div>
        {frame >= T.SYM1_DONE && (
          <div style={{
            marginTop: 14, opacity: sym1Op,
            color: GREEN, fontSize: 16, fontWeight: 600,
            borderTop: `1px solid ${GREEN}22`, paddingTop: 10,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{ width: 30, height: 20, overflow: 'hidden', borderRadius: 4 }}>
              <Img src={staticFile('npm-vs-pnpm/react-folder-image.png')} style={{ width: '100%' }} />
            </div>
            <span>🔗 node_modules/react → pnpm store</span>
          </div>
        )}
      </div>

      {/* ── Project 2 ── */}
      {frame >= T.PROJ2_APPEAR && (
        <div style={{
          position: 'absolute',
          left: 45, top: PROJ2_CY - 100 + proj2Slide, width: 440,
          opacity: proj2Op,
          ...cardBase, border: `1px solid ${PNPM}44`,
        }}>
          <div style={{ color: TEXT, fontWeight: 800, marginBottom: 12, fontSize: 20 }}>📁 portfolio</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: MONITOR_COLORS.TEXT_MAIN, fontSize: 20, fontFamily: 'monospace' }}>
            <span style={{ color: GREEN, fontWeight: 900 }}>$</span>
            <span>{CMD.slice(0, chars2)}</span>
            {cursor2 && <div style={{ width: 12, height: 24, backgroundColor: TEXT, borderRadius: 2 }} />}
          </div>
          {frame >= T.SYM2_DONE && (
            <div style={{
              marginTop: 14, opacity: sym2Op,
              color: GREEN, fontSize: 16, fontWeight: 600,
              borderTop: `1px solid ${GREEN}22`, paddingTop: 10,
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{ width: 30, height: 20, overflow: 'hidden', borderRadius: 4 }}>
                <Img src={staticFile('npm-vs-pnpm/react-folder-image.png')} style={{ width: '100%' }} />
              </div>
              <span>🔗 zero duplicate!</span>
            </div>
          )}
        </div>
      )}

      {/* ── pnpm store card ── */}
      <div style={{
        position: 'absolute',
        left: RIGHT_CX - 220, top: STORE_CY - 280, width: 440,
        opacity: storeEntranceOp,
        transform: `scale(${storeScale})`,
        transformOrigin: 'center center',
        minHeight: 600,
        ...cardBase,
        padding: '24px 26px',
        border: `2px solid ${frame >= T.HIT_SHOW ? GREEN : storeHasReact ? PNPM : BORDER}`,
        boxShadow: frame >= T.HIT_SHOW
          ? `0 0 ${hitGlow * 50}px ${GREEN}33`
          : storeHasReact
          ? `0 0 ${storeGlow * 30}px ${PNPM}22`
          : '0 10px 30px rgba(0,0,0,0.05)',
      }}>
        {/* Store header */}
        <div style={{
          color: PNPM, fontWeight: 800, fontSize: 22,
          marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${PNPM}22`, paddingBottom: 15,
        }}>
          <span style={{ fontSize: 28 }}>🗄</span>
          <span>pnpm store</span>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: DIM, fontWeight: 500 }}>~/.pnpm-store</span>
        </div>

        {/* 3D Render Image of the store */}
        <div style={{
          width: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 20,
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          opacity: storeHasReact ? 1 : 0.6,
          filter: storeHasReact ? 'none' : 'grayscale(100%) brightness(0.9)',
          transition: 'all 0.5s ease-in-out'
        }}>
          <Img src={staticFile('npm-vs-pnpm/pnpm-store.png')} style={{ width: '100%', display: 'block' }} />
        </div>

        {!storeHasReact && (
          <div style={{
            padding: '15px', backgroundColor: '#f8fafc',
            borderRadius: 15, border: `2px dashed ${BORDER}`, textAlign: 'center',
          }}>
            {frame >= T.CHECK1_START ? (
              <>
                <div style={{ fontSize: 24, marginBottom: 5 }}>{missOp > 0 ? '❌' : '🔍'}</div>
                <div style={{ fontSize: 16, color: missOp > 0 ? RED : DIM, fontWeight: 700 }}>
                  {missOp > 0 ? 'react — not found' : 'searching store…'}
                </div>
              </>
            ) : (
              <div style={{ color: DIM, fontSize: 14, fontWeight: 500 }}>No packages cached yet</div>
            )}
          </div>
        )}

        {storeHasReact && (
          <div style={{
            transform: `translateY(${pkgSlide}px)`, opacity: pkgOp,
            backgroundColor: frame >= T.HIT_SHOW ? '#f0fdf4' : '#fffbeb',
            border: `1.5px solid ${frame >= T.HIT_SHOW ? GREEN : PNPM}44`,
            borderRadius: 15, padding: '15px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 28, overflow: 'hidden', borderRadius: 4 }}>
                <Img src={staticFile('npm-vs-pnpm/react-folder-image.png')} style={{ width: '100%' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: MONITOR_COLORS.TEXT_MAIN }}>react@18.2.0</span>
              {frame >= T.HIT_SHOW && (
                <span style={{
                  marginLeft: 'auto', backgroundColor: GREEN, color: '#ffffff',
                  fontSize: 12, fontWeight: 900, padding: '2px 10px', borderRadius: 20,
                  transform: `scale(${hitPulse})`, display: 'inline-block',
                }}>HIT!</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: DIM, fontWeight: 500 }}>
              {frame >= T.HIT_SHOW
                ? '🔗 Shared by 2 projects'
                : frame >= T.SYM1_DONE
                ? '🔗 Linked to my-app'
                : '⬇ Fetching from registry…'}
            </div>
          </div>
        )}
      </div>

      {/* ── Server card ── */}
      <div style={{
        position: 'absolute',
        left: RIGHT_CX - 220, top: SERVER_CY - 100, width: 440,
        ...cardBase,
        border: `2px solid ${srvGlow > 0.1 ? RED : BORDER}`,
        boxShadow: srvGlow > 0 ? `0 0 ${srvGlow * 30}px ${RED}33` : '0 10px 25px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 12, padding: '12px'
      }}>
        <Img src={staticFile('npm-vs-pnpm/npm-registery.png')} style={{ width: '90%', borderRadius: 12 }} />
        <div style={{ color: RED, fontSize: 18, fontFamily: 'monospace', fontWeight: 800, marginTop: 4 }}>
          registry.npmjs.org
        </div>
      </div>

      {/* ═══ ARROWS ═══ */}
      <HArrow x1={ARROW_X1} x2={ARROW_X2} y={PROJ1_CY - 10}
        color={DIM} startFrame={T.CHECK1_START} endFrame={T.CHECK1_END} label="check store" />
      <VArrow x={RIGHT_CX - 15} y1={VARROW_Y1} y2={VARROW_Y2}
        color={RED} startFrame={T.REQ_START} endFrame={T.REQ_END} label="GET /react" />
      <VArrow x={RIGHT_CX + 15} y1={VARROW_Y2} y2={VARROW_Y1}
        color={GREEN} startFrame={T.DL_START} endFrame={T.DL_END} label="react@18 ↓" />
      <HArrow x1={ARROW_X2} x2={ARROW_X1} y={PROJ1_CY + 25}
        color={PNPM} startFrame={T.SYM1_START} endFrame={T.SYM1_END} label="🔗 symlink" dashed />
      {frame >= T.PROJ2_APPEAR && (
        <HArrow x1={ARROW_X1} x2={ARROW_X2} y={PROJ2_CY - 10}
          color={GREEN} startFrame={T.CHECK2_START} endFrame={T.CHECK2_END} label="check store" />
      )}
      {frame >= T.PROJ2_APPEAR && (
        <HArrow x1={ARROW_X2} x2={ARROW_X1} y={PROJ2_CY + 25}
          color={PNPM} startFrame={T.SYM2_START} endFrame={T.SYM2_END} label="🔗 symlink" dashed />
      )}

      {/* Moving dots */}
      <HMovingDot x1={ARROW_X1} x2={ARROW_X2} y={PROJ1_CY - 10} color={DIM} startFrame={T.CHECK1_START} endFrame={T.CHECK1_END} />
      <VMovingDot x={RIGHT_CX - 15} y1={VARROW_Y1} y2={VARROW_Y2} color={RED} startFrame={T.REQ_START} endFrame={T.REQ_END} />
      <VMovingDot x={RIGHT_CX + 15} y1={VARROW_Y2} y2={VARROW_Y1} color={GREEN} startFrame={T.DL_START} endFrame={T.DL_END} />
      <HMovingDot x1={ARROW_X2} x2={ARROW_X1} y={PROJ1_CY + 25} color={PNPM} startFrame={T.SYM1_START} endFrame={T.SYM1_END} />
      {frame >= T.PROJ2_APPEAR && (
        <>
          <HMovingDot x1={ARROW_X1} x2={ARROW_X2} y={PROJ2_CY - 10} color={GREEN} startFrame={T.CHECK2_START} endFrame={T.CHECK2_END} />
          <HMovingDot x1={ARROW_X2} x2={ARROW_X1} y={PROJ2_CY + 25} color={PNPM} startFrame={T.SYM2_START} endFrame={T.SYM2_END} />
        </>
      )}
    </AbsoluteFill>
  );
};

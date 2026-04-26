import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { MONITOR_COLORS } from '../components/Monitor';

const BG_GRADIENT = `radial-gradient(circle at center, ${MONITOR_COLORS.BG_LIGHT} 0%, ${MONITOR_COLORS.BG_DARK} 100%)`;
const CARD = '#ffffff';
const BORDER = '#e2e8f0';
const TEXT = MONITOR_COLORS.TEXT_MAIN;
const DIM = MONITOR_COLORS.TEXT_DIM;
const GREEN = '#2ecc71';
const NPM_RED = '#cb3837';
const PNPM = '#f39c12';
const RED = '#e74c3c';

const BENEFITS = [
  { icon: '💾', title: '3× less disk space', desc: 'One copy per version, shared across projects via symlinks' },
  { icon: '⚡', title: 'Faster installs', desc: 'Skips downloading packages already in the global store' },
  { icon: '🔗', title: 'Smart symlinks', desc: 'node_modules links to store — zero duplication' },
  { icon: '🌐', title: 'Saves bandwidth', desc: 'Never downloads the same package twice' },
];

export const Scene5Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Scene is 207 frames = 6.91s
  // Narration sync:
  //   0–113f  "Faster installs, efficient storage, and a cleaner Node modules."
  //             → comparison bars fill + savings badge
  //   127–190f "Now you know PNPM is the better choice."
  //             → benefit cards appear

  // Comparison bars fill quickly during "faster installs, efficient storage"
  const npmProg = interpolate(frame, [15, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pnpmProg = interpolate(frame, [40, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Savings badge appears mid-sentence
  const savSp = spring({ frame: frame - 85, fps, config: { damping: 200 } });
  const savOp = interpolate(savSp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Benefit cards appear as narrator says "cleaner Node modules... better choice" (100–175f)
  const benefitOps = BENEFITS.map((_, i) =>
    interpolate(frame, [95 + i * 16, 115 + i * 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  const NPM_MB = 150;
  const PNPM_MB = 50;
  const MAX_MB = 160;

  return (
    <AbsoluteFill style={{ background: BG_GRADIENT, opacity: sceneOp }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 180, left: 0, right: 0,
        textAlign: 'center', fontFamily: 'system-ui, sans-serif',
        fontSize: 42, fontWeight: 900, color: TEXT, letterSpacing: -1,
      }}>
        The Verdict
      </div>

      {/* Comparison Stack */}
      <div style={{
        position: 'absolute', top: 270, left: 60, right: 60,
        display: 'flex', flexDirection: 'column', gap: 30,
      }}>
        {/* npm card */}
        <div style={{
          backgroundColor: CARD, border: `1px solid ${BORDER}`,
          borderRadius: 24, padding: '28px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 16, marginBottom: 20,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: '#fff', border: `1.5px solid ${NPM_RED}22`,
              boxShadow: `0 4px 12px ${NPM_RED}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8,
            }}>
              <Img src={staticFile('npm-vs-pnpm/npm-logo.svg')} style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{
              color: NPM_RED, fontFamily: 'system-ui, sans-serif', fontSize: 32,
              fontWeight: 900, letterSpacing: 2,
            }}>npm</div>
          </div>

          <div style={{ height: 32, backgroundColor: '#f1f5f9', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(NPM_MB / MAX_MB) * 100 * npmProg}%`,
              backgroundColor: RED, borderRadius: 16, boxShadow: `0 0 20px ${RED}33`,
            }} />
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 20, color: RED, fontWeight: 800, marginTop: 10, opacity: npmProg }}>
            {Math.round(NPM_MB * npmProg)} MB Used
          </div>
        </div>

        {/* pnpm card */}
        <div style={{
          backgroundColor: CARD, border: `2px solid ${PNPM}44`,
          borderRadius: 24, padding: '28px', boxShadow: '0 10px 30px rgba(0,128,0,0.05)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 16, marginBottom: 20,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: '#fff', border: `1.5px solid ${PNPM}33`,
              boxShadow: `0 4px 12px ${PNPM}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8,
            }}>
              <Img src={staticFile('npm-vs-pnpm/pnpm-logo.png')} style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{
              color: PNPM, fontFamily: 'system-ui, sans-serif', fontSize: 32,
              fontWeight: 900, letterSpacing: 2,
            }}>pnpm</div>
          </div>

          <div style={{ height: 32, backgroundColor: '#f1f5f9', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(PNPM_MB / MAX_MB) * 100 * pnpmProg}%`,
              backgroundColor: GREEN, borderRadius: 16, boxShadow: `0 0 20px ${GREEN}33`,
            }} />
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 20, color: GREEN, fontWeight: 800, marginTop: 10, opacity: pnpmProg }}>
            {Math.round(PNPM_MB * pnpmProg)} MB Used
          </div>

          {frame >= 85 && (
            <div style={{
              opacity: savOp, marginTop: 20,
              backgroundColor: '#f0fdf4', border: `1px solid ${GREEN}44`,
              borderRadius: 14, padding: '14px 20px',
              textAlign: 'center', fontFamily: 'system-ui, sans-serif',
              fontSize: 22, color: GREEN, fontWeight: 800,
            }}>
              🎉 3× More Efficient!
            </div>
          )}
        </div>
      </div>

      {/* Benefits List */}
      <div style={{
        position: 'absolute', bottom: 280, left: 60, right: 60,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {BENEFITS.map(({ icon, title, desc }, i) => (
          <div key={title} style={{
            opacity: benefitOps[i],
            transform: `translateY(${interpolate(benefitOps[i], [0, 1], [20, 0])}px)`,
            backgroundColor: CARD, border: `1px solid ${BORDER}`,
            borderRadius: 16, padding: '16px 20px',
            display: 'flex', gap: 18, alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
          }}>
            <span style={{ fontSize: 36, flexShrink: 0 }}>{icon}</span>
            <div>
              <div style={{ color: TEXT, fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{title}</div>
              <div style={{ color: DIM, fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

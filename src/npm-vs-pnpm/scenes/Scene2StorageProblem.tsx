import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { MONITOR_COLORS } from '../components/Monitor';

const BG_GRADIENT = `radial-gradient(circle at center, ${MONITOR_COLORS.BG_LIGHT} 0%, ${MONITOR_COLORS.BG_DARK} 100%)`;
const CARD = '#ffffff';
const BORDER = '#e2e8f0';
const TEXT = MONITOR_COLORS.TEXT_MAIN;
const DIM = MONITOR_COLORS.TEXT_DIM;
const RED = '#e74c3c';
const WARN_Y = '#f39c12';

interface ProjectCardProps {
  name: string;
  startFrame: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame: frame - startFrame, fps, config: { damping: 200 } });
  const opacity = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
  const translateX = interpolate(sp, [0, 1], [-60, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        backgroundColor: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: '20px 24px',
        width: '100%',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div
        style={{
          color: TEXT,
          fontSize: 22,
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 800,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 24 }}>📁</span> {name}
      </div>

      <div
        style={{
          backgroundColor: '#f8fafc',
          borderRadius: 14,
          padding: '12px 18px',
          border: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ color: DIM, fontSize: 16, fontFamily: 'monospace', fontWeight: 600 }}>
          📁 node_modules
        </div>
        <div
          style={{
            marginLeft: 20,
            marginTop: 8,
            backgroundColor: '#fef2f2',
            border: `1px solid ${RED}33`,
            borderRadius: 8,
            padding: '4px 12px',
            fontSize: 16,
            fontFamily: 'monospace',
            color: RED,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ width: 40, height: 28, overflow: 'hidden', borderRadius: 4 }}>
            <Img src={staticFile('npm-vs-pnpm/react-folder-image.png')} style={{ width: '100%', height: 'auto' }} />
          </div>
          react
          <span style={{ color: DIM, fontSize: 14, fontWeight: 400 }}>~50 MB</span>
        </div>
        <div
          style={{
            color: DIM,
            fontSize: 13,
            fontFamily: 'monospace',
            marginTop: 8,
            paddingLeft: 20,
          }}
        >
          + 1,847 more packages…
        </div>
      </div>
    </div>
  );
};

// Scene is 295 frames = 9.83s
// Narration sync:
//   0–23f   "But here's the catch."
//   34–115f "If you have 10 projects using the same version of React,"  → cards appear
//   125–199f "you have 10 identical copies on your disk,"               → storage bar fills
//   206–282f "and that's hundreds of megabytes of wasted space."        → warning banner

const PROJECTS = [
  { name: 'blog-app', delay: 34 },     // "If you have 10 projects"
  { name: 'portfolio', delay: 80 },    // mid-sentence
  { name: 'ecommerce', delay: 120 },   // "you have 10 identical copies"
];

export const Scene2StorageProblem: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Storage bar fills during "10 identical copies on your disk" (125–199f)
  const storagePct = interpolate(frame, [130, 205], [0.44, 0.93], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Warning banner during "hundreds of megabytes of wasted space" (206–282f)
  const warnOp = interpolate(frame, [215, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pulse = interpolate(
    frame % 40,
    [0, 20, 40],
    [0.7, 1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: BG_GRADIENT, opacity: sceneOp }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 48,
          fontWeight: 900,
          color: WARN_Y,
          letterSpacing: -1,
        }}
      >
        ⚠️ The Problem with npm
      </div>

      {/* Project cards — stacked vertically */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {PROJECTS.map((p) =>
          frame >= p.delay ? (
            <ProjectCard key={p.name} name={p.name} startFrame={p.delay} />
          ) : (
            <div
              key={p.name}
              style={{
                height: 160,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                border: `1px dashed ${BORDER}`,
                borderRadius: 20,
              }}
            />
          )
        )}
      </div>

      {/* "3 copies!" callout — appears once all 3 cards are visible */}
      {frame >= 130 && (
        <div
          style={{
            position: 'absolute',
            top: 980,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 28,
            fontWeight: 800,
            color: RED,
            opacity: pulse,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Same react — copied 3 times!
        </div>
      )}

      {/* Storage section */}
      <div
        style={{
          position: 'absolute',
          top: 1080,
          left: 60,
          right: 60,
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: 24,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <span style={{ color: TEXT, fontSize: 24, fontWeight: 700 }}>
            💾 Disk Storage
          </span>
          <span style={{ color: RED, fontSize: 28, fontWeight: 900 }}>
            {Math.round(storagePct * 100)}% used
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: 44,
            backgroundColor: '#f1f5f9',
            borderRadius: 22,
            overflow: 'hidden',
            border: `1px solid ${BORDER}`,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${storagePct * 100}%`,
              backgroundColor: storagePct > 0.85 ? RED : WARN_Y,
              borderRadius: 22,
              boxShadow: `0 0 20px ${storagePct > 0.85 ? RED : WARN_Y}44`,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 22,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 6, backgroundColor: RED }} />
          <span style={{ color: DIM, fontSize: 20, fontWeight: 600 }}>
            3 × react = 150 MB wasted!
          </span>
        </div>
      </div>

      {/* Warning banner */}
      {frame >= 238 && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 60,
            right: 60,
            opacity: warnOp,
            backgroundColor: '#fffbeb',
            border: `2px solid ${WARN_Y}44`,
            borderRadius: 20,
            padding: '24px 30px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <span style={{ fontSize: 44, flexShrink: 0 }}>⚠️</span>
          <div>
            <div
              style={{
                color: WARN_Y,
                fontSize: 24,
                fontWeight: 900,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Storage Almost Full
            </div>
            <div
              style={{
                color: DIM,
                fontSize: 17,
                fontWeight: 500,
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              npm copies packages into every project — wasted space!
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

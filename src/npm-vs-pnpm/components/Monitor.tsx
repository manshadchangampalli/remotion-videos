import React from 'react';

export const MONITOR_COLORS = {
  BG_LIGHT: '#fdfbfb',
  BG_DARK: '#ebedee',
  SIDEBAR: 'rgba(255, 255, 255, 0.3)',
  FILETREE: 'linear-gradient(180deg, #fdfcfb 0%, #e2e8f0 100%)',
  EDITOR: '#ffffff',
  TERMINAL_GLASS: 'rgba(230, 239, 253, 0.75)',
  ACCENT_PURPLE: '#9795f0',
  ACCENT_PINK: '#fbc8d4',
  TEXT_MAIN: '#1e293b',
  TEXT_DIM: '#64748b',
};

interface MonitorProps {
  children?: React.ReactNode;
  terminalCommand?: string;
  terminalChars?: number;
  showCursor?: boolean;
}

export const Monitor: React.FC<MonitorProps> = ({
  terminalCommand = '',
  terminalChars = 0,
  showCursor = false,
}) => {
  return (
    <div style={{ position: 'relative', width: 900, height: 620, margin: '0 auto' }}>
      {/* ── Laptop Lid/Screen ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '90%',
          background: 'linear-gradient(135deg, #e5e7eb, #9ca3af)', 
          borderRadius: 28,
          padding: 3,
          boxShadow: `
            0 10px 30px rgba(0, 0, 0, 0.15),
            0 1px 2px rgba(255, 255, 255, 0.5) inset
          `,
          border: '1px solid #d1d5db',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
        }}
      >
        {/* Deep Black Glass Bezel */}
        <div
          style={{
            flex: 1, backgroundColor: '#0f172a', borderRadius: 24,
            padding: '16px 16px', display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Subtle Screen Reflection/Glow Overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
            pointerEvents: 'none', zIndex: 10,
          }} />

          {/* Main LCD Screen Area */}
          <div
            style={{
              flex: 1, backgroundColor: MONITOR_COLORS.EDITOR, borderRadius: 12,
              display: 'flex', position: 'relative', overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)',
            }}
          >
            {/* Sidebar with App Icons (Polished) */}
            <div
              style={{
                width: 68, backgroundColor: 'rgba(248, 250, 252, 0.8)',
                backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(0, 0, 0, 0.04)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                paddingTop: 24, gap: 24,
              }}
            >
              {[MONITOR_COLORS.ACCENT_PURPLE, '#38bdf8', '#fbbf24', '#f472b6'].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 32, height: 32, borderRadius: 10,
                    backgroundColor: color, opacity: 0.15,
                    border: `1px solid ${color}33`,
                  }}
                />
              ))}
            </div>

            {/* Folder Explorer (Sleeker) */}
            <div
              style={{
                width: 180, height: '100%', backgroundColor: '#fcfcfd',
                borderRight: '1px solid rgba(0, 0, 0, 0.04)', padding: '24px 20px',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              <div style={{ color: MONITOR_COLORS.TEXT_DIM, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>EDITOR</div>
              {[0.7, 0.4, 0.9, 0.5, 0.8, 0.6].map((w, idx) => (
                <div key={idx} style={{ height: 6, width: `${w * 100}%`, backgroundColor: '#e2e8f0', borderRadius: 4 }} />
              ))}
            </div>

            {/* Code Workspace with Mock Syntax Lines */}
            <div
              style={{
                flex: 1, padding: '40px 50px', display: 'flex', flexDirection: 'column',
                gap: 16, background: '#ffffff',
              }}
            >
              {[
                { w: 60, c: '#e2e8f0' }, { w: 140, c: '#9795f0' }, { w: 100, c: '#fbbf24' },
                { w: 180, c: '#e5e7eb' }, { w: 40, c: '#f472b6' }, { w: 220, c: '#e5e7eb' },
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: line.w, height: 10, backgroundColor: line.c, borderRadius: 5, opacity: 0.3 }} />
                  {i % 2 === 0 && <div style={{ width: 80, height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, opacity: 0.3 }} />}
                </div>
              ))}

              {/* Floating Terminal Card (Sleek Glassmorphism) */}
              <div
                style={{
                  position: 'absolute', top: '50%', left: '55%', transform: 'translate(-50%, -50%)',
                  width: 480, padding: '30px 40px',
                  backgroundColor: MONITOR_COLORS.TERMINAL_GLASS,
                  backdropFilter: 'blur(24px)', borderRadius: 24,
                  boxShadow: `
                    0 30px 60px rgba(0, 0, 0, 0.12),
                    0 0 0 1px rgba(255, 255, 255, 0.5) inset
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex', alignItems: 'center', gap: 16, zIndex: 20,
                }}
              >
                <div style={{
                  backgroundColor: '#ffffff77', padding: '6px 12px', borderRadius: 8,
                  fontSize: 20, fontFamily: 'monospace', fontWeight: 900, color: MONITOR_COLORS.TEXT_MAIN
                }}>
                  {'>_'}
                </div>
                <div style={{
                  fontFamily: 'monospace', fontSize: 26, color: MONITOR_COLORS.TEXT_MAIN,
                  letterSpacing: -1, fontWeight: 500,
                }}>
                  {terminalCommand.slice(0, terminalChars)}
                  {showCursor && (
                    <span style={{
                      backgroundColor: '#6366f1', width: 14, height: 32,
                      display: 'inline-block', verticalAlign: 'middle', marginLeft: 4, borderRadius: 2,
                    }} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Webcam/Sensor Notch Area */}
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            width: 80, height: 26, backgroundColor: '#000', borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1e293b' }} />
          </div>
        </div>
      </div>

      {/* ── Realistic MacBook Unibody Base with Keyboard Layout ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 10, left: '2%', width: '96%', height: '12%',
          background: 'linear-gradient(to bottom, #d1d5db, #9ca3af)',
          borderRadius: '4px 4px 30px 30px',
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.25)',
          zIndex: 1,
          overflow: 'hidden',
          border: '1px solid #9ca3af',
        }}
      >
        {/* Subtle Keyboard Key Grid (Simulation) */}
        <div style={{
          position: 'absolute', top: 5, left: '10%', right: '10%', height: '50%',
          backgroundImage: `
            repeating-linear-gradient(90deg, #0000000a 0, #0000000a 40px, transparent 40px, transparent 45px),
            repeating-linear-gradient(0deg, #0000000a 0, #0000000a 10px, transparent 10px, transparent 15px)
          `,
          opacity: 0.6,
          borderRadius: 4,
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        }} />

        {/* Trackpad Area */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 140, height: 28, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.04)',
        }} />

        {/* Thumb-cutout area for opening lip */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 150, height: 12, backgroundColor: 'rgba(0,0,0,0.12)', borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
        }} />
      </div>

      {/* Shadow Ground Bloom */}
      <div style={{
        position: 'absolute', bottom: -50, left: '8%', width: '84%', height: 70,
        backgroundColor: 'rgba(0,0,0,0.22)', filter: 'blur(60px)', borderRadius: '50%',
        zIndex: 0,
      }} />
    </div>
  );
};

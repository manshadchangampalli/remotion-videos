import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueGridBackground } from "../components/BlueGridBackground";
import { palette, fonts } from "../components/palette";

// Scene 13 WAKE — "That brief spark wakes up the microchip" (120f / 4s)
export const Scene13Wake: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chipSpring = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 120 } });
  const chipScale = interpolate(chipSpring, [0, 1], [0.5, 1]);

  // LEDs blink on at f30
  const wakeProgress = interpolate(frame, [30, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.7 + Math.sin(frame / 5) * 0.3;

  return (
    <AbsoluteFill style={{ background: palette.bg, opacity: fade }}>
      <BlueGridBackground />

      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ color: palette.accent, fontFamily: fonts.heading, fontWeight: 700, fontSize: 38, letterSpacing: 8 }}>
          THE CHIP
        </div>
        <div
          style={{
            color: palette.text,
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 110,
            letterSpacing: -2,
            marginTop: 4,
            textShadow: `0 0 26px ${palette.success}${Math.floor(wakeProgress * 99)}`,
          }}
        >
          WAKES UP
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${chipScale})`,
            filter: `drop-shadow(0 0 ${20 + wakeProgress * 40}px ${palette.success}${Math.floor(pulse * 99)})`,
          }}
        >
          <svg width={440} height={440} viewBox="0 0 100 100">
            <rect x={20} y={20} width={60} height={60} rx={4} fill="#1a1a1a" stroke={palette.accent} strokeWidth={1.2} />
            {/* pins */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <React.Fragment key={i}>
                <rect x={12} y={24 + i * 9} width={8} height={4} fill={palette.blue} />
                <rect x={80} y={24 + i * 9} width={8} height={4} fill={palette.blue} />
                <rect x={24 + i * 9} y={12} width={4} height={8} fill={palette.blue} />
                <rect x={24 + i * 9} y={80} width={4} height={8} fill={palette.blue} />
              </React.Fragment>
            ))}
            {/* LED grid lighting up progressively */}
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 6 }).map((__, c) => {
                const idx = r * 6 + c;
                const lit = wakeProgress * 36 > idx;
                const blink = 0.6 + Math.sin(frame / 3 + idx * 0.4) * 0.4;
                return (
                  <rect
                    key={`l${idx}`}
                    x={28 + c * 7}
                    y={28 + r * 7}
                    width={4}
                    height={4}
                    rx={1}
                    fill={lit ? palette.success : "#222"}
                    opacity={lit ? blink : 1}
                  />
                );
              }),
            )}
            <text x={50} y={95} textAnchor="middle" fontFamily="'JetBrains Mono'" fontSize={5} fill={palette.accent} opacity={wakeProgress}>
              POWER · READY
            </text>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

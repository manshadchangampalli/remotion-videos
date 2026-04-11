import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { AudioWave } from "../components/AudioWave";

export const Scene04RawWaves: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wave eruption
  const eruptSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 8, stiffness: 180 },
  });
  const waveScale = interpolate(eruptSpring, [0, 1], [0.05, 1]);
  const waveOp = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Wave grows more chaotic mid-scene (frames 30-90)
  const chaosLevel = interpolate(frame, [0, 40, 90, 120], [0.3, 1.4, 1.4, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Three stacked waves
  const amp1 = interpolate(frame, [0, 35], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label pulse
  const labelSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const labelY = interpolate(labelSpring, [0, 1], [60, 0]);

  // Fade out at end
  const fadeOut = interpolate(frame, [102, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: fadeOut }}>
      <CyberGrid opacity={0.3} color="#1a0800" />

      {/* Mic icon at top */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={60} height={80} viewBox="0 0 60 80">
          <rect x={18} y={2} width={24} height={44} rx={12} fill="none" stroke="#ff8c00" strokeWidth={3} />
          <path d="M8 38 Q8 60 30 60 Q52 60 52 38" fill="none" stroke="#ff8c00" strokeWidth={3} strokeLinecap="round" />
          <line x1={30} y1={60} x2={30} y2={76} stroke="#ff8c00" strokeWidth={3} />
          <line x1={16} y1={76} x2={44} y2={76} stroke="#ff8c00" strokeWidth={3} strokeLinecap="round" />
        </svg>
      </div>

      {/* Main waveform — center */}
      <div
        style={{
          position: "absolute",
          top: 780,
          left: 0,
          right: 0,
          transform: `scaleY(${waveScale})`,
          transformOrigin: "center",
          opacity: waveOp,
        }}
      >
        <AudioWave
          frame={frame}
          width={1080}
          height={320}
          color="#ff8c00"
          amplitude={amp1}
          chaos={chaosLevel}
          pointCount={140}
        />
      </div>

      {/* Secondary wave — slightly different phase */}
      <div
        style={{
          position: "absolute",
          top: 850,
          left: 0,
          right: 0,
          transform: `scaleY(${waveScale * 0.7})`,
          transformOrigin: "center",
          opacity: waveOp * 0.5,
        }}
      >
        <AudioWave
          frame={frame + 18}
          width={1080}
          height={200}
          color="#ff3333"
          amplitude={amp1 * 0.7}
          chaos={chaosLevel * 0.8}
          pointCount={100}
        />
      </div>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 1120,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${labelY}px)`,
          opacity: labelSpring,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,140,0,0.1)",
            border: "1px solid #ff8c00",
            borderRadius: 8,
            padding: "10px 32px",
          }}
        >
          <span
            style={{
              color: "#ff8c00",
              fontSize: 30,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              letterSpacing: 4,
              textShadow: "0 0 16px rgba(255,140,0,0.6)",
            }}
          >
            RAW AUDIO WAVES
          </span>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: interpolate(frame, [40, 65], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 38,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Sound is just{" "}
          <span style={{ color: "#ff8c00" }}>air vibrations</span>
          <br />
          your mic captures them all.
        </div>
      </div>
    </AbsoluteFill>
  );
};

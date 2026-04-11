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
import { Terrain3D } from "../components/Terrain3D";

export const Scene05SpectrogramBirth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rotation: waveform flips on X-axis into 3D terrain (frames 15-55)
  const flipSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const rotateX = interpolate(flipSpring, [0, 1], [0, 75]);

  // During flip, waveform fades and terrain appears
  const waveOp = interpolate(flipSpring, [0, 0.5, 1], [1, 0.4, 0]);
  const terrainOp = interpolate(flipSpring, [0, 0.4, 1], [0, 0, 1]);

  // Terrain rises from bottom
  const terrainRise = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const terrainY = interpolate(terrainRise, [0, 1], [200, 0]);

  // Label
  const labelOp = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const labelY = interpolate(labelSpring, [0, 1], [50, 0]);

  // Bottom text
  const textOp = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <CyberGrid opacity={0.25} />

      {/* Waveform (fades as it flips) */}
      <div
        style={{
          position: "absolute",
          top: 780,
          left: 0,
          right: 0,
          opacity: waveOp,
          transform: `perspective(900px) rotateX(${rotateX}deg)`,
          transformOrigin: "center bottom",
        }}
      >
        <AudioWave
          frame={frame}
          width={1080}
          height={300}
          color="#ff8c00"
          amplitude={1}
          chaos={0.8}
          pointCount={120}
        />
      </div>

      {/* 3D Terrain (appears as waveform flips) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: terrainOp,
          transform: `translateY(${terrainY}px)`,
        }}
      >
        <Terrain3D frame={frame} />
      </div>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelOp,
          transform: `translateY(${labelY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(0,242,255,0.08)",
            border: "1px solid #00f2ff",
            borderRadius: 8,
            padding: "10px 32px",
          }}
        >
          <span
            style={{
              color: "#00f2ff",
              fontSize: 28,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              letterSpacing: 3,
              textShadow: "0 0 14px rgba(0,242,255,0.6)",
            }}
          >
            GENERATING SPECTROGRAM
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
          opacity: textOp,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 36,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Converts waves into a{" "}
          <span style={{ color: "#00f2ff" }}>visual frequency map</span>
          <br />
          where every spike is a frequency.
        </div>
      </div>
    </AbsoluteFill>
  );
};

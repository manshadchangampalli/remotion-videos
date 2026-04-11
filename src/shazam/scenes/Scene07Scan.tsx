import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { Terrain3D } from "../components/Terrain3D";

export const Scene07Scan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scan plane sweeps from bottom to top (frames 15-90)
  const scanProgress = interpolate(frame, [15, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label springs in
  const labelSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const labelY = interpolate(labelSpring, [0, 1], [50, 0]);

  const sceneOp = interpolate(frame, [0, 12, 108, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text
  const textOp = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      <CyberGrid opacity={0.2} />

      {/* Terrain with scan */}
      <Terrain3D
        frame={frame}
        scanProgress={scanProgress}
        showScanPlane={frame >= 15}
      />

      {/* Scan plane glow layer */}
      {frame >= 15 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 60,
            top: interpolate(scanProgress, [0, 1], [1280, 680]),
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,242,255,0.12) 40%, rgba(0,242,255,0.18) 50%, rgba(0,242,255,0.12) 60%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* FILTERING DOMINANT PEAKS label */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelSpring,
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
            FILTERING DOMINANT PEAKS
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
            fontSize: 38,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Picks only the{" "}
          <span style={{ color: "#00f2ff" }}>highest spikes</span>
          <br />— the most dominant frequencies.
        </div>
      </div>
    </AbsoluteFill>
  );
};

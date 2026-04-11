import React from "react";

interface AudioWaveProps {
  frame: number;
  width?: number;
  height?: number;
  color?: string;
  amplitude?: number;
  chaos?: number;
  pointCount?: number;
}

// Deterministic pseudo-random using index seed
function seededNoise(i: number, seed: number): number {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const AudioWave: React.FC<AudioWaveProps> = ({
  frame,
  width = 1080,
  height = 400,
  color = "#ff8c00",
  amplitude = 1,
  chaos = 1,
  pointCount = 120,
}) => {
  const cy = height / 2;
  const t = frame * 0.08;

  // Build waveform points
  const points = Array.from({ length: pointCount }, (_, i) => {
    const x = (i / (pointCount - 1)) * width;
    const n = i / pointCount;

    const wave1 = Math.sin(n * Math.PI * 8 + t * 2.1) * 0.4;
    const wave2 = Math.sin(n * Math.PI * 14 + t * 3.3) * 0.25;
    const wave3 = Math.sin(n * Math.PI * 22 - t * 1.7) * 0.15;
    const wave4 = Math.sin(n * Math.PI * 5 + t * 0.9) * 0.2;
    const noise = (seededNoise(i, Math.floor(t * 2)) - 0.5) * chaos * 0.3;

    const raw = wave1 + wave2 + wave3 + wave4 + noise;
    // Envelope: full amplitude in middle, tapers at edges
    const env = Math.sin(n * Math.PI) * amplitude;
    const y = cy - raw * env * (height * 0.44);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = points.join(" ");

  // Mirror below center line
  const mirroredPoints = Array.from({ length: pointCount }, (_, i) => {
    const x = (i / (pointCount - 1)) * width;
    const n = i / pointCount;

    const wave1 = Math.sin(n * Math.PI * 8 + t * 2.1) * 0.4;
    const wave2 = Math.sin(n * Math.PI * 14 + t * 3.3) * 0.25;
    const wave3 = Math.sin(n * Math.PI * 22 - t * 1.7) * 0.15;
    const wave4 = Math.sin(n * Math.PI * 5 + t * 0.9) * 0.2;
    const noise = (seededNoise(i, Math.floor(t * 2)) - 0.5) * chaos * 0.3;

    const raw = wave1 + wave2 + wave3 + wave4 + noise;
    const env = Math.sin(n * Math.PI) * amplitude;
    const y = cy + raw * env * (height * 0.44);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const mirroredPolyline = mirroredPoints.join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <filter id="waveGlow" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="waveFade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="15%" stopColor={color} stopOpacity="1" />
          <stop offset="85%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Center line */}
      <line
        x1={0}
        y1={cy}
        x2={width}
        y2={cy}
        stroke={color}
        strokeWidth={1}
        opacity={0.2}
      />

      {/* Main wave */}
      <polyline
        points={polyline}
        fill="none"
        stroke="url(#waveFade)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#waveGlow)"
      />
      {/* Mirror wave */}
      <polyline
        points={mirroredPolyline}
        fill="none"
        stroke="url(#waveFade)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#waveGlow)"
        opacity={0.6}
      />
    </svg>
  );
};

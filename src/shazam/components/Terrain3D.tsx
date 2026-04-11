import React from "react";

interface Terrain3DProps {
  frame: number;
  scanProgress?: number; // 0-1: how far the scan plane has swept
  showScanPlane?: boolean;
  constellationOnly?: boolean; // show only tall peaks as dots
}

const COLS = 28;
const ROWS = 16;

// Deterministic height map using sine sums
function getHeight(col: number, row: number, t: number): number {
  const nx = col / COLS;
  const ny = row / ROWS;
  const h =
    Math.abs(Math.sin(nx * Math.PI * 4.2 + t * 0.4) * 0.5) +
    Math.abs(Math.sin(ny * Math.PI * 3.1 - t * 0.3) * 0.35) +
    Math.abs(Math.sin((nx + ny) * Math.PI * 6.8 + t * 0.2) * 0.15) +
    Math.abs(Math.sin(nx * Math.PI * 11 - ny * 4 + t * 0.1) * 0.1);
  // Normalize to 0-1
  return Math.min(h / 1.1, 1);
}

export const Terrain3D: React.FC<Terrain3DProps> = ({
  frame,
  scanProgress = -1,
  showScanPlane = false,
  constellationOnly = false,
}) => {
  const t = frame * 0.06;

  // Isometric-like projection
  const cellW = 1080 / COLS;
  const cellD = 38; // depth step per row
  const maxBarH = 260;
  const baseY = 1280; // where the terrain floor sits
  const offsetX = 0;

  const bars: React.ReactNode[] = [];

  // Peak threshold for constellation
  const PEAK_THRESHOLD = 0.72;

  for (let row = ROWS - 1; row >= 0; row--) {
    for (let col = 0; col < COLS; col++) {
      const h = getHeight(col, row, t);
      const barH = h * maxBarH;
      const x = offsetX + col * cellW;
      const y = baseY - row * cellD;
      const isPeak = h > PEAK_THRESHOLD;

      // Scan plane: below scanProgress rows are faded
      const rowProgress = row / ROWS;
      const belowScan = showScanPlane && scanProgress >= 0 && rowProgress < scanProgress;
      const fadeOut = belowScan && !isPeak ? 0.12 : 1;

      if (constellationOnly) {
        if (!isPeak) continue;
        bars.push(
          <circle
            key={`dot-${row}-${col}`}
            cx={x + cellW * 0.5}
            cy={y - barH - 10}
            r={6 + h * 8}
            fill="#00f2ff"
            opacity={0.85 + Math.sin(frame / 10 + col + row) * 0.15}
            filter="url(#terrainGlow)"
          />
        );
        continue;
      }

      // Color: peaks are cyan, normal are orange
      const barColor = isPeak ? "#00f2ff" : "#ff8c00";
      const barOpacity = isPeak
        ? (0.8 + Math.sin(frame / 8 + col + row) * 0.2) * fadeOut
        : (0.5 + h * 0.3) * fadeOut;

      bars.push(
        <g key={`bar-${row}-${col}`} opacity={barOpacity}>
          {/* Bar face */}
          <rect
            x={x + 2}
            y={y - barH}
            width={cellW - 4}
            height={barH}
            fill={barColor}
            opacity={0.7}
          />
          {/* Top face highlight */}
          <rect
            x={x + 2}
            y={y - barH}
            width={cellW - 4}
            height={Math.max(barH * 0.08, 2)}
            fill={isPeak ? "#aafeff" : "#ffb347"}
            opacity={0.9}
          />
          {/* Glow for peaks */}
          {isPeak && (
            <rect
              x={x}
              y={y - barH - 4}
              width={cellW}
              height={barH + 4}
              fill="#00f2ff"
              opacity={0.08 + Math.sin(frame / 6 + col) * 0.04}
            />
          )}
        </g>
      );
    }
  }

  // Scan plane
  const scanY =
    showScanPlane && scanProgress >= 0
      ? baseY - scanProgress * ROWS * cellD
      : -1000;

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="terrainGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="terrainGlowLight" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {bars}

      {/* Scanning plane */}
      {showScanPlane && scanProgress >= 0 && (
        <g>
          <rect
            x={0}
            y={scanY - 2}
            width={1080}
            height={4}
            fill="#00f2ff"
            opacity={0.9}
            filter="url(#terrainGlow)"
          />
          <rect
            x={0}
            y={scanY - 20}
            width={1080}
            height={20}
            fill="#00f2ff"
            opacity={0.08}
          />
        </g>
      )}
    </svg>
  );
};

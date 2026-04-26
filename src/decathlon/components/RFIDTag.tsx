import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "./palette";

interface Props {
  size?: number;
  startFrame?: number;
  showChip?: boolean;
  showAntenna?: boolean;
  pulse?: boolean;
  rotate?: number;
}

export const RFIDTag: React.FC<Props> = ({
  size = 420,
  startFrame = 0,
  showChip = true,
  showAntenna = true,
  pulse = false,
  rotate = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const tagSpring = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const scale = interpolate(tagSpring, [0, 1], [0.5, 1]);
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const antennaPath = buildSpiralPath();
  const antennaLen = 2400;
  const antennaDraw = interpolate(local, [10, 70], [antennaLen, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chipOpacity = interpolate(local, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulseScale = pulse ? 1 + Math.sin(frame / 6) * 0.04 : 1;
  const glow = pulse ? 30 + Math.sin(frame / 8) * 12 : 18;

  return (
    <div
      style={{
        width: size,
        height: size * 0.62,
        transform: `scale(${scale * pulseScale}) rotate(${rotate}deg)`,
        opacity,
        position: "relative",
        filter: `drop-shadow(0 0 ${glow}px ${palette.accent}66) drop-shadow(0 10px 30px rgba(0,0,0,0.6))`,
      }}
    >
      <svg
        viewBox="0 0 500 310"
        width={size}
        height={size * 0.62}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="label-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6fbff" />
            <stop offset="100%" stopColor="#c7e2f0" />
          </linearGradient>
          <filter id="chip-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <rect
          x={6}
          y={6}
          width={488}
          height={298}
          rx={22}
          ry={22}
          fill="url(#label-bg)"
          stroke={palette.blue}
          strokeWidth={2.5}
          opacity={0.96}
        />

        <rect
          x={22}
          y={22}
          width={456}
          height={266}
          rx={14}
          ry={14}
          fill="none"
          stroke={palette.blueDeep}
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={0.45}
        />

        {showAntenna && (
          <path
            d={antennaPath}
            fill="none"
            stroke={palette.blueDeep}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={antennaLen}
            strokeDashoffset={antennaDraw}
            opacity={0.88}
          />
        )}

        {showChip && (
          <g opacity={chipOpacity}>
            <rect
              x={220}
              y={125}
              width={60}
              height={60}
              rx={6}
              fill="#1a1a1a"
              stroke={palette.accent}
              strokeWidth={2}
              filter="url(#chip-glow)"
            />
            <rect x={220} y={125} width={60} height={60} rx={6} fill="#222" stroke={palette.accent} strokeWidth={1.5} />
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`cl${i}`}
                x1={220}
                y1={135 + i * 10}
                x2={215}
                y2={135 + i * 10}
                stroke={palette.blueDeep}
                strokeWidth={2}
              />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`cr${i}`}
                x1={280}
                y1={135 + i * 10}
                x2={285}
                y2={135 + i * 10}
                stroke={palette.blueDeep}
                strokeWidth={2}
              />
            ))}
            <circle cx={250} cy={155} r={3} fill={palette.accent} opacity={0.8} />
          </g>
        )}

        <text
          x={38}
          y={56}
          fontFamily="'JetBrains Mono', monospace"
          fontSize={13}
          fill={palette.blueDeep}
          letterSpacing={1.5}
          opacity={interpolate(local, [30, 60], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          DECATHLON · RFID EPC
        </text>
        <text
          x={38}
          y={276}
          fontFamily="'JetBrains Mono', monospace"
          fontSize={11}
          fill={palette.blueDeep}
          letterSpacing={1}
          opacity={interpolate(local, [40, 70], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          SN: 4902115
        </text>
      </svg>
    </div>
  );
};

function buildSpiralPath(): string {
  // squiggly rectangular spiral antenna, 4 loops from outside in, centered on chip
  const pad = 50;
  const w = 500;
  const h = 310;
  const step = 18;
  let d = "";
  for (let i = 0; i < 4; i++) {
    const x1 = pad + i * step;
    const y1 = pad + i * step;
    const x2 = w - pad - i * step;
    const y2 = h - pad - i * step;
    if (i === 0) d += `M ${x1} ${y1} `;
    else d += `L ${x1} ${y1} `;
    d += `L ${x2} ${y1} `;
    d += `L ${x2} ${y2} `;
    d += `L ${x1} ${y2} `;
    d += `L ${x1} ${y1 + step} `;
  }
  // final run-in to chip (approx 220,155)
  d += `L 220 ${pad + 4 * step + 5} `;
  return d;
}

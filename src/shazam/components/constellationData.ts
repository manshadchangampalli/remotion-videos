// Deterministic constellation points derived from terrain peaks
// Shared across scenes 7-13 for visual consistency

export interface StarPoint {
  id: number;
  x: number;  // 0-1080
  y: number;  // 0-1920 (within safe zone 300-1620)
  size: number;
  freq: number; // frequency value (normalized 0-1)
}

// 18 dominant peaks that persist across scenes
export const STARS: StarPoint[] = [
  { id: 0,  x: 108,  y: 680,  size: 10, freq: 0.92 },
  { id: 1,  x: 234,  y: 820,  size: 8,  freq: 0.85 },
  { id: 2,  x: 320,  y: 640,  size: 12, freq: 0.96 },
  { id: 3,  x: 445,  y: 760,  size: 7,  freq: 0.78 },
  { id: 4,  x: 510,  y: 900,  size: 9,  freq: 0.88 },
  { id: 5,  x: 600,  y: 700,  size: 11, freq: 0.94 },
  { id: 6,  x: 700,  y: 840,  size: 8,  freq: 0.82 },
  { id: 7,  x: 820,  y: 720,  size: 10, freq: 0.90 },
  { id: 8,  x: 940,  y: 860,  size: 7,  freq: 0.77 },
  { id: 9,  x: 160,  y: 1020, size: 9,  freq: 0.87 },
  { id: 10, x: 310,  y: 1100, size: 11, freq: 0.93 },
  { id: 11, x: 490,  y: 1060, size: 8,  freq: 0.83 },
  { id: 12, x: 660,  y: 1120, size: 12, freq: 0.97 },
  { id: 13, x: 800,  y: 1000, size: 9,  freq: 0.89 },
  { id: 14, x: 920,  y: 1140, size: 7,  freq: 0.79 },
  { id: 15, x: 220,  y: 1240, size: 10, freq: 0.91 },
  { id: 16, x: 560,  y: 1300, size: 8,  freq: 0.84 },
  { id: 17, x: 750,  y: 1260, size: 11, freq: 0.95 },
];

// Pairs of stars to connect with lines (spanning different distances)
export const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [2, 5], [3, 4],
  [4, 5], [5, 6], [5, 7], [6, 7], [7, 8],
  [0, 9], [1, 9], [9, 10], [10, 11], [10, 15],
  [11, 12], [11, 4], [12, 13], [12, 16], [12, 17],
  [13, 14], [13, 7], [15, 16], [16, 17], [17, 14],
];

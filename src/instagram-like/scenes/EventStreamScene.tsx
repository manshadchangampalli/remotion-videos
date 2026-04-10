import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const USER_NAMES = [
  "user_8372941",
  "cr7_fan_99",
  "football_uk",
  "user_2910482",
  "insta_pro_x",
  "user_5573829",
  "messi_rival",
  "user_1192847",
  "global_fan_3",
  "user_8847261",
  "cr7_forever",
  "user_4482910",
  "sportz_daily",
  "user_9918372",
  "real_madrid_",
  "user_3827410",
  "user_2948271",
  "user_7193820",
];

export const EventStreamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [930, 966], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Total duration: 966 frames (~32.2s)
  // Logbook title appears
  const titleScale = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 130 } });

  // Log entries stream in row by row
  const ENTRY_HEIGHT = 68;
  const VISIBLE_ROWS = 14;
  const LOG_START_Y = 220;

  // Scroll speed: entries scroll upward
  const scrollY = interpolate(frame, [30, 900], [0, ENTRY_HEIGHT * 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate log entries (more than visible)
  const totalEntries = 36;
  const entries = Array.from({ length: totalEntries }, (_, i) => ({
    id: i,
    user: USER_NAMES[i % USER_NAMES.length],
    postId: `post_${9281 + Math.floor(i * 7.3)}`,
    ts: `${String(Math.floor(i * 0.18) + 10).padStart(2, "0")}:${String(Math.floor((i * 10.8) % 60)).padStart(2, "0")}:${String(Math.floor((i * 3.3) % 60)).padStart(2, "0")}.${String(Math.floor((i * 137) % 1000)).padStart(3, "0")}`,
    color: `hsl(${280 + (i % 12) * 8}, 70%, 65%)`,
  }));

  // Badge
  const badgeScale = spring({ frame: frame - 200, fps, config: { damping: 10, stiffness: 130 } });

  // "No rushing, no crashing" label
  const calmOpacity = interpolate(frame, [350, 380], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter: likes piling up
  const likesLogged = Math.floor(interpolate(frame, [30, 900], [0, 4800000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(193,53,132,0.10) 0%, #050914 65%)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="esGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="esStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="esGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C13584" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
          <clipPath id="logClip">
            <rect x={30} y={LOG_START_Y} width={1020} height={ENTRY_HEIGHT * VISIBLE_ROWS} />
          </clipPath>
        </defs>

        {/* Title */}
        <rect x={0} y={40} width={1080} height={78} fill="rgba(5,9,20,0.9)" />
        <text x={540} y={91} textAnchor="middle"
          fill="url(#esGrad)" fontSize={34}
          fontWeight="900" fontFamily="monospace" letterSpacing={2}
          filter="url(#esGlow)"
        >
          THE EVENT STREAM
        </text>
        <line x1={0} y1={118} x2={1080} y2={118} stroke="url(#esGrad)" strokeWidth={1.5} strokeOpacity={0.4} />

        {/* Logbook container */}
        <g transform={`translate(0, ${titleScale > 0.3 ? 0 : 40})`} opacity={titleScale}>
          {/* Logbook frame */}
          <rect x={30} y={LOG_START_Y - 10} width={1020} height={ENTRY_HEIGHT * VISIBLE_ROWS + 20}
            rx={16}
            fill="rgba(8,12,25,0.95)"
            stroke="rgba(193,53,132,0.35)"
            strokeWidth={2}
          />
          {/* Terminal header */}
          <rect x={30} y={LOG_START_Y - 10} width={1020} height={44} rx={16}
            fill="rgba(15,20,40,0.95)"
          />
          <rect x={30} y={LOG_START_Y + 14} width={1020} height={20} fill="rgba(15,20,40,0.95)" />
          <circle cx={64} cy={LOG_START_Y + 12} r={7} fill="#ff5f56" />
          <circle cx={88} cy={LOG_START_Y + 12} r={7} fill="#ffbd2e" />
          <circle cx={112} cy={LOG_START_Y + 12} r={7} fill="#27c93f" />
          <text x={540} y={LOG_START_Y + 17} textAnchor="middle"
            fill="#4b5563" fontSize={15} fontFamily="monospace"
          >
            event-stream.log — kafka://likes-topic · partition 0
          </text>
          <line x1={30} y1={LOG_START_Y + 30} x2={1050} y2={LOG_START_Y + 30}
            stroke="rgba(193,53,132,0.2)" strokeWidth={1}
          />
        </g>

        {/* Scrolling log entries */}
        <g clipPath="url(#logClip)">
          <g transform={`translate(0, ${-scrollY})`}>
            {entries.map((entry, i) => {
              const entryY = LOG_START_Y + 34 + i * ENTRY_HEIGHT;
              const entryOpacity = interpolate(frame, [i * 5, i * 5 + 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const isRecent = i >= entries.length - 3;

              return (
                <g key={entry.id} opacity={entryOpacity}>
                  {/* Row background */}
                  <rect x={32} y={entryY - 22} width={1016} height={ENTRY_HEIGHT - 4}
                    fill={isRecent ? "rgba(193,53,132,0.06)" : "transparent"}
                    rx={4}
                  />
                  {/* Row separator */}
                  <line x1={52} y1={entryY + 40} x2={1028} y2={entryY + 40}
                    stroke="rgba(255,255,255,0.05)" strokeWidth={1}
                  />

                  {/* Timestamp */}
                  <text x={60} y={entryY + 4}
                    fill="rgba(100,120,140,0.8)" fontSize={17} fontFamily="monospace"
                  >
                    {entry.ts}
                  </text>

                  {/* Event type badge */}
                  <rect x={260} y={entryY - 16} width={68} height={28} rx={6}
                    fill="rgba(225,48,108,0.18)" stroke="#E1306C" strokeWidth={1}
                  />
                  <text x={294} y={entryY + 3}
                    textAnchor="middle"
                    fill="#E1306C" fontSize={15}
                    fontWeight="700" fontFamily="monospace"
                  >
                    ❤ LIKE
                  </text>

                  {/* User */}
                  <text x={360} y={entryY + 4}
                    fill={entry.color} fontSize={17} fontFamily="monospace"
                  >
                    {entry.user}
                  </text>

                  {/* Post ID */}
                  <text x={620} y={entryY + 4}
                    fill="rgba(148,163,184,0.7)" fontSize={17} fontFamily="monospace"
                  >
                    → {entry.postId}
                  </text>

                  {/* Status */}
                  <text x={920} y={entryY + 4}
                    fill="rgba(0,220,100,0.8)" fontSize={15}
                    fontFamily="monospace"
                  >
                    ✓ logged
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {/* Fade out top of log to show infinite scrolling */}
        <defs>
          <linearGradient id="fadeTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#050914" stopOpacity={1} />
            <stop offset="100%" stopColor="#050914" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fadeBottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#050914" stopOpacity={0} />
            <stop offset="100%" stopColor="#050914" stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <rect x={30} y={LOG_START_Y + 32} width={1020} height={60}
          fill="url(#fadeTop)" rx={4}
        />
        <rect x={30} y={LOG_START_Y + ENTRY_HEIGHT * VISIBLE_ROWS - 30} width={1020} height={50}
          fill="url(#fadeBottom)" rx={4}
        />

        {/* Live counter */}
        <g opacity={titleScale}>
          <text x={540} y={LOG_START_Y + ENTRY_HEIGHT * VISIBLE_ROWS + 75}
            textAnchor="middle"
            fill="#ffffff" fontSize={52}
            fontWeight="900" fontFamily="monospace"
          >
            {likesLogged.toLocaleString()} logged
          </text>
          <text x={540} y={LOG_START_Y + ENTRY_HEIGHT * VISIBLE_ROWS + 115}
            textAnchor="middle"
            fill="rgba(225,48,108,0.7)" fontSize={22}
            fontFamily="monospace"
          >
            ❤ events in stream
          </text>
        </g>

        {/* Badge: The Event Stream */}
        <g transform={`translate(540, 1660) scale(${badgeScale})`} opacity={badgeScale}>
          <rect x={-390} y={-50} width={780} height={100} rx={50}
            fill="url(#esGrad)" filter="url(#esStrongGlow)"
          />
          <text x={0} y={16} textAnchor="middle" fill="white" fontSize={36}
            fontWeight="900" fontFamily="monospace"
          >
            📋 EVENT STREAM (ENDLESS LOG)
          </text>
        </g>

        {/* "No rushing, no crashing" */}
        <g opacity={calmOpacity}>
          <text x={540} y={1800} textAnchor="middle"
            fill="rgba(148,163,184,0.8)" fontSize={24}
            fontFamily="monospace"
          >
            No rushing · No crashing · Just ordered events
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

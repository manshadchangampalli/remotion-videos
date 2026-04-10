import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";

export const MysteryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in / out
  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [220, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Question text drops in (frame 0-25)
  const questionDrop = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Hacker emoji spins and wobbles (frame 20+)
  const hackerSpin = interpolate(frame, [20, 65], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hackerScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 8, stiffness: 160 },
  });
  const hackerWobble = frame > 65
    ? Math.sin((frame - 65) * 0.15) * 10
    : 0;

  // "NO." slams in (frame 80)
  const noScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 5, stiffness: 350 },
  });

  // "Postman = Backend Server" reveals (frame 110)
  const revealOpacity = interpolate(frame, [110, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revealSlide = interpolate(frame, [110, 135], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Postman icon springs in (frame 135)
  const postmanIconScale = spring({
    frame: frame - 135,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // "NOT a web browser" strikes through (frame 165)
  const strikeThroughWidth = interpolate(frame, [165, 195], [0, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* Full-screen background image with heavier overlay */}
      <Img
        src={staticFile("postman/intro.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(2,4,8,0.75)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="mGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Scene label */}
        <g transform={`translate(0, ${(1 - questionDrop) * -60})`} opacity={questionDrop}>
          <rect x={0} y={40} width={1080} height={80} fill="rgba(2,4,8,0.9)" />
          <text
            x={540} y={93}
            textAnchor="middle"
            fill="#facc15"
            fontSize={34}
            fontWeight="900"
            fontFamily="monospace"
            letterSpacing={2}
            filter="url(#mGlow)"
          >
            🤔  THE MYSTERY
          </text>
          <line x1={0} y1={120} x2={1080} y2={120} stroke="#facc15" strokeWidth={1.5} strokeOpacity={0.35} />
        </g>

        {/* Question text */}
        <g opacity={questionDrop} transform={`translate(0, ${(1 - questionDrop) * 40})`}>
          <rect x={60} y={200} width={960} height={230} rx={24}
            fill="rgba(8,16,35,0.9)" stroke="rgba(250,204,21,0.4)" strokeWidth={2}
          />
          <text x={540} y={272} textAnchor="middle" fill="#e2e8f0" fontSize={32}
            fontWeight="700" fontFamily="monospace">
            Everyone says it's a CORS issue...
          </text>
          <text x={540} y={328} textAnchor="middle" fill="#facc15" fontSize={30}
            fontWeight="800" fontFamily="monospace" filter="url(#mGlow)">
            But WHY does it still work
          </text>
          <text x={540} y={380} textAnchor="middle" fill="#facc15" fontSize={30}
            fontWeight="800" fontFamily="monospace" filter="url(#mGlow)">
            in Postman?
          </text>
        </g>

        {/* Hacker emoji */}
        <g
          transform={`translate(540, 600) scale(${hackerScale}) rotate(${hackerSpin})`}
          opacity={hackerScale}
        >
          <circle cx={0} cy={0} r={80} fill="rgba(250,204,21,0.1)" stroke="#facc15" strokeWidth={2} />
          <text x={0} y={20} textAnchor="middle" fontSize={90}>🕵️</text>
        </g>

        {/* Wobble annotation */}
        {hackerScale > 0.5 && (
          <text
            x={540 + hackerWobble} y={730}
            textAnchor="middle"
            fill="rgba(250,204,21,0.8)"
            fontSize={22}
            fontFamily="monospace"
            opacity={Math.min(1, (hackerScale - 0.5) * 2)}
          >
            Is Postman secretly hacking your server?
          </text>
        )}

        {/* BIG "NO." */}
        <g transform={`translate(540, 900) scale(${noScale})`} opacity={noScale}>
          <text
            x={0} y={0}
            textAnchor="middle"
            fill="#00ff88"
            fontSize={180}
            fontWeight="900"
            fontFamily="monospace"
            filter="url(#mStrongGlow)"
          >
            NO.
          </text>
        </g>

        {/* Postman = Backend Server explanation */}
        <g opacity={revealOpacity} transform={`translate(0, ${revealSlide})`}>
          {/* Box */}
          <rect x={60} y={1060} width={960} height={340} rx={28}
            fill="rgba(255,108,55,0.08)" stroke="#FF6C37" strokeWidth={2.5}
            filter="url(#mGlow)"
          />
          <text x={540} y={1130} textAnchor="middle" fill="#FF6C37" fontSize={32}
            fontWeight="900" fontFamily="monospace" letterSpacing={2} filter="url(#mGlow)">
            POSTMAN RUNS ON YOUR MACHINE
          </text>
          <line x1={100} y1={1148} x2={980} y2={1148} stroke="#FF6C37" strokeWidth={1} strokeOpacity={0.35} />

          {/* Postman icon (circle with P) */}
          <g transform={`translate(200, 1250) scale(${postmanIconScale})`} opacity={postmanIconScale}>
            <circle cx={0} cy={0} r={55} fill="#FF6C37" filter="url(#mGlow)" />
            <text x={0} y={16} textAnchor="middle" fill="white" fontSize={50} fontWeight="900" fontFamily="serif">P</text>
          </g>

          <text x={330} y={1230} fill="#e2e8f0" fontSize={26} fontWeight="700" fontFamily="monospace">
            Acts like a
          </text>
          <rect x={320} y={1245} width={300} height={52} rx={10} fill="rgba(0,255,136,0.15)" stroke="#00ff88" strokeWidth={1.5} />
          <text x={470} y={1280} textAnchor="middle" fill="#00ff88" fontSize={28} fontWeight="900" fontFamily="monospace" filter="url(#mGlow)">
            BACKEND SERVER
          </text>

          {/* NOT a web browser */}
          <text x={330} y={1330} fill="#94a3b8" fontSize={26} fontFamily="monospace">
            Not a web browser
          </text>
          {strikeThroughWidth > 0 && (
            <line
              x1={320} y1={1323}
              x2={320 + strikeThroughWidth} y2={1323}
              stroke="#ff3333" strokeWidth={4} strokeLinecap="round"
            />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

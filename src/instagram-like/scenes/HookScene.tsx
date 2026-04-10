import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [175, 202], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Instagram logo mark appears
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 140 } });

  // Heart appears with pop
  const heartScale = spring({ frame: frame - 25, fps, config: { damping: 7, stiffness: 220 } });

  // Heart fill animation: outline → filled red
  const heartFill = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter spins up
  const counterProgress = interpolate(frame, [55, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const likeCount = Math.floor(counterProgress * 5000000);

  // Badge slides in
  const badgeY = interpolate(frame, [120, 148], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const badgeOpacity = interpolate(frame, [120, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing ring around heart
  const ringPulse = frame > 55
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [0.85, 1.15])
    : 1;
  const ringOpacity = frame > 55
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [0.2, 0.6])
    : 0;

  const heartColor = heartFill > 0.5 ? "#E1306C" : "#ffffff";
  const heartStroke = heartFill > 0.5 ? "#E1306C" : "#ffffff";
  const formattedCount = likeCount.toLocaleString();

  const sparks = [
    { x: -120, y: -80, delay: 70, size: 10 },
    { x: 130, y: -60, delay: 80, size: 8 },
    { x: -90, y: 60, delay: 75, size: 12 },
    { x: 110, y: 70, delay: 85, size: 9 },
    { x: -50, y: -110, delay: 90, size: 7 },
    { x: 60, y: -100, delay: 95, size: 11 },
    { x: -140, y: 10, delay: 88, size: 8 },
    { x: 150, y: 20, delay: 82, size: 10 },
  ];

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* Gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(193,53,132,0.18) 0%, rgba(131,58,180,0.12) 40%, #050914 75%)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="hkGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hkStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="22" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="igGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#405DE6" />
            <stop offset="25%" stopColor="#833AB4" />
            <stop offset="50%" stopColor="#C13584" />
            <stop offset="75%" stopColor="#E1306C" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
          <clipPath id="heartClip">
            <path d="M0,-80 C0,-80 -90,-90 -90,-20 C-90,40 0,100 0,100 C0,100 90,40 90,-20 C90,-90 0,-80 0,-80 Z" />
          </clipPath>
        </defs>

        {/* Instagram-style rounded square logo */}
        <g transform={`translate(540, 320) scale(${logoScale})`} opacity={logoScale}>
          <rect x={-70} y={-70} width={140} height={140} rx={32}
            fill="none" stroke="url(#igGrad)" strokeWidth={5}
            filter="url(#hkGlow)"
          />
          {/* Camera body */}
          <rect x={-42} y={-42} width={84} height={84} rx={20}
            fill="none" stroke="url(#igGrad)" strokeWidth={3}
          />
          <circle cx={0} cy={0} r={22} fill="none" stroke="url(#igGrad)" strokeWidth={3} />
          <circle cx={28} cy={-28} r={5} fill="#FCAF45" filter="url(#hkGlow)" />
        </g>

        {/* CRISTIANO RONALDO label */}
        {logoScale > 0.5 && (
          <g opacity={Math.min(1, (logoScale - 0.5) * 2)}>
            <text x={540} y={430} textAnchor="middle"
              fill="rgba(255,255,255,0.9)" fontSize={32}
              fontWeight="700" fontFamily="monospace" letterSpacing={2}
            >
              @Cristiano
            </text>
          </g>
        )}

        {/* Heart icon - large and centered */}
        <g transform={`translate(540, 760) scale(${heartScale})`} opacity={heartScale}>
          {/* Pulsing ring */}
          <circle cx={0} cy={0} r={180 * ringPulse} fill="none"
            stroke="#E1306C" strokeWidth={3} opacity={ringOpacity}
            filter="url(#hkGlow)"
          />
          <circle cx={0} cy={0} r={140 * ringPulse} fill="none"
            stroke="#C13584" strokeWidth={2} opacity={ringOpacity * 0.6}
            filter="url(#hkGlow)"
          />

          {/* Heart SVG path */}
          <path
            d="M0,-70 C-5,-85 -25,-95 -45,-95 C-75,-95 -95,-70 -95,-45 C-95,5 0,80 0,80 C0,80 95,5 95,-45 C95,-70 75,-95 45,-95 C25,-95 5,-85 0,-70 Z"
            fill={heartColor}
            stroke={heartStroke}
            strokeWidth={heartFill > 0.5 ? 0 : 4}
            filter={heartFill > 0.5 ? "url(#hkStrongGlow)" : "url(#hkGlow)"}
            opacity={0.95}
          />

          {/* Heart fill overlay for transition */}
          {heartFill > 0 && heartFill < 0.5 && (
            <path
              d="M0,-70 C-5,-85 -25,-95 -45,-95 C-75,-95 -95,-70 -95,-45 C-95,5 0,80 0,80 C0,80 95,5 95,-45 C95,-70 75,-95 45,-95 C25,-95 5,-85 0,-70 Z"
              fill="#E1306C"
              opacity={heartFill * 2}
              filter="url(#hkStrongGlow)"
            />
          )}
        </g>

        {/* Sparks flying out from heart */}
        {sparks.map((spark, i) => {
          const sparkAnim = interpolate(frame, [spark.delay, spark.delay + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const sparkFly = interpolate(frame, [spark.delay, spark.delay + 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <circle
              key={i}
              cx={540 + spark.x * (1 + sparkFly * 0.5)}
              cy={760 + spark.y * (1 + sparkFly * 0.5)}
              r={spark.size * sparkAnim * (1 - sparkFly * 0.7)}
              fill="#E1306C"
              opacity={sparkAnim * (1 - sparkFly)}
              filter="url(#hkGlow)"
            />
          );
        })}

        {/* Counter display */}
        <g transform={`translate(540, 1050)`}>
          <text
            x={0} y={0}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={heartFill > 0.5 ? 88 : 72}
            fontWeight="900"
            fontFamily="monospace"
            filter={heartFill > 0.5 ? "url(#hkStrongGlow)" : undefined}
          >
            {formattedCount}
          </text>
          {frame > 60 && (
            <text x={0} y={56} textAnchor="middle"
              fill="rgba(225,48,108,0.85)" fontSize={26}
              fontWeight="700" fontFamily="monospace" letterSpacing={3}
            >
              ❤ LIKES
            </text>
          )}
        </g>

        {/* "5M LIKES IN 10 MINUTES" badge */}
        <g transform={`translate(540, ${1260 + badgeY})`} opacity={badgeOpacity}>
          <rect x={-420} y={-52} width={840} height={104} rx={52}
            fill="url(#igGrad)" filter="url(#hkStrongGlow)"
          />
          <text x={0} y={16} textAnchor="middle" fill="white" fontSize={38}
            fontWeight="900" fontFamily="monospace"
          >
            5,000,000 LIKES IN 10 MINUTES
          </text>
        </g>

        {/* Floating mini hearts */}
        {frame > 65 && [
          { x: 150, startY: 900, size: 22, speed: 0.8, delay: 65 },
          { x: 920, startY: 850, size: 18, speed: 1.1, delay: 72 },
          { x: 80, startY: 750, size: 14, speed: 0.9, delay: 80 },
          { x: 980, startY: 950, size: 20, speed: 0.7, delay: 68 },
        ].map((h, i) => {
          const floatY = -(frame - h.delay) * h.speed * 2;
          const floatOpacity = interpolate(frame, [h.delay, h.delay + 20, h.delay + 80, h.delay + 120], [0, 0.8, 0.8, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <text key={i}
              x={h.x} y={h.startY + floatY}
              textAnchor="middle" fontSize={h.size}
              opacity={floatOpacity}
            >
              ❤
            </text>
          );
        })}

        {/* Title bar */}
        <g opacity={sceneIn}>
          <rect x={0} y={40} width={1080} height={78} fill="rgba(5,9,20,0.9)" />
          <text x={540} y={91} textAnchor="middle"
            fill="url(#igGrad)" fontSize={36}
            fontWeight="900" fontFamily="monospace" letterSpacing={3}
            filter="url(#hkGlow)"
          >
            INSTAGRAM LIKE ARCHITECTURE
          </text>
          <line x1={0} y1={118} x2={1080} y2={118} stroke="url(#igGrad)" strokeWidth={1.5} strokeOpacity={0.5} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

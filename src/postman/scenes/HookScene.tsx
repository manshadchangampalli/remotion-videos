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

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dark overlay increases over time to improve text readability
  const overlayOpacity = interpolate(frame, [0, 40], [0.15, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title bar: "POSTMAN vs BROWSER" slides in from top
  const titleY = interpolate(frame, [10, 35], [-80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ✅ POSTMAN badge — springs in (frame 30)
  const postmanBadgeScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // 200 OK badge — springs in with pop (frame 55)
  const okScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // Separating line sweeps in (frame 80)
  const lineWidth = interpolate(frame, [80, 120], [0, 860], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ❌ BROWSER badge — springs in (frame 120)
  const browserBadgeScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // CORS ERROR text — slams in (frame 155)
  const corsScale = spring({
    frame: frame - 155,
    fps,
    config: { damping: 6, stiffness: 280 },
  });

  // CORS ERROR text shake (frame 170+)
  const corsShake = frame > 170
    ? Math.sin(frame * 3.5) * interpolate(frame, [170, 200, 270, 310], [0, 8, 8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // "WHY?!" question mark bounces in (frame 210)
  const whyScale = spring({
    frame: frame - 210,
    fps,
    config: { damping: 6, stiffness: 260 },
  });
  const whyBounce = frame > 240
    ? Math.abs(Math.sin((frame - 240) * 0.12)) * 15
    : 0;

  // Scene fade out
  const sceneOut = interpolate(frame, [300, 330], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulses
  const greenGlow = frame > 55 ? Math.sin(frame * 0.18) * 0.25 + 0.75 : 0;
  const redGlow = frame > 170 ? Math.sin(frame * 0.22) * 0.3 + 0.7 : 0;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* Full-screen background image */}
      <Img
        src={staticFile("postman/intro.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Dark overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(2, 4, 8, ${overlayOpacity})`,
        }}
      />

      {/* SVG overlay for text and effects */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="hGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hRedGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ─── TITLE BAR ─── */}
        <g transform={`translate(0, ${titleY})`} opacity={titleOpacity}>
          <rect x={0} y={40} width={1080} height={80} fill="rgba(2,4,8,0.85)" />
          <text
            x={540} y={93}
            textAnchor="middle"
            fill="#FF6C37"
            fontSize={38}
            fontWeight="900"
            fontFamily="monospace"
            letterSpacing={3}
            filter="url(#hGlow)"
          >
            POSTMAN  vs  BROWSER
          </text>
          <line x1={0} y1={120} x2={1080} y2={120} stroke="#FF6C37" strokeWidth={1.5} strokeOpacity={0.4} />
        </g>

        {/* ─── POSTMAN SECTION (upper half) ─── */}
        {/* Green badge */}
        <g
          transform={`translate(540, 420) scale(${postmanBadgeScale})`}
          opacity={postmanBadgeScale}
        >
          {/* Glow aura */}
          <circle cx={0} cy={0} r={110 * greenGlow} fill="rgba(0,255,136,0.07)" />
          {/* Badge */}
          <rect x={-230} y={-55} width={460} height={110} rx={22}
            fill="rgba(0,20,10,0.85)" stroke="#00ff88" strokeWidth={3}
            filter="url(#hGlow)"
          />
          <text x={0} y={18} textAnchor="middle" fill="#00ff88" fontSize={52}
            fontWeight="900" fontFamily="monospace" filter="url(#hGlow)"
          >
            ✅  POSTMAN
          </text>
        </g>

        {/* 200 OK pop-up */}
        <g
          transform={`translate(540, 580) scale(${okScale})`}
          opacity={okScale}
        >
          <rect x={-160} y={-42} width={320} height={84} rx={42}
            fill="#00ff88" filter="url(#hStrongGlow)"
          />
          <text x={0} y={15} textAnchor="middle" fill="#052e16" fontSize={48}
            fontWeight="900" fontFamily="monospace"
          >
            200 OK
          </text>
        </g>

        {/* "No questions asked" annotation */}
        {okScale > 0.5 && (
          <text
            x={540} y={680}
            textAnchor="middle"
            fill="rgba(0,255,136,0.7)"
            fontSize={22}
            fontFamily="monospace"
            opacity={Math.min(1, (okScale - 0.5) * 2)}
          >
            ✓ DATA RECEIVED · NO ISSUES
          </text>
        )}

        {/* ─── DIVIDER LINE ─── */}
        {lineWidth > 0 && (
          <g>
            <line
              x1={(1080 - lineWidth) / 2} y1={760}
              x2={(1080 + lineWidth) / 2} y2={760}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
              strokeDasharray="12,6"
            />
            <text
              x={540} y={753}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize={18}
              fontFamily="monospace"
              opacity={lineWidth / 860}
            >
              — — — — — — — — — —
            </text>
          </g>
        )}

        {/* ─── BROWSER SECTION (lower half) ─── */}
        {/* Red badge */}
        <g
          transform={`translate(540, 900) scale(${browserBadgeScale})`}
          opacity={browserBadgeScale}
        >
          <circle cx={0} cy={0} r={110 * redGlow} fill="rgba(255,50,50,0.07)" />
          <rect x={-230} y={-55} width={460} height={110} rx={22}
            fill="rgba(20,0,0,0.85)" stroke="#ff3333" strokeWidth={3}
            filter="url(#hRedGlow)"
          />
          <text x={0} y={18} textAnchor="middle" fill="#ff3333" fontSize={52}
            fontWeight="900" fontFamily="monospace" filter="url(#hRedGlow)"
          >
            ❌  BROWSER
          </text>
        </g>

        {/* CORS ERROR slam */}
        <g
          transform={`translate(${540 + corsShake}, 1080) scale(${corsScale})`}
          opacity={corsScale}
        >
          <rect x={-270} y={-62} width={540} height={124} rx={16}
            fill="#ff1a1a" filter="url(#hStrongGlow)"
          />
          <text x={0} y={20} textAnchor="middle" fill="white" fontSize={58}
            fontWeight="900" fontFamily="monospace"
          >
            CORS ERROR
          </text>
        </g>

        {/* Red console lines below CORS */}
        {corsScale > 0.5 && (
          <g opacity={Math.min(1, (corsScale - 0.5) * 2)}>
            {["⛔ Access blocked by CORS policy", "⛔ Cross-Origin Request Blocked", "⛔ No 'Access-Control-Allow-Origin'"].map((line, i) => (
              <text
                key={i}
                x={100} y={1200 + i * 40}
                fill="#ff444488"
                fontSize={19}
                fontFamily="monospace"
                opacity={interpolate(frame, [175 + i * 10, 195 + i * 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              >
                {line}
              </text>
            ))}
          </g>
        )}

        {/* WHY?! text */}
        <g
          transform={`translate(540, ${1380 + whyBounce}) scale(${whyScale})`}
          opacity={whyScale}
        >
          <text
            x={0} y={0}
            textAnchor="middle"
            fill="#facc15"
            fontSize={100}
            fontWeight="900"
            fontFamily="monospace"
            filter="url(#hStrongGlow)"
          >
            WHY?!
          </text>
        </g>

        {/* Floating question marks */}
        {frame > 220 && [
          { x: 120, y: 1350, size: 38, delay: 220, angle: -12 },
          { x: 940, y: 1340, size: 32, delay: 235, angle: 8 },
          { x: 160, y: 1460, size: 28, delay: 250, angle: -6 },
          { x: 920, y: 1470, size: 28, delay: 245, angle: 10 },
        ].map((item, i) => (
          <text
            key={i}
            x={item.x}
            y={item.y - Math.sin((frame - item.delay) * 0.08) * 12}
            textAnchor="middle"
            fill="#facc15"
            fontSize={item.size}
            fontFamily="monospace"
            transform={`rotate(${item.angle}, ${item.x}, ${item.y})`}
            opacity={interpolate(frame, [item.delay, item.delay + 20], [0, 0.6], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            filter="url(#hGlow)"
          >
            ?
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

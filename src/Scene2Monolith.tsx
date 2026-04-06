import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { fontFamily } from "./fonts";

// Sub-section 1: US Military analogy (0–190 frames, ~6.3s)
const MilitaryAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 80, stiffness: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [-70, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const imgSpring = spring({ frame: frame - 18, fps, config: { damping: 80 } });
  const imgScale = interpolate(imgSpring, [0, 1], [0.88, 1]);
  const imgOpacity = interpolate(frame, [18, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const captionSpring = spring({ frame: frame - 55, fps, config: { damping: 80 } });
  const captionY = interpolate(captionSpring, [0, 1], [40, 0]);
  const captionOpacity = interpolate(frame, [55, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 48px",
        gap: 24,
        fontFamily,
      }}
    >
      <h2
        style={{
          fontSize: 68,
          fontWeight: 900,
          textTransform: "uppercase",
          color: "#2563eb",
          margin: 0,
          textAlign: "center",
          fontFamily,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        One App. One Boss. 🎯
      </h2>

      <div
        style={{
          transform: `scale(${imgScale})`,
          opacity: imgOpacity,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* trump-usa-military.png is 1024×1536 portrait — display at 2:3 ratio */}
        <Img
          src={staticFile("trump-usa-military.png")}
          style={{ width: 560, height: 840, objectFit: "cover", display: "block" }}
        />
      </div>

      <p
        style={{
          fontSize: 38,
          fontStyle: "italic",
          color: "#6b7280",
          margin: 0,
          textAlign: "center",
          fontFamily,
          transform: `translateY(${captionY}px)`,
          opacity: captionOpacity,
        }}
      >
        Everything runs from one command center
      </p>
    </AbsoluteFill>
  );
};

// Sub-section 2: One Codebase with architecture diagram (190–383 frames, ~6.4s)
const OneCodebase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 80, stiffness: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [-60, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const imgSpring = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 180 } });
  const imgScale = interpolate(imgSpring, [0, 1], [0.7, 1]);
  const imgOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const deploySpring = spring({ frame: frame - 80, fps, config: { damping: 10, stiffness: 220 } });
  const deployScale = interpolate(deploySpring, [0, 1], [0, 1]);
  const deployOpacity = interpolate(frame, [80, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 48px",
        gap: 28,
        fontFamily,
      }}
    >
      <h2
        style={{
          fontSize: 72,
          fontWeight: 900,
          textTransform: "uppercase",
          color: "#111",
          margin: 0,
          textDecoration: "underline",
          textDecorationColor: "#3b82f6",
          textDecorationThickness: 4,
          fontFamily,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        One Codebase
      </h2>

      <div
        style={{
          transform: `scale(${imgScale})`,
          opacity: imgOpacity,
          borderRadius: 20,
          overflow: "hidden",
          border: "2px solid rgba(0,0,0,0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        {/* monolithic-architecture.png is 572×1024 */}
        <Img
          src={staticFile("monolithic-architecture.png")}
          style={{ width: 450, height: 806, objectFit: "contain", display: "block", background: "#fff" }}
        />
      </div>

      <div
        style={{
          background: "rgba(59,130,246,0.12)",
          border: "3px solid #3b82f6",
          borderRadius: 20,
          padding: "20px 48px",
          transform: `scale(${deployScale})`,
          opacity: deployOpacity,
        }}
      >
        <span style={{ fontSize: 44, fontWeight: 900, color: "#2563eb", fontFamily }}>
          ONE DEPLOY 🚢
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Reusable horizontal company card that animates in at enterFrame
const CompanyRow: React.FC<{
  name: string;
  nameColor: string;
  imgFile: string | null;
  imgW: number;
  imgH: number;
  imgBg?: string;
  fact: string;
  enterFrame: number;
}> = ({ name, nameColor, imgFile, imgW, imgH, imgBg, fact, enterFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowSpring = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 15, stiffness: 180 },
  });
  const rowY = interpolate(rowSpring, [0, 1], [70, 0]);
  const rowOpacity = interpolate(frame, [enterFrame, enterFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 940,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "24px 36px",
        background: `${nameColor}0d`,
        border: `2px solid ${nameColor}30`,
        borderRadius: 20,
        transform: `translateY(${rowY}px)`,
        opacity: rowOpacity,
      }}
    >
      {/* Left: name + fact */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: nameColor, fontFamily, lineHeight: 1 }}>
          {name}
        </div>
        <div style={{ fontSize: 30, color: "#9ca3af", fontStyle: "italic", marginTop: 8, fontFamily }}>
          {fact}
        </div>
      </div>
      {/* Right: logo */}
      <div
        style={{
          background: imgBg ?? "transparent",
          padding: imgBg ? 16 : 0,
          borderRadius: imgBg ? 12 : 0,
          flexShrink: 0,
        }}
      >
        {imgFile ? (
          <Img
            src={staticFile(imgFile)}
            style={{ width: imgW, height: imgH, objectFit: "contain", display: "block" }}
          />
        ) : (
          <div style={{ width: imgW, height: imgH, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, fontWeight: 900, color: nameColor, fontFamily }}>
            SHOPIFY
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-section 3: Companies — logos appear when narrator mentions them (383–617)
// Stack Overflow at frame 0, Shopify at +39, Basecamp at +70
const MonolithExamples: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 80 } });
  const titleY = interpolate(titleSpring, [0, 1], [-50, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: "40px 60px",
        fontFamily,
      }}
    >
      <h2
        style={{
          fontSize: 72,
          fontWeight: 900,
          textTransform: "uppercase",
          color: "#111",
          margin: 0,
          fontFamily,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        Built on Monoliths 🏛️
      </h2>

      {/* Stack Overflow — mentioned first at frame 0 */}
      <CompanyRow
        name="Stack Overflow"
        nameColor="#f48024"
        imgFile="stackoverflow.png"
        imgW={260}
        imgH={173}
        imgBg="#fafafa"
        fact="Serving 66M+ devs. One monolith."
        enterFrame={0}
      />

      {/* Shopify — mentioned at +39 frames */}
      <CompanyRow
        name="Shopify"
        nameColor="#96bf48"
        imgFile={null}
        imgW={220}
        imgH={60}
        fact="$100B+ company. Started as one Rails app."
        enterFrame={39}
      />

      {/* Basecamp — mentioned at +70 frames */}
      <CompanyRow
        name="Basecamp"
        nameColor="#1f2937"
        imgFile="basecamp.png"
        imgW={110}
        imgH={110}
        fact="Team PM tool. Still a happy monolith."
        enterFrame={70}
      />
    </AbsoluteFill>
  );
};

// Sub-section 4: The Bug / War Zone (617+)
const BugZone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 0.25], { extrapolateRight: "clamp" });

  const bugSpring = spring({ frame, fps, config: { damping: 8, stiffness: 300 } });
  const bugScale = interpolate(bugSpring, [0, 1], [0, 1]);
  const bugPulse = interpolate(Math.sin((frame / fps) * Math.PI * 2.2), [-1, 1], [0.9, 1.0]);

  const titleSpring = spring({ frame: frame - 18, fps, config: { damping: 80 } });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const crashSpring = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 280 } });
  const crashScale = interpolate(crashSpring, [0, 1], [0.4, 1]);
  const crashOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const warSpring = spring({ frame: frame - 65, fps, config: { damping: 80 } });
  const warY = interpolate(warSpring, [0, 1], [50, 0]);
  const warOpacity = interpolate(frame, [65, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        background: `rgba(127,29,29,${bgOpacity})`,
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 160,
          fontWeight: 900,
          color: "#dc2626",
          textTransform: "uppercase",
          lineHeight: 1,
          transform: `scale(${bugScale * bugPulse})`,
          filter: "drop-shadow(0 0 40px rgba(220,38,38,0.7))",
        }}
      >
        BUG ❌
      </div>

      <h3
        style={{
          fontSize: 64,
          fontWeight: 900,
          textAlign: "center",
          color: "#111",
          lineHeight: 1.2,
          marginTop: 16,
          marginBottom: 32,
          fontFamily,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        ONE BUG IN <br />
        <span style={{ color: "#ef4444" }}>PAYMENTS?</span>
      </h3>

      <div
        style={{
          padding: 32,
          border: "4px solid #dc2626",
          background: "#dc2626",
          color: "#fff",
          borderRadius: 24,
          transform: `scale(${crashScale})`,
          opacity: crashOpacity,
        }}
      >
        <p style={{ fontSize: 64, fontWeight: 900, textTransform: "uppercase", fontStyle: "italic", margin: 0, fontFamily }}>
          App Crashed!
        </p>
      </div>

      <p
        style={{
          marginTop: 48,
          fontSize: 44,
          fontFamily,
          textTransform: "uppercase",
          color: "#f87171",
          fontWeight: 700,
          background: "#fff",
          padding: "12px 20px",
          borderRadius: 8,
          transform: `translateY(${warY}px)`,
          opacity: warOpacity,
        }}
      >
        Codebase = War Zone ⚔️
      </p>
    </AbsoluteFill>
  );
};

export const Scene2Monolith: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", fontFamily }}>
      {/* 0–190: Military analogy (audio 9.0–15.4s) */}
      <Sequence from={0} durationInFrames={190}>
        <MilitaryAnalogy />
      </Sequence>

      {/* 190–383: One codebase (audio 15.4–21.8s) */}
      <Sequence from={190} durationInFrames={193}>
        <OneCodebase />
      </Sequence>

      {/* 383–617: Companies mentioned — logos appear exactly when named */}
      {/* Stack Overflow at 21.76s (frame 0), Shopify at 23.07s (+39), Basecamp at 24.12s (+70) */}
      <Sequence from={383} durationInFrames={234}>
        <MonolithExamples />
      </Sequence>

      {/* 617+: Bug / war zone (audio 29.5s+) */}
      <Sequence from={617}>
        <BugZone />
      </Sequence>
    </AbsoluteFill>
  );
};

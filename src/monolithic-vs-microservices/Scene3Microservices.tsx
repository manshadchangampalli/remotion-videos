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

// Sub-section 1: Iran regions analogy (0–292, ~9.7s)
const RegionsAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 80, stiffness: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [-70, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const imgSpring = spring({ frame: frame - 20, fps, config: { damping: 80 } });
  const imgScale = interpolate(imgSpring, [0, 1], [0.88, 1]);
  const imgOpacity = interpolate(frame, [20, 40], [0, 1], {
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
          color: "#059669",
          margin: 0,
          textAlign: "center",
          fontFamily,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        31 Independent Regions 🗺️
      </h2>

      {/* iran.png is 1024×1536 portrait — display at correct 2:3 ratio */}
      <div
        style={{
          transform: `scale(${imgScale})`,
          opacity: imgOpacity,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(16,185,129,0.25)",
          border: "3px solid rgba(16,185,129,0.3)",
        }}
      >
        <Img
          src={staticFile("monolithic-vs-microservices/iran.png")}
          style={{ width: 840, height: 840, objectFit: "cover", display: "block" }}
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
        Knock one out — the others keep running 👊
      </p>
    </AbsoluteFill>
  );
};

// Sub-section 2: Independent services (292–541, ~8.3s)
const IndependentComponents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const services = [
    { name: "AUTH", db: "Auth DB", color: "#7c3aed", delay: 24 },
    { name: "PAYMENTS", db: "Pay DB", color: "#059669", delay: 29 },
    { name: "ORDERS", db: "Order DB", color: "#2563eb", delay: 53 },
    { name: "NOTIF", db: "User DB", color: "#d97706", delay: 72 },
  ];

  const gatewaySpring = spring({ frame: frame - 191, fps, config: { damping: 10, stiffness: 180 } });
  const gatewayScale = interpolate(gatewaySpring, [0, 1], [0, 1]);
  const gatewayOpacity = interpolate(frame, [191, 211], [0, 1], {
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
        gap: 40,
        padding: "48px 60px",
        fontFamily,
      }}
    >
      <h2
        style={{
          fontSize: 68,
          fontWeight: 900,
          color: "#059669",
          margin: 0,
          textTransform: "uppercase",
          fontFamily,
          opacity: titleOpacity,
        }}
      >
        Each Service = Its Own World
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%", maxWidth: 880 }}>
        {services.map(({ name, db, color, delay }, i) => {
          const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200 } });
          const itemY = interpolate(itemSpring, [0, 1], [50, 0]);
          const itemOpacity = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={name}
              style={{
                padding: 36,
                border: `3px solid ${color}33`,
                borderRadius: 20,
                background: `${color}0d`,
                textAlign: "center",
                transform: `translateY(${itemY}px)`,
                opacity: itemOpacity,
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 900, color, fontFamily }}>{name}</div>
              <div style={{ fontSize: 28, color: "#9ca3af", marginTop: 8, fontFamily }}>{db}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 900,
          padding: "22px 52px",
          background: "#059669",
          color: "#fff",
          borderRadius: 999,
          fontFamily,
          transform: `scale(${gatewayScale}) rotate(1.5deg)`,
          opacity: gatewayOpacity,
        }}
      >
        API GATEWAY 🛡️
      </div>
    </AbsoluteFill>
  );
};

// Reusable horizontal company row that pops in at enterFrame
const CompanyRow: React.FC<{
  name: string;
  nameColor: string;
  imgFile: string;
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
        padding: "22px 36px",
        background: `${nameColor}0d`,
        border: `2px solid ${nameColor}30`,
        borderRadius: 20,
        transform: `translateY(${rowY}px)`,
        opacity: rowOpacity,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: nameColor, fontFamily, lineHeight: 1 }}>
          {name}
        </div>
        <div style={{ fontSize: 30, color: "#9ca3af", fontStyle: "italic", marginTop: 8, fontFamily }}>
          {fact}
        </div>
      </div>
      <div
        style={{
          background: imgBg ?? "transparent",
          padding: imgBg ? "12px 20px" : 0,
          borderRadius: imgBg ? 12 : 0,
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile("monolithic-vs-microservices/" + imgFile)}
          style={{ width: imgW, height: imgH, objectFit: "contain", display: "block" }}
        />
      </div>
    </div>
  );
};

// Sub-section 3: Scale Masters — logos appear exactly when narrator names them (541–805)
// Netflix at 63.04s = Scene3 frame 541 → ScaleMasters frame 0
// Amazon  at 63.68s = Scene3 frame 560 → ScaleMasters frame +19
// Uber    at 64.60s = Scene3 frame 588 → ScaleMasters frame +47
// "700+ services" at 66.08s = Scene3 frame 632 → ScaleMasters frame +91
const ScaleMasters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 80 } });
  const titleY = interpolate(titleSpring, [0, 1], [-50, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // "Netflix 700+ services" fact appears at frame 120
  const statSpring = spring({ frame: frame - 120, fps, config: { damping: 14, stiffness: 180 } });
  const statY = interpolate(statSpring, [0, 1], [50, 0]);
  const statOpacity = interpolate(frame, [120, 140], [0, 1], {
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
        gap: 24,
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
        Scale Masters 🚀
      </h2>

      {/* Netflix — mentioned at ScaleMasters frame 0 */}
      <CompanyRow
        name="Netflix"
        nameColor="#e50914"
        imgFile="netflix.png"
        imgW={110}
        imgH={110}
        fact="700+ microservices at global scale"
        enterFrame={0}
      />

      {/* Amazon — mentioned at ScaleMasters frame 19 */}
      <CompanyRow
        name="Amazon"
        nameColor="#ff9900"
        imgFile="amazon.png"
        imgW={260}
        imgH={87}
        imgBg="#fafafa"
        fact="Famously migrated from monolith to microservices"
        enterFrame={19}
      />

      {/* Uber — mentioned at ScaleMasters frame 47 */}
      <CompanyRow
        name="Uber"
        nameColor="#000"
        imgFile="uber.png"
        imgW={260}
        imgH={91}
        fact="1 Python app → 2500+ microservices"
        enterFrame={47}
      />

      {/* "Netflix runs 700+ services" fact — at ScaleMasters frame 120 */}
      <div
        style={{
          marginTop: 8,
          padding: "20px 40px",
          background: "rgba(229,9,20,0.08)",
          border: "2px solid #e50914",
          borderRadius: 20,
          transform: `translateY(${statY}px)`,
          opacity: statOpacity,
        }}
      >
        <span style={{ fontSize: 42, fontWeight: 900, color: "#e50914", fontFamily }}>
          🤯 Netflix runs 700+ services!
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Sub-section 4: The Cost (805+)
const TheCost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.5, 1]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const costs = [
    { icon: "🚢", text: "10 Separate Deployments", delay: 65 },
    { icon: "🕵️", text: "Debugging across services", delay: 122 },
    { icon: "☸️", text: "Kubernetes complexity", delay: 185 },
  ];

  const footerSpring = spring({ frame: frame - 222, fps, config: { damping: 80 } });
  const footerY = interpolate(footerSpring, [0, 1], [50, 0]);
  const footerOpacity = interpolate(frame, [222, 242], [0, 1], {
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
        background: "rgba(245,158,11,0.05)",
        fontFamily,
      }}
    >
      <h2
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: "#d97706",
          textTransform: "uppercase",
          textAlign: "center",
          marginTop: 0,
          marginBottom: 32,
          fontFamily,
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        THE COST 💸
      </h2>
      <div
        style={{
          width: 880,
          border: "3px dashed rgba(217,119,6,0.35)",
          padding: 48,
          borderRadius: 40,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {costs.map(({ icon, text, delay }) => {
          const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 80 } });
          const itemX = interpolate(itemSpring, [0, 1], [-80, 0]);
          const itemOpacity = interpolate(frame, [delay, delay + 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                fontSize: 46,
                color: "#1f2937",
                fontWeight: 700,
                background: "rgba(0,0,0,0.03)",
                padding: 28,
                borderRadius: 20,
                border: "1px solid rgba(0,0,0,0.08)",
                fontFamily,
                transform: `translateX(${itemX}px)`,
                opacity: itemOpacity,
              }}
            >
              <span style={{ fontSize: 44 }}>{icon}</span>
              {text}
            </div>
          );
        })}
      </div>
      <p
        style={{
          marginTop: 52,
          fontSize: 40,
          fontFamily,
          textAlign: "center",
          color: "#d97706",
          padding: "20px 32px",
          border: "2px solid #d97706",
          borderRadius: 20,
          fontWeight: 700,
          transform: `translateY(${footerY}px)`,
          opacity: footerOpacity,
        }}
      >
        Infrastructure = Full-time Job 🏗️
      </p>
    </AbsoluteFill>
  );
};

export const Scene3Microservices: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", fontFamily }}>
      {/* 0–310: Regions analogy (audio 44.41–54.74s) */}
      <Sequence from={0} durationInFrames={310}>
        <RegionsAnalogy />
      </Sequence>

      {/* 310–549: Independent components (audio 54.74–63.04s) */}
      <Sequence from={310} durationInFrames={239}>
        <IndependentComponents />
      </Sequence>

      {/* 549–813: Companies (audio 63.04–71.84s) */}
      <Sequence from={549} durationInFrames={264}>
        <ScaleMasters />
      </Sequence>

      {/* 813+: The Cost (audio 71.84s+) */}
      <Sequence from={813}>
        <TheCost />
      </Sequence>
    </AbsoluteFill>
  );
};

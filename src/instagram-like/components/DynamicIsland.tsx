import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { IG_BLUE } from "../constants";

export const DynamicIsland: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Define global expansion triggers
  // 1. Hook Scaling: frame 105 to 203
  const isHookScaling = frame >= 105 && frame < 203;
  // 2. Bottleneck Overflow: frame 280 to 360 (during crash)
  const isBottleneckActive = frame >= 280 && frame < 400;
  // 3. Database Scaling: frame 2600 to 3000
  const isDbScaling = frame >= 2600 && frame < 3000;

  const isActive = isHookScaling || isBottleneckActive || isDbScaling;

  const diProgress = spring({
    frame: isActive ? (frame - (isHookScaling ? 105 : isBottleneckActive ? 280 : 2600)) : 0,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const width = interpolate(diProgress, [0, 1], [220, 560]);
  const height = interpolate(diProgress, [0, 1], [48, 64]);
  const borderRadius = interpolate(diProgress, [0, 1], [24, 32]);
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  // Content selection
  const statusLine = isHookScaling 
    ? "SYSTEM SCALING" 
    : isBottleneckActive 
      ? "BOTTLENECK DETECTED" 
      : "DATABASE EXPANDING";
  
  const metricLabel = isHookScaling 
    ? "AUTO-REQ" 
    : isBottleneckActive 
      ? "LOAD" 
      : "IOPS";

  const metricValue = isHookScaling 
    ? `${Math.floor(842 + Math.sin(frame * 0.4) * 12)}k/s`
    : isBottleneckActive
      ? `${Math.floor(95 + Math.random() * 5)}%`
      : `${Math.floor(12 + Math.sin(frame * 0.1) * 3)}M`;

  const statusColor = isBottleneckActive ? "#ff4444" : "#00ff88";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 48px 0",
        pointerEvents: "none",
        color: "#fff",
        fontFamily: "Outfit, sans-serif",
        fontSize: 26,
        fontWeight: 700,
      }}
    >
      {/* Time (Left) */}
      <span style={{ width: 100 }}>12:37</span>

      {/* DYNAMIC ISLAND (Notch) */}
      <div
        style={{
          width,
          height,
          background: "#000",
          borderRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
          opacity,
          position: "relative",
          pointerEvents: "auto",
        }}
      >
        <div 
          style={{ 
            whiteSpace: "nowrap", 
            fontSize: 16, 
            color: "#fff",
            fontWeight: 800,
            letterSpacing: 0.5,
            opacity: diProgress,
            display: "flex",
            alignItems: "center",
            gap: diProgress * 12
          }}
        >
          <div style={{ 
            width: 10, 
            height: 10, 
            borderRadius: "50%", 
            background: statusColor,
            boxShadow: `0 0 12px ${statusColor}`,
            opacity: 0.6 + Math.sin(frame * 0.2) * 0.4
          }} />
          <span style={{ fontSize: 13, textTransform: "uppercase" }}>{statusLine}</span>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
            <span style={{ fontSize: 11, color: isBottleneckActive ? "#ff9999" : IG_BLUE, lineHeight: 1 }}>{metricLabel}</span>
            <span style={{ fontSize: 13, color: "#fff", lineHeight: 1 }}>
              {metricValue}
            </span>
          </div>
        </div>
      </div>

      {/* Status Icons (Right) */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", width: 100, justifyContent: "flex-end" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fillOpacity=".3"/>
          <path d="M4.77 12.5L12.01 21.49l7.24-8.99C18.85 12.24 16.1 10 12.01 10c-4.09 0-6.84 2.24-7.24 2.5z"/>
        </svg>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
        </svg>
      </div>
    </div>
  );
};

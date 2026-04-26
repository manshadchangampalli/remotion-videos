import React from "react";
import { Img, staticFile } from "remotion";
import { palette } from "./palette";

interface Props {
  size?: number;
  opacity?: number;
}

export const DecathlonLogo: React.FC<Props> = ({
  size = 120,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        opacity,
        filter: `drop-shadow(0 0 24px ${palette.accent}66) drop-shadow(0 0 40px ${palette.blue}55)`,
      }}
    >
      <Img
        src={staticFile("decathlon/decathlon-logo.png")}
        style={{
          height: size,
          width: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

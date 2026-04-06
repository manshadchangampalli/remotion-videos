import React from "react";
import {
  AbsoluteFill,
} from "remotion";

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill className="bg-white flex items-center justify-center">
      <h1 className="text-6xl font-bold text-black text-center">
        Short URL Project
      </h1>
      <p className="text-2xl text-gray-600 mt-4">
        Ready for a new video
      </p>
    </AbsoluteFill>
  );
};

import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./short-url/Composition";

// Loading the Outfit font for a premium look
import "@remotion/google-fonts/Outfit";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortURL"
        component={MyComposition}
        durationInFrames={2318} // 77.25s at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

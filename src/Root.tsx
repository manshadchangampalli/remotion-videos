import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={MyComposition}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

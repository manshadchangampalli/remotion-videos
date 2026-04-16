import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./short-url/Composition";
import { PostmanComposition } from "./postman/Composition";
import { InstagramLikeComposition } from "./instagram-like/Composition";
import { LLMComposition, TOTAL_FRAMES as LLM_FRAMES } from "./llm/Composition";
import { E2EEComposition } from "./e2ee/Composition";
import { ShazamComposition } from "./shazam/Composition";
import { MyComposition as MonolithicComposition } from "./monolithic-vs-microservices/Composition";
import { NpmVsPnpm } from "./npm-vs-pnpm/NpmVsPnpm";

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
      <Composition
        id="PostmanVsBrowser"
        component={PostmanComposition}
        durationInFrames={2112} // 70.4s at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramLike"
        component={InstagramLikeComposition}
        durationInFrames={3840} // 128s at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LLMWorking"
        component={LLMComposition}
        durationInFrames={LLM_FRAMES} // 3795 frames = 126.5s (matches audio duration exactly)
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="E2EEWhatsApp"
        component={E2EEComposition}
        durationInFrames={1200}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShazamConstellation"
        component={ShazamComposition}
        durationInFrames={1710}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MonolithicVsMicroservices"
        component={MonolithicComposition}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NpmVsPnpm"
        component={NpmVsPnpm}
        durationInFrames={1494}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

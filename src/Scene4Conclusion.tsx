import React from "react";
import {
  AbsoluteFill,
} from "remotion";

export const Scene4Conclusion: React.FC = () => {
  return (
    <AbsoluteFill className="bg-black flex flex-col items-center justify-center p-20">
      <div className="absolute w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px]" />
      
      <div className="z-10 text-center">
        <h2 className="text-8xl font-black uppercase text-brand-primary mb-10 tracking-tighter">THE VERDICT</h2>
        <div className="space-y-12 mb-20">
           <div className="p-12 border-4 border-brand-primary bg-brand-primary/10 rounded-[50px] rotate-1">
              <p className="text-7xl font-black uppercase text-white tracking-tight">Start with Monolith 🧱</p>
           </div>
           <div className="p-12 border-4 border-brand-secondary bg-brand-secondary/10 rounded-[50px] -rotate-1">
              <p className="text-7xl font-black uppercase text-white tracking-tight">Split gradually 🛸</p>
           </div>
        </div>
        
        <div className="mt-20 flex flex-col items-center gap-10">
          <p className="text-5xl font-bold italic tracking-tight text-brand-accent animate-pulse uppercase">Follow for more System Design!</p>
          <div className="h-4 w-60 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

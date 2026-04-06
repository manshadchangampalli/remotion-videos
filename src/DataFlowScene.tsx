import React from "react";
import { 
  AbsoluteFill, 
  useCurrentFrame, 
  spring,
  useVideoConfig,
  staticFile,
  Img
} from "remotion";

const IconWrapper: React.FC<{ 
  src: string;
  label: string; 
  active?: boolean;
}> = ({ src, label, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { stiffness: 100 },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`w-48 h-48 rounded-3xl flex items-center justify-center transition-all duration-300 ${active ? 'ring-8 ring-blue-400 scale-110 shadow-2xl bg-blue-50' : 'shadow-lg bg-white'}`}
        style={{ 
          transform: `scale(${scale})`,
        }}
      >
        <Img 
            src={staticFile(src)} 
            className="w-40 h-40 object-contain drop-shadow-xl"
        />
      </div>
      <span className={`text-4xl font-extrabold uppercase tracking-tighter ${active ? 'text-blue-600 scale-110 outline-white' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
};

const Arrow: React.FC<{ 
  active: boolean; 
  label?: string;
  direction?: 'down' | 'up' | 'right' | 'left';
}> = ({ active, label, direction = 'down' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = active ? spring({
    frame,
    fps,
    config: { damping: 20 },
  }) : 0;

  const arrowStyles: Record<string, any> = {
    down: { transform: 'rotate(0deg)' },
    up: { transform: 'rotate(180deg)' },
    right: { transform: 'rotate(-90deg)' },
    left: { transform: 'rotate(90deg)' },
  };

  return (
    <div className="flex flex-col items-center gap-2 py-4 h-32 relative">
      <div 
        className="w-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200" 
        style={{ height: '100%', ...arrowStyles[direction] }}
      >
        <div 
          className="w-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" 
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      {active && label && (
        <div className="absolute top-1/2 -translate-y-1/2 bg-blue-600 px-4 py-2 rounded-2xl shadow-xl z-10 scale-110">
          <span className="text-2xl font-black text-white italic tracking-tighter">{label}</span>
        </div>
      )}
    </div>
  );
};

export const DataFlowScene: React.FC<{
  activeStep: number;
}> = ({ activeStep }) => {
  return (
    <AbsoluteFill className="bg-white flex flex-col items-center justify-center pt-24">
      <div className="flex flex-col items-center w-full max-w-2xl px-10">
        
        {/* Step 1: User Client */}
        <IconWrapper 
            src="client.png"
            label="User Click" 
            active={activeStep === 0} 
        />

        <Arrow active={activeStep >= 1} label="REQUEST" />

        {/* Step 2: Load Balancer */}
        <IconWrapper 
            src="load_balancer.png"
            label="Load Balancer" 
            active={activeStep === 1} 
        />

        <Arrow active={activeStep >= 2} label="CHECKING CACHE" />

        {/* The Choice: Redis or NoSQL */}
        <div className="flex gap-24 items-start justify-center">
            
            {/* Redis Cache */}
            <div className="flex flex-col items-center">
                <IconWrapper 
                    src="redis.png"
                    label="Redis (Fast)" 
                    active={activeStep === 2} 
                />
                {activeStep === 2 && (
                    <div className="mt-6 bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-3xl shadow-2xl scale-125 animate-bounce">
                        CACHE HIT!
                    </div>
                )}
            </div>

            {/* NoSQL Database */}
            <div className="flex flex-col items-center">
                <IconWrapper 
                    src="database.png"
                    label="NoSQL DB" 
                    active={activeStep === 3} 
                />
                {activeStep === 3 && (
                    <div className="mt-6 bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-3xl shadow-2xl">
                        MAPPING...
                    </div>
                )}
            </div>
        </div>

        {/* Step 4: Final Redirect */}
        {activeStep >= 4 && (
            <>
                <Arrow active={true} label="REDIRECT" />
                <IconWrapper 
                    src="redirect.png"
                    label="Destination" 
                    active={activeStep >= 4} 
                />
            </>
        )}

      </div>
    </AbsoluteFill>
  );
};

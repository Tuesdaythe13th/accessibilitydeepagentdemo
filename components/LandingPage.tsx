import React from 'react';
import LogoIcon from './icons/LogoIcon';
import SearchIcon from './icons/SearchIcon';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
      const card = cardRef.current;
      if (!card) return;

      const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty('--x', `${x}px`);
          card.style.setProperty('--y', `${y}px`);

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * 5; 
          const rotateY = ((x - centerX) / centerX) * -5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          
          const angle = 135 + rotateX - rotateY;
          card.style.setProperty('--angle', `${angle}deg`);
      };

      const handleMouseLeave = () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
          card.style.setProperty('--angle', '135deg');
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
      };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-black">
      {/* Background decoration: Concentric circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[1200px] h-[1200px] bg-indigo-900/20 rounded-full"></div>
        <div className="absolute w-[900px] h-[900px] bg-purple-900/20 rounded-full"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-900/20 rounded-full"></div>
        <div className="absolute w-[300px] h-[300px] bg-indigo-800/20 rounded-full"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-20">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-6 h-6 text-white" />
          <span className="text-xl font-semibold">Connect Flow</span>
        </div>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <SearchIcon className="w-5 h-5" />
        </button>
      </header>
      
      {/* Main container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-8 animate-fade-in-up">
        <div ref={cardRef} className="interactive-card rounded-3xl w-full h-[400px] p-12 flex items-center justify-between">
            <div className="glow"></div>
            
            {/* Left Side */}
            <div className="flex flex-col items-start justify-center gap-8 w-1/2 h-full">
                <h1 className="text-4xl font-semibold text-white leading-tight">
                    The self evolving accessibility platform
                </h1>
                <button 
                    onClick={onGetStarted}
                    className="text-lg text-white font-light border-b border-white/40 hover:border-white transition-colors pb-0.5"
                >
                    Start the demo
                </button>
            </div>

            {/* Right Side - Toggle */}
            <div className="flex flex-col items-center justify-center gap-4 w-1/2 h-full">
                {/* Toggle switch visual */}
                <div className="relative w-40 h-20 rounded-full bg-black/40 border border-white/10 flex items-center p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-60 blur-lg"></div>
                    <div className="relative w-full h-full rounded-full flex overflow-hidden">
                        <div className="w-1/2 h-full bg-blue-500/30"></div>
                        <div className="w-1/2 h-full bg-purple-600/30"></div>
                    </div>
                    {/* Thumb */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-400/20 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
                        <div className="absolute inset-2 rounded-full bg-gray-300/30 flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-gray-200/50 ring-4 ring-gray-300/30"></div>
                        </div>
                    </div>
                </div>
                <p className="text-sm font-semibold text-gray-300 tracking-[0.2em] mt-2">
                    ARTIFEX LABS
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
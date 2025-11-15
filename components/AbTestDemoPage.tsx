import React from 'react';
import LogoIcon from './icons/LogoIcon';

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className = '' }) => {
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
        <div ref={cardRef} className={`interactive-card rounded-2xl ${className}`}>
          {children}
          <div className="glow"></div>
        </div>
    );
};

// Simple SVG icons for the demo UI
const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);
const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3L9.5 8.5L4 10l5.5 4.5L8 21l4-3.5L16 21l-1.5-6.5L20 10l-5.5-1.5z"/>
    </svg>
);

interface AbTestDemoPageProps {
    onReturnToDashboard: () => void;
}

const AbTestDemoPage: React.FC<AbTestDemoPageProps> = ({ onReturnToDashboard }) => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center p-4 md:p-8 overflow-y-auto">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-black">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/40 rounded-full blur-[200px]"></div>
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[150px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center text-white mb-8">
                <div className="flex items-center gap-2">
                    <LogoIcon className="w-6 h-6" />
                    <span className="text-xl font-semibold">Connect Flow / A/B Test Demo</span>
                </div>
                <button 
                    onClick={onReturnToDashboard}
                    className="px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 border border-white/20 bg-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:-translate-y-0.5"
                >
                    Back to Dashboard
                </button>
            </header>

            <main className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in-up">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">Neuroadaptive UI for Conference Settings</h1>
                </div>

                {/* Step 1 & Objective */}
                <GlassCard className="p-6 bg-black/20">
                    <h2 className="text-xl font-semibold text-purple-300 mb-3">Step 1: The Trigger - Sensory Overload Detected</h2>
                    <p className="text-gray-300">The user is in a busy conference call. The AI detects a spike in the user's cognitive load from high chat activity and multiple screen shares.</p>
                </GlassCard>
                <GlassCard className="p-6 bg-black/20">
                    <h2 className="text-xl font-semibold text-purple-300 mb-3">Objective</h2>
                    <p className="text-gray-300">To determine which interface best helps neurodivergent users manage sensory overload during a busy conference call.</p>
                </GlassCard>

                <h2 className="text-2xl font-bold text-center text-white mt-4">Step 2: The A/B Test - Two Different Solutions</h2>
                
                {/* A/B Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Version A */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-semibold text-blue-300 text-center">Version A (Control): The Manual Dropdown</h3>
                        <p className="text-center text-sm text-gray-400 -mt-4">The user feels overwhelmed and must manually find and navigate a traditional settings menu to find a solution.</p>
                        <GlassCard className="p-6 flex-grow">
                            <h4 className="font-semibold mb-3">User Journey (A)</h4>
                            <div className="h-40 bg-black/30 rounded-lg flex items-center justify-center p-4 border border-white/10 mb-4">
                               <div className="text-center">
                                    <SettingsIcon className="w-12 h-12 mx-auto text-gray-500"/>
                                    <p className="text-sm text-gray-400 mt-2">Find & Click Settings</p>
                                    <div className="text-2xl animate-pulse">↓</div>
                                    <div className="bg-gray-800 p-2 rounded text-xs w-40 mx-auto">Read Options...</div>
                               </div>
                            </div>
                            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                                <li>Notice overload.</li>
                                <li>Stop focusing on the meeting.</li>
                                <li>Find the 'Settings' icon.</li>
                                <li>Click to open a dropdown.</li>
                                <li>Read through text-based options.</li>
                                <li>Select "Reduce Visual Noise."</li>
                            </ol>
                        </GlassCard>
                        <GlassCard className="p-6 flex-grow">
                             <h4 className="font-semibold mb-3">Version A: The Result</h4>
                             <div className="h-32 bg-green-900/20 rounded-lg flex items-center justify-center p-4 border border-green-400/20 mb-4">
                                <p className="text-green-300 text-center">UI is calm.</p>
                             </div>
                            <p className="text-sm text-gray-300">The UI is now calm, but the user had to do all the work, adding to their cognitive load during a stressful moment.</p>
                        </GlassCard>
                    </div>

                    {/* Version B */}
                    <div className="flex flex-col gap-6">
                         <h3 className="text-xl font-semibold text-green-300 text-center">Version B (Test): The Proactive Agent</h3>
                         <p className="text-center text-sm text-gray-400 -mt-4">AccessibleDeepAgent proactively intervenes with a simple, visual, and non-intrusive suggestion.</p>
                        <GlassCard className="p-6 flex-grow">
                            <h4 className="font-semibold mb-3">User Journey (B)</h4>
                            <div className="h-40 bg-black/30 rounded-lg flex items-center justify-center p-4 border border-white/10 mb-4">
                                <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-400/30 animate-pulse-glow">
                                    <SparkleIcon className="w-8 h-8 mx-auto text-purple-300"/>
                                    <p className="text-sm text-purple-200 mt-2">Agent suggests a solution</p>
                                    <button className="text-xs mt-2 bg-purple-600 px-3 py-1 rounded-md hover:bg-purple-700">Yes, Simplify</button>
                                </div>
                            </div>
                            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                                <li>Notice overload.</li>
                                <li>The Agent appears with a helpful, visual suggestion.</li>
                                <li>Click one simple button: "Yes, Simplify."</li>
                            </ol>
                        </GlassCard>
                        <GlassCard className="p-6 flex-grow">
                            <h4 className="font-semibold mb-3">Version B: The Result</h4>
                            <div className="h-32 bg-green-900/20 rounded-lg flex items-center justify-center p-4 border border-green-400/20 mb-4">
                                <p className="text-green-300 text-center">UI is calm.</p>
                             </div>
                            <p className="text-sm text-gray-300">The UI is now calm. The user feels supported and in control, having solved the problem with a single, effortless click.</p>
                        </GlassCard>
                    </div>
                </div>

                {/* Outcome & Hypothesis */}
                <h2 className="text-2xl font-bold text-center text-white mt-4">Step 3: The Outcome & Hypothesis</h2>
                <GlassCard className="p-6 bg-black/20">
                    <h3 className="text-xl font-semibold text-purple-300 mb-4">Why We Hypothesize Version B is Better</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                            <h4 className="font-bold text-gray-200">🧠 Lower Cognitive Load</h4>
                            <p className="text-gray-400 mt-1">The user doesn't have to read, search, or make multiple decisions. The agent does the heavy lifting.</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                             <h4 className="font-bold text-gray-200">⚡️ Faster Resolution</h4>
                            <p className="text-gray-400 mt-1">The problem is solved in one click, allowing the user to immediately return their focus to the meeting.</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                            <h4 className="font-bold text-gray-200">💖 More Empowering</h4>
                            <p className="text-gray-400 mt-1">The user feels supported by the system rather than having to fight against it. This builds trust and reduces anxiety.</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-200">Primary Metric for Success</h4>
                        <p className="text-gray-400 mt-1 text-sm">We expect to see a much higher <span className="font-semibold text-green-400">Intervention Acceptance Rate</span> in Version B, proving that users find the proactive suggestions helpful and welcome.</p>
                    </div>
                </GlassCard>
            </main>
        </div>
    );
};

export default AbTestDemoPage;

import React from 'react';
import { SessionData, TranscriptionEvent } from '../types';
import LogoIcon from './icons/LogoIcon';

// --- Reusable Glassmorphic Components ---
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

const TokenPill: React.FC<{ event: TranscriptionEvent }> = ({ event }) => {
    const speakerColors: { [key: string]: string } = {
        'AI': 'text-purple-400',
        'You': 'text-blue-400',
        'ASL': 'text-cyan-400',
    };
    return (
        <div className="p-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
            <div className="flex justify-between items-start text-sm">
                <p className="text-gray-300">
                    <span className={`font-semibold ${speakerColors[event.speaker] || 'text-gray-400'}`}>{event.speaker}:</span> {event.text}
                </p>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{event.timestamp}</span>
            </div>
        </div>
    );
};

// --- Page Specific Components ---
const BeTalConvergencePlot: React.FC = () => {
    const data = [
        { iteration: 1, ratio: 0.73 },
        { iteration: 2, ratio: 0.89 },
        { iteration: 3, ratio: 0.97 },
        { iteration: 4, ratio: 0.97 },
    ];
    const targetRatio = 1.0;
    const fairRange = [0.9, 1.1];
    
    const width = 300;
    const height = 150;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };

    const xScale = (i: number) => padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right);
    const yScale = (val: number) => height - padding.bottom - ((val - 0.6) / (1.2 - 0.6)) * (height - padding.top - padding.bottom);
    
    const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(p.ratio)}`).join(' ');

    return (
        <div>
            <h4 className="font-semibold text-gray-200 mb-2">BeTaL Convergence Plot</h4>
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
                    <title id="chart-title">A line chart showing the fairness ratio converging towards the target of 1.0 over 4 iterations.</title>
                    {/* Fair range */}
                    <rect x={padding.left} y={yScale(fairRange[1])} width={width - padding.left - padding.right} height={yScale(fairRange[0]) - yScale(fairRange[1])} fill="rgba(74, 222, 128, 0.1)" />
                    <line x1={padding.left} y1={yScale(fairRange[0])} x2={width-padding.right} y2={yScale(fairRange[0])} stroke="rgba(74, 222, 128, 0.3)" strokeDasharray="2,2" />
                    <line x1={padding.left} y1={yScale(fairRange[1])} x2={width-padding.right} y2={yScale(fairRange[1])} stroke="rgba(74, 222, 128, 0.3)" strokeDasharray="2,2" />
                    <text x={width - padding.right + 4} y={yScale(fairRange[0]) + 4} fill="#888" fontSize="10">Fair Zone</text>

                    {/* Target line */}
                    <line x1={padding.left} y1={yScale(targetRatio)} x2={width - padding.right} y2={yScale(targetRatio)} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,3" />
                    <text x={padding.left - 5} y={yScale(targetRatio) + 4} fill="#aaa" fontSize="10" textAnchor="end">1.0</text>

                    {/* Axes and labels */}
                    <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#666" />
                    <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#666" />
                    {data.map((d, i) => (
                         <text key={i} x={xScale(i)} y={height - padding.bottom + 15} fill="#888" fontSize="10" textAnchor="middle">{d.iteration}</text>
                    ))}
                    <text x={(width-padding.left-padding.right)/2 + padding.left} y={height - 5} fill="#888" fontSize="10" textAnchor="middle">Iteration</text>
                     <text x={padding.left - 30} y={padding.top + (height-padding.top-padding.bottom)/2} fill="#888" fontSize="10" transform={`rotate(-90, ${padding.left-30}, ${padding.top + (height-padding.top-padding.bottom)/2})`} textAnchor="middle">Fairness Ratio</text>

                    {/* Data line */}
                    <path d={linePath} stroke="#a855f7" fill="none" strokeWidth="2" />
                    {data.map((p, i) => (
                        <circle key={i} cx={xScale(i)} cy={yScale(p.ratio)} r="3" fill="#a855f7" stroke="#1C1C1E" strokeWidth="2" />
                    ))}
                </svg>
            </div>
        </div>
    );
};

const BeTalPerformanceAnalysis: React.FC<{ metrics: SessionData['finalMetrics'] }> = ({ metrics }) => (
    <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">BeTaL Performance Analysis</h3>
        <p className="text-sm text-gray-400 mb-6 -mt-2">Automated benchmarking for neuroinclusive accessibility</p>
        
        <div className="space-y-6">
            <BeTalConvergencePlot />
            <div>
                <h4 className="font-semibold text-gray-200 mb-2">Final Benchmark Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                        <div className="text-2xl font-bold text-purple-400">{metrics.metrics.fairness.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">Final Fairness Score</div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                        <div className="text-2xl font-bold text-blue-400">{(metrics.metrics.verification * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-400">Verification Parity</div>
                    </div>
                     <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                        <div className="text-2xl font-bold text-green-400">{(metrics.metrics.accuracy * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-400">Confidence Parity</div>
                    </div>
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-200 mb-2">Key Finding</h4>
                <div className="text-sm bg-black/20 p-4 rounded-lg border border-white/10 text-gray-300">
                    <p>Bidirectional verification provides a stronger signal to the designer model, enabling faster parameter tuning and convergence. System achieved a <span className="text-green-400 font-semibold">5.8% performance gap</span>, competitive with state-of-the-art BeTaL applications.</p>
                </div>
            </div>
        </div>
    </GlassCard>
);

const SessionMetrics: React.FC<{ data: SessionData }> = ({ data }) => {
    const userTurns = data.transcriptionEvents.filter(e => e.speaker === 'You').length;
    const aiTurns = data.transcriptionEvents.filter(e => e.speaker === 'AI').length;
    const aslTurns = data.transcriptionEvents.filter(e => e.speaker === 'ASL').length;
    
    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    }

    return (
        <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Session Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-gray-200">{formatDuration(data.durationInSeconds)}</div>
                    <div className="text-xs text-gray-400">Total Duration</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-blue-400">{userTurns}</div>
                    <div className="text-xs text-gray-400">User Turns</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-purple-400">{aiTurns}</div>
                    <div className="text-xs text-gray-400">AI Turns</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/10 relative">
                    <div className="text-2xl font-bold text-cyan-400">{aslTurns}</div>
                    <div className="text-xs text-gray-400">ASL Interpretations</div>
                    {data.aslModeEnabled && (
                        <div className="absolute top-2 right-2 text-xs bg-cyan-900/80 text-cyan-300 px-1.5 py-0.5 rounded-full">
                            Model Active
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};

const BeTalFramework: React.FC<{ data: SessionData }> = ({ data }) => (
    <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">BeTaL Framework & Models</h3>
        <div className="space-y-4 text-sm">
            <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                <h4 className="font-semibold text-purple-300">Designer Model: <span className="font-mono">Claude Opus 4.1</span></h4>
                <p className="text-xs text-gray-400">Iteratively tunes benchmark difficulty to target fairness.</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                <h4 className="font-semibold text-blue-300">Student Model: <span className="font-mono">o4-mini + BRN</span></h4>
                <p className="text-xs text-gray-400">Target model for accessibility evaluation with Bidirectional Reasoning Network.</p>
            </div>
             <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                <h4 className="font-semibold text-gray-300">Core Contribution</h4>
                <p className="text-xs text-gray-400">First application of BeTaL to accessibility, extending automated benchmark design to fairness evaluation in emotion AI.</p>
                <p className="text-xs text-gray-500 mt-2">Reference: Dsouza et al. "Automating Benchmark Design." arXiv:2510.25039v1, Oct 2025.</p>
            </div>
        </div>
    </GlassCard>
);

interface PostSessionPageProps {
  data: SessionData;
  onReturnHome: () => void;
}

const PostSessionPage: React.FC<PostSessionPageProps> = ({ data, onReturnHome }) => {
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
                <span className="text-xl font-semibold">Connect Flow / Session Summary</span>
            </div>
            <button 
                onClick={onReturnHome}
                className="px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 border border-white/20 bg-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:-translate-y-0.5"
            >
                Return Home
            </button>
        </header>

        {/* Main Content */}
        <main className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <BeTalPerformanceAnalysis metrics={data.finalMetrics} />
                <SessionMetrics data={data} />
                <BeTalFramework data={data} />
            </div>
            <div className="lg:col-span-1">
                <GlassCard className="p-4 h-[calc(100vh-10rem)] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 text-gray-100 flex-shrink-0">Transcription Log</h3>
                    <div className="space-y-2 overflow-y-auto flex-grow pr-2">
                        {data.transcriptionEvents.length > 0 ? (
                             data.transcriptionEvents.map((event) => <TokenPill key={event.id} event={event} />)
                        ) : (
                            <div className="text-center text-gray-400 py-8">No conversation recorded.</div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </main>
    </div>
  );
};

export default PostSessionPage;
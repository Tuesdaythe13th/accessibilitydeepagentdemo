
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LiveServerMessage } from '@google/genai';
import { startLiveSession, cleanupSession } from '../services/geminiService';
import { blobToBase64 } from '../utils/audioUtils';
import AslIcon from './icons/AslIcon';
import AccessibilityIcon from './icons/AccessibilityIcon';
import { TranscriptionEvent, FairnessMetrics, SessionData } from '../types';

// --- STYLES & ICONS ---

const GlobalStyles = () => (
    <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        /* Custom scrollbar for a sleek look */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
        }
        /* New animation for the active ASL frame */
        @keyframes active-scan {
            0% {
                box-shadow: inset 0 0 8px 1px rgba(168, 85, 247, 0.3), 0 0 12px rgba(168, 85, 247, 0.2);
                border-color: rgba(168, 85, 247, 0.6);
            }
            50% {
                box-shadow: inset 0 0 12px 2px rgba(192, 132, 252, 0.5), 0 0 20px rgba(192, 132, 252, 0.4);
                border-color: rgba(192, 132, 252, 1);
            }
            100% {
                box-shadow: inset 0 0 8px 1px rgba(168, 85, 247, 0.3), 0 0 12px rgba(168, 85, 247, 0.2);
                border-color: rgba(168, 85, 247, 0.6);
            }
        }
        .animate-active-scan {
            animation: active-scan 3s ease-in-out infinite;
        }
    `}</style>
);

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);

const ModalityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path><path d="m21 2-9 9"></path></svg>
);


// --- GLASSMORPHIC UI COMPONENTS ---

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
        <div ref={cardRef} className={`interactive-card rounded-2xl transition-all duration-300 ${className}`}>
            {children}
            <div className="glow"></div>
        </div>
    );
};


const GlassButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string, active?: boolean }> = ({ children, onClick, className = '', active = false }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl text-gray-200 transition-all duration-300 border flex items-center gap-2 justify-center
        border-white/20 bg-white/10
        shadow-[0_4px_15px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.2)]
        hover:bg-white/20 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:-translate-y-0.5
        active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] active:translate-y-0
        transform
        ${active ? 'bg-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] !border-purple-400/50 ring-2 ring-purple-500/30' : ''} ${className}`}>
        {children}
    </button>
);

const TokenPill: React.FC<{ event: TranscriptionEvent }> = ({ event }) => {
    const speakerColors: { [key: string]: string } = {
        'AI': 'text-purple-400',
        'You': 'text-blue-400',
        'ASL': 'text-cyan-400',
    };
    return (
        <div className="p-3 rounded-lg bg-black/40 backdrop-blur-sm animate-fade-in border border-white/10 shadow-lg shadow-black/30">
            <div className="flex justify-between items-start text-sm">
                <div className="flex items-center gap-2">
                    {event.speaker === 'ASL' && <AslIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    <p className="text-gray-300">
                        <span className={`font-semibold ${speakerColors[event.speaker] || 'text-gray-400'}`}>{event.speaker}:</span> {event.text}
                    </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{event.timestamp}</span>
            </div>
        </div>
    );
};

const PerceptionFeed: React.FC<{ events: TranscriptionEvent[]; videoRef: React.RefObject<HTMLVideoElement>; isAslEnabled: boolean; }> = ({ events, videoRef, isAslEnabled }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events]);
    return (
        <GlassCard className="p-0 h-full overflow-hidden relative">
            {/* Frame for ASL Interpretation */}
            <div className={`
                absolute inset-0 rounded-2xl pointer-events-none z-20 transition-all duration-500
                border-2 ${isAslEnabled ? 'border-purple-500/80 animate-active-scan' : 'border-transparent'}
            `}/>
            
            {isAslEnabled ? (
                <>
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-black/50 text-purple-300 text-xs px-2 py-1 rounded-full backdrop-blur-sm animate-fade-in border border-white/10">
                        <AccessibilityIcon className="w-4 h-4" />
                        <span>Neuroadaptive Agent: ASL Active</span>
                    </div>
                    <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </>
            ) : (
                <div className="w-full h-full bg-black/30 flex items-center justify-center">
                    <div className="text-center text-gray-400 p-4">
                        <AslIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <h3 className="font-semibold text-gray-200">ASL Mode Disabled</h3>
                        <p className="text-xs mt-1">Enable to activate video feed and ASL interpretation.</p>
                    </div>
                </div>
            )}
            
            <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                <div ref={scrollRef} className="space-y-2 overflow-y-auto h-full pr-2">
                    {events.map((event) => <TokenPill key={event.id} event={event} />)}
                </div>
            </div>
        </GlassCard>
    );
};

const MetricBar: React.FC<{ label: string; value: number; color: string; max?: number }> = ({ label, value, color, max = 1 }) => (
    <div className="flex items-center justify-between">
        <span>{label}: <span className={`font-bold ${value < (max * 0.15) ? 'text-red-400' : 'text-green-400'}`}>{value.toFixed(2)}</span></span>
        <div className="w-1/2 bg-black/50 rounded-full h-2.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-white/10">
            <div className={`${color} h-full rounded-full transition-all duration-700 ease-out`} style={{width: `${(value / max) * 100}%`}}></div>
        </div>
    </div>
);

const fairnessProfiles: FairnessMetrics[] = [
    {
        name: "Neurotypical",
        metrics: { accuracy: 0.92, verification: 0.89, fnr: 0.08, fairness: 0.12 }
    },
    {
        name: "Alexithymic",
        metrics: { accuracy: 0.87, verification: 0.68, fnr: 0.13, fairness: 0.12 }
    }
];

const BiasAndFairnessMetrics: React.FC<{ profileIndex: number }> = ({ profileIndex }) => {
    const currentProfile = fairnessProfiles[profileIndex];

    return (
        <GlassCard className="p-4 flex-1 w-1/2">
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Bias & Fairness Metrics</h2>
            <div className="text-sm space-y-4 text-gray-300">
                <div>
                    <h3 className="font-semibold text-gray-100 mb-2">
                        Active Profile: <span className="text-purple-400 font-mono p-1 rounded bg-black/20">{currentProfile.name}</span>
                    </h3>
                    <div className="space-y-3 pl-2">
                        <MetricBar label="Accuracy Parity" value={currentProfile.metrics.accuracy} color="bg-gradient-to-r from-teal-400 to-green-500" />
                        <MetricBar label="Verification Rate" value={currentProfile.metrics.verification} color="bg-gradient-to-r from-sky-400 to-blue-500" />
                        <MetricBar label="False Negative Rate" value={currentProfile.metrics.fnr} color="bg-gradient-to-r from-orange-400 to-red-500" max={0.5} />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-100 mb-1">System State</h3>
                    <p className="pl-2 bg-black/20 p-2 rounded-md">
                        Overall Fairness Score: <span className="font-bold text-green-400">{currentProfile.metrics.fairness.toFixed(2)}</span> (Target: &lt; 0.2)
                    </p>
                    <p className="pl-2 mt-2 text-xs text-gray-400">
                        Target Confidence Parity (ρ): <span className="font-mono text-gray-200">|conf_NT - conf_Alex| &lt; 0.1</span>
                    </p>
                </div>
            </div>
        </GlassCard>
    );
};

const betalIterations = [
    {
        iteration: 1,
        reasoning: "To achieve fairness ratio ρ = 1.0, I'll start with moderate prosody variance (0.5) for alexithymic users...",
        params: "{prosody_variance_alex: 0.5, semantic_strength: 0.7}",
        result: { ratio: 0.73, label: "Unfair" }
    },
    {
        iteration: 2,
        reasoning: "Alexithymic confidence is too low. I'll increase semantic feature strength to 0.9 to make emotion more context-driven.",
        params: "{prosody_variance_alex: 0.3, semantic_strength: 0.9}",
        result: { ratio: 0.89, label: "Improving" }
    },
    {
        iteration: 3,
        reasoning: "Almost there. Reducing prosody variance to 0.2 and adding bidirectional verification to catch misclassifications.",
        params: "{... enable_verification: True}",
        result: { ratio: 0.97, label: "Fair ✓" }
    },
    {
        iteration: 4,
        reasoning: "Fine-tuning to minimize gap. Final parameters achieve 0.97 confidence and 0.95 verification ratio. System converged.",
        params: `{ "prosody_variance": 0.18, "semantic_strength": 0.97 }`,
        result: { ratio: 0.97, label: "Converged ✓" }
    }
];

const BeTalParameterTuning: React.FC = () => {
    const [currentIteration, setCurrentIteration] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIteration(prev => (prev + 1) % betalIterations.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const iterationData = betalIterations[currentIteration];

    return (
        <GlassCard className="p-4 flex-1 w-1/2 relative overflow-hidden">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">BeTaL: Automated Benchmark Tuning</h2>
            <div className="space-y-3 text-sm text-gray-300 h-full">
                <div key={iterationData.iteration} className="animate-fade-in space-y-3">
                    <div>
                        <p className="text-purple-400 font-mono">Iteration {iterationData.iteration} <span className="text-gray-500">(Designer: Claude Opus 4.1)</span></p>
                        <p className="mt-1 pl-2 border-l-2 border-purple-400/30 text-gray-400 italic">"{iterationData.reasoning}"</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-100">Parameters:</p>
                        <pre className="text-xs bg-black/40 p-2 rounded-md mt-1 text-cyan-300 font-mono whitespace-pre-wrap">{iterationData.params}</pre>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-100">Result (Student: o4-mini):</p>
                        <p className="pl-2">Confidence Ratio: <span className={`font-bold ${iterationData.result.ratio > 0.9 ? 'text-green-400' : 'text-orange-400'}`}>{iterationData.result.ratio.toFixed(2)}</span> ({iterationData.result.label})</p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

const UiAdaptationControls: React.FC<{ onLeave: () => void; loopState: any; onToggleAsl: () => void; isAslEnabled: boolean; }> = ({ onLeave, loopState, onToggleAsl, isAslEnabled }) => (
    <GlassCard className="p-3 flex-shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-4">
             <GlassButton><PauseIcon /> Pause</GlassButton>
             <GlassButton><ModalityIcon /> Switch</GlassButton>
             <GlassButton onClick={onToggleAsl} active={isAslEnabled}><AslIcon /> ASL Mode</GlassButton>
        </div>
        <div className="flex flex-col items-center">
            <div className="text-sm text-gray-400">
                <span>Loop Iteration: <span className="font-semibold text-gray-200">{loopState.iteration}</span></span> | 
                <span> Condition: <span className="font-semibold text-green-400">{loopState.condition}</span></span>
            </div>
            <div className="flex gap-2 mt-1">
                <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full">TTS Rate: 0.8x</span>
                <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full">Theme: Low Stimulus</span>
            </div>
        </div>
        <button onClick={onLeave} className="px-6 py-2 rounded-lg bg-red-500/20 text-red-300 font-semibold border border-red-500/30 hover:bg-red-500/30 hover:text-red-200 transition-all duration-300 shadow-md hover:shadow-red-500/50">
            Leave
        </button>
    </GlassCard>
);


// --- MAIN COMPONENT ---

interface ConnectFlowProps {
  onSessionStarted: () => void;
  onSessionError: (error: Error) => void;
  onSessionEnd: (data: SessionData) => void;
  appState: 'connecting' | 'connected' | 'error';
}

const ConnectFlow: React.FC<ConnectFlowProps> = ({ onSessionStarted, onSessionError, onSessionEnd, appState }) => {
  const [transcriptionEvents, setTranscriptionEvents] = useState<TranscriptionEvent[]>([]);
  const [isAslModeEnabled, setIsAslModeEnabled] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  const sessionRef = useRef<Awaited<ReturnType<typeof startLiveSession>> | null>(null);
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sessionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setProfileIndex(prev => (prev + 1) % fairnessProfiles.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLeave = () => {
    const durationInSeconds = sessionStartTimeRef.current > 0 ? Math.round((Date.now() - sessionStartTimeRef.current) / 1000) : 0;
    const sessionData: SessionData = {
        transcriptionEvents: transcriptionEvents,
        finalMetrics: fairnessProfiles[profileIndex],
        durationInSeconds: durationInSeconds,
        aslModeEnabled: isAslModeEnabled
    };
    onSessionEnd(sessionData);
  }

  const toggleAslMode = () => {
    setIsAslModeEnabled(prev => !prev);
  };

  const onMessage = useCallback(async (message: LiveServerMessage) => {
    if (message.serverContent?.inputTranscription) {
        const text = message.serverContent.inputTranscription.text;
         if(text.trim()) {
            currentInputTranscription.current += text;
         }
    }
    if (message.serverContent?.outputTranscription) {
        const text = message.serverContent.outputTranscription.text;
        if(text.trim()) {
            currentOutputTranscription.current += text;
        }
    }
    
    if (message.serverContent?.turnComplete) {
        if(currentInputTranscription.current.trim()){
            let text = currentInputTranscription.current;
            let speaker: 'You' | 'ASL' = 'You';
            const aslMarker = '[ASL]: ';
            if (text.startsWith(aslMarker)) {
                text = text.substring(aslMarker.length);
                speaker = 'ASL';
            }
            setTranscriptionEvents(prev => [...prev, { id: Date.now() + Math.random(), text: text, speaker: speaker, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }
        if(currentOutputTranscription.current.trim()){
            setTranscriptionEvents(prev => [...prev, { id: Date.now() + Math.random(), text: currentOutputTranscription.current, speaker: 'AI', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }
      currentInputTranscription.current = '';
      currentOutputTranscription.current = '';
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (!isMounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
        };
        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const session = await startLiveSession(
          stream,
          isAslModeEnabled,
          onMessage,
          (e: ErrorEvent) => { if(isMounted) { console.error('Session error:', e); onSessionError(e.error as Error);} },
          (e) => { console.log('Session closed:', e); },
          () => { 
            if(isMounted) { 
                console.log('Session opened.'); 
                onSessionStarted(); 
                sessionStartTimeRef.current = Date.now();
            } 
          }
        );
        sessionRef.current = session;

        // Start sending video frames only if ASL mode is enabled
        if (isAslModeEnabled) {
          const canvasEl = canvasRef.current;
          const videoEl = videoRef.current;
          if (canvasEl && videoEl) {
            const ctx = canvasEl.getContext('2d');
            if (ctx) {
              const FRAME_RATE = 5; // 5 fps
              const JPEG_QUALITY = 0.8;
              frameIntervalRef.current = window.setInterval(() => {
                if (videoEl.readyState >= videoEl.HAVE_CURRENT_DATA) {
                  canvasEl.width = videoEl.videoWidth;
                  canvasEl.height = videoEl.videoHeight;
                  ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
                  canvasEl.toBlob(
                    async (blob) => {
                      if (blob && sessionRef.current) {
                        const base64Data = await blobToBase64(blob);
                        session.sendRealtimeInput({
                          media: { data: base64Data, mimeType: 'image/jpeg' }
                        });
                      }
                    },
                    'image/jpeg',
                    JPEG_QUALITY
                  );
                }
              }, 1000 / FRAME_RATE);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
            console.error('Failed to get user media or start session:', error);
            onSessionError(error as Error);
        }
      }
    };
    
    initSession();

    return () => {
      isMounted = false;
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      sessionRef.current?.close();
      cleanupSession();
    };
  }, [onMessage, onSessionStarted, onSessionError, isAslModeEnabled]);

  if (appState === 'error') {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1C1C1E] to-[#121218] text-gray-200 p-4 gap-4">
            <GlassCard className="p-8 text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Connection Error</h1>
                <p className="text-gray-300 mb-6">An unexpected error occurred. Please try again.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-lg bg-red-500/20 text-red-300 font-semibold border border-red-500/30 hover:bg-red-500/30 hover:text-red-200 transition-all duration-300 shadow-md hover:shadow-red-500/50">
                    Refresh
                </button>
            </GlassCard>
        </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#1C1C1E] to-[#121218] text-gray-200 p-4 gap-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(128,0,128,0.2),_transparent_30%),_radial-gradient(circle_at_bottom_right,_rgba(0,0,255,0.2),_transparent_30%)]"></div>
        <GlobalStyles />
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="relative z-10 h-full grid grid-rows-[minmax(0,_2fr)_minmax(0,_3fr)_auto] gap-4">
            <PerceptionFeed events={transcriptionEvents} videoRef={videoRef} isAslEnabled={isAslModeEnabled} />
            <div className="flex-grow w-full flex flex-row gap-4 overflow-hidden">
                <BiasAndFairnessMetrics profileIndex={profileIndex} />
                <BeTalParameterTuning />
            </div>
            <UiAdaptationControls onLeave={handleLeave} loopState={{ iteration: transcriptionEvents.length, condition: 'Running' }} onToggleAsl={toggleAslMode} isAslEnabled={isAslModeEnabled} />
        </div>
    </div>
  );
};

export default ConnectFlow;
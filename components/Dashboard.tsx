import React, { useState } from 'react';

import DyslexiaIcon from './icons/DyslexiaIcon';
import ColorblindIcon from './icons/ColorblindIcon';
import AutismSpectrumIcon from './icons/AutismSpectrumIcon';
import DyscalculiaIcon from './icons/DyscalculiaIcon';
import AlexithymiaIcon from './icons/AlexithymiaIcon';
import ContrastIcon from './icons/ContrastIcon';
import TextSizeIcon from './icons/TextSizeIcon';
import UnderlineIcon from './icons/UnderlineIcon';

const ToggleSwitch: React.FC<{isOn: boolean; onToggle: () => void}> = ({ isOn, onToggle }) => (
    <button onClick={onToggle} className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isOn ? 'bg-purple-600' : 'bg-gray-700'}`}>
        <span className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

const SettingRow: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode;}> = ({ icon, label, children }) => (
    <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
            <div className="text-gray-400">{icon}</div>
            <span className="text-sm text-gray-300">{label}</span>
        </div>
        {children}
    </div>
);

const ColorblindPresetDropdown: React.FC = () => {
    return (
        <div className="relative">
            <select className="w-full appearance-none bg-gray-700/50 border border-white/10 rounded-md py-1.5 pl-3 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Deuteranopia</option>
                <option>Protanopia</option>
                <option>Tritanopia</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
}

const SettingCard: React.FC<{ title: string; children: React.ReactNode;}> = ({ title, children }) => {
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
        <div ref={cardRef} className="interactive-card rounded-2xl p-4 flex flex-col gap-4 h-full">
            <h3 className="font-semibold text-lg text-gray-200 text-center">{title}</h3>
            <div className="flex flex-col gap-5 flex-grow justify-around">{children}</div>
            <div className="glow"></div>
        </div>
    );
};


interface DashboardProps {
  onStartSession: () => void;
  onPreviewAbTest: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  underlineLinks: boolean;
  onToggleUnderlineLinks: () => void;
  fontSize: number;
  onSetFontSize: (size: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    onStartSession, 
    onPreviewAbTest,
    isHighContrast, 
    onToggleHighContrast,
    underlineLinks,
    onToggleUnderlineLinks,
    fontSize,
    onSetFontSize
}) => {
    const [toggles, setToggles] = useState({
        dyslexiaFont: false,
        dyslexiaFilter: true,
        reducedMotion: true,
        focusCues: false,
        numericVisualizer: false,
        alexithymiaEmotionalFilter: false,
    });

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-black relative overflow-hidden font-['Poppins',_sans-serif]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1E] to-[#121218]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(128,0,128,0.15),_transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(0,0,255,0.15),_transparent_40%)]"></div>
            
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide text-center mb-4" style={{fontSize: '2.25rem'}}>Personalized Accessibility Suite</h1>

                <div className="relative w-full p-6 md:p-8 bg-black/30 border border-cyan-300/20 rounded-3xl shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl">
                    <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-600 opacity-20 blur-2xl animate-pulse-glow pointer-events-none"></div>
                    <div className="absolute inset-0 rounded-3xl border-2 border-cyan-300/40 pointer-events-none animate-pulse-glow" style={{animationDuration: '6s'}}></div>

                    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <SettingCard title="Visual & Reading Aids">
                            <SettingRow icon={<DyslexiaIcon />} label="Dyslexia-Optimized Font">
                                <ToggleSwitch isOn={toggles.dyslexiaFont} onToggle={() => handleToggle('dyslexiaFont')} />
                            </SettingRow>
                            <SettingRow icon={<DyslexiaIcon />} label="Dyslexia-Optimized Filter">
                                <ToggleSwitch isOn={toggles.dyslexiaFilter} onToggle={() => handleToggle('dyslexiaFilter')} />
                            </SettingRow>
                            <SettingRow icon={<ColorblindIcon />} label="Colorblind Mode Presets">
                                <div className="w-2/3"><ColorblindPresetDropdown /></div>
                            </SettingRow>
                        </SettingCard>

                        <SettingCard title="Autism Spectrum Focus">
                           <SettingRow icon={<AutismSpectrumIcon />} label="Reduced Motion Mode">
                                <ToggleSwitch isOn={toggles.reducedMotion} onToggle={() => handleToggle('reducedMotion')} />
                            </SettingRow>
                            <p className="text-xs text-gray-400 px-2 py-3 bg-black/20 rounded-lg">Reduces animations and background motion to lessen sensory overload and improve focus.</p>
                             <SettingRow icon={<AutismSpectrumIcon />} label="Focus & Attention Cues">
                                <ToggleSwitch isOn={toggles.focusCues} onToggle={() => handleToggle('focusCues')} />
                            </SettingRow>
                        </SettingCard>

                        <SettingCard title="Cognitive & Emotional Aids">
                            <SettingRow icon={<DyscalculiaIcon />} label="Numeric Visualizer">
                                <ToggleSwitch isOn={toggles.numericVisualizer} onToggle={() => handleToggle('numericVisualizer')} />
                            </SettingRow>
                            <div className="w-full px-2">
                                <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-purple-500" />
                            </div>
                            <SettingRow icon={<AlexithymiaIcon />} label="Alexithymia Cue Filter">
                                <ToggleSwitch isOn={toggles.alexithymiaEmotionalFilter} onToggle={() => handleToggle('alexithymiaEmotionalFilter')} />
                            </SettingRow>
                        </SettingCard>
                        
                        <SettingCard title="General UI Adjustments">
                             <SettingRow icon={<ContrastIcon />} label="High Contrast Mode">
                                <ToggleSwitch isOn={isHighContrast} onToggle={onToggleHighContrast} />
                            </SettingRow>
                             <SettingRow icon={<UnderlineIcon />} label="Underline All Links">
                                <ToggleSwitch isOn={underlineLinks} onToggle={onToggleUnderlineLinks} />
                            </SettingRow>
                            <SettingRow icon={<TextSizeIcon />} label="Adjust Font Size">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onSetFontSize(Math.max(12, fontSize - 2))} aria-label="Decrease font size" className="w-8 h-8 rounded-md bg-gray-700/50 border border-white/10 flex items-center justify-center text-lg font-bold hover:bg-gray-600/50">-</button>
                                    <span className="w-12 text-center font-mono text-sm">{fontSize}px</span>
                                    <button onClick={() => onSetFontSize(Math.min(24, fontSize + 2))} aria-label="Increase font size" className="w-8 h-8 rounded-md bg-gray-700/50 border border-white/10 flex items-center justify-center text-lg font-bold hover:bg-gray-600/50">+</button>
                                </div>
                            </SettingRow>
                        </SettingCard>
                    </div>
                </div>

                <div className="flex items-center justify-center flex-wrap gap-4 mt-8">
                    <button 
                        onClick={onPreviewAbTest}
                        className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 border-2 border-cyan-500/50 bg-cyan-500/20 shadow-[0_4px_15px_rgba(71,170,189,0.2),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-cyan-500/30 hover:shadow-[0_6px_20px_rgba(71,170,189,0.4),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transform"
                    >
                        Preview A/B Test
                    </button>
                    <button 
                        onClick={onStartSession}
                        className="px-10 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 border-2 border-purple-500/50 bg-purple-500/20 shadow-[0_4px_15px_rgba(168,85,247,0.2),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-purple-500/30 hover:shadow-[0_6px_20px_rgba(168,85,247,0.4),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transform"
                    >
                        Launch Connect Flow
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
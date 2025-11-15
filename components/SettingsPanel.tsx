
import React, { useState } from 'react';
import { MicIcon as SettingsMicIcon, ShareScreenIcon, LayoutIcon } from './icons/LayoutIcon';

interface ToggleProps {
  label: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, description }) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <div className="flex justify-between items-center">
            <div>
                <div className="text-white">{label}</div>
                {description && <div className="text-xs text-gray-400">{description}</div>}
            </div>
            <button onClick={() => setIsOn(!isOn)} className={`w-12 h-6 rounded-full p-1 transition-colors ${isOn ? 'bg-purple-600' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-[#252525] p-4 rounded-xl border border-white/10">
        <h3 className="font-semibold mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);


const SettingsPanel: React.FC = () => {
  return (
    <div className="h-full bg-[#1A1A1A] text-white p-2 space-y-4 overflow-y-auto">
      <SettingsSection title="Sensory Adjustments">
        <Toggle label="Screen Brightness" description="Visual Overload Filter" />
      </SettingsSection>
      <SettingsSection title="Communication Aids">
        <Toggle label="Visual Turn-Taking Cues" />
        <Toggle label="Highlight Active Signer" />
        <div className="flex justify-around items-center pt-2">
            <button className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50"><SettingsMicIcon /></button>
            <button className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50"><ShareScreenIcon /></button>
            <button className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50"><LayoutIcon /></button>
        </div>
      </SettingsSection>
      <SettingsSection title="Text Size Presets">
        <div className="grid grid-cols-2 gap-2 text-sm">
            <button className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-600/50">Acigranese</button>
            <button className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-600/50">Mute Background Noise</button>
            <button className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-600/50">Text Size Vtilde</button>
            <button className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-600/50">Oterble</button>
        </div>
      </SettingsSection>
      <SettingsSection title="Quiet Mode">
        <div className="text-sm text-gray-400">
          Eleoal View, hide Conina pgacts
        </div>
      </SettingsSection>
    </div>
  );
};

export default SettingsPanel;

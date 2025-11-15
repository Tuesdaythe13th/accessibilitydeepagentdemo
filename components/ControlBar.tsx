
import React from 'react';
import { ShareScreenIcon, LayoutIcon } from './icons/LayoutIcon';
import MicIcon from './icons/MicIcon';

interface ControlBarProps {
  latestTranscription: string;
  onLeave: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({ latestTranscription, onLeave }) => {
  return (
    <div className="bg-[#252525] p-3 flex items-center justify-between border-t border-white/10">
      <div className="flex items-center gap-2 w-1/3">
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-300 truncate">
          {latestTranscription || 'I agree, we need to focus on inclusive design from the start.'}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 text-sm">
            <ShareScreenIcon className="w-4 h-4"/>
            Screen
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 text-sm">
            <MicIcon className="w-4 h-4"/>
            Mode
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 text-sm">
            <LayoutIcon className="w-4 h-4"/>
            Layout
        </button>
      </div>

      <div className="w-1/3 flex justify-end">
        <button 
          onClick={onLeave}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
        >
          Leave
        </button>
      </div>
    </div>
  );
};

export default ControlBar;

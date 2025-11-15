
import React from 'react';

interface VideoPlaceholderProps {
  name: string;
  isMain: boolean;
  state: 'connecting' | 'connected' | 'error';
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({ name, isMain, state }) => {
  const imageUrl = isMain ? "https://i.imgur.com/3tk3b8P.jpeg" : "https://i.imgur.com/4Yj7z3D.jpeg";

  const getStateContent = () => {
    switch (state) {
      case 'connecting':
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-white/50 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-lg">Connecting...</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <p className="text-lg text-red-400">Connection Error</p>
            <p className="text-sm text-gray-400">Please check permissions and refresh.</p>
          </div>
        );
      case 'connected':
        return (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-xl" />
        );
    }
  };

  return (
    <div className="relative w-full h-full bg-black/50 rounded-xl overflow-hidden flex items-center justify-center text-white">
      {state !== 'connected' && <div className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center">{getStateContent()}</div>}
      {state === 'connected' && (
        <>
            <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-xl" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-lg text-sm backdrop-blur-sm">{name}</div>
        </>
      )}

      {/* Background decoration for non-connected states */}
       {state !== 'connected' && <div className="absolute w-full h-full bg-gradient-to-tr from-purple-900/30 via-transparent to-blue-900/30 animate-pulse"></div>}
    </div>
  );
};

export default VideoPlaceholder;

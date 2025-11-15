import React from 'react';
import LogoIcon from './icons/LogoIcon';
import MicOffIcon from './icons/MicOffIcon';

const PermissionDeniedScreen: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background from landing page */}
            <div className="absolute top-0 left-0 w-full h-full bg-black">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/50 rounded-full blur-[200px]"></div>
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-900/50 rounded-full blur-[150px]"></div>
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <LogoIcon className="w-6 h-6" />
                    <span className="text-xl font-semibold">Connect Flow</span>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-10 bg-red-900/10 backdrop-blur-xl border border-red-400/20 rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl shadow-red-500/40 ring-1 ring-inset ring-red-400/20">
                <div className="flex justify-center mb-6">
                    <MicOffIcon className="text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Permissions Required</h1>
                <p className="text-gray-300 mb-8">
                    Connect Flow requires camera and microphone access to function. Please grant permission in your browser's settings or address bar, then refresh the page.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 border border-white/20 bg-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transform hover:-translate-y-1 active:translate-y-0"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
};

export default PermissionDeniedScreen;
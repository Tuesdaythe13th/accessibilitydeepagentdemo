import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ConnectFlow from './components/ConnectFlow';
import PermissionDeniedScreen from './components/PermissionDeniedScreen';
import PostSessionPage from './components/PostSessionPage';
import { SessionData } from './types';
import Dashboard from './components/Dashboard';

type AppState = 'landing' | 'dashboard' | 'connecting' | 'connected' | 'error' | 'permissionDenied' | 'sessionEnded';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Accessibility State
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Base font size in pixels

  const handleStartDemo = () => {
    setAppState('dashboard');
  };

  const handleStartSession = () => {
    setAppState('connecting');
  };

  const handleSessionStarted = () => {
    setAppState('connected');
  };
  
  const handleSessionError = (error: Error) => {
    if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
        setAppState('permissionDenied');
    } else {
        setAppState('error');
    }
  };

  const handleSessionEnd = (data: SessionData) => {
    setSessionData(data);
    setAppState('sessionEnded');
  };

  const handleReturnHome = () => {
    setSessionData(null);
    setAppState('landing');
  }

  const renderContent = () => {
    switch (appState) {
        case 'landing':
            return <LandingPage onGetStarted={handleStartDemo} />;
        case 'dashboard':
            return <Dashboard 
                        onStartSession={handleStartSession} 
                        isHighContrast={isHighContrast}
                        onToggleHighContrast={() => setIsHighContrast(p => !p)}
                        underlineLinks={underlineLinks}
                        onToggleUnderlineLinks={() => setUnderlineLinks(p => !p)}
                        fontSize={fontSize}
                        onSetFontSize={setFontSize}
                    />;
        case 'permissionDenied':
            return <PermissionDeniedScreen />;
        case 'sessionEnded':
            return sessionData ? <PostSessionPage data={sessionData} onReturnHome={handleReturnHome} /> : <LandingPage onGetStarted={handleStartDemo} />;
        case 'connecting':
        case 'connected':
        case 'error':
            return <ConnectFlow onSessionStarted={handleSessionStarted} onSessionError={handleSessionError} onSessionEnd={handleSessionEnd} appState={appState} />;
        default:
            return <LandingPage onGetStarted={handleStartDemo} />;
    }
  }

  const accessibilityClasses = [
    isHighContrast ? 'high-contrast' : '',
    underlineLinks ? 'underline-links' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`min-h-screen bg-[#1C1C1E] text-gray-200 font-['Poppins',_sans-serif] ${accessibilityClasses}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {renderContent()}
    </div>
  );
};

export default App;
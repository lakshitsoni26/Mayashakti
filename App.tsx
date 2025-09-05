import React, { useState, useEffect, useCallback } from 'react';
import { Pillar, KarmaRecord } from './types';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { MayaBhedan } from './components/MayaBhedan';
import { ShaktiUpchar } from './components/ShaktiUpchar';
import { DivyaChakshu } from './components/DivyaChakshu';
import { DharmaNetwork } from './components/DharmaNetwork';
import { KarmaYudhBhumi } from './components/KarmaYudhBhumi';
import { GyanKosh } from './components/GyanKosh';
import { verifyToken } from './services/authService';

type AppState = 'initializing' | 'landing' | 'auth' | 'app';
type AuthView = 'login' | 'signup';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initializing');
  const [initialAuthView, setInitialAuthView] = useState<AuthView>('login');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [activePillar, setActivePillar] = useState<Pillar>(Pillar.MayaBhedan);
  
  const [karmaScore, setKarmaScore] = useState(50);
  const [karmaHistory, setKarmaHistory] = useState<KarmaRecord[]>([{ score: 50, timestamp: Date.now() }]);
  const [globalDharmaIndex, setGlobalDharmaIndex] = useState(75);

  useEffect(() => {
    // Show loader, then check for a valid token in localStorage
    const timer = setTimeout(async () => {
        const token = localStorage.getItem('mayashakti_token');
        if (token && await verifyToken(token)) {
            setAuthToken(token);
            setAppState('app');
        } else {
            localStorage.removeItem('mayashakti_token');
            setAppState('landing');
        }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  const updateKarma = useCallback((updater: (prevScore: number) => number) => {
    setKarmaScore(prevScore => {
        const newScore = Math.max(0, Math.min(100, updater(prevScore)));
        setKarmaHistory(prevHistory => [...prevHistory, { score: newScore, timestamp: Date.now() }]);
        return newScore;
    });
  }, []);

  const handleEnterSanctum = useCallback((view: AuthView) => {
    setInitialAuthView(view);
    setAppState('auth');
  }, []);

  const handleAuthSuccess = useCallback((token: string) => {
    localStorage.setItem('mayashakti_token', token);
    setAuthToken(token);
    setAppState('app');
    // Reset user state on new login
    setKarmaScore(50);
    setKarmaHistory([{ score: 50, timestamp: Date.now() }]);
    setActivePillar(Pillar.MayaBhedan);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('mayashakti_token');
    setAuthToken(null);
    setAppState('landing');
  }, []);
  
  const handleBackToLanding = useCallback(() => {
      setAppState('landing');
  }, []);

  const renderActivePillar = () => {
    // Pass the authToken to the active pillar component
    const props = { updateKarma, authToken };
    switch (activePillar) {
      case Pillar.MayaBhedan:
        return <MayaBhedan key={Pillar.MayaBhedan} {...props} />;
      case Pillar.ShaktiUpchar:
        return <ShaktiUpchar key={Pillar.ShaktiUpchar} {...props} />;
      case Pillar.DivyaChakshu:
        return <DivyaChakshu key={Pillar.DivyaChakshu} {...props} />;
      case Pillar.DharmaNetwork:
        return <DharmaNetwork key={Pillar.DharmaNetwork} karmaScore={karmaScore} updateKarma={updateKarma} globalDharmaIndex={globalDharmaIndex} setGlobalDharmaIndex={setGlobalDharmaIndex} />;
      case Pillar.KarmaYudhBhumi:
        return <KarmaYudhBhumi key={Pillar.KarmaYudhBhumi} karmaHistory={karmaHistory} />;
      case Pillar.GyanKosh:
        return <GyanKosh key={Pillar.GyanKosh} karmaScore={karmaScore} updateKarma={updateKarma} />;
      default:
        return <MayaBhedan key={Pillar.MayaBhedan} {...props} />;
    }
  };

  if (appState === 'initializing') {
    return <Loader />;
  }
  
  if (appState === 'landing') {
      return <LandingPage onEnterSanctum={handleEnterSanctum} />;
  }
  
  if (appState === 'auth') {
      return <Auth onAuthSuccess={handleAuthSuccess} onBackToLanding={handleBackToLanding} initialView={initialAuthView} />;
  }

  if (appState === 'app') {
    return (
      <div className="min-h-screen">
        <Header activePillar={activePillar} setPillar={setActivePillar} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          {renderActivePillar()}
        </main>
        <footer className="text-center py-6 text-slate-500 text-sm border-t border-amber-400/10">
          <p>🕉️ MayaShakti - The Digital Guardian</p>
          <p>Harnessing cosmic wisdom to illuminate the digital realm.</p>
        </footer>
      </div>
    );
  }

  return null; // Should not be reached
};

export default App;
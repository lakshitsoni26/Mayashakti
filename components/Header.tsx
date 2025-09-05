import React from 'react';
import { Pillar } from '../types';
import { OmIcon, EyeIcon, BoltIcon, CameraIcon, LogoutIcon, DharmaChakraIcon, GlobeIcon, ScrollIcon } from './icons';

interface HeaderProps {
  activePillar: Pillar;
  setPillar: (pillar: Pillar) => void;
  onLogout: () => void;
}

const NavButton: React.FC<{
  label: string;
  pillar: Pillar;
  activePillar: Pillar;
  setPillar: (pillar: Pillar) => void;
  children: React.ReactNode;
}> = ({ label, pillar, activePillar, setPillar, children }) => {
  const isActive = activePillar === pillar;
  return (
    <button
      onClick={() => setPillar(pillar)}
      className={`flex flex-col items-center justify-center p-2 text-center w-full transition-all duration-300 ease-in-out border-b-4 
      ${isActive 
        ? 'border-amber-400 text-amber-300' 
        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
      }`}
      aria-current={isActive}
    >
      {children}
      <span className="mt-1 text-[10px] md:text-xs font-semibold tracking-wider uppercase">{label}</span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ activePillar, setPillar, onLogout }) => {
  return (
    <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-40 border-b border-amber-400/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 text-left"
            aria-label="Scroll to top"
          >
            <OmIcon className="h-10 w-10 golden-gradient-text" />
            <h1 className="text-xl md:text-2xl font-bold font-cinzel tracking-tighter">
              <span className="golden-gradient-text">MayaShakti</span>
            </h1>
          </button>
           <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-amber-300 hover:bg-white/10 rounded-md transition-colors"
              aria-label="Logout"
            >
              <LogoutIcon className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-semibold">Logout</span>
            </button>
        </div>
      </div>
      <nav className="grid grid-cols-3 md:grid-cols-6 bg-black/30">
        <NavButton label="Maya Bhedan" pillar={Pillar.MayaBhedan} activePillar={activePillar} setPillar={setPillar}>
          <EyeIcon className="h-5 w-5 md:h-6 md:w-6" />
        </NavButton>
        <NavButton label="Shakti Upchar" pillar={Pillar.ShaktiUpchar} activePillar={activePillar} setPillar={setPillar}>
          <BoltIcon className="h-5 w-5 md:h-6 md:w-6" />
        </NavButton>
        <NavButton label="Divya Chakshu" pillar={Pillar.DivyaChakshu} activePillar={activePillar} setPillar={setPillar}>
          <CameraIcon className="h-5 w-5 md:h-6 md:w-6" />
        </NavButton>
        <NavButton label="Dharma Network" pillar={Pillar.DharmaNetwork} activePillar={activePillar} setPillar={setPillar}>
            <GlobeIcon className="h-5 w-5 md:h-6 md:w-6" />
        </NavButton>
        <NavButton label="YudhBhumi" pillar={Pillar.KarmaYudhBhumi} activePillar={activePillar} setPillar={setPillar}>
            <DharmaChakraIcon className="h-5 w-5 md:h-6 md:w-6" />
        </NavButton>
         <NavButton label="Gyan Kosh" pillar={Pillar.GyanKosh} activePillar={activePillar} setPillar={setPillar}>
            <ScrollIcon className="h-5 w-5 md:h-6 md:w-6" />
        </NavButton>
      </nav>
    </header>
  );
};
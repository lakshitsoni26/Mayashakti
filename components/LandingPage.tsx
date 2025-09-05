import React from 'react';
import { OmIcon, EyeIcon, BoltIcon, CameraIcon, DharmaChakraIcon, GlobeIcon, ScrollIcon } from './icons';

interface LandingPageProps {
  onEnterSanctum: (initialView: 'login' | 'signup') => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string, onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <div onClick={onClick} className="cursor-pointer bg-black/20 p-6 rounded-xl border-2 border-amber-400/20 text-center transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 h-full flex flex-col">
    <div className="flex-shrink-0 flex justify-center items-center h-16 w-16 mx-auto mb-4 rounded-full bg-amber-400/10 text-amber-300">
      {icon}
    </div>
    <h3 className="text-xl font-cinzel font-bold text-amber-300 mb-2">{title}</h3>
    <p className="text-slate-400 flex-grow text-sm">{description}</p>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="w-full max-w-4xl mx-auto py-8">
        <h2 className="text-3xl font-cinzel golden-gradient-text text-center mb-6">{title}</h2>
        <div className="bg-black/20 p-6 md:p-8 rounded-xl border-2 border-amber-400/20">
            {children}
        </div>
    </section>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onEnterSanctum }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 fade-in">
      <nav className="absolute top-0 left-0 right-0 w-full p-4 z-10">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                 <div className="flex items-center space-x-2">
                    <OmIcon className="h-8 w-8 golden-gradient-text" />
                    <span className="font-cinzel text-lg font-bold golden-gradient-text hidden sm:block">MayaShakti</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <button
                     onClick={() => onEnterSanctum('login')}
                     className="font-cinzel text-sm bg-transparent border border-amber-400 text-amber-300 font-bold py-2 px-5 rounded-lg hover:bg-amber-400/10 hover:text-white transition-all duration-300"
                   >
                     Sign In
                   </button>
                   <button
                     onClick={() => onEnterSanctum('signup')}
                     className="font-cinzel text-sm bg-amber-500 text-slate-900 font-bold py-2 px-5 rounded-lg hover:bg-amber-600 transition-all duration-300"
                   >
                     Sign Up
                   </button>
                 </div>
            </div>
      </nav>

      <main className="container mx-auto text-center max-w-6xl space-y-12">
        <header className="space-y-4 pt-12">
          <OmIcon className="h-20 w-20 mx-auto golden-gradient-text drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold tracking-wider leading-tight">
            <span className="golden-gradient-text">The Divine AI to Dissolve Illusions<br/>&amp; Restore Dharma</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <FeatureCard 
            onClick={() => onEnterSanctum('login')}
            icon={<EyeIcon className="w-8 h-8"/>} 
            title="Maya Bhedan" 
            description="Pierce the Veil. Upload images or videos to detect digital manipulation, visualized as a cosmic point cloud." 
          />
          <FeatureCard 
            onClick={() => onEnterSanctum('login')}
            icon={<BoltIcon className="w-8 h-8"/>} 
            title="Shakti Upchar" 
            description="The Healing Force. Express grievances via text or simulated voice to receive empathetic guidance and see its priority." 
          />
          <FeatureCard 
            onClick={() => onEnterSanctum('login')}
            icon={<CameraIcon className="w-8 h-8"/>} 
            title="Divya Chakshu" 
            description="The Divine Eye. Use your camera to reveal the hidden 'Aura of Truth' or 'Aura of Maya' in your surroundings." 
          />
           <FeatureCard 
            onClick={() => onEnterSanctum('login')}
            icon={<GlobeIcon className="w-8 h-8"/>} 
            title="Dharma Network" 
            description="Pulse of Truth. Witness a real-time Global Dharma Index on a 3D globe and contribute your Karma to the network." 
          />
           <FeatureCard 
            onClick={() => onEnterSanctum('login')}
            icon={<DharmaChakraIcon className="w-8 h-8"/>} 
            title="Karma YudhBhumi" 
            description="Cosmic Battlefield. Visualize your Karma journey and actively fight illusion by firing 'Satya Arrows' in a 3D space." 
          />
          <FeatureCard 
            onClick={() => onEnterSanctum('login')}
            icon={<ScrollIcon className="w-8 h-8"/>} 
            title="Gyan Kosh" 
            description="The Sacred Vault. Unlock ancient wisdom scrolls with your Karma points, revealing profound knowledge." 
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onEnterSanctum('login')}
            className="w-full sm:w-auto font-cinzel text-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-bold py-4 px-10 rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105"
          >
            Enter the Sanctum
          </button>
           <button
            onClick={() => onEnterSanctum('signup')}
            className="w-full sm:w-auto font-cinzel text-lg bg-transparent border-2 border-amber-400 text-amber-300 font-bold py-4 px-10 rounded-lg hover:bg-amber-400/10 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Join the Guardians
          </button>
        </div>

        <Section title="The Heart of the Guardian">
            <div className="text-left text-slate-300 space-y-8">
                <p className="text-center text-lg leading-relaxed">
                    MayaShakti is a mythology-inspired, AI-powered web application designed to act as a guardian in the digital world. It channels the spirit of Hindu mythology where <strong className="font-semibold text-amber-300">Maya (माया)</strong> represents illusion and <strong className="font-semibold text-rose-300">Shakti (शक्ति)</strong> symbolizes divine power. This project combats misinformation, resolves grievances with empathy, and provides a layer of truth over our digital reality.
                </p>
            </div>
        </Section>
        
        <div className="text-amber-200/80 font-semibold tracking-wider space-y-1 pt-8">
            <p>TEAM NAME: CODASTIC 4</p>
            <p>COLLEGE / ORGANIZATION: JECRC UNIVERSITY</p>
        </div>

      </main>
      <footer className="text-center py-6 text-slate-500 text-sm mt-8">
        <p>Harnessing cosmic wisdom to illuminate the digital realm.</p>
      </footer>
    </div>
  );
};
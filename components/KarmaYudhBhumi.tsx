import React, { useRef, useEffect, useState } from 'react';
import { KarmaRecord } from '../types';

interface KarmaYudhBhumiProps {
  karmaHistory: KarmaRecord[];
}

const KarmaChart: React.FC<{ history: KarmaRecord[] }> = ({ history }) => {
  if (history.length < 2) {
    return <div className="h-48 flex items-center justify-center text-slate-500">Not enough data to draw your journey.</div>;
  }
  
  const width = 500;
  const height = 150;
  const padding = 20;

  const minTime = history[0].timestamp;
  const maxTime = history[history.length - 1].timestamp;
  const timeRange = maxTime - minTime || 1;

  const getX = (timestamp: number) => padding + ((timestamp - minTime) / timeRange) * (width - 2 * padding);
  const getY = (score: number) => height - padding - (score / 100) * (height - 2 * padding);

  const pathData = history.map((p, i) => {
    const x = getX(p.timestamp);
    const y = getY(p.score);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <path d={pathData} fill="none" stroke="url(#karmaGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="karmaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--saffron)" />
          <stop offset="100%" stopColor="var(--vedic-gold)" />
        </linearGradient>
      </defs>
      {/* Current Score Dot */}
      <circle cx={getX(history[history.length-1].timestamp)} cy={getY(history[history.length-1].score)} r="5" fill="var(--vedic-gold)" />
    </svg>
  );
};

export const KarmaYudhBhumi: React.FC<KarmaYudhBhumiProps> = ({ karmaHistory }) => {
  const threeRef = useRef<HTMLDivElement>(null);
  const [asuras, setAsuras] = useState(5);

  const handleBattlefieldClick = () => {
    if (asuras > 0) {
      setAsuras(prev => prev - 1);
      // Here you would trigger the "Satya Arrow" animation in THREE.js
    }
  };
  
  // Placeholder for THREE.js scene initialization
  useEffect(() => {
    const container = threeRef.current;
    if (container) {
      // Initialize THREE.js scene, camera, renderer
      // Add stars, Asura nodes, and logic for Satya Arrow
      // This effect runs once on mount.
    }
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-cinzel golden-gradient-text">Karma YudhBhumi (कर्म एवं युद्धभूमि)</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Visualize your journey and engage in the cosmic battle against illusion.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="p-4 bg-black/30 rounded-xl border-2 border-amber-400/20">
          <h3 className="text-xl font-cinzel text-amber-300 mb-2 text-center">Your Karma Journey</h3>
          <KarmaChart history={karmaHistory} />
        </div>

        <div className="p-4 bg-black/30 rounded-xl border-2 border-amber-400/20">
            <h3 className="text-xl font-cinzel text-amber-300 mb-2 text-center">Cosmic Battlefield</h3>
            <div 
              ref={threeRef}
              onClick={handleBattlefieldClick}
              className="h-80 bg-black rounded-lg cursor-pointer text-center flex flex-col items-center justify-center border border-amber-400/20"
              aria-label={`Cosmic battlefield with ${asuras} asura nodes remaining. Click to fire an arrow of truth.`}
            >
              <p className="text-slate-400 italic">[Simulated THREE.js Scene]</p>
              <p className="text-slate-500 text-sm mt-2">Click to fire a Satya Arrow and dissolve an Asura Node.</p>
              <p className="font-bold text-2xl text-red-400 mt-4">{asuras} Asura Nodes Remain</p>
            </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';

interface DharmaNetworkProps {
  karmaScore: number;
  updateKarma: (updater: (prevScore: number) => number) => void;
  globalDharmaIndex: number;
  setGlobalDharmaIndex: (updater: (prevIndex: number) => number) => void;
}

const MIN_KARMA_CONTRIBUTION = 10;

export const DharmaNetwork: React.FC<DharmaNetworkProps> = ({ karmaScore, updateKarma, globalDharmaIndex, setGlobalDharmaIndex }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canContribute = karmaScore >= MIN_KARMA_CONTRIBUTION;
  
  const handleContribute = () => {
    setError(null);
    setSuccess(null);
    if (!canContribute) {
      setError(`You need at least ${MIN_KARMA_CONTRIBUTION} Karma to contribute.`);
      return;
    }
    updateKarma(prev => prev - MIN_KARMA_CONTRIBUTION);
    setGlobalDharmaIndex(prev => prev + 1); // Each contribution adds 1 to the index
    setSuccess(`Thank you for contributing ${MIN_KARMA_CONTRIBUTION} Karma to the global Dharma.`);
    setTimeout(() => setSuccess(null), 3000);
  };
  
  const pulseDuration = Math.max(0.5, 3 - globalDharmaIndex / 40);
  const globeColor = globalDharmaIndex < 33 ? 'var(--sacred-red)' : globalDharmaIndex < 66 ? 'var(--saffron)' : 'var(--vedic-gold)';

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-cinzel golden-gradient-text">Dharma Network (धर्म प्रतिध्वनि)</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Witness the collective pulse of truth. Your actions ripple across the cosmos.</p>
      </div>
      
      <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
        <div 
          className="absolute w-full h-full rounded-full"
          style={{
            backgroundColor: globeColor,
            animation: `pulse ${pulseDuration}s infinite`,
            boxShadow: `0 0 40px 10px ${globeColor}`,
            opacity: 0.8
          }}
        />
        <div className="absolute w-full h-full border border-white/10 rounded-full" />
        <div className="relative z-10 text-center text-white">
          <p className="font-bold text-5xl drop-shadow-lg">{globalDharmaIndex}</p>
          <p className="font-cinzel tracking-widest">Global Dharma Index</p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto text-center space-y-4">
        <p className="text-slate-300">
          Contribute your personal Karma to strengthen the global pulse of truth. Each contribution helps dispel the collective Maya.
        </p>
        <button
          onClick={handleContribute}
          disabled={!canContribute}
          className="font-cinzel bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Contribute {MIN_KARMA_CONTRIBUTION} Karma
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-300 text-sm mt-2">{success}</p>}
      </div>

    </div>
  );
};

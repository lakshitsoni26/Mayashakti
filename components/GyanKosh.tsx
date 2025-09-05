import React, { useState } from 'react';
import { LockIcon, ScrollIcon } from './icons';
import { AnimatedText } from './AnimatedText';

interface GyanKoshProps {
  karmaScore: number;
  updateKarma: (updater: (prevScore: number) => number) => void;
}

const WISDOM_SCROLLS = [
    "The greatest illusion (Maya) is the belief in separation. The greatest truth (Dharma) is the recognition of unity.",
    "Just as a lotus rises from the mud, pure and unstained, so can the wise mind rise above the chaos of misinformation.",
    "Three gates lead to self-destruction: lust, anger, and greed. Guard them well to protect your inner sanctum of truth.",
    "Your Karma is your own. The actions you take in the digital realm, as in the physical, shape your destiny.",
    "Seek not to win arguments, but to understand. True victory is not in silencing a voice, but in illuminating a mind.",
    "The arrow of truth, once released, flies straight. Its path is guided by clarity, not by the winds of opinion.",
];

const UNLOCK_THRESHOLD = 50;

export const GyanKosh: React.FC<GyanKoshProps> = ({ karmaScore, updateKarma }) => {
  const [unlockedScroll, setUnlockedScroll] = useState<string | null>(null);
  const isLocked = karmaScore < UNLOCK_THRESHOLD;

  const handleUnlock = () => {
    if (isLocked) return;
    const randomIndex = Math.floor(Math.random() * WISDOM_SCROLLS.length);
    setUnlockedScroll(WISDOM_SCROLLS[randomIndex]);
    updateKarma(prev => prev + 2); // A small reward for seeking wisdom
  };

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-cinzel golden-gradient-text">Gyan Kosh (ज्ञान कोष)</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">The Sacred Vault of Wisdom. Only those with sufficient Karma may seek what lies within.</p>
      </div>
      
      <div className="max-w-2xl mx-auto p-8 bg-black/30 rounded-xl border-2 border-amber-400/20 flex flex-col items-center text-center">
        {isLocked ? (
          <>
            <LockIcon className="w-16 h-16 text-amber-400/50 mb-4"/>
            <h3 className="text-2xl font-cinzel text-amber-300">The Vault is Sealed</h3>
            <p className="text-slate-400 mt-2">
              You need a Karma Score of <strong className="text-white">{UNLOCK_THRESHOLD}</strong> to unlock the wisdom within.
              Currently, your score is <strong className="text-white">{karmaScore}</strong>.
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2.5 rounded-full" style={{width: `${(karmaScore / UNLOCK_THRESHOLD) * 100}%`}}></div>
            </div>
          </>
        ) : (
          <>
            <ScrollIcon className="w-16 h-16 text-amber-300 mb-4"/>
            <h3 className="text-2xl font-cinzel text-amber-300">The Vault is Open</h3>
            <p className="text-slate-400 mt-2">Your Karma has granted you access. Seek the wisdom of the ancients.</p>
            <button
              onClick={handleUnlock}
              className="mt-6 font-cinzel bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all"
            >
              Retrieve Wisdom Scroll
            </button>
          </>
        )}
      </div>

      {unlockedScroll && (
         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 fade-in" onClick={() => setUnlockedScroll(null)}>
            <div className="max-w-2xl w-full mx-auto p-8 bg-bg-color border-2 border-amber-400/40 rounded-xl space-y-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-cinzel text-center golden-gradient-text">A Scroll Reveals Itself...</h3>
                <div className="p-6 bg-black/20 rounded-lg border-l-4 border-amber-400/50">
                    <AnimatedText text={unlockedScroll} className="text-slate-200 text-lg italic leading-relaxed text-center" />
                </div>
                 <button onClick={() => setUnlockedScroll(null)} className="w-full mt-4 font-cinzel bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                    Close
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

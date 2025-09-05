import React, { useState, useCallback } from 'react';
import { ShaktiUpcharResponse } from '../types';
import { resolveGrievance } from '../services/apiService';
import { AnimatedText } from './AnimatedText';

const PriorityGauge: React.FC<{ sentiment: ShaktiUpcharResponse['sentiment'] }> = ({ sentiment }) => {
  const priorityMap: Record<ShaktiUpcharResponse['sentiment'], { value: number; color: string; label: string }> = {
    'Calm': { value: 2, color: 'var(--vedic-gold)', label: 'Low Priority' },
    'Disturbed': { value: 6, color: 'var(--saffron)', label: 'Medium Priority' },
    'Wrathful': { value: 9, color: 'var(--sacred-red)', label: 'High Priority' },
  };
  const { value, color, label } = priorityMap[sentiment];
  const angle = -90 + (value / 10) * 180;

  return (
    <div className="w-full max-w-xs mx-auto text-center">
      <div className="relative h-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-48 border-4 border-amber-400/20 rounded-t-full" />
        <div 
          className="absolute top-0 left-0 w-full h-48 rounded-t-full transition-all duration-1000 ease-out"
          style={{ 
              background: `conic-gradient(from -90deg, ${color} 0deg, ${color} ${angle}deg, transparent ${angle}deg, transparent 180deg)`,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </div>
      <p className="font-cinzel text-xl mt-[-1.5rem]" style={{ color }}>{label}</p>
      <p className="text-sm text-slate-400 uppercase tracking-widest">{sentiment}</p>
    </div>
  );
};


interface ShaktiUpcharProps {
  updateKarma: (updater: (prevScore: number) => number) => void;
  authToken: string | null;
}

export const ShaktiUpchar: React.FC<ShaktiUpcharProps> = ({ updateKarma, authToken }) => {
  const [grievance, setGrievance] = useState<string>('');
  const [result, setResult] = useState<ShaktiUpcharResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecord = () => {
      setIsRecording(true);
      setError(null);
      setResult(null);
      setTimeout(() => {
          setGrievance("Simulated voice-to-text: 'I am deeply troubled by the spread of false news regarding community health. It is causing panic and distrust among neighbors.'");
          setIsRecording(false);
      }, 2500);
  };
  
  const handleDemo = () => {
      setError(null);
      setResult(null);
      setGrievance("I am concerned about a viral social media post claiming a miracle cure that seems too good to be true. It's causing a lot of confusion in my community.");
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievance.trim()) {
      setError('Please describe your grievance.');
      return;
    }
    if (!authToken) {
      setError('Authentication required. Please log in again.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await resolveGrievance(authToken, grievance);
      setResult(response);
      updateKarma(prev => prev + 3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [grievance, updateKarma, authToken]);

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-cinzel golden-gradient-text">Shakti Upchar (शक्ति उपचार)</h2>
        <p className="text-slate-400 mt-2">Channeling divine feminine energy to guide you towards resolution.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <textarea
          value={grievance}
          onChange={(e) => setGrievance(e.target.value)}
          placeholder="Share your concerns, and let Shakti guide you..."
          className="w-full h-32 p-3 bg-black/30 border-2 border-amber-400/20 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-200 placeholder-slate-500"
          disabled={isLoading || isRecording}
        />
        <div className="flex justify-end">
            <button
                type="button"
                onClick={handleDemo}
                disabled={isLoading || isRecording}
                className="font-cinzel text-sm text-amber-300 hover:text-white transition-colors"
            >
              Try a Demo
            </button>
        </div>
        <div className="flex gap-4">
            <button
                type="button"
                onClick={handleRecord}
                disabled={isLoading || isRecording}
                className="w-1/2 font-cinzel bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isRecording ? 'Recording...' : 'Record Grievance'}
            </button>
            <button
                type="submit"
                disabled={isLoading || isRecording || !grievance.trim()}
                className="w-1/2 font-cinzel bg-gradient-to-r from-rose-700 to-red-800 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-rose-700/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Gathering Energy...' : 'Seek Resolution'}
            </button>
        </div>
      </form>

      {error && <p className="text-center text-red-400">{error}</p>}

      {result && (
        <div className={`max-w-3xl mx-auto mt-8 p-6 bg-black/20 backdrop-blur-sm border border-amber-400/20 rounded-xl space-y-6 fade-in`}>
          <PriorityGauge sentiment={result.sentiment} />
          <div>
            <h3 className="text-xl font-cinzel text-amber-300 mb-2">Resolution Path</h3>
            <AnimatedText text={result.resolutionPath} className="text-slate-300 leading-relaxed" />
          </div>
          <div>
            <h3 className="text-xl font-cinzel text-orange-300 mb-2">A Message from Shakti</h3>
            <AnimatedText text={result.message} className="text-slate-300 leading-relaxed italic border-l-4 border-orange-400/50 pl-4" />
          </div>
        </div>
      )}
    </div>
  );
};
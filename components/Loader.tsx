import React from 'react';

const LotusPetal: React.FC<{ rotation: number, delay: string }> = ({ rotation, delay }) => (
    <path
        d="M50 10 C 40 25, 40 40, 50 50 C 60 40, 60 25, 50 10 Z"
        fill="url(#petalGradient)"
        transform={`rotate(${rotation} 50 50)`}
        className="opacity-0 scale-50 origin-center"
        style={{ animation: `bloom 1.5s ${delay} ease-out forwards` }}
    />
);

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#281c1c] flex flex-col items-center justify-center z-50">
      <style>{`
        @keyframes bloom {
          to {
            opacity: 0.8;
            transform: rotate(var(--rotation)) scale(1);
          }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
      `}</style>
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-[0_0_15px_rgba(255,193,7,0.5)]">
        <defs>
          <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: '#ffeb99', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffc107', stopOpacity: 0.8 }} />
          </radialGradient>
        </defs>
        {Array.from({ length: 8 }).map((_, i) => (
          <LotusPetal key={i} rotation={i * 45} delay={`${i * 0.1}s`} />
        ))}
      </svg>
      <h2 className="text-2xl font-cinzel golden-gradient-text mt-4 animate-pulse" style={{animationDuration: '2s'}}>
        Awakening The Guardian...
      </h2>
    </div>
  );
};
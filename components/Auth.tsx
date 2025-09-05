import React, { useState, FormEvent, useEffect } from 'react';
import { OmIcon } from './icons';
import { login, signup } from '../services/authService';

interface AuthProps {
  onAuthSuccess: (token: string) => void;
  onBackToLanding: () => void;
  initialView: 'login' | 'signup';
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBackToLanding, initialView }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoginView(initialView === 'login');
  }, [initialView]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Username and password cannot be empty.');
      setIsLoading(false);
      return;
    }

    try {
      if (isLoginView) {
        // Handle Login
        const { token } = await login(username, password);
        onAuthSuccess(token);
      } else {
        // Handle Sign Up
        await signup(username, password);
        setMessage('Account created successfully! Please sign in.');
        setIsLoginView(true);
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 fade-in">
        <div className="w-full max-w-md">
            <div className="text-center mb-6">
                <OmIcon className="h-20 w-20 mx-auto golden-gradient-text drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]" />
            </div>
            <div 
                className="bg-black/20 border-2 border-amber-400/30 rounded-2xl shadow-2xl shadow-amber-500/10 p-8"
            >
                <h2 className="text-3xl font-cinzel golden-gradient-text text-center mb-2">
                {isLoginView ? 'Enter the Sanctum' : 'Join the Guardians'}
                </h2>
                <p className="text-center text-slate-400 mb-6">
                {isLoginView ? 'Provide your credentials to proceed.' : 'Create your account to begin your journey.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-amber-300/80 text-sm font-bold mb-2 font-cinzel" htmlFor="username">
                    Username
                    </label>
                    <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-black/30 border-2 border-amber-400/20 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-200 placeholder-slate-500"
                    placeholder="Your sacred name"
                    disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-amber-300/80 text-sm font-bold mb-2 font-cinzel" htmlFor="password">
                    Password
                    </label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-black/30 border-2 border-amber-400/20 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-200 placeholder-slate-500"
                    placeholder="Your secret mantra"
                    disabled={isLoading}
                    />
                </div>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                {message && <p className="text-green-300 text-sm text-center">{message}</p>}

                <button
                    type="submit"
                    className="w-full font-cinzel text-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? 'Please wait...' : (isLoginView ? 'Sign In' : 'Sign Up')}
                </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                {isLoginView ? "Don't have an account?" : 'Already a guardian?'}
                <button onClick={() => { setIsLoginView(!isLoginView); setError(null); setMessage(null); }} className="font-semibold text-amber-300 hover:text-amber-200 ml-2">
                    {isLoginView ? 'Sign Up' : 'Sign In'}
                </button>
                </p>
            </div>
            <div className="text-center mt-6">
                 <button onClick={onBackToLanding} className="text-sm text-slate-500 hover:text-amber-300 transition-colors">
                    &larr; Back to Entrance
                 </button>
            </div>
        </div>
    </div>
  );
};
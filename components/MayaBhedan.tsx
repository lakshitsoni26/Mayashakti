import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { analyzeMedia } from '../services/apiService';
import { AnimatedText } from './AnimatedText';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve({ base64: result.split(',')[1], mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
  
interface MayaBhedanProps {
  updateKarma: (updater: (prevScore: number) => number) => void;
  authToken: string | null;
}

export const MayaBhedan: React.FC<MayaBhedanProps> = ({ updateKarma, authToken }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{narration: string, verdict: string} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      setError(`Image is too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`);
      return;
    }
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
      setError(`Video is too large. Maximum size is ${MAX_VIDEO_SIZE / 1024 / 1024}MB.`);
      return;
    }
    
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  }, []);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) {
      setError('Please upload an image or video to analyze.');
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
      if (mediaFile.type.startsWith('video/')) {
        // Videos are not supported by the current analysis function.
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult({
          verdict: 'Unclear',
          narration: 'The currents of time within video are complex. This feature is still in deep meditation and will awaken soon.',
        });
      } else {
        const { base64, mimeType } = await fileToBase64(mediaFile);
        const analysisResult = await analyzeMedia(authToken, base64, mimeType);
        setResult({
          verdict: analysisResult.verdict,
          narration: analysisResult.discourse,
        });
      }
      updateKarma(prev => prev + 5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A cosmic disturbance interrupted the analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [mediaFile, updateKarma, authToken]);

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-cinzel golden-gradient-text">Maya Bhedan (माया भेदन)</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Pierce the veil of digital illusion. Upload media to reveal its hidden nature.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <div 
            className="p-4 bg-black/30 border-2 border-dashed border-amber-400/20 rounded-lg text-center cursor-pointer hover:border-amber-400/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
            <input type="file" ref={fileInputRef} className="sr-only" accept="image/*,video/*" onChange={handleFileChange} disabled={isLoading} />
            {mediaPreview ? (
                mediaFile?.type.startsWith('image/') ? (
                    <img src={mediaPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                    <video src={mediaPreview} controls className="max-h-64 mx-auto rounded-lg" />
                )
            ) : (
                <div className="text-slate-400 py-8">
                    <p className="font-semibold">Click to upload Image or Video</p>
                    <p className="text-xs mt-1">Max 5MB for images, 10MB for videos.</p>
                </div>
            )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !mediaFile}
          className="w-full font-cinzel bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? 'Piercing the Veil...' : 'Reveal the Truth'}
        </button>
      </form>

      {error && <p className="text-center text-red-400">{error}</p>}

      {result && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 fade-in" onClick={() => setResult(null)}>
            <div className="max-w-3xl w-full mx-auto p-6 bg-bg-color border-2 border-amber-400/40 rounded-xl space-y-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-cinzel text-center golden-gradient-text">Analysis Complete</h3>
                <div className="relative h-64 bg-black/30 rounded-lg flex items-center justify-center text-center p-4 border border-amber-400/20">
                  {mediaPreview && (
                      <>
                          {mediaFile?.type.startsWith('image/') ? (
                              <img src={mediaPreview} alt="Analyzed Media" className="max-h-full max-w-full object-contain rounded-lg" />
                          ) : (
                              <video src={mediaPreview} controls className="max-h-full max-w-full object-contain rounded-lg" />
                          )}
                          <div 
                              className="analysis-grid"
                              style={{
                                  '--grid-color': result.verdict === 'Truth' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)'
                              } as React.CSSProperties}
                          ></div>
                      </>
                  )}
                </div>
                <div>
                    <h4 className="text-xl font-cinzel text-amber-300 mb-2">Divine Narration (दिव्य कथा)</h4>
                    <AnimatedText text={result.narration} className="text-slate-300 leading-relaxed" />
                </div>
                 <button onClick={() => setResult(null)} className="w-full mt-4 font-cinzel bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                    Close
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
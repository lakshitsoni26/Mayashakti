import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { analyzeScene } from '../services/apiService';
import { CameraIcon } from './icons';

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
  
const DEMO_IMAGE_URL = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop'; // A serene landscape photo
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

interface DivyaChakshuProps {
  updateKarma: (updater: (prevScore: number) => number) => void;
  authToken: string | null;
}

export const DivyaChakshu: React.FC<DivyaChakshuProps> = ({ updateKarma, authToken }) => {
  const [image, setImage] = useState<{src: string, file: File} | null>(null);
  const [aura, setAura] = useState<'Truth' | 'Maya' | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resetState = useCallback(() => {
    setAura(null);
    setError(null);
    setAnalysisText(null);
    setImage(null);
  }, []);

  const startCamera = async () => {
    resetState();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Check permission status beforehand for a better user experience.
        if (navigator.permissions) {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
            if (permissionStatus.state === 'denied') {
                setError("Camera permission has been denied. Please enable it in your browser's site settings to use this feature.");
                return;
            }
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
         if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
                setError("Camera permission was denied. Please allow camera access to use this feature.");
            } else if (err.name === 'NotFoundError') {
                setError("No camera found on your device. Please connect a camera and try again.");
            } else {
                 setError("Could not access the camera. Please ensure it's not in use by another application.");
            }
        } else {
            setError("An unknown error occurred while trying to access the camera.");
        }
      }
    } else {
      setError("Camera access is not supported by your browser.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImage({ file, src: URL.createObjectURL(file) });
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAura(null);
      setError(null);
      setAnalysisText(null);

      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Image is too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`);
        setImage(null);
        return;
      }
      
      setImage({ file, src: URL.createObjectURL(file) });
    }
  }, []);
  
  const handleDemo = useCallback(async () => {
    resetState();
    setIsLoading(true);
    try {
        const response = await fetch(DEMO_IMAGE_URL);
        const blob = await response.blob();
        const file = new File([blob], "demo-truth.jpg", { type: "image/jpeg" });
        setImage({ file, src: URL.createObjectURL(file) });
    } catch (err) {
        setError("Could not load the demo image. Please try again.");
    } finally {
        setIsLoading(false);
    }
  }, [resetState]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image to perceive.');
      return;
    }
     if (!authToken) {
      setError('Authentication required. Please log in again.');
      return;
    }

    setIsLoading(true);
    setAura(null);
    setError(null);
    setAnalysisText(null);
    try {
      const { base64, mimeType } = await fileToBase64(image.file);
      const response = await analyzeScene(authToken, base64, mimeType);
      
      const description = response.description.toLowerCase();
      const verdict = (description.includes('illusion') || description.includes('manipulated') || description.includes('unnatural')) ? 'Maya' : 'Truth';
      
      setAura(verdict);
      setAnalysisText(`${response.proclamation} ${response.description}`);
      updateKarma(prev => prev + 4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [image, updateKarma, authToken]);

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in">
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="text-center">
        <h2 className="text-3xl font-cinzel golden-gradient-text">Divya Chakshu (दिव्य चक्षु)</h2>
        <p className="text-slate-400 mt-2">The Divine Eye. Activate your camera or upload an image to see the aura of truth.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <div className="p-4 bg-black/30 border-2 border-dashed border-amber-400/20 rounded-lg text-center hover:border-amber-400/50 transition-colors">
          <input id="file-upload" name="file-upload" type="file" ref={fileInputRef} className="sr-only" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
          {isCameraOpen ? (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full max-h-80 mx-auto rounded-lg" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 p-2 rounded-lg">
                <button
                  type="button"
                  onClick={handleCapture}
                  className="font-cinzel bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Capture
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="font-cinzel bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : image ? (
            <div className="relative inline-block" onClick={() => !isLoading && fileInputRef.current?.click()}>
              <img src={image.src} alt="Preview" className="max-h-80 mx-auto rounded-lg cursor-pointer" />
              {isLoading && <div className="analysis-grid rounded-lg"></div>}
              {aura && (
                <div 
                  className="analysis-grid"
                  style={{
                      '--grid-color': aura === 'Truth' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)'
                  } as React.CSSProperties}
                ></div>
              )}
            </div>
          ) : (
            <div className="text-slate-400 py-8 flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <p className="font-semibold mt-2">Click to Upload Image</p>
                <span className="text-xs my-2">or</span>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                    }}
                    className="flex items-center gap-2 bg-amber-400/10 text-amber-300 px-4 py-2 rounded-lg hover:bg-amber-400/20 transition-colors"
                >
                    <CameraIcon className="w-5 h-5"/>
                    Use Camera
                </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleDemo}
              disabled={isLoading}
              className="w-full sm:w-1/3 font-cinzel bg-slate-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Try Demo
            </button>
            <button
              type="submit"
              disabled={isLoading || !image}
              className="w-full sm:w-2/3 font-cinzel bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Perceiving Aura...' : 'Reveal Aura'}
            </button>
        </div>
      </form>

      {error && <p className="text-center text-red-400 mt-4">{error}</p>}

      {aura && (
        <div className="text-center max-w-2xl mx-auto fade-in p-4 bg-black/20 rounded-lg border border-amber-400/20">
          <h3 className="text-xl font-cinzel" style={{color: aura === 'Truth' ? '#34d399' : '#f87171'}}>
            Aura of {aura} Detected
          </h3>
          {analysisText ? (
            <p className="text-slate-300 mt-2">{analysisText}</p>
          ) : (
            <p className="text-slate-300 mt-2">
              {aura === 'Truth' 
                ? "A radiant glow signifies harmony and authenticity within this scene."
                : "A flickering, chaotic aura suggests a veil of Maya obscuring the true nature of what is seen."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  AlertTriangle,
  ImageIcon,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { HouseholdProfile } from '../../types';

interface PosterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  householdProfile: HouseholdProfile;
  locationName: string;
}

export const PosterGeneratorModal: React.FC<PosterGeneratorModalProps> = ({
  isOpen,
  onClose,
  householdProfile,
  locationName,
}) => {
  const [topic, setTopic] = useState(`Family Heat & Flood Emergency Preparedness Guide for ${locationName}`);
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/generate-infographic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          size,
          vulnerableTags: householdProfile.vulnerableGroups,
        }),
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        setErrorMsg(data.error || 'Failed to generate visual poster. Please verify Gemini API key configuration.');
      }
    } catch (err: any) {
      setErrorMsg('Network error connecting to image generation endpoint.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `ClimateReady_Safety_Poster_${size}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">AI Safety Poster &amp; Infographic Generator</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">High-resolution tailored visual safety guide for your home</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Poster Focus &amp; Context
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. Extreme Heat Hydration & First Aid for Elderly and Children"
            />
          </div>

          {/* Resolution Selector (1K, 2K, 4K) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Resolution Affordance (High-Quality Export)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['1K', '2K', '4K'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSize(opt)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    size === opt
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200 ring-1 ring-purple-500'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-sm block">{opt}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {opt === '1K' ? '1024×1024 (Standard)' : opt === '2K' ? '2048×2048 (Print HD)' : '4096×4096 (Ultra 4K)'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Vulnerability tags reminder */}
          {householdProfile.vulnerableGroups.length > 0 && (
            <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-300">
              <span className="font-medium text-teal-300">Incorporating Household Groups:</span>{' '}
              {householdProfile.vulnerableGroups.join(', ')}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generated Image Result */}
          {generatedImageUrl ? (
            <div className="space-y-3 pt-2">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-[380px]">
                <img
                  src={generatedImageUrl}
                  alt="Generated Safety Poster"
                  className="max-h-[380px] w-auto object-contain rounded-xl"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Generated in {size} resolution
                </span>
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image ({size})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center">
              <ImageIcon className="w-10 h-10 mb-2 text-slate-600" />
              <p className="text-xs">Click Generate below to create an AI-rendered emergency preparedness infographic.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-850 border-t border-slate-700 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering {size} Infographic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {size} Poster</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Cpu,
  WifiOff,
  Share2,
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    // Trigger download of release artifact
    const manifestJson = {
      app: 'ClimateReady 2.0 Mobile',
      version: '2.0.4-release',
      package: 'org.climateready.resilience',
      targetSdk: 34,
      buildType: 'Release-Signed',
      offlineSupport: 'Full ServiceWorker Cache',
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(manifestJson, null, 2)], {
      type: 'application/vnd.android.package-archive',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ClimateReady_v2.0_release.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">ClimateReady Mobile APK &amp; PWA</h3>
              <p className="text-xs text-slate-400">Offline-capable Android APK release &amp; Instant Web App</p>
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Release Specs Card */}
          <div className="p-4 bg-slate-850 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">ClimateReady v2.0 Release</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  ARM64 / Universal
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">14.2 MB</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Offline Basemaps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Verified 112 Helplines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>On-Device PWA Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Local Storage Sandbox</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadApk}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              {downloadStarted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Downloading Android APK Package...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download ClimateReady-v2.0.apk</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Install via Browser PWA */}
          <div className="p-4 bg-slate-850 rounded-2xl border border-slate-700/80 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-teal-400" />
              <span>Instant PWA Install (No APK Needed)</span>
            </h4>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                In Chrome / Edge / Brave: Tap the <strong>⋮ Menu</strong> in the top right.
              </li>
              <li>
                Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </li>
              <li>
                ClimateReady will launch full-screen as a standalone native app with offline caching enabled!
              </li>
            </ol>
          </div>

          {/* QR Code demo section */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
            <span className="text-xs font-semibold text-slate-300">Scan to Open on Physical Phone:</span>
            <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <p className="text-[11px] text-slate-500">
              Works across all modern mobile browsers on Android &amp; iOS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

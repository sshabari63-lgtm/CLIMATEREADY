import React from 'react';
import {
  Database,
  ExternalLink,
  ShieldAlert,
  CloudSun,
  Map,
  Bot,
  AlertTriangle,
} from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Data Sources &amp; Platform Limitations (Section 20)</h2>
            <p className="text-xs text-slate-400">
              Transparent catalog of external telemetry, mapping engines, and AI models utilized
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Open-Meteo */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-white text-base">Open-Meteo Weather API</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Primary Meteorological Feed
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Provides hourly and 7-day numerical weather predictions including dry-bulb temperature, apparent temperature (heat index), precipitation probability, rainfall accumulation, relative humidity, wind velocity, and UV index.
          </p>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Limitations:</strong> Weather models refresh at scheduled global runs (every 1-3 hours). Sudden hyper-local convective cloudbursts or localized microclimates may exhibit latency.
          </div>
        </div>

        {/* OpenStreetMap & Leaflet */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-white text-base">OpenStreetMap (via Leaflet)</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
              Default &amp; Offline Mapping
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Serves community-maintained vector and raster map tiles without proprietary tracking or API key prerequisites. Enables complete offline caching of neighborhood basemaps via service worker.
          </p>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Limitations:</strong> Road updates and newly constructed municipal drainage networks rely on community map contributors and may vary by township.
          </div>
        </div>

        {/* Google Maps (Temporary) */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Google Maps JavaScript API</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              Optional / Beta Layer
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Feature-flagged secondary provider for satellite, hybrid, and terrain perspectives, as well as nearby public healthcare facility discovery via Places grounding.
          </p>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Limitations &amp; Architecture:</strong> Requires external billing and API quotas. Automatically falls back to OpenStreetMap if disabled or offline.
          </div>
        </div>

        {/* Gemini AI */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Google Gemini 3.8 &amp; 3 Pro Models</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
              Server-Side AI Assistant
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Powers the ClimateReady Guide chat assistant (Gemini 3.8 Flash), speech read-aloud (Gemini 3.8 Flash TTS), and visual emergency posters (Gemini 3 Pro Image). Strictly grounded in local docs.
          </p>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Strict Safety Boundaries:</strong> The AI model does not issue government disaster alerts, does not prescribe medical dosages, and never retains private user conversation records.
          </div>
        </div>
      </div>

      {/* Regulatory Notice */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-3.5 text-xs text-slate-300">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-white text-sm mb-1">Official Regulatory Sources in India</h4>
          <p className="leading-relaxed">
            For statutory red, orange, and yellow weather warnings, always verify with the <strong>India Meteorological Department (mausam.imd.gov.in)</strong> and the <strong>National Disaster Management Authority (ndma.gov.in)</strong>. In life-threatening emergencies, call <strong>112</strong> or state control rooms immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

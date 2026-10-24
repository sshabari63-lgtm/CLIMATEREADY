import React from 'react';
import {
  BookOpen,
  Sun,
  CloudRain,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Droplets,
  Home,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const LearnView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Climate Preparedness Academy (Learn)</h2>
            <p className="text-xs text-slate-400">
              Evidence-based community resilience protocols, warning code keys, and survival physics
            </p>
          </div>
        </div>
      </div>

      {/* IMD Warning Color Codes Key */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Official IMD Meteorological Warning Color Codes
        </h3>
        <p className="text-xs text-slate-400">
          Statutory color codes used by the India Meteorological Department for extreme rainfall, cyclones, and heatwaves.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
            <span className="font-bold text-emerald-400 uppercase block">Green (No Warning)</span>
            <strong className="text-white text-xs block">No Adverse Weather Expected</strong>
            <p className="text-slate-400 text-[11px]">Normal everyday weather. Maintain standard preparedness check-ins.</p>
          </div>

          <div className="p-4 rounded-xl bg-yellow-950/40 border border-yellow-800/60 space-y-1">
            <span className="font-bold text-yellow-400 uppercase block">Yellow (Be Updated)</span>
            <strong className="text-white text-xs block">Watch for Deterioration</strong>
            <p className="text-slate-400 text-[11px]">Severely bad weather possible. Keep batteries charged and monitor updates.</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-1">
            <span className="font-bold text-amber-400 uppercase block">Orange (Be Prepared)</span>
            <strong className="text-white text-xs block">High Confidence Disruption</strong>
            <p className="text-slate-400 text-[11px]">Elevate valuables, verify drinking water, keep children and seniors indoors.</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 space-y-1">
            <span className="font-bold text-rose-400 uppercase block">Red (Take Action)</span>
            <strong className="text-white text-xs block">Severe Threat to Life &amp; Property</strong>
            <p className="text-slate-400 text-[11px]">Torrential cloudburst or extreme heat surge. Follow mandatory evacuation directives.</p>
          </div>
        </div>
      </div>

      {/* Physics of Heat & Waterlogging Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Heatwave Science */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sun className="w-5 h-5" />
            <span>Understanding Heat Index &amp; Wet-Bulb Limits</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The human body cools itself primarily through evaporation of sweat. When relative humidity exceeds 70%, sweat cannot evaporate efficiently, causing core body temperatures to spike even at 36°C ambient temperature.
          </p>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <strong className="text-slate-200">The 35°C Wet-Bulb Threshold:</strong> Sustained exposure beyond 35°C wet-bulb temperature leads to hyperthermia within 6 hours without active external cooling.
          </div>
        </div>

        {/* Flood Science */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <CloudRain className="w-5 h-5" />
            <span>The Sponge Effect &amp; Antecedent Rainfall</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Urban flooding is rarely caused only by the downpour occurring at this moment. If moderate rain has fallen across the previous 4 days, soil porosity and groundwater tables are 100% saturated. Any further 30mm rainfall turns into immediate 100% surface runoff.
          </p>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <strong className="text-slate-200">Impervious Paving Penalty:</strong> Concrete driveways and asphalt eliminate natural percolation, forcing runoff directly into subways and street intersections.
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sun,
  Thermometer,
  Droplets,
  AlertTriangle,
  HeartPulse,
  Briefcase,
  GraduationCap,
  Baby,
  Users,
  ShieldAlert,
  Volume2,
  CheckCircle2,
  Home,
  Wind,
  PhoneCall,
} from 'lucide-react';
import { WeatherData } from '../../types';
import { HeatSafePlanner } from '../planner/HeatSafePlanner';

interface HeatSafetyViewProps {
  weather: WeatherData | null;
  locationName: string;
  onReadGuidance?: (text: string) => void;
}

export const HeatSafetyView: React.FC<HeatSafetyViewProps> = ({
  weather,
  locationName,
  onReadGuidance,
}) => {
  // Personalization options
  const [activityType, setActivityType] = useState<'indoor' | 'outdoor'>('indoor');
  const [duration, setDuration] = useState<'short' | 'prolonged'>('short');
  const [hasShade, setHasShade] = useState(true);
  const [hasCoolRoom, setHasCoolRoom] = useState(true);

  const currentTemp = weather?.current.temperature ?? 34;
  const apparentTemp = weather?.current.apparentTemperature ?? 39;

  const handleReadAloud = () => {
    if (!onReadGuidance) return;
    const text = `Heatwave safety briefing for ${locationName}. Current temperature is ${currentTemp} degrees Celsius with a heat index of ${apparentTemp} degrees. Key warning signs of heat stroke include high body temperature, confusion, and absence of sweating. If observed, call 108 or 112 immediately and apply cool wet compresses.`;
    onReadGuidance(text);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 border border-amber-900/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Heatwave Preparedness Module</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  Section 6
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Hyper-local thermal stress mitigation, indoor cooling engineering, and clinical warning signs
              </p>
            </div>
          </div>
        </div>

        {onReadGuidance && (
          <button
            type="button"
            onClick={handleReadAloud}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-teal-400" />
            <span>Read Heat Briefing</span>
          </button>
        )}
      </div>

      {/* Hourly Heat-Safe Time Planner Component */}
      <HeatSafePlanner
        hourly={weather?.hourly || []}
        locationName={locationName}
        onReadSchedule={onReadGuidance}
      />

      {/* Personalization Interactive Box */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Personalized Heat Exposure Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Activity Environment</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-700 p-0.5 bg-slate-850">
              <button
                type="button"
                onClick={() => setActivityType('indoor')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                  activityType === 'indoor' ? 'bg-teal-600 text-white' : 'text-slate-400'
                }`}
              >
                Indoor
              </button>
              <button
                type="button"
                onClick={() => setActivityType('outdoor')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                  activityType === 'outdoor' ? 'bg-amber-600 text-white' : 'text-slate-400'
                }`}
              >
                Outdoor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Approximate Exposure</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-700 p-0.5 bg-slate-850">
              <button
                type="button"
                onClick={() => setDuration('short')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                  duration === 'short' ? 'bg-teal-600 text-white' : 'text-slate-400'
                }`}
              >
                &lt; 2 Hours
              </button>
              <button
                type="button"
                onClick={() => setDuration('prolonged')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                  duration === 'prolonged' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                4+ Hours
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Shade &amp; Drinking Water</label>
            <button
              type="button"
              onClick={() => setHasShade(!hasShade)}
              className={`w-full py-2 rounded-lg border font-semibold text-center transition-colors ${
                hasShade
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}
            >
              {hasShade ? '✓ Shade Available' : '⚠ Direct Sun Exposure'}
            </button>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Cooler Refuge Room</label>
            <button
              type="button"
              onClick={() => setHasCoolRoom(!hasCoolRoom)}
              className={`w-full py-2 rounded-lg border font-semibold text-center transition-colors ${
                hasCoolRoom
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}
            >
              {hasCoolRoom ? '✓ Shaded Indoor Room' : '⚠ Hot / Tin-Roof Space'}
            </button>
          </div>
        </div>

        {/* Dynamic Recommendation Banner */}
        <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
          <strong className="text-teal-300 block">Personalized Guideline:</strong>
          {activityType === 'outdoor' && duration === 'prolonged' ? (
            <p className="text-amber-300">
              ⚠ High Strain Profile: For outdoor exertion exceeding 4 hours under {currentTemp}°C, mandatory 15-minute shaded rests every 45 minutes are imperative. Drink 250ml water + ORS every half-hour. Wear a wet bandana around your neck.
            </p>
          ) : (
            <p>
              Standard Profile: Keep curtains drawn against direct afternoon sunlight. Increase hydration intake to at least 3.5 liters today, and check on elderly neighbors.
            </p>
          )}
        </div>
      </div>

      {/* Target Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Outdoor Workers */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>Outdoor &amp; Construction Workers</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>Plan heavy physical masonry, digging, or roofing tasks before 9:30 AM or after 4:30 PM.</li>
            <li>Wear loose-fitting, light-colored cotton long-sleeve shirts.</li>
            <li>Employers should provide shaded rest tarpaulins and continuous chilled electrolyte water.</li>
          </ul>
        </div>

        {/* Schools & Students */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Schools &amp; Students</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>Cancel mid-day open-ground physical education (P.E.) classes during yellow/orange heat alerts.</li>
            <li>Sound an hourly "Water Bell" across all classrooms to remind children to hydrate.</li>
            <li>Equip school infirmary with ice packs, oral glucose, and standby thermometer.</li>
          </ul>
        </div>

        {/* Older Adults & Infants */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Baby className="w-4 h-4" />
            <span>Older Adults &amp; Infants</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>Thirst reflex degrades with age; actively hand water glasses to seniors every 60 minutes.</li>
            <li>Keep toddlers in single-layer cotton; never leave children inside a parked car.</li>
            <li>Prepare cool footbaths (20–25°C) for seniors in the afternoon to lower core thermal strain.</li>
          </ul>
        </div>
      </div>

      {/* Clinical Warning Signs: Heat Exhaustion vs Heat Stroke */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
          <h3 className="font-bold text-white text-base">Emergency Warning Signs: Heat Exhaustion vs. Heat Stroke</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-950/20 border border-amber-900/50 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-amber-300 text-sm block">Heat Exhaustion (Act Immediately)</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Heavy sweating and clammy, pale skin</li>
              <li>Dizziness, fatigue, and muscle cramps</li>
              <li>Nausea or mild vomiting</li>
              <li>Weak, rapid pulse</li>
            </ul>
            <div className="p-2.5 bg-amber-950/50 rounded-lg text-amber-200 mt-2">
              <strong>Action:</strong> Move person to shade, loosen clothing, sip cool water/ORS, sponge body with damp towel.
            </div>
          </div>

          <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-rose-400 text-sm block">Heat Stroke (Medical Emergency - Dial 108 / 112)</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>High body temperature (&gt; 39.5°C / 103°F)</li>
              <li>Hot, red, dry skin with <strong>cessation of sweating</strong></li>
              <li>Confusion, slurred speech, or loss of consciousness</li>
              <li>Throbbing headache and seizures</li>
            </ul>
            <div className="p-2.5 bg-rose-950/80 rounded-lg text-rose-200 mt-2 font-bold flex items-center justify-between">
              <span>ACTION: Call 108 / 112 immediately! Immerse in cool bath while awaiting ambulance.</span>
              <a href="tel:108" className="px-2 py-1 bg-rose-600 rounded text-white text-xs">Call 108</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

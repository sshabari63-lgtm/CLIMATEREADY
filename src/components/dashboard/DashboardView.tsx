import React, { useState } from 'react';
import {
  ShieldAlert,
  Sun,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Bell,
  Users,
  Printer,
  ChevronRight,
  Droplets,
  Wind,
  Compass,
  Volume2,
  Calendar,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileCheck,
  ListChecks,
} from 'lucide-react';
import {
  WeatherData,
  SavedLocation,
  HouseholdProfile,
  FamilyPlan,
  ChecklistItem,
  AlertSubscription,
  ReadinessAssessmentData,
} from '../../types';
import { MapProvider } from '../maps/MapProvider';

interface DashboardViewProps {
  weather: WeatherData | null;
  locations: SavedLocation[];
  activeLocationId: string;
  onSelectLocation: (id: string) => void;
  householdProfile: HouseholdProfile;
  plan: FamilyPlan;
  checklist: ChecklistItem[];
  onToggleChecklistItem: (id: string) => void;
  preparednessScore: number;
  assessmentData: ReadinessAssessmentData;
  alertSubscriptions: AlertSubscription[];
  onOpenAlerts: () => void;
  onOpenProfile: () => void;
  onOpenFamilyPlan: () => void;
  onOpenSafetyCard: () => void;
  onOpenCalendar: () => void;
  onOpenAssessment: () => void;
  onOpenTwin: () => void;
  onOpenChecklistGen: () => void;
  onRefreshWeather: () => void;
  isLoadingWeather: boolean;
  onReadGuidance?: (text: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  weather,
  locations,
  activeLocationId,
  onSelectLocation,
  householdProfile,
  plan,
  checklist,
  onToggleChecklistItem,
  preparednessScore,
  assessmentData,
  alertSubscriptions,
  onOpenAlerts,
  onOpenProfile,
  onOpenFamilyPlan,
  onOpenSafetyCard,
  onOpenCalendar,
  onOpenAssessment,
  onOpenTwin,
  onOpenChecklistGen,
  onRefreshWeather,
  isLoadingWeather,
  onReadGuidance,
}) => {
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);
  const activeLocation = locations.find((l) => l.id === activeLocationId) || locations[0];

  const currentSub = alertSubscriptions.find((s) => s.locationId === activeLocationId && s.enabled);
  const isTempTriggered =
    currentSub && weather && weather.current.temperature >= currentSub.tempThreshold;
  const isApparentTriggered =
    currentSub && weather && weather.current.apparentTemperature >= currentSub.apparentTempThreshold;
  const isRainTriggered =
    currentSub &&
    weather &&
    weather.daily[0] &&
    weather.daily[0].precipitationSum >= currentSub.rainThresholdMm;
  const hasTriggeredAlert = isTempTriggered || isApparentTriggered || isRainTriggered;

  const tailoredChecklist = checklist.filter((item) => {
    if (!item.relevantGroups || item.relevantGroups.length === 0) return true;
    return item.relevantGroups.some((g) => householdProfile.vulnerableGroups.includes(g));
  });

  const completedCount = tailoredChecklist.filter((c) => c.isCompleted).length;
  const pendingTasks = tailoredChecklist.filter((c) => !c.isCompleted);

  const handleReadSummary = () => {
    if (!onReadGuidance || !weather) return;
    const text = `ClimateReady resilience briefing for ${weather.locationName}. Current temperature is ${weather.current.temperature} degrees Celsius, with an apparent temperature of ${weather.current.apparentTemperature} degrees. Heat risk score is ${weather.heatRiskScore} out of 100, and flood risk score is ${weather.floodRiskScore} out of 100. Your Climate Readiness Score is ${assessmentData.score || preparednessScore} percent. Remember, completion does not equal disaster probability. In an emergency, dial 112.`;
    onReadGuidance(text);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Banner: "Prepare Today. Stay Safer Tomorrow." */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/50 border border-emerald-850 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Hyper-Local Climate Intelligence
            </span>
            <span className="text-xs text-slate-400">Data Source: Open-Meteo &amp; IMD Standards</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Prepare Today. Stay Safer Tomorrow.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time heatwave and monsoon flood risk monitoring for <strong>{activeLocation.name}</strong>. Transform meteorological forecasts into actionable, life-preserving household safety steps.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAssessment}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-slate-950" />
              <span>Check My Climate Readiness</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenTwin}
              className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-emerald-300 border border-emerald-700/60 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Launch Climate Twin Simulator</span>
            </button>
          </div>
        </div>

        {/* Quick Weather Snapshot Pill */}
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-xl space-y-3 min-w-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{activeLocation.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              Live Feed
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{weather?.current.temperature ?? 34}°C</span>
            <span className="text-xs text-rose-400 font-semibold">
              Feels {weather?.current.apparentTemperature ?? 39}°C
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Humidity: {weather?.current.relativeHumidity ?? 62}%</span>
            </div>
            <div className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-teal-400" />
              <span>Rain: {weather?.daily[0]?.precipitationSum ?? 0}mm</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
            <span>{weather?.isCached ? 'Cached data' : 'Verified Open-Meteo'}</span>
            <button
              type="button"
              onClick={onRefreshWeather}
              disabled={isLoadingWeather}
              className="hover:text-teal-300 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingWeather ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature 9: Active Threshold Alert Banner */}
      {hasTriggeredAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-red-950/60 to-rose-950/70 border border-rose-800/80 shadow-lg flex items-start gap-3.5 text-rose-200 animate-fadeIn">
          <Bell className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2">
              <strong className="text-white text-sm">User-Set Threshold Alert Active</strong>
              <span className="text-[10px] px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase">
                User threshold (Not official warning)
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-rose-100">
              Live forecast has crossed your configured threshold:{' '}
              {isTempTriggered && <span>Air Temp &ge; {currentSub?.tempThreshold}°C. </span>}
              {isApparentTriggered && <span>Heat Index &ge; {currentSub?.apparentTempThreshold}°C. </span>}
              {isRainTriggered && <span>Rain &ge; {currentSub?.rainThresholdMm} mm. </span>}
              Hydrate immediately and prepare backup flashlights.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAlerts}
            className="text-xs text-rose-300 underline font-medium hover:text-white shrink-0"
          >
            Adjust
          </button>
        </div>
      )}

      {/* 3 Core Climate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Heat Risk Status */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Heat Risk Status
            </span>
            <Sun className="w-5 h-5 text-amber-400" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {weather?.heatRiskScore ?? 65}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold">
              {(weather?.heatRiskScore ?? 65) > 70 ? 'Severe Heat Strain' : 'Moderate Caution'}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${weather?.heatRiskScore ?? 65}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Calculated from max air temp ({weather?.current.temperature ?? 34}°C) and apparent humidity index.
          </p>
        </div>

        {/* Flood Risk Status */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Flood Risk Status
            </span>
            <CloudRain className="w-5 h-5 text-sky-400" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {weather?.floodRiskScore ?? 35}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <span className="text-xs text-sky-400 font-semibold">
              {(weather?.floodRiskScore ?? 35) > 60 ? 'High Inundation Risk' : 'Low to Moderate'}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${weather?.floodRiskScore ?? 35}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Based on 24h rain ({weather?.daily[0]?.precipitationSum ?? 0} mm) and coastal drainage slope.
          </p>
        </div>

        {/* Climate Readiness Score Card (Transparent Formula) */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-lg space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Climate Readiness Score
            </span>
            <button
              type="button"
              onClick={() => setShowCalculationInfo(!showCalculationInfo)}
              className="text-slate-400 hover:text-teal-300"
              title="How is this score calculated?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">
                {assessmentData.score || preparednessScore}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <button
              type="button"
              onClick={onOpenAssessment}
              className="text-xs text-teal-400 hover:underline font-semibold"
            >
              Retake Audit →
            </button>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${assessmentData.score || preparednessScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Based on 7-dimension household audit (drinking water, emergency contacts, medical kits, shade).
          </p>

          {/* Calculation Info Popover */}
          {showCalculationInfo && (
            <div className="absolute top-12 right-2 left-2 z-20 bg-slate-900 border border-slate-700 p-3.5 rounded-xl text-xs text-slate-300 shadow-2xl space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs">Transparent Calculation Formula</strong>
                <button
                  type="button"
                  onClick={() => setShowCalculationInfo(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] leading-relaxed">
                Score (0–100) = Drinking Water (15) + Helplines Card (15) + First Aid Kit (15) + Passive Shade (15) + Evacuation Route (15) + Go-Bag (15) + IMD Alerts (10).
              </p>
              <div className="p-2 bg-amber-950/60 rounded text-[10px] text-amber-200">
                * Note: High preparedness indicates thorough personal diligence, not immunity against catastrophic disasters.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Location Context Map + Preparedness Action Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Location Context Map with Satellite & Leaflet */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white text-sm">Location Observation Map</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeLocation.lat.toFixed(2)}°N, {activeLocation.lon.toFixed(2)}°E
              </span>
            </div>

            {/* Context Map */}
            <MapProvider
              lat={activeLocation.lat}
              lon={activeLocation.lon}
              locationName={activeLocation.name}
              zoom={11}
              height="250px"
              showProviderSwitch={true}
            />

            {/* Emergency Numbers Quick Strip */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-850 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Unified Emergency</span>
                <a href="tel:112" className="font-mono font-bold text-teal-400 hover:underline">112</a>
              </div>
              <div className="p-2 bg-slate-850 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Ambulance</span>
                <a href="tel:108" className="font-mono font-bold text-sky-400 hover:underline">108</a>
              </div>
              <div className="p-2 bg-slate-850 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Disaster NDMA</span>
                <a href="tel:1070" className="font-mono font-bold text-amber-400 hover:underline">1070</a>
              </div>
            </div>
          </div>

          {/* Household Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Household Vulnerabilities ({householdProfile.membersCount} Members)
                </h4>
              </div>
              <button
                type="button"
                onClick={onOpenProfile}
                className="text-xs text-teal-400 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {householdProfile.vulnerableGroups.map((g) => (
                <span
                  key={g}
                  className="text-xs px-2.5 py-1 rounded-lg bg-teal-950/60 border border-teal-800/80 text-teal-200 font-medium capitalize"
                >
                  {g.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Preparedness Summary & Actionable Tasks */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Preparedness Action Center</h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              {completedCount} Completed • {pendingTasks.length} Pending
            </span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {tailoredChecklist.slice(0, 6).map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  item.isCompleted
                    ? 'bg-slate-850/50 border-slate-800 opacity-60'
                    : 'bg-slate-850 border-slate-700/80 hover:border-emerald-500/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => onToggleChecklistItem(item.id)}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm font-semibold ${item.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                      {item.title}
                    </span>
                    {item.priority === 'high' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-900 font-bold uppercase">
                        High
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={onOpenChecklistGen}
              className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-between transition-colors"
            >
              <span>Smart Generator</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={onOpenFamilyPlan}
              className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-between transition-colors"
            >
              <span>Family Contacts</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={onOpenCalendar}
              className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-between transition-colors"
            >
              <span>7-Day .ICS Plan</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

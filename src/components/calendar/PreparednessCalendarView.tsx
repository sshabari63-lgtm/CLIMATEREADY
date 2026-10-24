import React from 'react';
import {
  Calendar as CalendarIcon,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sun,
  CloudRain,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { DailyForecastItem, ChecklistItem } from '../../types';
import { generateICS, downloadICS } from '../../utils/icsExport';

interface PreparednessCalendarViewProps {
  daily: DailyForecastItem[];
  locationName: string;
  checklist: ChecklistItem[];
  onToggleChecklistItem: (id: string) => void;
  onRecordStreak: () => void;
}

export const PreparednessCalendarView: React.FC<PreparednessCalendarViewProps> = ({
  daily,
  locationName,
  checklist,
  onToggleChecklistItem,
  onRecordStreak,
}) => {
  const handleExportICS = () => {
    const icsContent = generateICS(locationName, daily, checklist);
    const filename = `ClimateReady_${locationName.replace(/\s+/g, '_')}_7DayPlan.ics`;
    downloadICS(filename, icsContent);
    onRecordStreak();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">7-Day Preparedness Calendar</h2>
              <p className="text-xs text-slate-400">
                Synchronizing live Open-Meteo forecasts with actionable household tasks for {locationName}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportICS}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export .ics Calendar</span>
        </button>
      </div>

      {/* Daily Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daily.slice(0, 7).map((day, idx) => {
          // Identify hazards
          const isHighHeat = day.maxTemp >= 38 || day.apparentTempMax >= 42;
          const isHighRain = day.precipitationSum >= 25;

          // Date string formatting
          const dateObj = new Date();
          dateObj.setDate(dateObj.getDate() + idx);
          const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
          const dateFormatted = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

          // Pick associated tasks
          let recommendedTask = 'Daily hydration check and emergency radio test.';
          let urgencyClass = 'text-teal-400 border-teal-800/60 bg-teal-950/30';
          if (isHighHeat) {
            recommendedTask = 'Heat Precaution: Stock 5L drinking water per person and prepare ORS electrolytes.';
            urgencyClass = 'text-rose-400 border-rose-800/60 bg-rose-950/30';
          } else if (isHighRain) {
            recommendedTask = 'Flood Precaution: Clear rooftop drains, elevate ground-floor electronics, charge powerbanks.';
            urgencyClass = 'text-sky-400 border-sky-800/60 bg-sky-950/30';
          }

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Day title & weather badge */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400">{weekday}</span>
                  <h4 className="text-base font-bold text-white">{dateFormatted}</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  {day.maxTemp >= 36 ? (
                    <Sun className="w-5 h-5 text-amber-400" />
                  ) : day.precipitationSum > 5 ? (
                    <CloudRain className="w-5 h-5 text-sky-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Weather Stats */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    Max / Feels:
                  </span>
                  <p className="font-semibold text-white mt-0.5">
                    {day.maxTemp}°C <span className="text-slate-400 font-normal">({day.apparentTempMax}°C)</span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    Rain Total:
                  </span>
                  <p className="font-semibold text-white mt-0.5">
                    {day.precipitationSum} mm{' '}
                    <span className="text-slate-400 font-normal">({day.precipitationProbability}%)</span>
                  </p>
                </div>
              </div>

              {/* Action task */}
              <div className={`p-3 rounded-xl border text-xs leading-relaxed ${urgencyClass}`}>
                <div className="font-semibold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recommended Action</span>
                </div>
                <p className="text-slate-200">{recommendedTask}</p>
              </div>

              {/* Risk metrics mini-pill */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Heat Risk: <strong className={day.heatRiskScore > 60 ? 'text-rose-400' : 'text-slate-300'}>{day.heatRiskScore}/100</strong></span>
                <span>Flood Risk: <strong className={day.floodRiskScore > 60 ? 'text-sky-400' : 'text-slate-300'}>{day.floodRiskScore}/100</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

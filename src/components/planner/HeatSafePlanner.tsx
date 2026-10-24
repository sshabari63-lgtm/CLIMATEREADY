import React from 'react';
import { Sun, AlertTriangle, Clock, ShieldCheck, Thermometer, Droplets, Volume2 } from 'lucide-react';
import { HourlyForecastItem } from '../../types';

interface HeatSafePlannerProps {
  hourly: HourlyForecastItem[];
  locationName: string;
  onReadSchedule?: (text: string) => void;
}

export const HeatSafePlanner: React.FC<HeatSafePlannerProps> = ({
  hourly,
  locationName,
  onReadSchedule,
}) => {
  // Sort or identify peak hours
  const highestApparentHour = hourly.reduce(
    (max, cur) => (cur.apparentTemperature > max.apparentTemperature ? cur : max),
    hourly[0] || { apparentTemperature: 0, time: '' }
  );

  const getBadgeStyle = (category: HourlyForecastItem['heatCategory']) => {
    switch (category) {
      case 'extreme_danger':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'danger':
        return 'bg-red-950/80 text-red-300 border-red-800';
      case 'extreme_caution':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'caution':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-800';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    }
  };

  const getCategoryLabel = (category: HourlyForecastItem['heatCategory']) => {
    switch (category) {
      case 'extreme_danger':
        return 'Extreme Heat Risk';
      case 'danger':
        return 'High Heat Strain';
      case 'extreme_caution':
        return 'Caution: Warm & Humid';
      case 'caution':
        return 'Moderate Thermal Load';
      default:
        return 'Safe Thermal Window';
    }
  };

  const handleReadAloud = () => {
    if (!onReadSchedule) return;
    const peakTimeStr = highestApparentHour.time.includes('T')
      ? highestApparentHour.time.split('T')[1].slice(0, 5)
      : highestApparentHour.time;
    const text = `Heat safe planner for ${locationName}. Peak feels-like temperature reaches ${highestApparentHour.apparentTemperature} degrees Celsius around ${peakTimeStr}. Outdoor exertion should be scheduled before 9 AM or after 5 PM. Stay hydrated and avoid direct sunlight during midday.`;
    onReadSchedule(text);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white">Heat-Safe Time Planner (Feature 17)</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
              Hourly Forecast
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly apparent temperature progression for {locationName}
          </p>
        </div>

        {onReadSchedule && (
          <button
            type="button"
            onClick={handleReadAloud}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read Schedule Aloud</span>
          </button>
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3 bg-amber-950/40 border border-amber-900/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Advisory Notice:</strong> The heat windows below are <em>relative to today's Open-Meteo forecast</em> and are intended for planning household errands and hydration breaks. <strong>This is not a medical guarantee of safety.</strong> Anyone experiencing dizziness, dry mouth, or nausea should move to shade and hydrate immediately.
        </div>
      </div>

      {/* Peak Danger Banner */}
      {highestApparentHour.apparentTemperature > 36 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/60 to-red-950/40 border border-rose-800/80 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2.5">
            <Thermometer className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-semibold text-white">Peak Thermal Stress Expected:</span>
              <p className="text-rose-300 text-[11px] mt-0.5">
                Maximum apparent temperature of <strong>{highestApparentHour.apparentTemperature}°C</strong> at{' '}
                {highestApparentHour.time.includes('T')
                  ? highestApparentHour.time.split('T')[1].slice(0, 5)
                  : highestApparentHour.time}
                . Limit outdoor labor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {hourly.slice(0, 12).map((item, index) => {
          const timeLabel = item.time.includes('T') ? item.time.split('T')[1].slice(0, 5) : item.time;
          const badgeClass = getBadgeStyle(item.heatCategory);
          const categoryLabel = getCategoryLabel(item.heatCategory);

          return (
            <div
              key={index}
              className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono font-medium text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {timeLabel}
                </span>
                <span className="text-[10px] text-slate-500">H+{index + 1}</span>
              </div>

              <div className="my-2.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">{item.temperature}°C</span>
                  <span className="text-xs text-slate-400">
                    (Feels {item.apparentTemperature}°C)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-0.5">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    {item.relativeHumidity}%
                  </span>
                  {item.precipitation > 0 && (
                    <span className="text-sky-300 font-medium">
                      {item.precipitation} mm
                    </span>
                  )}
                </div>
              </div>

              <div className={`px-2 py-1 rounded-md text-[10px] font-medium border text-center ${badgeClass}`}>
                {categoryLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

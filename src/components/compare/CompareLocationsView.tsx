import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Thermometer,
  CloudRain,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
} from 'lucide-react';
import { SavedLocation, WeatherData } from '../../types';
import { fetchWeatherForecast } from '../../services/weatherService';

interface CompareLocationsViewProps {
  locations: SavedLocation[];
  activeLocationId: string;
  onSelectLocation: (id: string) => void;
  preparednessScore: number;
}

export const CompareLocationsView: React.FC<CompareLocationsViewProps> = ({
  locations,
  activeLocationId,
  onSelectLocation,
  preparednessScore,
}) => {
  const [comparisonData, setComparisonData] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      setLoading(true);
      const results: Record<string, WeatherData> = {};
      for (const loc of locations) {
        try {
          const w = await fetchWeatherForecast(loc.id, loc.name, loc.lat, loc.lon);
          results[loc.id] = w;
        } catch {
          // ignore individual fails
        }
      }
      if (isMounted) {
        setComparisonData(results);
        setLoading(false);
      }
    };
    loadAll();
    return () => {
      isMounted = false;
    };
  }, [locations]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compare Saved Locations (Feature 13)</h2>
              <p className="text-xs text-slate-400">
                Side-by-side meteorological metrics, risk scoring, and data completeness auditing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-teal-400 flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Updating multi-location telemetry...
            </span>
          )}
        </div>
      </div>

      {/* Critical Data Completeness Notice */}
      <div className="p-4 bg-amber-950/40 border border-amber-900/50 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Data Completeness Rule:</strong> Note the <strong>Data Completeness Column</strong> below. When a location has partial or cached telemetry (e.g. 60%), <em>missing data must NEVER be interpreted as low risk</em>. A low risk score with low completeness requires ground verification.
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-850 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Air Temp &amp; Feels Like</th>
                <th className="py-3.5 px-4 font-semibold">Rainfall (Next 24h)</th>
                <th className="py-3.5 px-4 font-semibold">Heat Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Flood Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Preparedness</th>
                <th className="py-3.5 px-4 font-semibold">Data Completeness</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {locations.map((loc) => {
                const weather = comparisonData[loc.id];
                const isSelected = loc.id === activeLocationId;
                const completeness = weather ? weather.completeness : 0;

                return (
                  <tr
                    key={loc.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-teal-950/30' : ''
                    }`}
                  >
                    {/* Location Name */}
                    <td className="py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span>{loc.name}</span>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-normal">{loc.region}</span>
                    </td>

                    {/* Temp */}
                    <td className="py-4 px-4">
                      {weather ? (
                        <div>
                          <span className="font-semibold text-white">
                            {weather.current.temperature}°C
                          </span>
                          <span className="text-xs text-slate-400 ml-1">
                            (Feels {weather.current.apparentTemperature}°C)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Loading...</span>
                      )}
                    </td>

                    {/* Rain */}
                    <td className="py-4 px-4">
                      {weather ? (
                        <div className="flex items-center gap-1.5">
                          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                          <span className="font-medium">
                            {weather.daily[0]?.precipitationSum ?? 0} mm
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Heat Risk Score */}
                    <td className="py-4 px-4">
                      {weather ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              weather.heatRiskScore > 70
                                ? 'bg-rose-500'
                                : weather.heatRiskScore > 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="font-bold text-white">{weather.heatRiskScore}/100</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Flood Risk Score */}
                    <td className="py-4 px-4">
                      {weather ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              weather.floodRiskScore > 70
                                ? 'bg-sky-500'
                                : weather.floodRiskScore > 40
                                ? 'bg-cyan-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="font-bold text-white">{weather.floodRiskScore}/100</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Preparedness */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>{preparednessScore}%</span>
                      </div>
                    </td>

                    {/* Data Completeness */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`font-semibold ${
                              completeness >= 90
                                ? 'text-emerald-400'
                                : completeness >= 70
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {completeness}%
                          </span>
                          {completeness < 80 && (
                            <span className="text-[10px] text-rose-300 font-medium bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-900">
                              Partial data
                            </span>
                          )}
                        </div>
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              completeness >= 90
                                ? 'bg-emerald-500'
                                : completeness >= 70
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${completeness}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectLocation(loc.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-teal-600 hover:bg-teal-500 text-white'
                        }`}
                        disabled={isSelected}
                      >
                        {isSelected ? 'Selected' : 'Set Active'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

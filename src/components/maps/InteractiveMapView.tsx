import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Building2,
  AlertTriangle,
  Sparkles,
  Shield,
  Layers,
  Info,
  Loader2,
} from 'lucide-react';
import { MapProvider } from './MapProvider';
import { SavedLocation, CommunityReport } from '../../types';

interface InteractiveMapViewProps {
  location: SavedLocation;
  reports: CommunityReport[];
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  location,
  reports,
}) => {
  const [nearbyGuidance, setNearbyGuidance] = useState<any>(null);
  const [loadingGuidance, setLoadingGuidance] = useState(false);

  const fetchNearbyFacilities = async () => {
    setLoadingGuidance(true);
    try {
      const res = await fetch(
        `/api/places/nearby-guidance?lat=${location.lat}&lon=${location.lon}&locationName=${encodeURIComponent(
          location.name
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setNearbyGuidance(data);
      }
    } catch (e) {
      console.warn('Failed to fetch nearby guidance:', e);
    } finally {
      setLoadingGuidance(false);
    }
  };

  // Convert approved community reports into map markers
  const markers = reports
    .filter((r) => r.status === 'approved')
    .map((r) => ({
      lat: r.lat,
      lon: r.lon,
      title: `${r.locationName} (${r.type.replace('_', ' ')})`,
      description: `${r.description} [User-reported, unverified]`,
      type: 'report' as const,
    }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Interactive Resilience Map</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                  OpenStreetMap | Google Maps (Beta)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Viewing {location.name} ({location.lat.toFixed(4)}° N, {location.lon.toFixed(4)}° E)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchNearbyFacilities}
          disabled={loadingGuidance}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
        >
          {loadingGuidance ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Identify Nearby Public Facilities (AI Grounding)</span>
        </button>
      </div>

      {/* Main Map Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <MapProvider
          lat={location.lat}
          lon={location.lon}
          locationName={location.name}
          zoom={13}
          markers={markers}
          height="480px"
          showProviderSwitch={true}
        />

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-500 inline-block"></span>
            <span>Primary Active Location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>Moderated Community Incident Pins ({markers.length} active)</span>
          </div>
          <div className="text-[11px] text-slate-500 ml-auto">
            Switch provider via top-right selector • Automatic Leaflet fallback active
          </div>
        </div>
      </div>

      {/* Optional Gemini & Maps Grounding Nearby Guidance Result */}
      {nearbyGuidance && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">Nearby Public Facilities &amp; Civil Context</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
              {nearbyGuidance.source}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {nearbyGuidance.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nearbyGuidance.facilities?.map((f: any, i: number) => (
              <div key={i} className="p-3.5 bg-slate-850 rounded-xl border border-slate-700/80 space-y-1">
                <span className="font-semibold text-white text-xs block">{f.type}</span>
                <p className="text-xs text-slate-400 leading-snug">{f.advice}</p>
              </div>
            ))}
          </div>

          {/* Mandatory Grounding Disclaimer */}
          <div className="p-3 bg-amber-950/40 border border-amber-900/50 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-semibold">Regulatory Notice:</strong>{' '}
              {nearbyGuidance.disclaimer ||
                'AI-generated from Google Maps data, verify before relying on it. Do not present anything as an official shelter, safe zone, evacuation route, or flood boundary.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

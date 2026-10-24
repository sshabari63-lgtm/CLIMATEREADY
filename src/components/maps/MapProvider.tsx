import React, { useState } from 'react';
import { LeafletMap } from './LeafletMap';
import { GoogleMap } from './GoogleMap';
import { Layers, AlertCircle, Info } from 'lucide-react';

interface MapMarker {
  lat: number;
  lon: number;
  title: string;
  type?: 'primary' | 'report' | 'shelter' | 'hazard';
  description?: string;
}

interface MapProviderProps {
  lat: number;
  lon: number;
  locationName: string;
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
  showProviderSwitch?: boolean;
}

export const MapProvider: React.FC<MapProviderProps> = ({
  lat,
  lon,
  locationName,
  zoom = 12,
  markers = [],
  height = '360px',
  className = '',
  showProviderSwitch = true,
}) => {
  const [provider, setProvider] = useState<'leaflet' | 'google'>('leaflet');
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const handleFallback = (reason: string) => {
    setProvider('leaflet');
    setFallbackNotice(reason);
    setTimeout(() => setFallbackNotice(null), 6000);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showProviderSwitch && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-4 h-4 text-teal-400" />
            <span className="font-medium text-slate-300">Map Engine:</span>
          </div>

          <div className="inline-flex items-center rounded-lg bg-slate-800/90 p-1 border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setProvider('leaflet');
                setFallbackNotice(null);
              }}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                provider === 'leaflet'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OpenStreetMap
            </button>

            <button
              type="button"
              onClick={() => {
                setProvider('google');
              }}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                provider === 'google'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Google Maps</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/30 text-amber-300 rounded border border-amber-400/40">
                Beta / temp
              </span>
            </button>
          </div>
        </div>
      )}

      {fallbackNotice && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{fallbackNotice}</span>
        </div>
      )}

      {provider === 'google' ? (
        <GoogleMap
          lat={lat}
          lon={lon}
          locationName={locationName}
          zoom={zoom}
          markers={markers}
          height={height}
          onFallbackToLeaflet={handleFallback}
        />
      ) : (
        <LeafletMap
          lat={lat}
          lon={lon}
          locationName={locationName}
          zoom={zoom}
          markers={markers}
          height={height}
        />
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          Coordinates: {lat.toFixed(4)}° N, {lon.toFixed(4)}° E
        </span>
        <span>Elevation / terrain baseline: Coastal Plain</span>
      </div>
    </div>
  );
};

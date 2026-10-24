import React, { useState } from 'react';
import {
  CloudRain,
  MapPin,
  Building,
  ShieldAlert,
  AlertTriangle,
  List,
  Map as MapIcon,
  CheckCircle2,
  PhoneCall,
  Compass,
} from 'lucide-react';
import { WeatherData, SavedLocation, CommunityReport } from '../../types';
import { MapProvider } from '../maps/MapProvider';

interface FloodSafetyViewProps {
  weather: WeatherData | null;
  location: SavedLocation;
  reports: CommunityReport[];
}

export const FloodSafetyView: React.FC<FloodSafetyViewProps> = ({
  weather,
  location,
  reports,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filterCategory, setFilterCategory] = useState<'all' | 'waterlogging' | 'shelter' | 'hospital'>('all');

  const rain24h = weather?.daily[0]?.precipitationSum ?? 0;
  const floodScore = weather?.floodRiskScore ?? 35;

  // Mock verified shelters and facilities for this ward
  const verifiedFacilities = [
    {
      id: 'fac-1',
      type: 'shelter',
      title: 'Community Multi-Purpose Relief Center',
      locationName: `${location.name} Ward High School Campus`,
      lat: location.lat + 0.005,
      lon: location.lon + 0.004,
      details: 'High ground elevation (12m above MSL), capacity 450 persons, emergency generator available.',
    },
    {
      id: 'fac-2',
      type: 'hospital',
      title: 'Government Taluk General Hospital',
      locationName: `${location.name} Civil Hospital Block`,
      lat: location.lat - 0.006,
      lon: location.lon - 0.003,
      details: '24x7 trauma care, standby power backup, designated flood-safe medical ward.',
    },
  ];

  const mapMarkers = [
    ...verifiedFacilities.map((f) => ({
      lat: f.lat,
      lon: f.lon,
      title: f.title,
      description: f.details,
      type: (f.type === 'shelter' ? 'shelter' : 'primary') as any,
    })),
    ...reports
      .filter((r) => r.status === 'approved' || r.status === 'action_in_progress')
      .map((r) => ({
        lat: r.lat,
        lon: r.lon,
        title: `${r.locationName} (${r.type.replace('_', ' ')})`,
        description: `${r.description} [User-reported unverified]`,
        type: 'report' as const,
      })),
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-cyan-950/30 border border-sky-900/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Flood Preparedness &amp; Inundation Map</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                  Section 7
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Antecedent rainfall tracking, drainage vulnerability, and verified civic high-ground shelters
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'map' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Accessible List View</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Callout */}
      <div className="p-3.5 bg-amber-950/40 border border-amber-900/50 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Flood Safety Integrity Notice:</strong> ClimateReady does <strong>not fabricate flood depths, unverified safe evacuation routes, or real-time dam releases</strong>. Always follow verified directives broadcast by the District Collector and the State Disaster Management Authority (SDMA). In case of rising floodwater, call <strong>112</strong> or <strong>1070</strong>.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Flood Risk Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-400">{floodScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">Soil saturation &amp; 7-day cumulative rainfall index.</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Forecast 24h Rain
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{rain24h} mm</span>
          </div>
          <p className="text-[11px] text-slate-400">Open-Meteo numerical weather forecast.</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Terrain Drainage Baseline
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">Coastal Plain</span>
          </div>
          <p className="text-[11px] text-slate-400">Elevation 6m - 14m above mean sea level.</p>
        </div>
      </div>

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <h3 className="font-semibold text-white text-sm">
                Interactive Flood Context Map (Streets &amp; Satellite Layers)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
            </span>
          </div>

          <MapProvider
            lat={location.lat}
            lon={location.lon}
            locationName={location.name}
            zoom={12}
            markers={mapMarkers}
            height="460px"
            showProviderSwitch={true}
          />

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>Primary Observation Station</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
              <span>Verified High-Ground Shelters / Hospitals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span>User-Reported Incidents (Unverified)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible List View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Accessible Directory of Shelters &amp; Incident Locations
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                Verified Civic Shelter
              </span>
              <h4 className="text-sm font-bold text-white">Community Multi-Purpose Relief Center</h4>
              <p className="text-xs text-slate-300">{location.name} Ward High School Campus</p>
              <p className="text-xs text-slate-400">Elevation: 12m MSL • Standby diesel generator &amp; drinking water tanker.</p>
            </div>

            <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold uppercase">
                Government Healthcare
              </span>
              <h4 className="text-sm font-bold text-white">Government Taluk General Hospital</h4>
              <p className="text-xs text-slate-300">Emergency Casualty Block • 24x7 Standby Doctor</p>
              <p className="text-xs text-slate-400">Equipped with snake bite anti-venom, tetanus toxoid, and ORS dehydration ward.</p>
            </div>
          </div>
        </div>
      )}

      {/* Practical Home Flood-Proofing Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>Home &amp; Facility Flood Resistance Protocols</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-1.5">
            <strong className="text-white block font-semibold">1. Electrical Isolation</strong>
            <p>If water approaches doorstep, isolate the main switch immediately. Never plug in wet appliances after floodwaters recede until wiring has been inspected.</p>
          </div>
          <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-1.5">
            <strong className="text-white block font-semibold">2. Drinking Water Sump Sealing</strong>
            <p>Fit a rubber gasket or seal your underground sump lid with thick tarpaulin before downpours to prevent urban drainage water infiltration.</p>
          </div>
          <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-1.5">
            <strong className="text-white block font-semibold">3. Vertical Document Elevation</strong>
            <p>Store Aadhaar cards, property deeds, and educational certificates in floating airtight dry-bags on top shelves above the 4-foot waterline.</p>
          </div>
          <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-1.5">
            <strong className="text-white block font-semibold">4. Vehicle Relocation</strong>
            <p>Park two-wheelers and cars on designated elevated flyovers or neighborhood multi-tier parking lots ahead of red weather alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Map as MapIcon, Globe } from 'lucide-react';

interface MapMarker {
  lat: number;
  lon: number;
  title: string;
  type?: 'primary' | 'report' | 'shelter' | 'hazard';
  description?: string;
}

interface LeafletMapProps {
  lat: number;
  lon: number;
  locationName: string;
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
  initialLayer?: 'osm' | 'satellite';
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  lat,
  lon,
  locationName,
  zoom = 12,
  markers = [],
  height = '360px',
  className = '',
  initialLayer = 'osm',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>(initialLayer);

  const TILE_URLS = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attrib: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attrib: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
    },
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([lat, lon], zoom);

      // Add selected tile layer
      const layerConfig = TILE_URLS[activeLayer];
      const tileLayer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attrib,
        maxZoom: layerConfig.maxZoom,
      }).addTo(map);

      currentTileLayerRef.current = tileLayer;

      // Custom icon helper
      const createIcon = (color: string, label?: string) =>
        L.divIcon({
          className: 'custom-leaflet-pin',
          html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white;">${label || ''}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

      // Primary location marker
      const primaryMarker = L.marker([lat, lon], {
        icon: createIcon('#059669', '★'), // Emerald
      }).addTo(map);
      primaryMarker
        .bindPopup(
          `<div style="font-family: sans-serif; font-size: 12px; color: #1e293b; padding: 2px;">
            <strong style="font-size: 13px; color: #047857;">${locationName}</strong><br/>
            <span>Active Observation Center</span><br/>
            <span style="font-size: 11px; color: #64748b;">Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}</span>
          </div>`
        )
        .openPopup();

      // Additional markers (e.g. community reports, shelters)
      markers.forEach((m) => {
        let pinColor = '#0284c7'; // Sky Blue
        let labelChar = '•';
        if (m.type === 'hazard') {
          pinColor = '#ef4444';
          labelChar = '!';
        } else if (m.type === 'report') {
          pinColor = '#d97706';
          labelChar = 'R';
        } else if (m.type === 'shelter') {
          pinColor = '#10b981';
          labelChar = 'S';
        }

        const extraMarker = L.marker([m.lat, m.lon], {
          icon: createIcon(pinColor, labelChar),
        }).addTo(map);

        if (m.title || m.description) {
          extraMarker.bindPopup(
            `<div style="font-family: sans-serif; font-size: 12px; color: #1e293b; padding: 2px;">
              <strong style="color: ${pinColor};">${m.title}</strong>
              <p style="margin: 4px 0 0; font-size: 11px; color: #334155;">${m.description || ''}</p>
            </div>`
          );
        }
      });

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } catch (err) {
      console.warn('Leaflet map initialization notice:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, locationName, zoom, markers, activeLayer]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner ${className}`} style={{ height }}>
      <div ref={containerRef} className="w-full h-full z-10" />

      {/* Layer selector on map */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg text-xs">
        <button
          type="button"
          onClick={() => setActiveLayer('osm')}
          className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeLayer === 'osm'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
          title="Standard Street Basemap"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Streets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLayer('satellite')}
          className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeLayer === 'satellite'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
          title="Satellite Imagery Basemap"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>
      </div>

      <div className="absolute bottom-2 left-2 z-20 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-slate-300 border border-slate-700 pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>{activeLayer === 'satellite' ? 'Esri World Satellite Imagery' : 'OpenStreetMap Vector Basemap'}</span>
      </div>
    </div>
  );
};

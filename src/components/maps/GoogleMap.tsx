import React, { useEffect, useRef, useState } from 'react';

interface MapMarker {
  lat: number;
  lon: number;
  title: string;
  type?: 'primary' | 'report' | 'shelter' | 'hazard';
  description?: string;
}

interface GoogleMapProps {
  lat: number;
  lon: number;
  locationName: string;
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
  onFallbackToLeaflet: (reason: string) => void;
}

declare global {
  interface Window {
    google?: any;
    initGoogleMapsCallback?: () => void;
  }
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  lat,
  lon,
  locationName,
  zoom = 12,
  markers = [],
  height = '350px',
  className = '',
  onFallbackToLeaflet,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      const msg = 'No Google Maps API Key provided in environment. Falling back to OpenStreetMap.';
      setLoadError(msg);
      onFallbackToLeaflet(msg);
      return;
    }

    const renderMap = () => {
      if (!containerRef.current || !window.google?.maps) return;

      try {
        const center = { lat, lng: lon };
        const map = new window.google.maps.Map(containerRef.current, {
          center,
          zoom,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Primary marker
        const primaryMarker = new window.google.maps.Marker({
          position: center,
          map,
          title: locationName,
          animation: window.google.maps.Animation.DROP,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color: #1e293b; padding: 4px;"><strong>${locationName}</strong><br/>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}</div>`,
        });
        infoWindow.open(map, primaryMarker);

        // Additional markers
        markers.forEach((m) => {
          const marker = new window.google.maps.Marker({
            position: { lat: m.lat, lng: m.lon },
            map,
            title: m.title,
          });
          const extraInfo = new window.google.maps.InfoWindow({
            content: `<div style="color: #1e293b; padding: 4px;"><strong>${m.title}</strong><p style="margin: 4px 0 0; font-size: 12px;">${m.description || ''}</p></div>`,
          });
          marker.addListener('click', () => {
            extraInfo.open(map, marker);
          });
        });
      } catch (err: any) {
        console.error('Google Maps init error:', err);
        const errNotice = 'Google Maps initialization failed. Switched to OpenStreetMap.';
        setLoadError(errNotice);
        onFallbackToLeaflet(errNotice);
      }
    };

    if (window.google?.maps) {
      renderMap();
    } else {
      // Inject script
      const scriptId = 'google-maps-script';
      let existingScript = document.getElementById(scriptId) as HTMLScriptElement;

      if (!existingScript) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          const errNotice = 'Google Maps script failed to load (check key/network). Switched to Leaflet.';
          setLoadError(errNotice);
          onFallbackToLeaflet(errNotice);
        };

        window.initGoogleMapsCallback = () => {
          renderMap();
        };

        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkInterval);
            renderMap();
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 5000);
      }
    }
  }, [lat, lon, locationName, zoom, markers, onFallbackToLeaflet]);

  if (loadError) {
    return null; // Will trigger parent fallback to Leaflet
  }

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-inner ${className}`} style={{ height }}>
      <div ref={containerRef} className="w-full h-full z-10" />
      <div className="absolute bottom-2 left-2 z-20 bg-amber-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-amber-200 border border-amber-800/80 pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        Google Maps (Beta / Temporary Provider)
      </div>
    </div>
  );
};

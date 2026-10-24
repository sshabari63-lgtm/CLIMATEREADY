# ClimateReady Architecture Documentation

## Overview
ClimateReady is designed with high resilience, privacy-first storage, offline-first capabilities, and swappable mapping providers.

## Mapping Architecture & Google Maps Integration
ClimateReady implements a clean Provider Pattern (`MapProvider.tsx`):
- **Leaflet & OpenStreetMap (Default)**: Free, open-source, requires no API keys, fully functional offline when cached.
- **Google Maps (Temporary / Optional)**:
  - Enabled via feature flag: `VITE_ENABLE_GOOGLE_MAPS=true`
  - Client API key: `VITE_GOOGLE_MAPS_API_KEY`
  - Loaded lazily only when the user selects Google Maps on a map view.
  - Automatic graceful fallback to Leaflet if the key is missing, invalid, or quota is exceeded.

### How to Disable Google Maps
1. In `.env` (or environment variables), set `VITE_ENABLE_GOOGLE_MAPS=false`.
2. Or toggle off the "Google Maps Provider" flag in the **Admin Dashboard** (`/admin`).
3. To permanently remove Google Maps code, remove `src/components/maps/GoogleMap.tsx` and leave `LeafletMap.tsx` as the single map rendering engine.

### Terms & Billing Considerations
- The Google Maps JavaScript API is subject to Google Cloud Platform Terms of Service and pricing ($7.00 per 1,000 requests after the monthly free tier).
- Restrict your API key in Google Cloud Console:
  - Restrict HTTP referrers to your authorized domain and `localhost`.
  - Restrict API permissions to "Maps JavaScript API" only.
  - Set daily budget alerts and API quota ceilings.
- Grounding calls (`/api/places/nearby-guidance`) run through the backend using Gemini model integrations without exposing backend keys to browser bundles.

## Offline & PWA Strategy
- Service Worker (`/public/sw.js`) intercepts network requests using stale-while-revalidate for static assets and offline guidance pages.
- Assessments and user plans are saved in browser `localStorage`.
- Weather data displayed from cache is explicitly stamped: `"Saved on <timestamp>, may be outdated"`.

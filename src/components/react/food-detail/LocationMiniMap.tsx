'use client';

import { useRef, useEffect, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface Location {
  name: string;
  city: string;
  lat: number;
  lng: number;
  description: string;
  priceRange?: string;
}

interface Props {
  locations: Location[];
  center?: [number, number];
}

export default function LocationMiniMap({ locations, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0 || mapInstance.current) return;

    let cancelled = false;

    async function loadMap() {
      try {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(cssLink);

        const L = await import('leaflet');
        if (cancelled) return;

        const defaultCenter: [number, number] = center || [-2.5, 118.0];

        const map = L.map(mapRef.current!, {
          center: defaultCenter,
          zoom: 4,
          attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        locations.forEach((loc) => {
          const marker = L.marker([loc.lat, loc.lng]).addTo(map);
          marker.bindPopup(`
            <strong>${loc.name}</strong><br/>
            <em>${loc.city}</em><br/>
            ${loc.description}${loc.priceRange ? `<br/><strong>${loc.priceRange}</strong>` : ''}
          `);
        });

        if (locations.length > 0) {
          const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng] as [number, number]));
          map.fitBounds(bounds, { padding: [30, 30] });
        }

        mapInstance.current = map;
        if (!cancelled) setLoaded(true);
      } catch {
        if (!cancelled) setError('Gagal memuat peta');
      }
    }

    loadMap();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [locations, center]);

  if (locations.length === 0) return null;

  return (
    <section className="map-section" aria-label="Tempat mencoba hidangan ini">
      <h2 className="section-title">Tempat Mencoba</h2>
      <div className="map-layout">
        <div className="map-container">
          {!loaded && !error && <div className="map-loading" aria-live="polite">Memuat peta...</div>}
          {error && <div className="map-error" role="alert">{error}</div>}
          <div ref={mapRef} className="leaflet-map" style={{ opacity: loaded ? 1 : 0 }} />
        </div>
        <div className="location-list" role="list" aria-label="Daftar lokasi">
          {locations.map((loc, i) => (
            <div key={i} className="location-card" role="listitem">
              <div className="location-icon" aria-hidden="true">📍</div>
              <div className="location-info">
                <h3 className="location-name">{loc.name}</h3>
                <p className="location-city">{loc.city}</p>
                <p className="location-desc">{loc.description}</p>
                {loc.priceRange && <span className="location-price">{loc.priceRange}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

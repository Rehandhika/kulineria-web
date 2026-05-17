'use client';

import { useRef, useEffect, useState } from 'react';

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
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    let cancelled = false;

    async function loadMap() {
      try {
        // Lazy-load maplibre CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
        document.head.appendChild(cssLink);

        const maplibregl = await import('maplibre-gl');
        if (cancelled) return;

        const defaultCenter: [number, number] = center || [-2.5, 118.0];

        const map = new maplibregl.Map({
          container: mapRef.current!,
          style: 'https://demotiles.maplibre.org/style.json',
          center: defaultCenter,
          zoom: 4,
          attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.AttributionControl({ compact: true }));

        locations.forEach((loc) => {
          const el = document.createElement('div');
          el.className = 'map-marker';
          el.setAttribute('role', 'img');
          el.setAttribute('aria-label', `${loc.name}, ${loc.city}`);
          el.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--c-accent)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>';

          new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(
              new maplibregl.Popup({ offset: 25 }).setHTML(
                `<strong>${loc.name}</strong><br/><em>${loc.city}</em><br/>${loc.description}${loc.priceRange ? `<br/><strong>${loc.priceRange}</strong>` : ''}`
              )
            )
            .addTo(map);
        });

        setLoaded(true);
      } catch {
        if (!cancelled) setError('Gagal memuat peta');
      }
    }

    loadMap();

    return () => { cancelled = true; };
  }, [locations, center]);

  if (locations.length === 0) return null;

  return (
    <section className="map-section" aria-label="Tempat mencoba hidangan ini">
      <h2 className="section-title">Tempat Mencoba</h2>
      <div className="map-layout">
        <div className="map-container">
          {!loaded && !error && <div className="map-loading" aria-live="polite">Memuat peta...</div>}
          {error && <div className="map-error" role="alert">{error}</div>}
          <div ref={mapRef} className="maplibre-map" style={{ opacity: loaded ? 1 : 0 }} />
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
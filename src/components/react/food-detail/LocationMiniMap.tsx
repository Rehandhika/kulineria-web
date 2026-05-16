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
        const maplibregl = await import('maplibre-gl');
        if (cancelled) return;

        const defaultCenter: [number, number] = center || [-2.5, 118.0];

        const map = new maplibregl.Map({
          container: mapRef.current!,
          style: 'https://demotiles.maplibre.org/style.json',
          center: defaultCenter,
          zoom: 4,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        locations.forEach((loc) => {
          const el = document.createElement('div');
          el.className = 'map-marker';
          el.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--c-accent)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>';

          new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(
              new maplibregl.Popup({ offset: 25 }).setHTML(
                `<strong>${loc.name}</strong><br/>${loc.city}<br/>${loc.description}`
              )
            )
            .addTo(map);
        });

        setLoaded(true);
      } catch (e) {
        if (!cancelled) setError('Failed to load map');
      }
    }

    loadMap();

    return () => { cancelled = true; };
  }, [locations, center]);

  if (locations.length === 0) return null;

  return (
    <section className="map-section" aria-label="Where to try this dish">
      <h2 className="section-title">Where to Try</h2>
      <div className="map-layout">
        <div className="map-container">
          {!loaded && !error && <div className="map-loading">Loading map...</div>}
          {error && <div className="map-error">{error}</div>}
          <div ref={mapRef} className="maplibre-map" style={{ opacity: loaded ? 1 : 0 }} />
        </div>

        <div className="location-list">
          {locations.map((loc, i) => (
            <div key={i} className="location-card">
              <div className="location-icon">📍</div>
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
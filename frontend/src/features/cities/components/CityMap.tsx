import { useEffect, useRef } from 'react';
import maplibregl, { type Map, type Marker } from 'maplibre-gl';

import type { City } from '@/types/city';

interface CityMapProps {
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (slug: string) => void;
}

export function CityMap({ cities, selectedCity, onSelectCity }: CityMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: selectedCity ? [selectedCity.lng, selectedCity.lat] : [104.1954, 35.8617],
      zoom: 3.4,
      attributionControl: {},
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    cities.forEach((city) => {
      const markerElement = document.createElement('button');

      markerElement.type = 'button';
      markerElement.textContent = city.name;
      markerElement.className =
        city.slug === selectedCity?.slug
          ? 'rounded-full border-[3px] border-white bg-brand-primary px-5 py-2 text-xs font-bold text-white shadow-xl'
          : 'rounded-full border-[3px] border-white bg-brand-primary/90 px-3 py-2 text-xs font-bold text-white shadow-lg';

      markerElement.onclick = () => onSelectCity(city.slug);

      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: 'center',
      })
        .setLngLat([city.lng, city.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [cities, selectedCity?.slug, onSelectCity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCity) return;

    map.flyTo({
      center: [selectedCity.lng, selectedCity.lat],
      zoom: 4.8,
      speed: 0.8,
      essential: true,
    });
  }, [selectedCity]);

  return <div ref={containerRef} className="h-[560px] w-full" />;
}
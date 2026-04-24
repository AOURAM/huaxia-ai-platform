import { useEffect, useRef } from 'react';
import maplibregl, { type Map, type Marker } from 'maplibre-gl';

import type { ChinaCity } from '@/constants/chinaCities';

interface CityMapProps {
  cities: ChinaCity[];
  selectedCity: ChinaCity;
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
      center: [selectedCity.lng, selectedCity.lat],
      zoom: 4,
      attributionControl: false,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [selectedCity.lat, selectedCity.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    cities.forEach((city) => {
      const markerElement = document.createElement('button');
      markerElement.type = 'button';
      markerElement.className =
        city.slug === selectedCity.slug
          ? 'rounded-full border-[3px] border-white bg-brand-primary px-5 py-2 text-xs font-bold text-white shadow-xl'
          : 'rounded-full border-[3px] border-white bg-brand-primary/90 px-3 py-2 text-xs font-bold text-white shadow-lg';
      markerElement.textContent = city.name;
      markerElement.onclick = () => onSelectCity(city.slug);

      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: 'center',
      })
        .setLngLat([city.lng, city.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    map.flyTo({
      center: [selectedCity.lng, selectedCity.lat],
      zoom: selectedCity.slug === 'shanghai' ? 5 : 4.6,
      speed: 0.8,
      essential: true,
    });
  }, [cities, selectedCity, onSelectCity]);

  return <div ref={containerRef} className="h-[560px] w-full" />;
}
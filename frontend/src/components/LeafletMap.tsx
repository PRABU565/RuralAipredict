import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Globe } from 'lucide-react';
import { Village } from '../types';

interface LeafletMapProps {
  allVillages: Village[];
  selectedVillage: Village;
  onSelectVillage: (village: Village) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ 
  allVillages, 
  selectedVillage, 
  onSelectVillage 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  // Village coordinates mapped representing different parts of India
  const coordinates: { [key: number]: [number, number] } = {
    1: [12.9716, 77.5946], // Ramapuram (South Bangalore block)
    2: [20.1200, 85.8300], // Pipili (East Odisha block)
    3: [10.2300, 77.2000], // Kanthalloor (Kerala Highlands block)
    4: [18.8100, 74.1500], // Morachi Chincholi (Maharashtra Semi-Arid block)
    5: [19.1200, 74.8500]  // Hiware Bazar (Central Model block)
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet Map instance
    const initialCoords = coordinates[selectedVillage.id] || [18.8100, 77.5946];
    
    const map = L.map(mapContainerRef.current, {
      center: initialCoords,
      zoom: 6,
      zoomControl: true,
      layers: []
    });

    mapRef.current = map;

    // Add Dark Mode/Sleek Map Tiles from CartoDB (perfect fit for dark premium UI)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Plot Markers for each village
    allVillages.forEach((village) => {
      const coords = coordinates[village.id];
      if (!coords) return;

      // Custom pulsing SVG beacon HTML
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="pulse-beacon" id="marker-beacon-${village.id}"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 4px;">
            <strong style="font-size: 14px; color: #10b981; display: block; margin-bottom: 2px;">${village.name}</strong>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-bottom: 8px;">Region: ${village.region}</span>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: #e2e8f0;">
              <div>🌾 <strong>Crop:</strong> ${village.crop}</div>
              <div>👨‍🌾 <strong>Farmers:</strong> ${village.farmers}</div>
              <div>💧 <strong>Water Level:</strong> ${village.water_level}%</div>
              <div>🌦️ <strong>Rainfall:</strong> ${village.rainfall} mm</div>
              <div>🚨 <strong>Risk Tier:</strong> ${village.disease_risk} Disease Risk</div>
            </div>
            <span style="font-size: 9px; color: #10b981; display: block; margin-top: 8px; font-weight: bold; border-top: 1px solid #334155; padding-top: 6px;">Click Marker to select village</span>
          </div>
        `);

      marker.on('click', () => {
        onSelectVillage(village);
      });

      markersRef.current[village.id] = marker;
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update center when selected village changes
  useEffect(() => {
    if (!mapRef.current) return;
    const coords = coordinates[selectedVillage.id];
    if (coords) {
      mapRef.current.setView(coords, 8, { animate: true, duration: 1.5 });
      
      // Auto open popup for target
      const marker = markersRef.current[selectedVillage.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1200);
      }
    }
  }, [selectedVillage]);

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-[360px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          Geospatial Information Map
        </span>
        <span className="text-[10px] font-semibold text-slate-350 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" /> Lat: {coordinates[selectedVillage.id]?.[0]}, Lon: {coordinates[selectedVillage.id]?.[1]}
        </span>
      </div>

      {/* Map container DOM */}
      <div className="flex-1 rounded-lg overflow-hidden border border-slate-900 z-10">
        <div ref={mapContainerRef} className="w-full h-full min-h-[250px]"></div>
      </div>
    </div>
  );
};

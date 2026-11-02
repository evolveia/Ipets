import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SosAlert } from '../../types';
import { Radio, MapPin, AlertTriangle, Crosshair, ZoomIn, ZoomOut, Phone, ShieldCheck, Navigation } from 'lucide-react';

interface SosMapProps {
  alerts: SosAlert[];
  radiusKm: number;
  userPosition?: [number, number];
  onSelectAlert?: (alert: SosAlert) => void;
}

export const SosMap: React.FC<SosMapProps> = ({
  alerts,
  radiusKm,
  userPosition = [-1.4525, -48.4800], // Residência em Nazaré, Belém - PA
  onSelectAlert,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [activeRegion, setActiveRegion] = useState<'both' | 'belem' | 'ananindeua'>('both');

  // Key Coordinates
  const BELEM_COORDS: [number, number] = [-1.4525, -48.4800];
  const ANANINDEUA_COORDS: [number, number] = [-1.3650, -48.3750];
  const METRO_CENTER: [number, number] = [-1.4100, -48.4300];

  // Metropolitan bounds encompassing Belém and Ananindeua
  const METRO_BOUNDS: [[number, number], [number, number]] = [
    [-1.4850, -48.5150], // Sudoeste Belém / Baía do Guajará
    [-1.3400, -48.3500], // Nordeste Ananindeua / BR-316
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: METRO_CENTER,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Fit bounds to show both Belém and Ananindeua by default
      map.fitBounds(METRO_BOUNDS, { padding: [25, 25] });

      // Open source HD Voyager tile layer (no proprietary API key needed)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom control bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 1. User Position Marker (Belém) with Radar Pulse
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #00A896; opacity: 0.4; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background-color: #00A896; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,168,150,0.5); z-index: 10; position: relative;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker(userPosition, { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>Sua Localização</b><br>Nazaré, Belém - PA<br><small style="color: #00A896; font-weight: bold;">Radar Comunitário Ativo</small>`);

      // 2. Dynamic Radar Coverage Circle
      const radarCircle = L.circle(userPosition, {
        radius: radiusKm * 1000,
        color: '#E63946',
        fillColor: '#E63946',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '6, 6',
      }).addTo(map);

      circleRef.current = radarCircle;

      // 3. Render Dynamic Alert Markers
      renderAlertMarkers(map, alerts);

      // Force resize invalidation after DOM paint
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.error('Error initializing Leaflet SOS map:', err);
    }

    // ResizeObserver to handle tab changes or responsive layout shifts
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update radar circle radius dynamically when prop changes
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);

  // Re-render markers if alerts change
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderAlertMarkers(mapInstanceRef.current, alerts);
    }
  }, [alerts]);

  const renderAlertMarkers = (map: L.Map, currentAlerts: SosAlert[]) => {
    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    currentAlerts.forEach((alert, index) => {
      // Dynamic coordinates in Belém or Ananindeua
      const lat =
        alert.latitude ||
        (index % 2 === 0 ? -1.4550 - index * 0.008 : -1.3680 + index * 0.006);
      const lng =
        alert.longitude ||
        (index % 2 === 0 ? -48.4900 + index * 0.006 : -48.3750 - index * 0.008);

      const alertIcon = L.divIcon({
        className: 'custom-sos-alert-icon',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #E63946; opacity: 0.45; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <img src="${alert.photoUrl}" alt="${alert.petName}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2.5px solid #E63946; box-shadow: 0 4px 12px rgba(230,57,70,0.5); z-index: 10; position: relative;" />
            <span style="position: absolute; bottom: -8px; background: #E63946; color: white; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 6px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.25); z-index: 12;">
              ${alert.petName}
            </span>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([lat, lng], { icon: alertIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: inherit; width: 210px; text-align: left; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="${alert.photoUrl}" style="width: 42px; height: 42px; border-radius: 10px; object-fit: cover; border: 1.5px solid #E63946;" />
            <div>
              <b style="color: #22333B; font-size: 14px; display: block; line-height: 1.2;">${alert.petName}</b>
              <span style="font-size: 11px; color: #6B7A83;">${alert.breed}</span>
            </div>
          </div>
          <p style="font-size: 11px; color: #444; margin: 4px 0;">📍 <b>Último Visto:</b> ${alert.lastSeenAddress}</p>
          ${alert.rewardAmount ? `<span style="display: inline-block; background: #FFF3E0; color: #D97706; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin: 4px 0;">Recompensa: R$ ${alert.rewardAmount}</span>` : ''}
          <div style="margin-top: 8px; border-top: 1px solid #eee; padding-top: 6px; display: flex; gap: 6px;">
            <a href="tel:${alert.contactPhone.replace(/\D/g, '')}" style="flex: 1; background: #00A896; color: white; text-decoration: none; font-size: 11px; font-weight: bold; padding: 5px 8px; border-radius: 8px; text-align: center;">Ligar Tutor</a>
            <a href="https://wa.me/55${alert.contactPhone.replace(/\D/g, '')}" target="_blank" style="flex: 1; background: #52B788; color: white; text-decoration: none; font-size: 11px; font-weight: bold; padding: 5px 8px; border-radius: 8px; text-align: center;">WhatsApp</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectAlert) onSelectAlert(alert);
      });

      markersRef.current.push(marker);
    });
  };

  const goToRegion = (region: 'both' | 'belem' | 'ananindeua') => {
    setActiveRegion(region);
    if (!mapInstanceRef.current) return;

    if (region === 'both') {
      mapInstanceRef.current.fitBounds(METRO_BOUNDS, { padding: [25, 25], animate: true });
    } else if (region === 'belem') {
      mapInstanceRef.current.flyTo(BELEM_COORDS, 14, { animate: true, duration: 0.8 });
    } else if (region === 'ananindeua') {
      mapInstanceRef.current.flyTo(ANANINDEUA_COORDS, 14, { animate: true, duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-[290px] sm:h-[330px] rounded-[24px] overflow-hidden shadow-lg border border-stone-200 bg-stone-900">
      {/* Map canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Region Selector Tabs (Top Left) */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-1 text-[11px] font-bold text-[#22333B]">
        <button
          onClick={() => goToRegion('both')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeRegion === 'both' ? 'bg-[#00A896] text-white shadow-2xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Belém + Ananindeua
        </button>
        <button
          onClick={() => goToRegion('belem')}
          className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
            activeRegion === 'belem' ? 'bg-[#00A896] text-white shadow-2xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Belém
        </button>
        <button
          onClick={() => goToRegion('ananindeua')}
          className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
            activeRegion === 'ananindeua' ? 'bg-[#00A896] text-white shadow-2xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Ananindeua
        </button>
      </div>

      {/* Floating Radar Live Status (Top Right) */}
      <div className="absolute top-3 right-3 z-10 bg-[#E63946] text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold">
        <Radio className="w-3.5 h-3.5 animate-pulse" />
        <span>Radar {radiusKm} km</span>
      </div>

      {/* Recenter button (Bottom Left) */}
      <button
        onClick={() => goToRegion('belem')}
        className="absolute bottom-3 left-3 z-10 bg-white hover:bg-stone-50 text-[#00A896] p-2.5 rounded-xl shadow-md border border-stone-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95"
        title="Minha Localização"
      >
        <Crosshair className="w-4 h-4 text-[#E63946]" />
        <span className="hidden sm:inline">Minha Localização</span>
      </button>

      {/* Leaflet GPS Active Badge (No API Key Required) */}
      <div className="absolute bottom-3 right-12 z-10 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-md border border-white/10 text-[11px] font-bold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
        <span>GPS Comunitário Ativo ({alerts.length} alertas)</span>
      </div>
    </div>
  );
};


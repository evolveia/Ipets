import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Bike, MapPin, Package, Navigation, Phone, MessageSquare, Compass } from 'lucide-react';

interface DeliveryMapProps {
  orderId?: string;
  courierName?: string;
  courierPhone?: string;
  hubName?: string;
  destinationAddress?: string;
  etaMinutes?: number;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  orderId = 'PED-98214',
  courierName = 'Rodrigo Mendonça',
  courierPhone = '(91) 98124-7790',
  hubName = 'Pet Shop & Hub Belém Doca 24h',
  destinationAddress = 'Av. Nazaré, 842 - Nazaré, Belém - PA',
  etaMinutes = 14,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const courierMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [activeZone, setActiveZone] = useState<'belem' | 'ananindeua'>('belem');
  const [currentStep, setCurrentStep] = useState(0);

  // Belém Coordinates Route: Hub Doca [-1.4430, -48.4880] -> Nazaré Destination [-1.4525, -48.4800]
  const belemRoute: [number, number][] = [
    [-1.4430, -48.4880], // Hub Doca (Travessa Visconde de Souza Franco)
    [-1.4455, -48.4860], // Av. Visconde de Souza Franco
    [-1.4480, -48.4840], // Cruzamento Gov. José Malcher
    [-1.4505, -48.4820], // Travessa Quintino Bocaiúva
    [-1.4525, -48.4800], // Av. Nazaré (Residência do Tutor)
  ];

  // Ananindeua Coordinates Route: Hub BR-316 Km 3 [-1.3780, -48.3880] -> Cidade Nova Coqueiro [-1.3650, -48.3740]
  const ananindeuaRoute: [number, number][] = [
    [-1.3780, -48.3880], // Atacarejo Pet Ananindeua BR-316
    [-1.3740, -48.3840], // Passarela do Metrópole
    [-1.3710, -48.3800], // Av. Mário Covas cruzamento
    [-1.3680, -48.3770], // Acesso Cidade Nova
    [-1.3650, -48.3740], // Residência Coqueiro / Cidade Nova
  ];

  const currentRoute = activeZone === 'belem' ? belemRoute : ananindeuaRoute;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const centerCoords: [number, number] =
        activeZone === 'belem' ? [-1.4475, -48.4840] : [-1.3715, -48.3810];

      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Route Polyline
      const poly = L.polyline(currentRoute, {
        color: '#00A896',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      polylineRef.current = poly;

      // Fit bounds so entire route is immediately visible with comfortable margin
      map.fitBounds(poly.getBounds(), { padding: [40, 40] });

      // 1. Origin Marker
      const hubLabel = activeZone === 'belem' ? 'Hub Belém Doca 24h' : 'Hub Ananindeua BR-316';
      const hubIcon = L.divIcon({
        className: 'custom-hub-icon',
        html: `
          <div style="background-color: #00A896; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker(currentRoute[0], { icon: hubIcon })
        .addTo(map)
        .bindPopup(`<b>${hubLabel}</b><br>Separação Rápida iPet 24/7`);

      // 2. Destination Marker
      const destLabel = activeZone === 'belem' ? destinationAddress : 'Cidade Nova / Coqueiro, Ananindeua - PA';
      const homeIcon = L.divIcon({
        className: 'custom-home-icon',
        html: `
          <div style="background-color: #E63946; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(230,57,70,0.4); animation: bounce 2s infinite;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker(currentRoute[currentRoute.length - 1], { icon: homeIcon })
        .addTo(map)
        .bindPopup(`<b>Destino do Tutor</b><br>${destLabel}`);

      // 3. Live Courier Motoboy Marker with Radar Pulse
      const courierIcon = L.divIcon({
        className: 'custom-courier-icon',
        html: `
          <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #FF9F1C; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background-color: #FF9F1C; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(255,159,28,0.5); z-index: 10; position: relative;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const courierMarker = L.marker(currentRoute[2], { icon: courierIcon })
        .addTo(map)
        .bindPopup(`<b>${courierName}</b><br>Entregador Oficial iPet Express`);

      courierMarkerRef.current = courierMarker;

      // Invalidate size on load
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.error('Error initializing Leaflet delivery map:', err);
    }

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
  }, [activeZone]);

  // Animate courier movement along points
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % currentRoute.length;
        if (courierMarkerRef.current) {
          courierMarkerRef.current.setLatLng(currentRoute[next]);
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentRoute]);

  const handleCenterCourier = () => {
    if (mapInstanceRef.current && courierMarkerRef.current) {
      mapInstanceRef.current.panTo(courierMarkerRef.current.getLatLng(), {
        animate: true,
      });
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current && polylineRef.current) {
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), {
        padding: [40, 40],
        animate: true,
      });
    }
  };

  return (
    <div className="relative w-full h-[290px] sm:h-[330px] rounded-[24px] overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
      {/* Map canvas container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Route Switcher Pills (Top Left) */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-1 text-[11px] font-bold text-[#22333B]">
        <button
          onClick={() => setActiveZone('belem')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeZone === 'belem' ? 'bg-[#00A896] text-white shadow-2xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Rota Belém (Doca ➔ Nazaré)
        </button>
        <button
          onClick={() => setActiveZone('ananindeua')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeZone === 'ananindeua' ? 'bg-[#00A896] text-white shadow-2xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Rota Ananindeua (BR-316)
        </button>
      </div>

      {/* Floating Live ETA Banner (Top Right) */}
      <div className="absolute top-3 right-3 z-10 bg-[#22333B]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/20 flex items-center gap-2 text-xs font-bold text-white">
        <span className="text-[#FF9F1C] font-mono">~{etaMinutes} min</span>
        <span className="text-stone-300">• {activeZone === 'belem' ? '1.4 km' : '2.1 km'}</span>
      </div>

      {/* Actions (Bottom Left): Center Courier & Fit Route */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
        <button
          onClick={handleCenterCourier}
          className="bg-white hover:bg-stone-50 text-[#00A896] p-2.5 rounded-xl shadow-md border border-stone-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95"
          title="Focar no entregador"
        >
          <Navigation className="w-4 h-4 text-[#FF9F1C]" />
          <span className="hidden sm:inline">Entregador</span>
        </button>
        <button
          onClick={handleFitRoute}
          className="bg-white hover:bg-stone-50 text-[#22333B] p-2.5 rounded-xl shadow-md border border-stone-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95"
          title="Ver rota inteira"
        >
          <Compass className="w-4 h-4 text-[#00A896]" />
          <span className="hidden sm:inline">Ver Rota</span>
        </button>
      </div>

      {/* Floating Courier Contact Card (Bottom Center / Right) */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-stone-200/80 flex items-center gap-2.5 max-w-[240px]">
        <div className="w-8 h-8 rounded-full bg-[#FF9F1C] text-white flex items-center justify-center font-bold text-xs shrink-0">
          RM
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#22333B] truncate">{courierName}</p>
          <p className="text-[10px] text-[#6B7A83] truncate">
            {activeZone === 'belem' ? 'Moto 24h Belém Doca' : 'Moto 24h Ananindeua'}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={`tel:${courierPhone.replace(/\D/g, '')}`}
            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-[#E4F6F3] text-[#00A896] flex items-center justify-center cursor-pointer transition-colors"
            title="Ligar"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a
            href={`https://wa.me/55${courierPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-lg bg-[#52B788] text-white flex items-center justify-center cursor-pointer transition-colors"
            title="WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};


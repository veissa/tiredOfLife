
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation } from 'lucide-react';

interface PickupPoint {
  id: number;
  name: string;
  address: string;
  schedule: string;
  nextAvailable: string;
  coordinates: [number, number];
  type: 'market' | 'farm' | 'shop';
}

interface MapViewProps {
  pickupPoints: PickupPoint[];
  onPointSelect: (point: PickupPoint) => void;
  selectedPoint?: PickupPoint | null;
}

const MapView = ({ pickupPoints, onPointSelect, selectedPoint }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Paris coordinates
          setUserLocation([2.3522, 48.8566]);
        }
      );
    } else {
      // Default to Paris coordinates
      setUserLocation([2.3522, 48.8566]);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    if (!mapboxToken) {
      // For demo purposes, we'll show a message to add the token
      return;
    }

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation,
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    new mapboxgl.Marker({ color: '#3B82F6' })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<div class="p-2"><strong>Votre position</strong></div>'))
      .addTo(map.current);

    // Add pickup point markers
    pickupPoints.forEach((point) => {
      const el = document.createElement('div');
      el.className = 'pickup-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = point.type === 'market' ? '#10B981' : point.type === 'farm' ? '#F59E0B' : '#8B5CF6';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(point.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-3">
              <h3 class="font-semibold">${point.name}</h3>
              <p class="text-sm text-gray-600">${point.address}</p>
              <p class="text-sm text-green-600 font-medium">${point.nextAvailable}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onPointSelect(point);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, userLocation, pickupPoints, onPointSelect]);

  if (!mapboxToken) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-6">
        <MapPin className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Configuration de la carte</h3>
        <p className="text-gray-600 text-center mb-4">
          Entrez votre token Mapbox pour afficher la carte interactive
        </p>
        <input
          type="text"
          placeholder="Token Mapbox public"
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setMapboxToken(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-2">
          Obtenez votre token sur <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">mapbox.com</a>
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-64 rounded-lg shadow-lg" />
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Marchés</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Fermes</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Épiceries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;

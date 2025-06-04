
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Calendar } from 'lucide-react';

interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationSelectorProps {
  onLocationChange: (location: UserLocation) => void;
}

const LocationSelector = ({ onLocationChange }: LocationSelectorProps) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Position détectée"
          };
          setUserLocation(location);
          onLocationChange(location);
          setIsDetecting(false);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setIsDetecting(false);
        }
      );
    } else {
      console.error('Géolocalisation non supportée');
      setIsDetecting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Votre localisation
        </h3>
        <button
          onClick={detectLocation}
          disabled={isDetecting}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300"
        >
          <Navigation className="w-4 h-4" />
          <span>{isDetecting ? 'Détection...' : 'Me localiser'}</span>
        </button>
      </div>
      
      {userLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-green-800 font-medium">{userLocation.address}</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Coordonnées: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

import React from 'react';
import Header from '../components/Header';
import MapView from '../components/MapView';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, List } from 'lucide-react';

interface PickupPoint {
  id: number;
  name: string;
  address: string;
  schedule: string;
  nextAvailable: string;
  coordinates: [number, number];
  type: 'market' | 'farm' | 'shop';
  distance?: string;
}

// Hardcoded pickup points data (move from PickupPointSelector)
const pickupPoints: PickupPoint[] = [
  {
    id: 1,
    name: "Marché de Belleville",
    address: "Place du Marché, 75020 Paris",
    schedule: "Mar, Ven: 8h-14h",
    nextAvailable: "Mardi 7 Mai",
    coordinates: [2.3765, 48.8714],
    type: 'market',
    distance: "1.2 km"
  },
  {
    id: 2,
    name: "Ferme des Trois Chênes",
    address: "15 Route de la Ferme, 78000 Versailles",
    schedule: "Sam: 9h-17h",
    nextAvailable: "Samedi 9 Mai",
    coordinates: [2.1301, 48.8014],
    type: 'farm',
    distance: "12.5 km"
  },
  {
    id: 3,
    name: "Épicerie Bio du Quartier",
    address: "42 Rue de la République, 92100 Boulogne",
    schedule: "Lun-Sam: 9h-19h",
    nextAvailable: "Demain 10h",
    coordinates: [2.2394, 48.8366],
    type: 'shop',
    distance: "3.8 km"
  },
  {
    id: 4,
    name: "Marché Saint-Germain",
    address: "4-6 Rue Lobineau, 75006 Paris",
    schedule: "Mar, Jeu, Sam: 8h-13h",
    nextAvailable: "Jeudi 9 Mai",
    coordinates: [2.3354, 48.8534],
    type: 'market',
    distance: "2.1 km"
  },
  {
    id: 5,
    name: "Ferme Bio de la Vallée",
    address: "28 Chemin des Prés, 91190 Gif-sur-Yvette",
    schedule: "Mer, Sam: 10h-18h",
    nextAvailable: "Mercredi 8 Mai",
    coordinates: [2.1167, 48.7],
    type: 'farm',
    distance: "18.3 km"
  }
];

const PickupPointsPage = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/products?search=${query}`);
  };

  // Helper functions for styling (move from PickupPointSelector)
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'market': return '🏪';
      case 'farm': return '🚜';
      case 'shop': return '🏬';
      default: return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'market': return 'bg-green-100 text-green-800';
      case 'farm': return 'bg-yellow-100 text-yellow-800';
      case 'shop': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
        onSearch={handleSearch}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Points de retrait</h1>
        
        {/* List of Pickup Points */}
        <div className="space-y-4 mb-8">
          {pickupPoints.map((point) => (
            <div
              key={point.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getTypeIcon(point.type)}</span>
                    <h3 className="font-semibold text-gray-900">{point.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(point.type)}`}>
                      {point.distance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock size={14} />
                      <span>{point.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span className="text-green-600 font-medium">{point.nextAvailable}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map View */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Visualiser sur la carte</h2>
        <MapView pickupPoints={pickupPoints} onPointSelect={() => {}} />

      </div>
    </div>
  );
};

export default PickupPointsPage;

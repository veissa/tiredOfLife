
import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, List } from 'lucide-react';
import MapView from './MapView';

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

interface PickupPointSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (point: PickupPoint) => void;
}

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

const PickupPointSelector = ({ isOpen, onClose, onSelect }: PickupPointSelectorProps) => {
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedPoint) {
      onSelect(selectedPoint);
      onClose();
    }
  };

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-4 bg-white rounded-xl shadow-xl max-w-4xl mx-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Choisir un point relais</h2>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List size={16} />
                  <span>Liste</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'map' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <MapPin size={16} />
                  <span>Carte</span>
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'map' ? (
              <div className="h-full p-6">
                <MapView
                  pickupPoints={pickupPoints}
                  onPointSelect={setSelectedPoint}
                  selectedPoint={selectedPoint}
                />
                {selectedPoint && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <span className="mr-2">{getTypeIcon(selectedPoint.type)}</span>
                          {selectedPoint.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{selectedPoint.address}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock size={14} />
                            <span>{selectedPoint.schedule}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span className="text-green-600 font-medium">{selectedPoint.nextAvailable}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(selectedPoint.type)}`}>
                        {selectedPoint.distance}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {pickupPoints.map((point) => (
                    <div
                      key={point.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPoint?.id === point.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedPoint(point)}
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
                          <p className="text-sm text-gray-600 mb-2">{point.address}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{point.schedule}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span className="text-green-600 font-medium">{point.nextAvailable}</span>
                            </div>
                          </div>
                        </div>
                        {selectedPoint?.id === point.id && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6">
            <button
              onClick={handleConfirm}
              disabled={!selectedPoint}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirmer la commande
              {selectedPoint && (
                <span className="ml-2 text-green-200">
                  - {selectedPoint.name}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupPointSelector;

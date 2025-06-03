
import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface PickupPoint {
  id: number;
  name: string;
  address: string;
  schedule: string;
  nextAvailable: string;
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
    nextAvailable: "Mardi 7 Mai"
  },
  {
    id: 2,
    name: "Ferme des Trois Chênes",
    address: "15 Route de la Ferme, 78000 Versailles",
    schedule: "Sam: 9h-17h",
    nextAvailable: "Samedi 9 Mai"
  },
  {
    id: 3,
    name: "Épicerie Bio du Quartier",
    address: "42 Rue de la République, 92100 Boulogne",
    schedule: "Lun-Sam: 9h-19h",
    nextAvailable: "Demain 10h"
  }
];

const PickupPointSelector = ({ isOpen, onClose, onSelect }: PickupPointSelectorProps) => {
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedPoint) {
      onSelect(selectedPoint);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-4 bg-white rounded-xl shadow-xl max-w-2xl mx-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Choisir un point relais</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
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
                      <h3 className="font-semibold text-gray-900">{point.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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

          {/* Footer */}
          <div className="border-t p-6">
            <button
              onClick={handleConfirm}
              disabled={!selectedPoint}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirmer la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupPointSelector;

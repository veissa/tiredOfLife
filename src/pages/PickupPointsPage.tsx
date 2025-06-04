
import React, { useState } from 'react';
import Header from '../components/Header';
import PickupPointSelector from '../components/PickupPointSelector';

const PickupPointsPage = () => {
  const [isPickupSelectorOpen, setIsPickupSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Points de retrait</h1>
        
        <button
          onClick={() => setIsPickupSelectorOpen(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Voir les points de retrait
        </button>

        <PickupPointSelector
          isOpen={isPickupSelectorOpen}
          onClose={() => setIsPickupSelectorOpen(false)}
          onSelect={(point) => {
            console.log('Point selected:', point);
            setIsPickupSelectorOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default PickupPointsPage;


import React from 'react';
import Header from '../components/Header';
import PickupPointSelector from '../components/PickupPointSelector';

const PickupPointsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Points de retrait</h1>
        
        <PickupPointSelector
          onSelectPoint={() => {}}
          selectedPoint={null}
        />
      </div>
    </div>
  );
};

export default PickupPointsPage;

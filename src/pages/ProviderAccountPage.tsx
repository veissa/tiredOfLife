
import React from 'react';
import Header from '../components/Header';
import ProviderAccount from '../components/ProviderAccount';

const ProviderAccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
      />
      <ProviderAccount />
    </div>
  );
};

export default ProviderAccountPage;

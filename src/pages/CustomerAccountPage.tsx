
import React from 'react';
import Header from '../components/Header';
import CustomerAccount from '../components/CustomerAccount';

const CustomerAccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
      />
      <CustomerAccount />
    </div>
  );
};

export default CustomerAccountPage;

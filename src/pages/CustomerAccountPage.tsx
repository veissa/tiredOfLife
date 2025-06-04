import React from 'react';
import Header from '../components/Header';
import CustomerAccount from '../components/CustomerAccount';
import { useNavigate } from 'react-router-dom';

const CustomerAccountPage = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/products?search=${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
        onSearch={handleSearch}
      />
      <CustomerAccount />
    </div>
  );
};

export default CustomerAccountPage;

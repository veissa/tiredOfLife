import React from 'react';
import Header from '../components/Header';
import ProviderAccount from '../components/ProviderAccount';
import { useNavigate } from 'react-router-dom';

const ProviderAccountPage = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/products?search=${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
      />
      <ProviderAccount />
    </div>
  );
};

export default ProviderAccountPage;

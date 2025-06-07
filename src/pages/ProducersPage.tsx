import React, { useState } from 'react';
import Header from '../components/Header';
import ProducerCard from '../components/ProducerCard';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/lib/constants';

interface Producer {
  id: string;
  shopName: string;
  description: string;
  address: string;
  certifications: string[];
  pickupInfo: {
    location?: string;
    hours?: string;
    instructions?: string;
    phone?: string;
    email?: string;
  };
  images: string[];
  isActive: boolean;
}

const ProducersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: producers, isLoading, isError, error } = useQuery<Producer[]>({
    queryKey: ['allProducers'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/producers`);
      return response.data;
    },
  });

  const filteredProducers = producers?.filter(producer =>
    producer.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) return <div className="text-center py-8">Chargement des producteurs...</div>;
  if (isError) return <div className="text-center py-8 text-red-600">Erreur: {error?.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={setSearchQuery}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nos producteurs</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducers.map((producer) => (
            <ProducerCard
              key={producer.id}
              producer={producer}
              onClick={(producerId) => navigate(`/products?producer=${producerId}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProducersPage;

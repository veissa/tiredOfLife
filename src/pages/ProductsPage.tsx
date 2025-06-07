import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ProductFromServer {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  status: 'active' | 'inactive' | 'rupture'; // Assuming status might come from backend
  description?: string;
  unit: string;
  producerId: string;
  producer: { // Assuming producer object is nested as in backend
    id: string;
    shopName: string;
  };
}

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducer, setSelectedProducer] = useState('');
  
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from backend
  const { data: products, isLoading, isError, error } = useQuery<ProductFromServer[], Error>({
    queryKey: ['allProducts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    const producerId = params.get('producer');

    if (query) {
      setSearchQuery(query);
    }

    if (producerId && products) {
      const producer = products.find(p => p.producer.id === producerId);
      if (producer) {
        setSelectedProducer(producer.producer.shopName);
      } else {
        setSelectedProducer(''); 
      }
    } else {
      setSelectedProducer('');
    }
  }, [location.search, products]);

  // Extract unique categories and producers from fetched data
  const categories = products ? Array.from(new Set(products.map(product => product.category))) : [];
  const producers = products ? Array.from(new Set(products.map(product => product.producer.shopName))) : [];

  // Filter products based on selected category, producer, and search query
  const filteredProducts = products ? products.filter(product => {
    const categoryMatch = selectedCategory === "" || product.category === selectedCategory;
    const producerMatch = selectedProducer === "" || product.producer.shopName === selectedProducer;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && producerMatch && searchMatch;
  }) : [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  if (isError) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error?.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}} // Placeholder
        onSearch={setSearchQuery}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tous les produits</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <ProductFilters 
              categories={categories}
              producers={producers}
              selectedCategory={selectedCategory}
              selectedProducer={selectedProducer}
              onCategoryChange={setSelectedCategory}
              onProducerChange={setSelectedProducer}
            />
          </div>
          
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => {}} // Placeholder
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

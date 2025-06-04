import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { mockProducts } from '../data/mockData';
import { useLocation } from 'react-router-dom';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducer, setSelectedProducer] = useState('');
  
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Extract unique categories and producers from mock data
  const categories = Array.from(new Set(mockProducts.map(product => product.category)));
  const producers = Array.from(new Set(mockProducts.map(product => product.producer)));

  // Filter products based on selected category and producer
  const filteredProducts = mockProducts.filter(product => {
    const categoryMatch = selectedCategory === "" || product.category === selectedCategory;
    const producerMatch = selectedProducer === "" || product.producer === selectedProducer;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && producerMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
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
                  onAddToCart={() => {}}
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

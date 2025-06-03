
import React from 'react';

interface FiltersProps {
  categories: string[];
  producers: string[];
  selectedCategory: string;
  selectedProducer: string;
  onCategoryChange: (category: string) => void;
  onProducerChange: (producer: string) => void;
}

const ProductFilters = ({
  categories,
  producers,
  selectedCategory,
  selectedProducer,
  onCategoryChange,
  onProducerChange
}: FiltersProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h3 className="font-semibold text-lg text-gray-900">Filtres</h3>
      
      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Catégories</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ""}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">Toutes</span>
          </label>
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Producers */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Producteurs</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="producer"
              value=""
              checked={selectedProducer === ""}
              onChange={(e) => onProducerChange(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">Tous</span>
          </label>
          {producers.map(producer => (
            <label key={producer} className="flex items-center">
              <input
                type="radio"
                name="producer"
                value={producer}
                checked={selectedProducer === producer}
                onChange={(e) => onProducerChange(e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{producer}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

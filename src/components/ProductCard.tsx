
import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  producer: string;
  image: string;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">Par {product.producer}</p>
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-lg font-bold text-green-600">
              {product.price}€
            </span>
            <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
          </div>
          <span className="text-xs text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Package } from 'lucide-react';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ProductFromServer {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  status: 'active' | 'inactive' | 'rupture';
  description?: string;
  unit: string;
  producerId: string;
  producer: {
    id: string;
    shopName: string;
  };
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const { data: product, isLoading, isError, error } = useQuery<ProductFromServer, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if id is available
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={() => {}}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error: {error?.message}</h1>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={() => {}}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log(`Added ${quantity} x ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={() => {}}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux produits
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              {product.images && product.images.length > 0 ? (
                <img
                  src={`${API_URL.replace('/api', '')}/uploads/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package size={48} />
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {product.producer.shopName}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {product.price}€
                </span>
                <span className="text-gray-500">/{product.unit}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-600">(4.8) · 24 avis</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Produit frais et de qualité, cultivé localement avec passion par nos producteurs partenaires. Idéal pour vos préparations culinaires quotidiennes."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantité</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-gray-600">
                  Total: {(product.price * quantity).toFixed(2)}€
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ajouter au panier
            </Button>

            {/* Producer Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">À propos du producteur</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">
                    {product.producer.shopName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{product.producer.shopName}</p>
                  <p className="text-gray-600 text-sm">Producteur local certifié</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

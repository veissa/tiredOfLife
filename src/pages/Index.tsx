
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Cart from '../components/Cart';
import PickupPointSelector from '../components/PickupPointSelector';
import ProducerCard from '../components/ProducerCard';
import { mockProducts, mockProducers, categories, producers, Product } from '../data/mockData';

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPickupSelectorOpen, setIsPickupSelectorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducer, setSelectedProducer] = useState("");
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'producers'>('home');

  const filteredProducts = mockProducts.filter(product => {
    const categoryMatch = selectedCategory === "" || product.category === selectedCategory;
    const producerMatch = selectedProducer === "" || product.producer === selectedProducer;
    return categoryMatch && producerMatch;
  });

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsPickupSelectorOpen(true);
  };

  const handlePickupPointSelect = (point: any) => {
    console.log('Point relais sélectionné:', point);
    setCartItems([]);
    alert('Commande confirmée ! Vous recevrez un email de confirmation.');
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {currentView === 'home' && (
        <>
          <Hero />
          
          {/* Quick Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <button
                onClick={() => setCurrentView('products')}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-center group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🥕</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Nos Produits</h3>
                <p className="text-gray-600">Découvrez notre sélection de produits locaux</p>
              </button>
              
              <button
                onClick={() => setCurrentView('producers')}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-center group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Nos Producteurs</h3>
                <p className="text-gray-600">Rencontrez les artisans de votre région</p>
              </button>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Points Relais</h3>
                <p className="text-gray-600">Récupérez vos commandes près de chez vous</p>
              </div>
            </div>

            {/* Featured Products */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Produits du moment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockProducts.slice(0, 4).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentView('products')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Voir tous les produits
                </button>
              </div>
            </section>
          </div>
        </>
      )}

      {currentView === 'products' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tous nos produits</h1>
            <button
              onClick={() => setCurrentView('home')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Retour à l'accueil
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <ProductFilters
                categories={categories}
                producers={producers}
                selectedCategory={selectedCategory}
                selectedProducer={selectedProducer}
                onCategoryChange={setSelectedCategory}
                onProducerChange={setSelectedProducer}
              />
            </div>
            
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun produit trouvé pour cette sélection.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentView === 'producers' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nos producteurs</h1>
            <button
              onClick={() => setCurrentView('home')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Retour à l'accueil
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockProducers.map(producer => (
              <ProducerCard key={producer.id} producer={producer} />
            ))}
          </div>
        </div>
      )}

      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <PickupPointSelector
        isOpen={isPickupSelectorOpen}
        onClose={() => setIsPickupSelectorOpen(false)}
        onSelect={handlePickupPointSelect}
      />
    </div>
  );
};

export default Index;

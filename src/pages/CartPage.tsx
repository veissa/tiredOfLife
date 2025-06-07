import React from 'react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemsCount={totalItems} onCartClick={() => {}} onSearch={() => {}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre Panier</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Votre panier est vide.</p>
            <Link to="/products">
              <Button className="bg-green-600 hover:bg-green-700">Commencer vos achats</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                  <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden mr-4">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`${API_URL.replace('/api', '')}/uploads/${item.images[0]}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                    <p className="text-gray-600">{item.price}€/{item.unit}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full mr-2"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full ml-2"
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé du Panier</h2>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Total articles:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total:</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 mb-3">Procéder au paiement</Button>
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
                onClick={clearCart}
              >
                Vider le panier
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 

import React, { useState } from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Local Market</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Accueil</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Produits</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Producteurs</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Points Relais</a>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
              <User size={20} />
            </button>
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

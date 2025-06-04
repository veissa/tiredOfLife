
import React, { useState } from 'react';
import { User, Package, BarChart3, Settings, LogOut, Plus, Edit2, Trash2, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProviderAccount = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasShop, setHasShop] = useState(false); // This would come from user data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tomates bio',
      price: 4.50,
      stock: 25,
      category: 'Légumes',
      image: '/placeholder.svg',
      status: 'active'
    },
    {
      id: 2,
      name: 'Miel de lavande',
      price: 12.00,
      stock: 8,
      category: 'Épicerie',
      image: '/placeholder.svg',
      status: 'active'
    }
  ]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Légumes',
    description: ''
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      image: '/placeholder.svg',
      status: 'active'
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', stock: '', category: 'Légumes', description: '' });
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products', label: 'Mes produits', icon: Package },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  // If no shop exists, show shop creation prompt
  if (!hasShop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenue sur votre espace producteur</h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Pour commencer à vendre vos produits sur Local Market, vous devez d'abord créer votre boutique. 
            Cela ne prend que quelques minutes et vous permettra de présenter votre exploitation et vos produits aux clients.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Créez votre boutique</h3>
              <p className="text-sm text-gray-600">Présentez votre exploitation et votre savoir-faire</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Ajoutez vos produits</h3>
              <p className="text-sm text-gray-600">Mettez en ligne votre catalogue de produits</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Vendez en local</h3>
              <p className="text-sm text-gray-600">Connectez-vous avec les consommateurs locaux</p>
            </div>
          </div>

          <Link
            to="/create-shop"
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Store size={20} />
            <span>Créer ma boutique</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold text-gray-900">Espace Producteur</h1>
            <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors">
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
          
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Tableau de bord</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Ventes du mois</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">1,247 €</p>
                  <p className="text-sm text-green-600 mt-1">+12% par rapport au mois dernier</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">Commandes</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">23</p>
                  <p className="text-sm text-blue-600 mt-1">En attente de retrait</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">Produits actifs</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{products.length}</p>
                  <p className="text-sm text-purple-600 mt-1">Produits en ligne</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Commandes récentes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 rounded">
                    <span>Commande #1234 - Marie Dupont</span>
                    <span className="text-green-600 font-medium">45.80 €</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded">
                    <span>Commande #1235 - Jean Martin</span>
                    <span className="text-green-600 font-medium">32.50 €</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mes produits</h2>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Ajouter un produit</span>
                </button>
              </div>

              {isAddingProduct && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Nouveau produit</h3>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Légumes">Légumes</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Épicerie">Épicerie</option>
                        <option value="Boulangerie">Boulangerie</option>
                        <option value="Fromagerie">Fromagerie</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex space-x-4">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Ajouter
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingProduct(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-1">Catégorie: {product.category}</p>
                    <p className="text-green-600 font-bold text-lg mb-1">{product.price.toFixed(2)} €</p>
                    <p className="text-gray-600 mb-3">Stock: {product.stock} unités</p>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                        <Edit2 size={16} />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'profile' || activeTab === 'settings') && (
            <div className="text-center py-12">
              <p className="text-gray-500">Cette section sera disponible prochainement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderAccount;

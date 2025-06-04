
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: 'active' | 'inactive' | 'rupture';
  description?: string;
  unit: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Tomates bio',
      price: 4.50,
      stock: 25,
      category: 'Légumes',
      image: '/placeholder.svg',
      status: 'active',
      unit: 'kg'
    },
    {
      id: 2,
      name: 'Miel de lavande',
      price: 12.00,
      stock: 0,
      category: 'Épicerie',
      image: '/placeholder.svg',
      status: 'rupture',
      unit: 'pot'
    }
  ]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Légumes',
    description: '',
    unit: 'kg'
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      image: '/placeholder.svg',
      status: 'active',
      unit: newProduct.unit
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', stock: '', category: 'Légumes', description: '', unit: 'kg' });
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case 'rupture':
        return <Badge className="bg-red-100 text-red-800">Rupture</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des produits</h2>
        <Button onClick={() => setIsAddingProduct(true)} className="bg-green-600 hover:bg-green-700">
          <Plus size={18} />
          Ajouter un produit
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total produits</p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">En rupture</p>
                <p className="text-xl font-bold">{products.filter(p => p.stock === 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire d'ajout */}
      {isAddingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau produit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du produit</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unité</label>
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="kg">kg</option>
                  <option value="pièce">pièce</option>
                  <option value="botte">botte</option>
                  <option value="pot">pot</option>
                  <option value="litre">litre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Légumes">Légumes</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Épicerie">Épicerie</option>
                  <option value="Boulangerie">Boulangerie</option>
                  <option value="Fromagerie">Fromagerie</option>
                </select>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Ajouter
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                {getStatusBadge(product.status)}
              </div>
              <p className="text-gray-600 mb-1">Catégorie: {product.category}</p>
              <p className="text-green-600 font-bold text-lg mb-1">{product.price.toFixed(2)} €/{product.unit}</p>
              <p className={`mb-3 ${product.stock === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                Stock: {product.stock} {product.unit}s
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Eye size={14} />
                  Voir
                </Button>
                <Button size="sm" variant="outline">
                  <Edit2 size={14} />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;

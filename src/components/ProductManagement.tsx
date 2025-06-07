import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

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
}

interface ProductToCreate {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  unit: string;
  image?: File | null;
}

interface ProductToUpdate extends Partial<Omit<ProductFromServer, 'id' | 'image' | 'status' | 'producerId'>> {
  id: string;
  image?: File | null; // Allow explicitly providing a new file, or null to remove
}

interface ProductManagementProps {
  producerId: string;
}

const ProductManagement = ({ producerId }: ProductManagementProps) => {
  const { toast } = useToast();

  // Fetch products
  const { data: products, isLoading, isError, error, refetch } = useQuery<ProductFromServer[], Error>({
    queryKey: ['products', producerId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get(`${API_URL}/products/producer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  console.log("Products data:", products);
  console.log("Is loading:", isLoading);
  console.log("Is error:", isError);
  console.log("Error:", error);

  // Add product mutation
  const addProductMutation = useMutation<ProductFromServer, Error, ProductToCreate>({
    mutationFn: async (newProductData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const formData = new FormData();
      formData.append('name', newProductData.name);
      formData.append('price', newProductData.price.toString());
      formData.append('stock', newProductData.stock.toString());
      formData.append('category', newProductData.category);
      formData.append('unit', newProductData.unit);
      if (newProductData.description) {
        formData.append('description', newProductData.description);
      }
      if (newProductData.image) {
        formData.append('image', newProductData.image);
      }

      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Produit ajouté",
        description: "Le nouveau produit a été ajouté avec succès.",
      });
      refetch();
      setIsAddingProduct(false);
      setProductImage(null);
    },
    onError: (err) => {
      toast({
        title: "Erreur",
        description: `Échec de l'ajout du produit: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation<ProductFromServer, Error, ProductToUpdate>({
    mutationFn: async (updatedProductData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const formData = new FormData();
      for (const key in updatedProductData) {
        if (key !== 'image') {
          formData.append(key, (updatedProductData as any)[key]);
        }
      }
      if (updatedProductData.image) {
        formData.append('image', updatedProductData.image);
      }

      const response = await axios.put(`${API_URL}/products/${updatedProductData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
      refetch();
      setEditingProduct(null);
      setProductImage(null);
    },
    onError: (err) => {
      toast({
        title: "Erreur",
        description: `Échec de la mise à jour du produit: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation<void, Error, string>({
    mutationFn: async (productId) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
      refetch();
    },
    onError: (err) => {
      toast({
        title: "Erreur",
        description: `Échec de la suppression du produit: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFromServer | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Légumes',
    description: '',
    unit: 'kg'
  });

  const [productImage, setProductImage] = useState<File | null>(null);

  const [viewingProduct, setViewingProduct] = useState<ProductFromServer | null>(null);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      description: newProduct.description,
      unit: newProduct.unit,
      image: productImage
    });
  };

  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const dataToSend: ProductToUpdate = {
      id: editingProduct.id,
      name: editingProduct.name,
      price: parseFloat(editingProduct.price as any),
      stock: parseInt(editingProduct.stock as any),
      category: editingProduct.category,
      unit: editingProduct.unit,
      description: editingProduct.description,
    };

    if (productImage) {
      dataToSend.image = productImage;
    }

    updateProductMutation.mutate(dataToSend);
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

  if (isLoading) return <div className="text-center py-8">Chargement des produits...</div>;
  if (isError) return <div className="text-center py-8 text-red-600">Erreur: {error?.message}</div>;

  // Ensure products is an array for rendering
  const productsToDisplay = products || [];

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
                <p className="text-xl font-bold">{productsToDisplay.length}</p>
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
                <p className="text-xl font-bold">{Array.isArray(productsToDisplay) ? productsToDisplay.filter(p => p.stock === 0).length : 0}</p>
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
                <label className="block text-sm font-medium mb-1">Image du produit</label>
                <Input
                  type="file"
                  onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
                  accept="image/*"
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={addProductMutation.isPending}>
                  {addProductMutation.isPending ? 'Ajout...' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulaire d'édition */}
      {editingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Modifier le produit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du produit</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image du produit</label>
                <Input
                  type="file"
                  onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
                  accept="image/*"
                />
                {editingProduct.images.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">Image actuelle: <a href={editingProduct.images[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir l'image</a></p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) as any } : null)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) as any } : null)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unité</label>
                <select
                  value={editingProduct.unit}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, unit: e.target.value } : null)}
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
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={updateProductMutation.isPending}>
                  {updateProductMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsToDisplay.map((product) => (
          <Card key={product.id} className="relative overflow-hidden group">
            {product.status === 'rupture' && (
              <Badge variant="destructive" className="absolute top-2 right-2 text-xs font-semibold">Rupture</Badge>
            )}
            {product.status === 'active' && (
              <Badge className="bg-green-500 text-white absolute top-2 right-2 text-xs font-semibold">Actif</Badge>
            )}
            <CardContent className="p-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                {product.images.length > 0 ? (
                  <img 
                    src={`${API_URL.replace('/api', '')}/uploads/${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package size={48} />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Catégorie: {product.category}</p>
              <p className="text-xl font-bold text-green-600 mb-2">{product.price.toFixed(2)} €/{product.unit}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock} {product.unit}s</p>
              
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setViewingProduct(product)}>
                  <Eye size={16} className="mr-2" />
                  Voir
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                  <Edit2 size={16} className="mr-2" />
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)} disabled={deleteProductMutation.isPending}>
                  {deleteProductMutation.isPending ? 'Suppression...' : <Trash2 size={16} className="mr-2" />}
                  
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product View Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
            <Button 
              variant="ghost"
              className="absolute top-3 right-3" 
              onClick={() => setViewingProduct(null)}
            >
              X
            </Button>
            <h2 className="text-2xl font-bold mb-4">Détails du produit: {viewingProduct.name}</h2>
            <div className="space-y-3">
              <p><strong>Prix:</strong> {viewingProduct.price.toFixed(2)} €/{viewingProduct.unit}</p>
              <p><strong>Stock:</strong> {viewingProduct.stock} {viewingProduct.unit}s</p>
              <p><strong>Catégorie:</strong> {viewingProduct.category}</p>
              <p><strong>Statut:</strong> {getStatusBadge(viewingProduct.status)}</p>
              <p><strong>Description:</strong> {viewingProduct.description || 'Aucune description.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

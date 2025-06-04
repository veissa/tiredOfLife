
import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'en_attente' | 'preparee' | 'prete' | 'retiree' | 'annulee';
  orderDate: string;
  pickupDate?: string;
  pickupPoint: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '001',
      customerName: 'Marie Dupont',
      customerEmail: 'marie.dupont@email.com',
      items: [
        { name: 'Tomates bio', quantity: 2, price: 4.50 },
        { name: 'Miel de lavande', quantity: 1, price: 12.00 }
      ],
      total: 21.00,
      status: 'en_attente',
      orderDate: '2024-06-03',
      pickupDate: '2024-06-04',
      pickupPoint: 'Marché de Provence'
    },
    {
      id: '002',
      customerName: 'Jean Martin',
      customerEmail: 'jean.martin@email.com',
      items: [
        { name: 'Tomates bio', quantity: 1, price: 4.50 }
      ],
      total: 4.50,
      status: 'prete',
      orderDate: '2024-06-02',
      pickupDate: '2024-06-03',
      pickupPoint: 'Ferme du Soleil'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
      preparee: { label: 'Préparée', class: 'bg-blue-100 text-blue-800' },
      prete: { label: 'Prête', class: 'bg-green-100 text-green-800' },
      retiree: { label: 'Retirée', class: 'bg-gray-100 text-gray-800' },
      annulee: { label: 'Annulée', class: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.class}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente': return <Clock className="text-yellow-600" size={20} />;
      case 'preparee': return <Package className="text-blue-600" size={20} />;
      case 'prete': return <CheckCircle className="text-green-600" size={20} />;
      case 'retiree': return <CheckCircle className="text-gray-600" size={20} />;
      case 'annulee': return <XCircle className="text-red-600" size={20} />;
      default: return <Clock className="text-gray-600" size={20} />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'en_attente').length,
    ready: orders.filter(o => o.status === 'prete').length,
    completed: orders.filter(o => o.status === 'retiree').length
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des commandes</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total commandes</p>
                <p className="text-xl font-bold">{orderStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-yellow-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-xl font-bold">{orderStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Prêtes</p>
                <p className="text-xl font-bold">{orderStats.ready}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Complétées</p>
                <p className="text-xl font-bold">{orderStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold">Commande #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                  <p className="text-lg font-bold text-green-600 mt-1">{order.total.toFixed(2)} €</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Produits commandés:</h4>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {item.quantity}x {item.name} - {(item.quantity * item.price).toFixed(2)} €
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-500" />
                      <span className="text-sm">Point de retrait: {order.pickupPoint}</span>
                    </div>
                    <p className="text-sm text-gray-600">Commandé le: {order.orderDate}</p>
                    {order.pickupDate && (
                      <p className="text-sm text-gray-600">Retrait prévu: {order.pickupDate}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                {order.status === 'en_attente' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateOrderStatus(order.id, 'preparee')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Marquer comme préparée
                  </Button>
                )}
                {order.status === 'preparee' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateOrderStatus(order.id, 'prete')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Marquer comme prête
                  </Button>
                )}
                {order.status === 'prete' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateOrderStatus(order.id, 'retiree')}
                    variant="outline"
                  >
                    Marquer comme retirée
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Eye size={14} />
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;

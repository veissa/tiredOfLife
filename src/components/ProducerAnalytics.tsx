
import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProducerAnalytics = () => {
  const salesData = [
    { name: 'Jan', ventes: 1200, commandes: 24 },
    { name: 'Fév', ventes: 1400, commandes: 28 },
    { name: 'Mar', ventes: 1100, commandes: 22 },
    { name: 'Avr', ventes: 1600, commandes: 32 },
    { name: 'Mai', ventes: 1800, commandes: 36 },
    { name: 'Juin', ventes: 1247, commandes: 23 }
  ];

  const topProducts = [
    { name: 'Tomates bio', ventes: 450, pourcentage: 36 },
    { name: 'Miel de lavande', ventes: 320, pourcentage: 26 },
    { name: 'Courgettes', ventes: 240, pourcentage: 19 },
    { name: 'Salade', ventes: 180, pourcentage: 14 },
    { name: 'Radis', ventes: 57, pourcentage: 5 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytiques et rapports</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventes ce mois</p>
                <p className="text-2xl font-bold">1,247 €</p>
                <p className="text-xs text-green-600 mt-1">+12% vs mois dernier</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-blue-600 mt-1">+5% vs mois dernier</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients uniques</p>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-purple-600 mt-1">+3 nouveaux</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Panier moyen</p>
                <p className="text-2xl font-bold">54,22 €</p>
                <p className="text-xs text-orange-600 mt-1">+8% vs mois dernier</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ventes" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nombre de commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commandes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top produits */}
      <Card>
        <CardHeader>
          <CardTitle>Produits les plus vendus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${product.pourcentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{product.ventes} €</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prochains objectifs */}
      <Card>
        <CardHeader>
          <CardTitle>Objectifs du mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Objectif de ventes: 1,500 €</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
                <span className="text-sm font-medium">83%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Objectif commandes: 30</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '77%' }}></div>
                </div>
                <span className="text-sm font-medium">77%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerAnalytics;

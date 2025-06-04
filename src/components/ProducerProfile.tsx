
import React, { useState } from 'react';
import { Save, Camera, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ProducerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    shopName: 'Ferme Bio du Soleil',
    description: 'Exploitation familiale depuis 3 générations, spécialisée dans les légumes bio et les produits du terroir.',
    address: '123 Chemin de la Ferme, 13000 Marseille',
    phone: '04 91 23 45 67',
    email: 'contact@ferme-bio-soleil.fr',
    website: 'www.ferme-bio-soleil.fr',
    certifications: 'Agriculture Biologique, Label Rouge',
    pickupDays: 'Mardi, Jeudi, Samedi',
    pickupHours: '8h00 - 18h00',
    deliveryZones: 'Marseille, Aix-en-Provence, Aubagne'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Ici on sauvegarderait les données
    console.log('Profil sauvegardé:', profile);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profil de ma boutique</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
            Modifier le profil
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save size={16} />
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
          </div>
        )}
      </div>

      {/* Photo de la boutique */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src="/placeholder.svg"
                alt="Photo de la boutique"
                className="w-32 h-32 rounded-lg object-cover"
              />
              {isEditing && (
                <button className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white hover:bg-opacity-70">
                  <Camera size={24} />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{profile.shopName}</h3>
              <p className="text-gray-600">{profile.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de la boutique</label>
              {isEditing ? (
                <Input
                  value={profile.shopName}
                  onChange={(e) => setProfile(prev => ({ ...prev, shopName: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.shopName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Certifications</label>
              {isEditing ? (
                <Input
                  value={profile.certifications}
                  onChange={(e) => setProfile(prev => ({ ...prev, certifications: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.certifications}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            {isEditing ? (
              <textarea
                value={profile.description}
                onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{profile.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <MapPin size={16} className="mr-1" />
                Adresse
              </label>
              {isEditing ? (
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.address}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Phone size={16} className="mr-1" />
                Téléphone
              </label>
              {isEditing ? (
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.phone}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Mail size={16} className="mr-1" />
                Email
              </label>
              {isEditing ? (
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.email}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Globe size={16} className="mr-1" />
                Site web
              </label>
              {isEditing ? (
                <Input
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.website}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de retrait */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de retrait et livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Jours de retrait</label>
              {isEditing ? (
                <Input
                  value={profile.pickupDays}
                  onChange={(e) => setProfile(prev => ({ ...prev, pickupDays: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.pickupDays}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Horaires de retrait</label>
              {isEditing ? (
                <Input
                  value={profile.pickupHours}
                  onChange={(e) => setProfile(prev => ({ ...prev, pickupHours: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.pickupHours}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Zones de livraison</label>
            {isEditing ? (
              <Input
                value={profile.deliveryZones}
                onChange={(e) => setProfile(prev => ({ ...prev, deliveryZones: e.target.value }))}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{profile.deliveryZones}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerProfile;

import React, { useState, useEffect } from 'react';
import { Save, Camera, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ProducerProfileData {
  shopName: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  certifications?: string[];
  pickupInfo?: { // Explicitly define pickupInfo as an object
    pickupDays?: string;
    pickupHours?: string;
    deliveryZones?: string;
  };
  images?: string[];
}

const ProducerProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState<ProducerProfileData>({
    shopName: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    certifications: [],
    pickupInfo: {},
    images: []
  });
  const [shopImageFile, setShopImageFile] = useState<File | null>(null); // New state for the image file

  // Fetch producer profile
  const { data: fetchedProfile, isLoading, isError, error, refetch } = useQuery<ProducerProfileData, Error>({
    queryKey: ['producerProfile'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get(`${API_URL}/producers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (fetchedProfile) {
      setLocalProfile({
        shopName: fetchedProfile.shopName || '',
        description: fetchedProfile.description || '',
        address: fetchedProfile.address || '',
        phone: fetchedProfile.phone || '',
        email: fetchedProfile.email || '',
        website: fetchedProfile.website || '',
        certifications: fetchedProfile.certifications || [],
        pickupInfo: fetchedProfile.pickupInfo || {},
        images: fetchedProfile.images || []
      });
    }
  }, [fetchedProfile]);

  // Update producer profile mutation
  const updateProfileMutation = useMutation<ProducerProfileData, Error, FormData>({
    mutationFn: async (formData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await axios.put(`${API_URL}/producers/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data', // Axios automatically sets this for FormData
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Profil mis à jour",
        description: "Votre profil de boutique a été mis à jour avec succès.",
      });
      refetch();
      setIsEditing(false);
      setShopImageFile(null); // Clear the selected file after successful upload
    },
    onError: (err) => {
      toast({
        title: "Erreur",
        description: `Échec de la mise à jour du profil: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const formData = new FormData();
    formData.append('shopName', localProfile.shopName);
    if (localProfile.description) formData.append('description', localProfile.description);
    if (localProfile.address) formData.append('address', localProfile.address);
    if (localProfile.phone) formData.append('phone', localProfile.phone);
    if (localProfile.email) formData.append('email', localProfile.email);
    if (localProfile.website) formData.append('website', localProfile.website);
    if (localProfile.certifications) {
      // Append each certification as a separate field or a JSON stringified array
      formData.append('certifications', JSON.stringify(localProfile.certifications));
    }
    if (localProfile.pickupInfo) {
      formData.append('pickupInfo', JSON.stringify(localProfile.pickupInfo));
    }
    if (shopImageFile) {
      formData.append('shopImage', shopImageFile); // Append the image file
    }

    updateProfileMutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShopImageFile(e.target.files[0]);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement du profil...</div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-red-500">Erreur: {error?.message}</div>;
  }

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
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={updateProfileMutation.isPending}> 
              <Save size={16} />
              {updateProfileMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={updateProfileMutation.isPending}> 
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
                src={localProfile.images && localProfile.images.length > 0 ? `${API_URL.replace('/api', '')}/uploads/${localProfile.images[0]}` : "/placeholder.svg"}
                alt="Photo de la boutique"
                className="w-32 h-32 rounded-lg object-cover"
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white hover:bg-opacity-70 cursor-pointer">
                  <Camera size={24} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{localProfile.shopName}</h3>
              <p className="text-gray-600">{localProfile.description}</p>
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
                  value={localProfile.shopName}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, shopName: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.shopName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Certifications</label>
              {isEditing ? (
                <Input
                  value={localProfile.certifications?.join(', ') || ''} 
                  onChange={(e) => setLocalProfile(prev => ({
                    ...prev,
                    certifications: e.target.value ? e.target.value.split(', ').map(s => s.trim()) : [] 
                  }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.certifications?.join(', ') || ''}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            {isEditing ? (
              <textarea
                value={localProfile.description}
                onChange={(e) => setLocalProfile(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{localProfile.description}</p>
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
                  value={localProfile.address}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, address: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.address}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Phone size={16} className="mr-1" />
                Téléphone
              </label>
              {isEditing ? (
                <Input
                  value={localProfile.phone}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.phone}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Mail size={16} className="mr-1" />
                Email
              </label>
              {isEditing ? (
                <Input
                  value={localProfile.email}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.email}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Globe size={16} className="mr-1" />
                Site web
              </label>
              {isEditing ? (
                <Input
                  value={localProfile.website}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, website: e.target.value }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.website}</p>
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
                  value={localProfile.pickupInfo?.pickupDays || ''}
                  onChange={(e) => setLocalProfile(prev => ({
                    ...prev,
                    pickupInfo: { ...prev.pickupInfo, pickupDays: e.target.value }
                  }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.pickupInfo?.pickupDays || ''}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Horaires de retrait</label>
              {isEditing ? (
                <Input
                  value={localProfile.pickupInfo?.pickupHours || ''}
                  onChange={(e) => setLocalProfile(prev => ({
                    ...prev,
                    pickupInfo: { ...prev.pickupInfo, pickupHours: e.target.value }
                  }))}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{localProfile.pickupInfo?.pickupHours || ''}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Zones de livraison</label>
            {isEditing ? (
              <Input
                value={localProfile.pickupInfo?.deliveryZones || ''}
                onChange={(e) => setLocalProfile(prev => ({
                  ...prev,
                  pickupInfo: { ...prev.pickupInfo, deliveryZones: e.target.value }
                }))}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{localProfile.pickupInfo?.deliveryZones || ''}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerProfile;

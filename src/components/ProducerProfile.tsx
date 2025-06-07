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
  certifications?: string[];
  pickupInfo?: { 
    location?: string;
    hours?: string;
    instructions?: string;
    phone?: string;
    email?: string;
  };
  images?: string[];
  website?: string; // Add website here as it's part of the form
}

interface ProducerProfileProps {
  producerId: string;
  refetchProducers: () => void;
}

const ProducerProfile = ({ producerId, refetchProducers }: ProducerProfileProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState<ProducerProfileData>({
    shopName: '',
    description: '',
    address: '',
    certifications: [],
    pickupInfo: {},
    images: [],
    website: '',
  });
  const [shopImageFile, setShopImageFile] = useState<File | null>(null);

  // Fetch producer profile
  const { data: fetchedProfile, isLoading, isError, error, refetch } = useQuery<ProducerProfileData, Error>({
    queryKey: ['producerProfile', producerId], // Include producerId in query key
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get(`${API_URL}/producers/profile/${producerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data[0]; // Assuming API returns an array, take the first (and only) one
    },
    enabled: !!producerId, // Only fetch when producerId is available
  });

  useEffect(() => {
    if (fetchedProfile) {
      setLocalProfile({
        shopName: fetchedProfile.shopName || '',
        description: fetchedProfile.description || '',
        address: fetchedProfile.address || '',
        certifications: fetchedProfile.certifications || [],
        pickupInfo: fetchedProfile.pickupInfo || {},
        images: fetchedProfile.images || [],
        website: fetchedProfile.website || '',
        // Extract phone and email from pickupInfo if they exist
        phone: fetchedProfile.pickupInfo?.phone || '',
        email: fetchedProfile.pickupInfo?.email || '',
      });
    } else {
      // Reset local profile when no fetched profile (e.g., when producerId changes to null or different shop)
      setLocalProfile({
        shopName: '',
        description: '',
        address: '',
        certifications: [],
        pickupInfo: {},
        images: [],
        website: '',
        phone: '',
        email: '',
      });
    }
    setIsEditing(false); // Exit editing mode when profile changes
    setShopImageFile(null); // Clear any selected image file
  }, [fetchedProfile, producerId]);

  // Update producer profile mutation
  const updateProfileMutation = useMutation<ProducerProfileData, Error, FormData>({
    mutationFn: async (formData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await axios.put(`${API_URL}/producers/profile/${producerId}`, formData, {
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
      refetch(); // Refetch the current producer profile
      refetchProducers(); // Refetch the list of producers in the parent component
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
    if (localProfile.website) formData.append('website', localProfile.website);
    
    // Combine phone and email into pickupInfo
    const updatedPickupInfo = {
      ...localProfile.pickupInfo,
      phone: localProfile.phone,
      email: localProfile.email,
    };
    formData.append('pickupInfo', JSON.stringify(updatedPickupInfo));

    if (localProfile.certifications) {
      formData.append('certifications', JSON.stringify(localProfile.certifications));
    }
    if (shopImageFile) {
      formData.append('shopImage', shopImageFile); 
    }

    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => {
      if (name === 'phone' || name === 'email') {
        return {
          ...prev,
          [name]: value,
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });
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
            <Input
              label="Nom de la boutique"
              name="shopName"
              value={localProfile.shopName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <Input
              label="Adresse"
              name="address"
              value={localProfile.address || ''}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <Input
              label="Téléphone"
              name="phone"
              value={localProfile.phone || ''}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <Input
              label="Email"
              name="email"
              value={localProfile.email || ''}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <Input
              label="Site Web"
              name="website"
              value={localProfile.website || ''}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <Input
              label="Certifications (séparées par des virgules)"
              name="certifications"
              value={localProfile.certifications?.join(', ') || ''}
              onChange={(e) => setLocalProfile({
                ...localProfile, certifications: e.target.value.split(', ').map(s => s.trim())
              })}
              readOnly={!isEditing}
            />
          </div>
          <div className="grid grid-cols-1">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Description de votre activité"
              name="description"
              value={localProfile.description || ''}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations de retrait */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de retrait</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Lieu de retrait"
            name="pickupInfo.location"
            value={localProfile.pickupInfo?.location || ''}
            onChange={(e) => setLocalProfile({
              ...localProfile, pickupInfo: { ...localProfile.pickupInfo, location: e.target.value }
            })}
            readOnly={!isEditing}
          />
          <Input
            label="Heures de retrait"
            name="pickupInfo.hours"
            value={localProfile.pickupInfo?.hours || ''}
            onChange={(e) => setLocalProfile({
              ...localProfile, pickupInfo: { ...localProfile.pickupInfo, hours: e.target.value }
            })}
            readOnly={!isEditing}
          />
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
            placeholder="Instructions de retrait"
            name="pickupInfo.instructions"
            value={localProfile.pickupInfo?.instructions || ''}
            onChange={(e) => setLocalProfile({
              ...localProfile, pickupInfo: { ...localProfile.pickupInfo, instructions: e.target.value }
            })}
            readOnly={!isEditing}
          />
          <Input
            label="Zones de livraison (séparées par des virgules)"
            name="pickupInfo.deliveryZones"
            value={localProfile.pickupInfo?.deliveryZones || ''}
            onChange={(e) => setLocalProfile({
              ...localProfile, pickupInfo: { ...localProfile.pickupInfo, deliveryZones: e.target.value }
            })}
            readOnly={!isEditing}
          />
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Visibilité de la boutique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={localProfile.isActive}
              onChange={(e) => setLocalProfile({ ...localProfile, isActive: e.target.checked })}
              disabled={!isEditing}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <label htmlFor="isActive" className="text-gray-700">Rendre la boutique visible aux clients</label>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default ProducerProfile;

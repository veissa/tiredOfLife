import React, { useState, useEffect } from 'react';
import { Save, Camera, MapPin, Phone, Mail, Globe, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
    deliveryZones?: string[]; // Added deliveryZones to pickupInfo
  };
  images?: string[];
  website?: string; 
  phone?: string; // These are extracted for form input
  email?: string; // These are extracted for form input
}

interface ProducerProfileProps {
  producerId: string;
  refetchProducers: () => void;
}

const formSchema = z.object({
  shopName: z.string().min(2, { message: "Le nom de la boutique doit contenir au moins 2 caractères." }),
  description: z.string().optional(),
  address: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  pickupInfo: z.object({
    location: z.string().optional(),
    hours: z.string().optional(),
    instructions: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Adresse e-mail invalide.").optional().or(z.literal('')), // Allow empty string
    deliveryZones: z.array(z.string()).optional(),
  }).optional(),
  images: z.array(z.string()).optional(),
  website: z.string().optional(),
});

const ProducerProfile = ({ producerId, refetchProducers }: ProducerProfileProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [shopImageFile, setShopImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: '',
      description: '',
      address: '',
      certifications: [],
      pickupInfo: {
        location: '',
        hours: '',
        instructions: '',
        phone: '',
        email: '',
        deliveryZones: [],
      },
      images: [],
      website: '',
    },
  });

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
      form.reset({
        shopName: fetchedProfile.shopName || '',
        description: fetchedProfile.description || '',
        address: fetchedProfile.address || '',
        certifications: fetchedProfile.certifications || [],
        pickupInfo: {
          location: fetchedProfile.pickupInfo?.location || '',
          hours: fetchedProfile.pickupInfo?.hours || '',
          instructions: fetchedProfile.pickupInfo?.instructions || '',
          phone: fetchedProfile.pickupInfo?.phone || '',
          email: fetchedProfile.pickupInfo?.email || '',
          deliveryZones: fetchedProfile.pickupInfo?.deliveryZones || [],
        },
        images: fetchedProfile.images || [],
        website: fetchedProfile.website || '',
      });
    } else {
      form.reset(); // Reset form if no profile is fetched
    }
    setIsEditing(false); // Exit editing mode when profile changes
    setShopImageFile(null); // Clear any selected image file
  }, [fetchedProfile, producerId, form]);

  // Update producer profile mutation
  const updateProfileMutation = useMutation<ProducerProfileData, Error, FormData>({
    mutationFn: async (formData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await axios.put(`${API_URL}/producers/profile/${producerId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette boutique ? Cette action est irréversible.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        await axios.delete(`${API_URL}/producers/profile/${producerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({
          title: "Boutique supprimée",
          description: "Votre boutique a été supprimée avec succès.",
        });
        refetchProducers(); // Refetch producers in parent to update list
        navigate('/account/provider'); // Redirect after deletion
      } catch (error) {
        console.error('Erreur lors de la suppression de la boutique:', error);
        toast({
          title: "Erreur",
          description: `Échec de la suppression de la boutique: ${error.response?.data?.message || error.message}`,
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('shopName', values.shopName);
    if (values.description) formData.append('description', values.description);
    if (values.address) formData.append('address', values.address);
    if (values.website) formData.append('website', values.website);
    
    // Combine phone and email into pickupInfo
    const updatedPickupInfo = {
      ...values.pickupInfo,
    };
    formData.append('pickupInfo', JSON.stringify(updatedPickupInfo));

    if (values.certifications) {
      formData.append('certifications', JSON.stringify(values.certifications));
    }
    if (shopImageFile) {
      formData.append('shopImage', shopImageFile); 
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
        <div className="space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
              Modifier le profil
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={form.handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700" disabled={updateProfileMutation.isPending}> 
                <Save size={16} />
                {updateProfileMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                form.reset(fetchedProfile ? {
                  shopName: fetchedProfile.shopName || '',
                  description: fetchedProfile.description || '',
                  address: fetchedProfile.address || '',
                  certifications: fetchedProfile.certifications || [],
                  pickupInfo: {
                    location: fetchedProfile.pickupInfo?.location || '',
                    hours: fetchedProfile.pickupInfo?.hours || '',
                    instructions: fetchedProfile.pickupInfo?.instructions || '',
                    phone: fetchedProfile.pickupInfo?.phone || '',
                    email: fetchedProfile.pickupInfo?.email || '',
                    deliveryZones: fetchedProfile.pickupInfo?.deliveryZones || [],
                  },
                  images: fetchedProfile.images || [],
                  website: fetchedProfile.website || '',
                } : undefined); // Reset form to fetched values or default
              }} disabled={updateProfileMutation.isPending}> 
                Annuler
              </Button>
            </div>
          )}
          <Button 
            onClick={handleDelete}
            variant="destructive"
            className="ml-4"
            disabled={updateProfileMutation.isPending} // Disable delete during save
          >
            <Trash2 size={16} />
            Supprimer la boutique
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo de la boutique */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={form.watch('images') && form.watch('images').length > 0 ? `${API_URL.replace('/api', '')}/uploads/${form.watch('images')[0]}` : "/placeholder.svg"}
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
                  <h3 className="text-xl font-bold mb-2">{form.watch('shopName')}</h3>
                  <p className="text-gray-600">{form.watch('description')}</p>
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
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la boutique</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de votre boutique" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse de votre boutique" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description de votre boutique" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web (facultatif)</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre site web" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations de collecte */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de collecte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupInfo.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu de collecte</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Adresse de la ferme, Marché local" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupInfo.hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heures de collecte</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Lun-Ven 16h-18h" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupInfo.instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions de collecte</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sonnez à la porte arrière" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone de contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: +33 6 12 34 56 78" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: contact@boutique.fr" {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Certifications (remains a simple input for now)*/}
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications (séparées par des virgules)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bio, Local, etc."
                          value={field.value ? field.value.join(', ') : ''}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupInfo.deliveryZones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zones de livraison (Code Postale)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 75001, 75002"
                          value={field.value ? field.value.join(', ') : ''}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ProducerProfile;

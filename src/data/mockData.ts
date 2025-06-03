
export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  producer: string;
  image: string;
  stock: number;
  category: string;
  description?: string;
}

export interface Producer {
  id: number;
  name: string;
  description: string;
  specialties: string[];
  image: string;
  location: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Pommes Bio Gala",
    price: 3.50,
    unit: "kg",
    producer: "Ferme du Soleil",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
    stock: 25,
    category: "Fruits",
    description: "Pommes biologiques croquantes et sucrées"
  },
  {
    id: 2,
    name: "Carottes du Potager",
    price: 2.80,
    unit: "kg",
    producer: "Jardin des Saveurs",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400",
    stock: 30,
    category: "Légumes",
    description: "Carottes fraîches et croquantes"
  },
  {
    id: 3,
    name: "Fromage de Chèvre",
    price: 8.50,
    unit: "pièce",
    producer: "Chèvrerie des Prés",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400",
    stock: 12,
    category: "Fromages",
    description: "Fromage de chèvre artisanal aux herbes"
  },
  {
    id: 4,
    name: "Miel d'Acacia",
    price: 12.00,
    unit: "pot 500g",
    producer: "Rucher des Collines",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    stock: 8,
    category: "Épicerie",
    description: "Miel d'acacia pur et naturel"
  },
  {
    id: 5,
    name: "Salade Mixte",
    price: 2.50,
    unit: "sachet",
    producer: "Jardin des Saveurs",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    stock: 20,
    category: "Légumes",
    description: "Mélange de salades fraîches de saison"
  },
  {
    id: 6,
    name: "Œufs Fermiers",
    price: 4.20,
    unit: "douzaine",
    producer: "Ferme du Coq",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
    stock: 15,
    category: "Œufs",
    description: "Œufs frais de poules élevées au grand air"
  },
  {
    id: 7,
    name: "Pain de Campagne",
    price: 3.80,
    unit: "pièce",
    producer: "Boulangerie Martin",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    stock: 6,
    category: "Boulangerie",
    description: "Pain artisanal au levain naturel"
  },
  {
    id: 8,
    name: "Tomates Cerises",
    price: 5.20,
    unit: "barquette 500g",
    producer: "Serre des Délices",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400",
    stock: 18,
    category: "Légumes",
    description: "Tomates cerises sucrées et parfumées"
  }
];

export const mockProducers: Producer[] = [
  {
    id: 1,
    name: "Ferme du Soleil",
    description: "Exploitation familiale en agriculture biologique depuis 3 générations. Nous cultivons fruits et légumes de saison dans le respect de l'environnement.",
    specialties: ["Fruits bio", "Légumes anciens", "Herbes aromatiques"],
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600",
    location: "Val-de-Marne"
  },
  {
    id: 2,
    name: "Chèvrerie des Prés",
    description: "Nos chèvres pâturent librement dans les prairies. Nous transformons leur lait en fromages artisanaux aux saveurs authentiques.",
    specialties: ["Fromages de chèvre", "Yaourts", "Faisselles"],
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600",
    location: "Essonne"
  },
  {
    id: 3,
    name: "Jardin des Saveurs",
    description: "Maraîcher passionné cultivant une grande variété de légumes frais selon les méthodes de permaculture.",
    specialties: ["Légumes de saison", "Aromates", "Micro-pousses"],
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
    location: "Hauts-de-Seine"
  },
  {
    id: 4,
    name: "Rucher des Collines",
    description: "Apiculteur artisan produisant des miels de qualité. Nos ruches sont placées dans des environnements préservés.",
    specialties: ["Miel d'acacia", "Miel de tilleul", "Propolis"],
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600",
    location: "Seine-et-Marne"
  }
];

export const categories = ["Fruits", "Légumes", "Fromages", "Épicerie", "Œufs", "Boulangerie"];
export const producers = ["Ferme du Soleil", "Jardin des Saveurs", "Chèvrerie des Prés", "Rucher des Collines", "Ferme du Coq", "Boulangerie Martin", "Serre des Délices"];

/**
 * Modelos de dados e tipos da plataforma iPet (Super App Pet)
 */

export type UserRole = 'tutor' | 'partner' | 'courier' | 'admin';

export interface UserAddress {
  id: string;
  label: string; // ex: 'Casa', 'Trabalho'
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  hubId: string;
  hubName: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  addresses: UserAddress[];
  role: UserRole;
  isPrime: boolean;
  hasProtect: boolean;
  createdAt: string;
}

export type PetSpecies = 'cao' | 'gato' | 'outro';
export type PetSize = 'mini' | 'pequeno' | 'medio' | 'grande' | 'gigante';

export interface PetHealthRecord {
  id: string;
  petId: string;
  type: 'vacina' | 'exame' | 'medicacao' | 'consulta';
  title: string;
  date: string;
  vetName: string;
  clinic?: string;
  nextDueDate?: string;
  notes?: string;
  attachmentUrl?: string;
  documentName?: string;
  documentType?: 'pdf' | 'image';
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  size: PetSize;
  weightKg: number;
  birthDate: string; // YYYY-MM-DD
  gender: 'macho' | 'femea';
  photoUrl: string;
  photos: string[];
  microchipCode?: string;
  allergies: string[];
  conditions: string[];
  notes: string;
  active: boolean;
  dailyFoodGrams?: number;
  currentFoodSku?: string;
  healthRecords: PetHealthRecord[];
}

export type ProductCategory = 
  | 'racao' 
  | 'farmacia' 
  | 'higiene' 
  | 'petiscos' 
  | 'brinquedos' 
  | 'acessorios';

export interface Product {
  id: string;
  partnerId: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  weightKg: number;
  imageUrl: string;
  isTop100: boolean;
  top100Rank?: number;
  isEmergencyEssential: boolean; // para modo noturno (20h-08h)
  stockQty: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  targetPet?: 'cao' | 'gato' | 'ambos';
}

export interface CartItem {
  product: Product;
  qty: number;
  petId?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'picking' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderEvent {
  status: OrderStatus;
  title: string;
  description: string;
  at: string;
}

export interface Order {
  id: string;
  userId: string;
  hubId: string;
  hubName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  isEmergency: boolean;
  status: OrderStatus;
  etaMinutes: number;
  placedAt: string;
  paymentMethod: string;
  address: string;
  courierName?: string;
  courierPhone?: string;
  events: OrderEvent[];
}

export interface Hub {
  id: string;
  name: string;
  type: 'petshop' | 'atacarejo' | 'darkstore';
  address: string;
  neighborhood: string;
  radiusKm: number;
  openHours: string;
  is24h: boolean;
  rating: number;
  stockCount: number;
}

export interface SosSighting {
  id: string;
  alertId: string;
  reporterName: string;
  reporterPhone?: string;
  locationName: string;
  note: string;
  photoUrl?: string;
  createdAt: string;
}

export interface SosAlert {
  id: string;
  ownerId: string;
  ownerName: string;
  petId: string;
  petName: string;
  species: PetSpecies;
  breed: string;
  photoUrl: string;
  status: 'ativo' | 'resolvido';
  lastSeenAddress: string;
  lastSeenAt: string;
  description: string;
  rewardAmount?: number;
  contactPhone: string;
  radiusKm: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  microchipCode?: string;
  sightings: SosSighting[];
}

export interface SubscriptionPlan {
  id: 'prime' | 'protect';
  title: string;
  subtitle: string;
  priceMonthly: number;
  features: string[];
  popular?: boolean;
  badge?: string;
}

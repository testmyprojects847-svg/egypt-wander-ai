export interface Tour {
  id: string;
  name: string;
  description: string;
  city: string;
  price: number;
  currency: 'EGP';
  duration: string;
  availability: 'available' | 'unavailable';
  image_url: string;
  features: string[];
  last_updated: string;
  // New enhanced fields
  starting_point?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  experience_level?: string;
  best_for?: string[];
  cancellation_policy?: string;
}

export type TourFormData = Omit<Tour, 'id' | 'last_updated'>;

export const EGYPTIAN_CITIES = [
  'Cairo',
  'Giza',
  'Luxor',
  'Aswan',
  'Alexandria',
  'Sharm El Sheikh',
  'Hurghada',
  'Marsa Alam',
  'Dahab',
  'Siwa Oasis',
  'Bahariya Oasis',
  'Fayoum',
];

export const EXPERIENCE_LEVELS = [
  { value: 'relaxing', label: 'Relaxing', labelAr: 'مريحة' },
  { value: 'moderate', label: 'Moderate', labelAr: 'متوسطة' },
  { value: 'active', label: 'Active', labelAr: 'نشطة' },
];

export const BEST_FOR_OPTIONS = [
  { value: 'couples', label: 'Couples', labelAr: 'أزواج' },
  { value: 'families', label: 'Families', labelAr: 'عائلات' },
  { value: 'seniors', label: 'Seniors', labelAr: 'كبار السن' },
  { value: 'solo', label: 'Solo Travelers', labelAr: 'مسافرون منفردون' },
  { value: 'groups', label: 'Groups', labelAr: 'مجموعات' },
  { value: 'adventure', label: 'Adventure Seekers', labelAr: 'محبي المغامرة' },
];

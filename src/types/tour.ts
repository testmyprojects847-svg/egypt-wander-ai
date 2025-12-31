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
  last_updated: string;
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

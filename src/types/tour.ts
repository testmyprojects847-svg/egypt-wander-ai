export interface Tour {
  id: string;
  name: string;
  name_ar?: string;
  tourism_type?: string;
  tourism_type_ar?: string;
  description: string;
  description_ar?: string;
  city: string;
  price: number;
  price_usd?: number | null;
  currency: 'EGP';
  duration: string;
  availability: 'available' | 'unavailable';
  image_url: string;
  features: string[];
  last_updated: string;
  // Enhanced fields
  starting_point?: string;
  starting_point_ar?: string;
  highlights?: string[];
  highlights_ar?: string[];
  included?: string[];
  included_ar?: string[];
  excluded?: string[];
  excluded_ar?: string[];
  experience_level?: string;
  best_for?: string[];
  best_for_ar?: string[];
  cancellation_policy?: string;
  cancellation_policy_ar?: string;
}

export type TourFormData = Omit<Tour, 'id' | 'last_updated'>;

export const EGYPTIAN_CITIES = [
  { value: 'Cairo', labelEn: 'Cairo', labelAr: 'القاهرة' },
  { value: 'Giza', labelEn: 'Giza', labelAr: 'الجيزة' },
  { value: 'Luxor', labelEn: 'Luxor', labelAr: 'الأقصر' },
  { value: 'Aswan', labelEn: 'Aswan', labelAr: 'أسوان' },
  { value: 'Alexandria', labelEn: 'Alexandria', labelAr: 'الإسكندرية' },
  { value: 'Sharm El Sheikh', labelEn: 'Sharm El Sheikh', labelAr: 'شرم الشيخ' },
  { value: 'Hurghada', labelEn: 'Hurghada', labelAr: 'الغردقة' },
  { value: 'Marsa Alam', labelEn: 'Marsa Alam', labelAr: 'مرسى علم' },
  { value: 'Dahab', labelEn: 'Dahab', labelAr: 'دهب' },
  { value: 'Siwa Oasis', labelEn: 'Siwa Oasis', labelAr: 'واحة سيوة' },
  { value: 'Bahariya Oasis', labelEn: 'Bahariya Oasis', labelAr: 'الواحات البحرية' },
  { value: 'Fayoum', labelEn: 'Fayoum', labelAr: 'الفيوم' },
];

export const TOURISM_TYPES = [
  { value: 'Beach Tourism', label: 'Beach Tourism', labelAr: 'سياحة الشواطئ' },
  { value: 'Safari & Desert', label: 'Safari & Desert', labelAr: 'سفاري وصحراء' },
  { value: 'Historical & Museums', label: 'Historical & Museums', labelAr: 'تاريخية ومتاحف' },
  { value: 'Nile Cruises', label: 'Nile Cruises', labelAr: 'رحلات نيلية' },
  { value: 'Religious Tourism', label: 'Religious Tourism', labelAr: 'سياحة دينية' },
  { value: 'Medical Tourism', label: 'Medical Tourism', labelAr: 'سياحة علاجية' },
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

// Helper to get city label by language
export function getCityLabel(cityValue: string, language: 'en' | 'ar'): string {
  const city = EGYPTIAN_CITIES.find(c => c.value === cityValue);
  return city ? (language === 'ar' ? city.labelAr : city.labelEn) : cityValue;
}

// Helper to get tourism type label by language
export function getTourismTypeLabel(typeValue: string, language: 'en' | 'ar'): string {
  const type = TOURISM_TYPES.find(t => t.value === typeValue);
  return type ? (language === 'ar' ? type.labelAr : type.label) : typeValue;
}

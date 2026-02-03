import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tour, TOURISM_TYPES, EGYPTIAN_CITIES, getTourismTypeLabel, getCityLabel, getDiscountedPrice } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Clock, 
  MapPin, 
  Search, 
  CheckCircle,
  Loader2,
  Star,
  XCircle,
  Shield,
  Sparkles,
  Phone,
  Mail,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/contexts/I18nContext';
import { LuxuryNavbar } from '@/components/home/LuxuryNavbar';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { NationalityDropdown } from '@/components/NationalityDropdown';

// Map from Supabase row to frontend Tour type
function mapFromDb(row: any): Tour {
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar || undefined,
    tourism_type: row.tourism_type || undefined,
    tourism_type_ar: row.tourism_type_ar || undefined,
    description: row.description || '',
    description_ar: row.description_ar || undefined,
    city: row.city,
    price: row.price,
    price_usd: row.price_usd || null,
    price_egp: row.price_egp || row.price || null,
    discount_percentage: row.discount_percentage || null,
    currency: 'EGP',
    duration: row.duration,
    availability: row.availability ? 'available' : 'unavailable',
    image_url: row.image_url || '',
    features: row.features || [],
    last_updated: row.updated_at,
    starting_point: row.starting_point || undefined,
    starting_point_ar: row.starting_point_ar || undefined,
    highlights: row.highlights || [],
    highlights_ar: row.highlights_ar || [],
    included: row.included || [],
    included_ar: row.included_ar || [],
    excluded: row.excluded || [],
    excluded_ar: row.excluded_ar || [],
    experience_level: row.experience_level || undefined,
    best_for: row.best_for || [],
    best_for_ar: row.best_for_ar || [],
    cancellation_policy: row.cancellation_policy || undefined,
    cancellation_policy_ar: row.cancellation_policy_ar || undefined,
  };
}

interface TouristFormData {
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  preferred_language: string;
  country_of_residence: string;
  preferred_city: string;
  travel_interests: string;
  special_requests: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tourismTypeFilter, setTourismTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState<TouristFormData>({
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    preferred_language: '',
    country_of_residence: '',
    preferred_city: '',
    travel_interests: '',
    special_requests: '',
  });
  const { toast } = useToast();
  const { t, language, isRTL, formatPrice } = useI18n();

  // Helper to get tour name based on language
  const getTourName = (tour: Tour) => language === 'ar' && tour.name_ar ? tour.name_ar : tour.name;
  const getTourDescription = (tour: Tour) => language === 'ar' && tour.description_ar ? tour.description_ar : tour.description;
  const getTourHighlights = (tour: Tour) => language === 'ar' && tour.highlights_ar?.length ? tour.highlights_ar : tour.highlights;
  const getTourIncluded = (tour: Tour) => language === 'ar' && tour.included_ar?.length ? tour.included_ar : tour.included;
  const getTourExcluded = (tour: Tour) => language === 'ar' && tour.excluded_ar?.length ? tour.excluded_ar : tour.excluded;
  const getTourStartingPoint = (tour: Tour) => language === 'ar' && tour.starting_point_ar ? tour.starting_point_ar : tour.starting_point;
  const getTourCancellationPolicy = (tour: Tour) => language === 'ar' && tour.cancellation_policy_ar ? tour.cancellation_policy_ar : tour.cancellation_policy;
  const getTourTourismType = (tour: Tour) => {
    if (tour.tourism_type) {
      return getTourismTypeLabel(tour.tourism_type, language);
    }
    return undefined;
  };

  // Always dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Fetch available tours
  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('availability', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tours:', error);
        toast({
          title: t('error'),
          description: t('somethingWentWrong'),
          variant: 'destructive',
        });
      } else {
        setTours((data || []).map(mapFromDb));
      }
      setIsLoading(false);
    };

    fetchTours();
  }, [toast, t]);

  // Smart dependent filtering - cities based on selected tourism type
  const availableCities = useMemo(() => {
    if (tourismTypeFilter === 'all') {
      return [...new Set(tours.map(t => t.city))].sort();
    }
    return [...new Set(
      tours
        .filter(t => t.tourism_type === tourismTypeFilter)
        .map(t => t.city)
    )].sort();
  }, [tours, tourismTypeFilter]);

  // Reset city filter when tourism type changes and city is no longer available
  useEffect(() => {
    if (cityFilter !== 'all' && !availableCities.includes(cityFilter)) {
      setCityFilter('all');
    }
  }, [availableCities, cityFilter]);

  // Filter tours
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const tourName = getTourName(tour).toLowerCase();
      const tourDesc = getTourDescription(tour).toLowerCase();
      const matchesSearch = 
        tourName.includes(searchQuery.toLowerCase()) ||
        tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tourDesc.includes(searchQuery.toLowerCase());
      const matchesTourismType = tourismTypeFilter === 'all' || tour.tourism_type === tourismTypeFilter;
      const matchesCity = cityFilter === 'all' || tour.city === cityFilter;
      return matchesSearch && matchesTourismType && matchesCity;
    });
  }, [tours, searchQuery, tourismTypeFilter, cityFilter, language]);

  const handleCardClick = (tour: Tour) => {
    setSelectedTour(tour);
    setIsDetailsOpen(true);
  };

  const handleBookFromDetails = () => {
    setIsDetailsOpen(false);
    setIsBookingOpen(true);
    setBookingSuccess(false);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      nationality: '',
      preferred_language: language,
      country_of_residence: '',
      preferred_city: selectedTour?.city || '',
      travel_interests: '',
      special_requests: '',
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTour) return;

    // Basic validation
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.nationality.trim()) {
      toast({
        title: t('error'),
        description: t('fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t('error'),
        description: t('invalidEmail'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existingTourist } = await supabase
        .from('tourists')
        .select('id, total_bookings')
        .eq('email', formData.email.trim())
        .maybeSingle();

      const travelInterestsArray = formData.travel_interests
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      if (existingTourist) {
        const { error: updateError } = await supabase
          .from('tourists')
          .update({
            full_name: formData.full_name.trim(),
            phone: formData.phone.trim(),
            nationality: formData.nationality.trim(),
            preferred_language: formData.preferred_language || null,
            country_of_residence: formData.country_of_residence.trim() || null,
            preferred_city: formData.preferred_city || selectedTour.city,
            travel_interests: travelInterestsArray.length > 0 ? travelInterestsArray : null,
            special_requests: formData.special_requests.trim() || null,
            tour_name: selectedTour.name, // Save tour name
            total_bookings: (existingTourist.total_bookings || 0) + 1,
            last_booking_date: new Date().toISOString().split('T')[0],
          })
          .eq('id', existingTourist.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('tourists')
          .insert({
            full_name: formData.full_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            nationality: formData.nationality.trim(),
            preferred_language: formData.preferred_language || null,
            country_of_residence: formData.country_of_residence.trim() || null,
            preferred_city: formData.preferred_city || selectedTour.city,
            travel_interests: travelInterestsArray.length > 0 ? travelInterestsArray : null,
            special_requests: formData.special_requests.trim() || null,
            tour_name: selectedTour.name, // Save tour name
            total_bookings: 1,
            last_booking_date: new Date().toISOString().split('T')[0],
          });

        if (insertError) throw insertError;
      }

      // Also insert into bookings table for verified reviews
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          tour_name: selectedTour.name,
          status: 'confirmed',
        });

      if (bookingError) {
        console.error('Error creating booking record:', bookingError);
      }

      setBookingSuccess(true);
      toast({
        title: t('bookingSuccess'),
        description: t('willContactSoon'),
      });

      setTimeout(() => {
        setIsBookingOpen(false);
        setSelectedTour(null);
        setBookingSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: t('bookingFailed'),
        description: t('somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
      <LuxuryNavbar />

      {/* Compact Header Section */}
      <section className="pt-6 pb-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title - Minimal spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <h1 className="font-playfair text-primary text-2xl md:text-3xl tracking-[0.15em] uppercase mb-1">
              {t('pageTitle')}
            </h1>
            <p className="font-playfair text-primary/60 text-xs md:text-sm tracking-wide">
              {t('pageSubtitle')}
            </p>
          </motion.div>

          {/* Compact Search & Filters Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={`flex flex-col md:flex-row items-stretch gap-2 mb-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Search Input */}
            <div className={`relative flex-1 md:max-w-sm ${isRTL ? 'md:order-3' : ''}`}>
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-9 bg-black border-primary/30 text-primary text-sm placeholder:text-primary/40 focus:border-primary focus:ring-primary/20 font-playfair ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9'}`}
              />
            </div>

            {/* Tourism Type Filter */}
            <Select value={tourismTypeFilter} onValueChange={setTourismTypeFilter}>
              <SelectTrigger className={`w-full md:w-48 h-9 bg-black border-primary/30 text-primary text-sm focus:border-primary focus:ring-primary/20 font-playfair ${isRTL ? 'md:order-2 flex-row-reverse' : ''}`}>
                <Compass className={`w-3.5 h-3.5 text-primary/50 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                <SelectValue placeholder={t('allTypes')} />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary/40">
                <SelectItem value="all" className="text-primary hover:bg-primary/10 font-playfair text-sm">{t('allTypes')}</SelectItem>
                {TOURISM_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value} className="text-primary hover:bg-primary/10 font-playfair text-sm">
                    {language === 'ar' ? type.labelAr : type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City Filter - Dependent on Tourism Type */}
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className={`w-full md:w-44 h-9 bg-black border-primary/30 text-primary text-sm focus:border-primary focus:ring-primary/20 font-playfair ${isRTL ? 'md:order-1 flex-row-reverse' : ''}`}>
                <MapPin className={`w-3.5 h-3.5 text-primary/50 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                <SelectValue placeholder={t('allCities')} />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary/40">
                <SelectItem value="all" className="text-primary hover:bg-primary/10 font-playfair text-sm">{t('allCities')}</SelectItem>
                {availableCities.map(city => (
                  <SelectItem key={city} value={city} className="text-primary hover:bg-primary/10 font-playfair text-sm">
                    {getCityLabel(city, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Tours count - inline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <p className="text-primary/50 font-playfair text-xs">
              {filteredTours.length} {t('toursAvailable')}
            </p>
            {(tourismTypeFilter !== 'all' || cityFilter !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchQuery(''); setTourismTypeFilter('all'); setCityFilter('all'); }}
                className="text-primary/60 hover:text-primary text-xs h-7 px-2"
              >
                {t('clearFilters')}
              </Button>
            )}
          </motion.div>

          {/* Tours Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-primary/50 font-playfair text-sm">{t('loadingTours')}</p>
              </div>
            </div>
          ) : filteredTours.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
            >
              {filteredTours.map((tour) => (
                <motion.div
                  key={tour.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  onClick={() => handleCardClick(tour)}
                  className="cursor-pointer group rounded-lg overflow-hidden border border-primary/30 hover:border-primary bg-black transition-all duration-300 hover:shadow-[0_0_20px_hsla(42,70%,52%,0.2)]"
                >
                  {/* Image Container */}
                  <div className="p-2 pb-0">
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      <img
                        src={tour.image_url || 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'}
                        alt={getTourName(tour)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Tourism Type Badge */}
                      {tour.tourism_type && (
                        <Badge className={`absolute top-1.5 bg-primary/90 text-black text-[10px] px-1.5 py-0.5 font-playfair border-0 ${isRTL ? 'right-1.5' : 'left-1.5'}`}>
                          {getTourTourismType(tour)}
                        </Badge>
                      )}
                      {/* Discount Badge */}
                      {tour.discount_percentage && tour.discount_percentage > 0 && (
                        <Badge className={`absolute top-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 font-bold border-0 ${isRTL ? 'left-1.5' : 'right-1.5'}`}>
                          {tour.discount_percentage}% {t('discount')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-2.5 pt-2">
                    <h3 className={`font-playfair text-primary text-xs font-semibold tracking-wide mb-0.5 line-clamp-1 uppercase ${isRTL ? 'text-right' : ''}`}>
                      {getTourName(tour)}
                    </h3>
                    <p className={`text-primary/40 font-playfair text-[10px] tracking-wide mb-2 line-clamp-1 ${isRTL ? 'text-right' : ''}`}>
                      {getTourDescription(tour) || (language === 'ar' ? 'تجربة حصرية بإرشاد خبير' : 'Exclusive guided experience')}
                    </p>
                    
                    {/* Price with Discount */}
                    <div className={`flex items-baseline gap-1.5 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      {tour.discount_percentage && tour.discount_percentage > 0 ? (
                        <>
                          <span className="text-primary font-playfair text-sm font-bold">
                            {formatPrice(
                              getDiscountedPrice(tour.price_egp || tour.price, tour.discount_percentage),
                              tour.price_usd ? getDiscountedPrice(tour.price_usd, tour.discount_percentage) : null
                            )}
                          </span>
                          <span className="text-primary/40 font-playfair text-[10px] line-through">
                            {formatPrice(tour.price_egp || tour.price, tour.price_usd)}
                          </span>
                        </>
                      ) : (
                        <span className="text-primary font-playfair text-sm font-bold">
                          {formatPrice(tour.price_egp || tour.price, tour.price_usd)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 border border-primary/20 rounded-lg">
              <MapPin className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <h3 className="font-playfair text-primary text-lg mb-1">{t('noToursFound')}</h3>
              <p className="text-primary/50 font-playfair text-sm">{t('tryDifferentSearch')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Tour Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-primary/40" dir={isRTL ? 'rtl' : 'ltr'}>
          {selectedTour && (
            <>
              <DialogHeader>
                <DialogTitle className="font-playfair text-xl text-primary tracking-wider uppercase">
                  {getTourName(selectedTour)}
                </DialogTitle>
                <DialogDescription className={`flex items-center gap-2 text-primary/60 font-playfair ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  {getCityLabel(selectedTour.city, language)}
                  {selectedTour.tourism_type && (
                    <Badge className={`bg-primary/20 text-primary border-primary/40 text-xs ${isRTL ? 'mr-2' : 'ml-2'}`}>
                      {getTourTourismType(selectedTour)}
                    </Badge>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="relative h-48 overflow-hidden border border-primary/30">
                <img
                  src={selectedTour.image_url || '/placeholder.svg'}
                  alt={getTourName(selectedTour)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className={`flex items-center justify-between bg-black border border-primary/30 p-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock className="w-5 h-5 text-primary/60" />
                  <span className="font-playfair text-primary">{selectedTour.duration}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {selectedTour.discount_percentage && selectedTour.discount_percentage > 0 ? (
                    <>
                      <span className="text-2xl font-playfair font-bold text-primary tracking-wider">
                        {formatPrice(
                          getDiscountedPrice(selectedTour.price_egp || selectedTour.price, selectedTour.discount_percentage),
                          selectedTour.price_usd ? getDiscountedPrice(selectedTour.price_usd, selectedTour.discount_percentage) : null
                        )}
                      </span>
                      <span className="text-sm font-playfair text-primary/40 line-through">
                        {formatPrice(selectedTour.price_egp || selectedTour.price, selectedTour.price_usd)}
                      </span>
                      <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 font-bold">
                        {selectedTour.discount_percentage}% {t('discount')}
                      </Badge>
                    </>
                  ) : (
                    <span className="text-2xl font-playfair font-bold text-primary tracking-wider">
                      {formatPrice(selectedTour.price_egp || selectedTour.price, selectedTour.price_usd)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 py-4">
                {/* Description */}
                <div>
                  <h4 className={`font-playfair text-primary text-sm tracking-wider mb-2 ${isRTL ? 'text-right' : ''}`}>{t('description')}</h4>
                  <p className={`text-primary/70 font-playfair text-sm leading-relaxed ${isRTL ? 'text-right' : ''}`}>{getTourDescription(selectedTour)}</p>
                </div>

                {/* Starting Point */}
                {getTourStartingPoint(selectedTour) && (
                  <div className={`flex items-center gap-2 p-3 border border-primary/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-primary/70 font-playfair text-sm">
                      <span className="text-primary">{t('startingPoint')}:</span> {getTourStartingPoint(selectedTour)}
                    </span>
                  </div>
                )}

                {/* Highlights */}
                {getTourHighlights(selectedTour) && getTourHighlights(selectedTour)!.length > 0 && (
                  <div>
                    <h4 className={`font-playfair text-primary text-sm tracking-wider mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Sparkles className="w-4 h-4" />
                      {t('highlights')}
                    </h4>
                    <ul className="space-y-1.5">
                      {getTourHighlights(selectedTour)!.map((highlight, index) => (
                        <li key={index} className={`flex items-start gap-2 text-primary/70 font-playfair text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                          <Star className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Included */}
                {getTourIncluded(selectedTour) && getTourIncluded(selectedTour)!.length > 0 && (
                  <div>
                    <h4 className={`font-playfair text-primary text-sm tracking-wider mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <CheckCircle className="w-4 h-4" />
                      {t('whatsIncluded')}
                    </h4>
                    <ul className="grid grid-cols-2 gap-1.5">
                      {getTourIncluded(selectedTour)!.map((item, index) => (
                        <li key={index} className={`flex items-center gap-2 text-green-500/80 font-playfair text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excluded */}
                {getTourExcluded(selectedTour) && getTourExcluded(selectedTour)!.length > 0 && (
                  <div>
                    <h4 className={`font-playfair text-primary text-sm tracking-wider mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <XCircle className="w-4 h-4" />
                      {t('whatsNotIncluded')}
                    </h4>
                    <ul className="grid grid-cols-2 gap-1.5">
                      {getTourExcluded(selectedTour)!.map((item, index) => (
                        <li key={index} className={`flex items-center gap-2 text-red-500/70 font-playfair text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                          <XCircle className="w-3 h-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cancellation Policy */}
                {getTourCancellationPolicy(selectedTour) && (
                  <div className="p-3 border border-primary/20 bg-primary/5">
                    <h4 className={`font-playfair text-primary text-sm tracking-wider mb-1 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Shield className="w-4 h-4" />
                      {t('cancellationPolicy')}
                    </h4>
                    <p className={`text-primary/70 font-playfair text-sm ${isRTL ? 'text-right' : ''}`}>{getTourCancellationPolicy(selectedTour)}</p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleBookFromDetails}
                className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-playfair tracking-wider text-lg"
              >
                {t('bookThisTour')}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-black border-primary/40" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl text-primary tracking-wider">{t('bookTour')}</DialogTitle>
            {selectedTour && (
              <DialogDescription className="text-primary/60 font-playfair">
                {getTourName(selectedTour)} - {formatPrice(selectedTour.price, selectedTour.price_usd)}
              </DialogDescription>
            )}
          </DialogHeader>

          {bookingSuccess ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="font-playfair text-primary text-xl tracking-wider mb-2">{t('bookingSuccess')}</h3>
              <p className="text-primary/60 font-playfair">{t('willContactSoon')}</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4 py-4">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className={`font-playfair text-primary text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{t('personalInformation')}</h4>
                
                <div>
                  <Label className={`text-primary/80 font-playfair text-sm ${isRTL ? 'text-right block' : ''}`}>{t('fullName')} *</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`mt-1 bg-black border-primary/30 text-primary placeholder:text-primary/40 ${isRTL ? 'text-right' : ''}`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className={`text-primary/80 font-playfair text-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Mail className="w-3 h-3" />
                      {t('email')} *
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 bg-black border-primary/30 text-primary placeholder:text-primary/40"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <Label className={`text-primary/80 font-playfair text-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Phone className="w-3 h-3" />
                      {t('phone')} *
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 bg-black border-primary/30 text-primary placeholder:text-primary/40"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className={`text-primary/80 font-playfair text-sm ${isRTL ? 'text-right block' : ''}`}>
                    {t('nationality')} *
                  </Label>
                  <NationalityDropdown
                    value={formData.nationality}
                    onChange={(value) => setFormData({ ...formData, nationality: value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <h4 className={`font-playfair text-primary text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{t('preferences')}</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className={`text-primary/80 font-playfair text-sm ${isRTL ? 'text-right block' : ''}`}>{t('preferredLanguage')}</Label>
                    <Select
                      value={formData.preferred_language}
                      onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
                    >
                      <SelectTrigger className="mt-1 bg-black border-primary/30 text-primary">
                        <SelectValue placeholder={t('selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-primary/40">
                        <SelectItem value="en" className="text-primary hover:bg-primary/10">English</SelectItem>
                        <SelectItem value="ar" className="text-primary hover:bg-primary/10">العربية</SelectItem>
                        <SelectItem value="fr" className="text-primary hover:bg-primary/10">Français</SelectItem>
                        <SelectItem value="de" className="text-primary hover:bg-primary/10">Deutsch</SelectItem>
                        <SelectItem value="es" className="text-primary hover:bg-primary/10">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className={`text-primary/80 font-playfair text-sm ${isRTL ? 'text-right block' : ''}`}>{t('countryOfResidence')}</Label>
                    <Input
                      value={formData.country_of_residence}
                      onChange={(e) => setFormData({ ...formData, country_of_residence: e.target.value })}
                      className={`mt-1 bg-black border-primary/30 text-primary placeholder:text-primary/40 ${isRTL ? 'text-right' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <h4 className={`font-playfair text-primary text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{t('additionalDetails')}</h4>
                
                <div>
                  <Label className={`text-primary/80 font-playfair text-sm ${isRTL ? 'text-right block' : ''}`}>{t('travelInterests')}</Label>
                  <Input
                    value={formData.travel_interests}
                    onChange={(e) => setFormData({ ...formData, travel_interests: e.target.value })}
                    placeholder={t('travelInterestsPlaceholder')}
                    className={`mt-1 bg-black border-primary/30 text-primary placeholder:text-primary/40 ${isRTL ? 'text-right' : ''}`}
                  />
                </div>

                <div>
                  <Label className={`text-primary/80 font-playfair text-sm ${isRTL ? 'text-right block' : ''}`}>{t('specialRequests')}</Label>
                  <Textarea
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                    placeholder={t('specialRequestsPlaceholder')}
                    rows={3}
                    className={`mt-1 bg-black border-primary/30 text-primary placeholder:text-primary/40 ${isRTL ? 'text-right' : ''}`}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 bg-primary text-black hover:bg-primary/90 font-playfair tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {isSubmitting ? (
                  <span className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('submitting')}
                  </span>
                ) : (
                  t('confirmBooking')
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <LuxuryFooter />
    </div>
  );
}

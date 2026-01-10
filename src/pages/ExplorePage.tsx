import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tour } from '@/types/tour';
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
  Calendar,
  Users,
  CheckCircle,
  Loader2,
  Compass,
  User,
  Settings,
  Star,
  XCircle,
  Shield,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatBot } from '@/components/ChatBot';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { EGYPTIAN_CITIES } from '@/types/tour';

// Map from Supabase row to frontend Tour type
function mapFromDb(row: any): Tour {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    city: row.city,
    price: row.price,
    currency: 'EGP',
    duration: row.duration,
    availability: row.availability ? 'available' : 'unavailable',
    image_url: row.image_url || '',
    features: row.features || [],
    last_updated: row.updated_at,
    starting_point: row.starting_point || undefined,
    highlights: row.highlights || [],
    included: row.included || [],
    excluded: row.excluded || [],
    experience_level: row.experience_level || undefined,
    best_for: row.best_for || [],
    cancellation_policy: row.cancellation_policy || undefined,
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

// Egyptian cities for the bottom carousel
const CITY_IMAGES = [
  { name: 'Aswan', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400' },
  { name: 'Luxor', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400' },
  { name: 'Cairo', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400' },
  { name: 'Sharm El Sheikh', image: 'https://images.unsplash.com/photo-1548918901-9b31223c5c3a?w=400' },
  { name: 'Alexandria', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400' },
  { name: 'Hurghada', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
];

export default function ExplorePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
  const { language, setLanguage, t } = useLanguage();

  // Always dark mode for this luxurious design
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Fetch available tours only
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
          title: 'Error',
          description: 'Failed to load tours. Please try again.',
          variant: 'destructive',
        });
      } else {
        setTours((data || []).map(mapFromDb));
      }
      setIsLoading(false);
    };

    fetchTours();
  }, [toast]);

  // Filter tours by search
  const filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      preferred_language: '',
      country_of_residence: '',
      preferred_city: selectedTour?.city || '',
      travel_interests: '',
      special_requests: '',
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTour) return;

    // Basic validation - all required fields
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.nationality.trim()) {
      toast({
        title: t('error'),
        description: t('fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if tourist already exists
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
        // Update existing tourist
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
            total_bookings: (existingTourist.total_bookings || 0) + 1,
            last_booking_date: new Date().toISOString().split('T')[0],
          })
          .eq('id', existingTourist.id);

        if (updateError) throw updateError;
      } else {
        // Create new tourist
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
            total_bookings: 1,
            last_booking_date: new Date().toISOString().split('T')[0],
          });

        if (insertError) throw insertError;
      }

      setBookingSuccess(true);
      toast({
        title: t('bookingSuccess'),
        description: t('willContactSoon'),
      });

      // Close dialog after 2 seconds
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
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30"
      >
        <div className="container-custom flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Compass className="w-5 h-5 text-background" />
            </div>
            <span className="text-lg font-bold text-gradient-gold">{t('egyptTours')}</span>
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              {t('tours')}
            </Link>
            <Link to="#" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              {t('aboutUs')}
            </Link>
            <Link to="#" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              {t('contact')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
            <Link 
              to="/admin"
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-primary/50 rounded-lg text-primary hover:bg-primary/10 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">{t('booking')}</span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Pharaoh Images */}
      <section className="relative pt-24 pb-8 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
        
        {/* Pharaoh Statues Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex justify-center items-end gap-8 md:gap-16 mb-8"
        >
          {/* Left Pharaoh - Gold */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="w-32 h-40 md:w-48 md:h-56 rounded-full overflow-hidden glow-gold">
              <img 
                src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400" 
                alt="Egyptian Pharaoh"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>

          {/* Right Pharaoh - Blue/Teal */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="w-32 h-40 md:w-48 md:h-56 rounded-full overflow-hidden" style={{ boxShadow: '0 0 30px hsla(200, 70%, 50%, 0.3)' }}>
              <img 
                src="https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400" 
                alt="Egyptian Queen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Curated Experiences Section */}
      <section className="px-4 pb-12">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gradient-gold">{t('curatedExperiences')}</h2>
          </motion.div>

          {/* Tours Grid - Bento Style */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">{t('loadingTours')}</p>
              </div>
            </div>
          ) : filteredTours.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleCardClick(tour)}
                  className={`card-luxe cursor-pointer group ${index === 0 ? 'md:col-span-2 md:row-span-1' : ''}`}
                >
                  <div className="relative">
                    {/* Image */}
                    <div className={`relative overflow-hidden ${index === 0 ? 'h-48 md:h-56' : 'h-40'}`}>
                      <img
                        src={tour.image_url || 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      
                      {/* Ankh Icon Overlay */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-primary text-lg">☥</span>
                      </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1">{tour.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-1 mb-3">{tour.description}</p>
                      
                      <button className="btn-gold text-sm py-1.5 px-4 rounded-md">
                        {t('exploreExperience')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('noToursFound')}</h3>
              <p className="text-muted-foreground">
                {searchQuery ? t('tryDifferentSearch') : t('noAvailableTours')}
              </p>
            </div>
          )}

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`w-2 h-2 rounded-full transition-all ${
                  dot === 0 ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Explore Modern Egypt Section */}
      <section className="px-4 pb-24">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gradient-gold">{t('exploreModernEgypt')}</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchTours')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 bg-secondary/50 border-border/50"
                />
              </div>
              <button className="btn-gold text-sm py-2">{t('viewAll')}</button>
            </div>
          </div>

          {/* Cities Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {CITY_IMAGES.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 cursor-pointer group"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                  {city.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          {selectedTour && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gradient-gold">{selectedTour.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {selectedTour.city}
                </DialogDescription>
              </DialogHeader>

              {/* Tour Image */}
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={selectedTour.image_url || '/placeholder.svg'}
                  alt={selectedTour.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price & Duration */}
              <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{selectedTour.duration}</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {selectedTour.price.toLocaleString()} {selectedTour.currency}
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('description')}</h4>
                <p className="text-muted-foreground">{selectedTour.description}</p>
              </div>

              {/* Starting Point */}
              {selectedTour.starting_point && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {t('startingPoint')}
                  </h4>
                  <p className="text-muted-foreground">{selectedTour.starting_point}</p>
                </div>
              )}

              {/* Highlights */}
              {selectedTour.highlights && selectedTour.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {t('highlights')}
                  </h4>
                  <ul className="space-y-1">
                    {selectedTour.highlights.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Included */}
              {selectedTour.included && selectedTour.included.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    {t('whatsIncluded')}
                  </h4>
                  <ul className="space-y-1">
                    {selectedTour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Excluded */}
              {selectedTour.excluded && selectedTour.excluded.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    {t('whatsNotIncluded')}
                  </h4>
                  <ul className="space-y-1">
                    {selectedTour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best For */}
              {selectedTour.best_for && selectedTour.best_for.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    {t('bestFor')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTour.best_for.map((item, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              {selectedTour.cancellation_policy && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    {t('cancellationPolicy')}
                  </h4>
                  <p className="text-muted-foreground">{selectedTour.cancellation_policy}</p>
                </div>
              )}

              {/* Book Button */}
              <Button 
                className="w-full btn-gold mt-4"
                onClick={handleBookFromDetails}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('bookThisTour')}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gradient-gold">
              <Calendar className="w-5 h-5 text-primary" />
              {t('bookTour')}
            </DialogTitle>
            <DialogDescription>
              {selectedTour && (
                <span className="text-foreground font-medium">{selectedTour.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success-foreground" />
              </div>
              <h3 className="text-xl font-bold text-success mb-2">{t('bookingSuccess')}</h3>
              <p className="text-muted-foreground text-center">{t('willContactSoon')}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {t('fullName')} *
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="Enter full name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    ✉ {t('email')} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    📞 {t('phone')} *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+20 123 456 7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality" className="flex items-center gap-1">
                    🌐 {t('nationality')} *
                  </Label>
                  <Input
                    id="nationality"
                    placeholder="e.g., German, British"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                  ♡ {t('preferences')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferred_language" className="flex items-center gap-1">
                      🗣 {t('preferredLanguage')}
                    </Label>
                    <Select
                      value={formData.preferred_language}
                      onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
                    >
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder={t('selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Russian">Russian</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country_of_residence">{t('countryOfResidence')}</Label>
                    <Input
                      id="country_of_residence"
                      placeholder="e.g., Germany, UK"
                      value={formData.country_of_residence}
                      onChange={(e) => setFormData({ ...formData, country_of_residence: e.target.value })}
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_city" className="flex items-center gap-1">
                      📍 {t('preferredCity')}
                    </Label>
                    <Select
                      value={formData.preferred_city}
                      onValueChange={(value) => setFormData({ ...formData, preferred_city: value })}
                    >
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder={t('selectCity')} />
                      </SelectTrigger>
                      <SelectContent>
                        {EGYPTIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                  📋 {t('additionalDetails')}
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="travel_interests">{t('travelInterests')}</Label>
                    <Input
                      id="travel_interests"
                      placeholder={t('travelInterestsPlaceholder')}
                      value={formData.travel_interests}
                      onChange={(e) => setFormData({ ...formData, travel_interests: e.target.value })}
                      className="bg-secondary/50 border-border/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('travelInterestsSuggestions')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special_requests">{t('specialRequests')}</Label>
                    <Textarea
                      id="special_requests"
                      placeholder={t('specialRequestsPlaceholder')}
                      value={formData.special_requests}
                      onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                      className="bg-secondary/50 border-border/50"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {selectedTour && (
                <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('price')}:</span>
                  <span className="text-lg font-bold text-primary">
                    {selectedTour.price.toLocaleString()} {selectedTour.currency}
                  </span>
                </div>
              )}

              <Button 
                type="submit" 
                className={`w-full ${bookingSuccess ? 'bg-success hover:bg-success/90' : 'btn-gold'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('confirmBooking')}
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Concierge ChatBot - Custom styled */}
      <ChatBot 
        welcomeMessage={t('chatbotWelcome')}
        placeholder={t('typeMessage')}
        onlineText={t('online')}
      />
    </div>
  );
}

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
  Star,
  XCircle,
  Shield,
  Sparkles,
  Filter,
  ArrowLeft,
  Globe,
  Phone,
  Mail,
  Heart
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

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
  const { language, setLanguage, t } = useLanguage();

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

  // Filter tours
  const filteredTours = tours.filter((tour) => {
    const matchesSearch = 
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'all' || tour.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  // Get unique cities from tours
  const uniqueCities = [...new Set(tours.map(t => t.city))];

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
        description: 'Please enter a valid email address.',
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
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Compass className="w-5 h-5 text-background" />
              </div>
              <span className="text-lg font-bold text-gradient-gold">{t('egyptTours')}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/tours" className="text-primary font-medium">
              {t('tours')}
            </Link>
            <Link to="#about" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              {t('aboutUs')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
              {t('availableTours')}
            </h1>
            <p className="text-muted-foreground">
              {filteredTours.length} {t('tours').toLowerCase()} available
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('searchTours')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 h-12"
              />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-secondary/50 border-border/50 h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Tours Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">{t('loadingTours')}</p>
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
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTours.map((tour) => (
                <motion.div
                  key={tour.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => handleCardClick(tour)}
                  className="card-luxe cursor-pointer group overflow-hidden"
                >
                  <div className="relative">
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={tour.image_url || 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      
                      {/* Price Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm">
                        <span className="text-background font-bold text-sm">
                          {tour.price.toLocaleString()} EGP
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <Heart className="w-4 h-4 text-foreground" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-primary text-sm font-medium">{tour.city}</span>
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1">{tour.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{tour.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{tour.duration}</span>
                        </div>
                        <Button size="sm" className="btn-gold">
                          {t('exploreExperience')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('noToursFound')}</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || cityFilter !== 'all' ? t('tryDifferentSearch') : t('noAvailableTours')}
              </p>
              {(searchQuery || cityFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchQuery(''); setCityFilter('all'); }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

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

              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={selectedTour.image_url || '/placeholder.svg'}
                  alt={selectedTour.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{selectedTour.duration}</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {selectedTour.price.toLocaleString()} {selectedTour.currency}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('description')}</h4>
                <p className="text-muted-foreground">{selectedTour.description}</p>
              </div>

              {selectedTour.starting_point && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {t('startingPoint')}
                  </h4>
                  <p className="text-muted-foreground">{selectedTour.starting_point}</p>
                </div>
              )}

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

              {selectedTour.included && selectedTour.included.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {t('whatsIncluded')}
                  </h4>
                  <ul className="space-y-1">
                    {selectedTour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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

              {selectedTour.cancellation_policy && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    {t('cancellationPolicy')}
                  </h4>
                  <p className="text-muted-foreground">{selectedTour.cancellation_policy}</p>
                </div>
              )}

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
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-500 mb-2">{t('bookingSuccess')}</h3>
              <p className="text-muted-foreground text-center">{t('willContactSoon')}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Basic Information
                </h3>
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
                      <Mail className="w-4 h-4" />
                      {t('email')} *
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

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {t('phone')} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-secondary/50 border-border/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {t('nationality')} *
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
              </div>

              {/* Preferences Section */}
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                  🧡 {t('preferences')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('preferredLanguage')}</Label>
                    <Select
                      value={formData.preferred_language}
                      onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
                    >
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder={t('selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
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

                  <div className="space-y-2 md:col-span-2">
                    <Label>{t('preferredCity')}</Label>
                    <Select
                      value={formData.preferred_city || selectedTour?.city}
                      onValueChange={(value) => setFormData({ ...formData, preferred_city: value })}
                    >
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder={t('selectCity')} />
                      </SelectTrigger>
                      <SelectContent>
                        {EGYPTIAN_CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                  📋 {t('additionalDetails')}
                </h3>
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
                    <p className="text-xs text-muted-foreground">{t('travelInterestsSuggestions')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special_requests">{t('specialRequests')}</Label>
                    <Textarea
                      id="special_requests"
                      placeholder={t('specialRequestsPlaceholder')}
                      value={formData.special_requests}
                      onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                      className="bg-secondary/50 border-border/50 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Price & Submit */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">{t('price')}</span>
                  <span className="text-2xl font-bold text-primary">
                    {selectedTour?.price.toLocaleString()} EGP
                  </span>
                </div>
                <Button 
                  type="submit" 
                  className="w-full btn-gold h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {t('confirmBooking')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Concierge */}
      <ChatBot 
        welcomeMessage="Welcome to Egypt Tours! 🇪🇬 How can I help you?"
        placeholder="Type your message..."
        onlineText="Online"
      />
    </div>
  );
}
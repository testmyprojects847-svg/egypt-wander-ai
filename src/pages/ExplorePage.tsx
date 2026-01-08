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
  Clock, 
  MapPin, 
  Search, 
  Calendar,
  Users,
  CheckCircle,
  Loader2,
  Compass,
  Bell,
  Moon,
  Sun,
  Menu,
  User,
  Settings,
  Star,
  XCircle,
  Shield,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface BookingFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_date: string;
  travelers: number;
  notes: string;
  nationality: string;
}

export default function ExplorePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [bookingData, setBookingData] = useState<BookingFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    preferred_date: '',
    travelers: 1,
    notes: '',
    nationality: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    setBookingData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      preferred_date: '',
      travelers: 1,
      notes: '',
      nationality: '',
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTour) return;

    // Basic validation
    if (!bookingData.customer_name.trim() || !bookingData.customer_email.trim() || !bookingData.customer_phone.trim() || !bookingData.nationality.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, check if tourist already exists
      const { data: existingTourist } = await supabase
        .from('tourists')
        .select('id, total_bookings')
        .eq('email', bookingData.customer_email.trim())
        .maybeSingle();

      let touristId: string;

      if (existingTourist) {
        // Update existing tourist
        touristId = existingTourist.id;
        await supabase
          .from('tourists')
          .update({
            full_name: bookingData.customer_name.trim(),
            phone: bookingData.customer_phone.trim(),
            nationality: bookingData.nationality.trim(),
            preferred_city: selectedTour.city,
            total_bookings: (existingTourist.total_bookings || 0) + 1,
            last_booking_date: new Date().toISOString().split('T')[0],
          })
          .eq('id', touristId);
      } else {
        // Create new tourist
        const { data: newTourist, error: touristError } = await supabase
          .from('tourists')
          .insert({
            full_name: bookingData.customer_name.trim(),
            email: bookingData.customer_email.trim(),
            phone: bookingData.customer_phone.trim(),
            nationality: bookingData.nationality.trim(),
            preferred_city: selectedTour.city,
            special_requests: bookingData.notes.trim() || null,
            total_bookings: 1,
            last_booking_date: new Date().toISOString().split('T')[0],
          })
          .select('id')
          .single();

        if (touristError) {
          throw touristError;
        }
        touristId = newTourist.id;
      }

      // Create booking
      const { error: bookingError } = await supabase.from('bookings').insert({
        tour_id: selectedTour.id,
        customer_name: bookingData.customer_name.trim(),
        customer_email: bookingData.customer_email.trim(),
        customer_phone: bookingData.customer_phone.trim() || null,
        preferred_date: bookingData.preferred_date || null,
        travelers: bookingData.travelers,
        notes: bookingData.notes.trim() || null,
        status: 'pending',
      });

      if (bookingError) {
        throw bookingError;
      }

      toast({
        title: 'Booking Submitted!',
        description: 'Your booking request has been received. We will contact you soon.',
      });
      setIsBookingOpen(false);
      setSelectedTour(null);

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Same design as admin */}
      <div className="hidden lg:flex h-screen bg-card border-r border-border flex-col py-6 w-64 sticky top-0">
        {/* Logo */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Compass className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg">Egypt Tours</h1>
              <p className="text-xs text-muted-foreground">Explore & Book</p>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 mb-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            EXPLORE
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            <li>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/30 text-primary border-l-4 border-primary">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">Tours</span>
              </div>
            </li>
          </ul>
        </nav>

        {/* Admin Link */}
        <div className="px-3 mt-auto pt-4 border-t border-border">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Admin Dashboard</span>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header - Same as admin */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu */}
            <button className="lg:hidden p-2 hover:bg-secondary rounded-lg">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Compass className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Egypt Tours</span>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center relative max-w-md flex-1 mx-4">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-0"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-secondary rounded-lg flex items-center gap-2 text-sm"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              {/* Admin Link for mobile */}
              <Link 
                to="/admin"
                className="lg:hidden p-2 hover:bg-secondary rounded-lg"
                title="Admin Dashboard"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="gradient-gold px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            Discover Amazing Tours in Egypt
          </h2>
          <p className="text-primary-foreground/90">
            Explore ancient wonders and book your next adventure
          </p>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm font-medium text-foreground">
                Available Tours ({filteredTours.length})
              </span>
            </div>
          </div>

          {/* Tours Grid */}
          {isLoading ? (
            <div className="text-center py-16 bg-card rounded-2xl shadow-soft">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading tours...</p>
            </div>
          ) : filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  onClick={() => handleCardClick(tour)}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={tour.image_url || '/placeholder.svg'}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
                      Available
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price & Location */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{tour.city}</span>
                      </div>
                      <span className="text-primary font-bold">
                        ~{tour.price.toLocaleString()} {tour.currency}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
                      {tour.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
                      {tour.description}
                    </p>

                    {/* Duration */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      {tour.best_for && tour.best_for.slice(0, 1).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-primary/10 text-primary border-primary/30 uppercase font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-accent/10 text-accent border-accent/30 uppercase font-medium"
                      >
                        {tour.city}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl shadow-soft">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tours found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'No available tours at the moment'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Tour Details Dialog (Read-Only) */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTour && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTour.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {selectedTour.city}
                </DialogDescription>
              </DialogHeader>

              {/* Tour Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={selectedTour.image_url || '/placeholder.svg'}
                  alt={selectedTour.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price & Duration */}
              <div className="flex items-center justify-between bg-muted rounded-lg p-4">
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
                <h4 className="font-semibold text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedTour.description}</p>
              </div>

              {/* Starting Point */}
              {selectedTour.starting_point && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Starting Point
                  </h4>
                  <p className="text-muted-foreground">{selectedTour.starting_point}</p>
                </div>
              )}

              {/* Highlights */}
              {selectedTour.highlights && selectedTour.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Highlights
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
                    What's Included
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
                    What's Not Included
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
                    Best For
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
                    Cancellation Policy
                  </h4>
                  <p className="text-muted-foreground">{selectedTour.cancellation_policy}</p>
                </div>
              )}

              {/* Book Button */}
              <Button 
                className="w-full gradient-gold text-primary-foreground mt-4"
                onClick={handleBookFromDetails}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book This Tour
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Book Tour
            </DialogTitle>
            <DialogDescription>
              {selectedTour && (
                <span className="text-foreground font-medium">{selectedTour.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Full Name *</Label>
              <Input
                id="customer_name"
                placeholder="Enter your full name"
                value={bookingData.customer_name}
                onChange={(e) => setBookingData({ ...bookingData, customer_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">Email *</Label>
              <Input
                id="customer_email"
                type="email"
                placeholder="Enter your email"
                value={bookingData.customer_email}
                onChange={(e) => setBookingData({ ...bookingData, customer_email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone *</Label>
                <Input
                  id="customer_phone"
                  placeholder="Phone number"
                  value={bookingData.customer_phone}
                  onChange={(e) => setBookingData({ ...bookingData, customer_phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  placeholder="Your nationality"
                  value={bookingData.nationality}
                  onChange={(e) => setBookingData({ ...bookingData, nationality: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_date">Preferred Date</Label>
                <Input
                  id="preferred_date"
                  type="date"
                  value={bookingData.preferred_date}
                  onChange={(e) => setBookingData({ ...bookingData, preferred_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelers">
                  <Users className="w-4 h-4 inline mr-1" />
                  Travelers
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min={1}
                  max={20}
                  value={bookingData.travelers}
                  onChange={(e) => setBookingData({ ...bookingData, travelers: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Requests</Label>
              <Textarea
                id="notes"
                placeholder="Any special requests or notes..."
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {selectedTour && (
              <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Price:</span>
                <span className="text-lg font-bold text-primary">
                  {selectedTour.price.toLocaleString()} {selectedTour.currency}
                </span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full gradient-gold text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

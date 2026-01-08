import { useState, useEffect } from 'react';
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
  Compass
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
}

export default function ExplorePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    preferred_date: '',
    travelers: 1,
    notes: '',
  });
  const { toast } = useToast();

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

  const handleBookClick = (tour: Tour) => {
    setSelectedTour(tour);
    setIsBookingOpen(true);
    setBookingData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      preferred_date: '',
      travelers: 1,
      notes: '',
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTour) return;

    // Basic validation
    if (!bookingData.customer_name.trim() || !bookingData.customer_email.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('bookings').insert({
      tour_id: selectedTour.id,
      customer_name: bookingData.customer_name.trim(),
      customer_email: bookingData.customer_email.trim(),
      customer_phone: bookingData.customer_phone.trim() || null,
      preferred_date: bookingData.preferred_date || null,
      travelers: bookingData.travelers,
      notes: bookingData.notes.trim() || null,
      status: 'pending',
    });

    setIsSubmitting(false);

    if (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Booking Submitted!',
        description: 'Your booking request has been received. We will contact you soon.',
      });
      setIsBookingOpen(false);
      setSelectedTour(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Egypt Tours</h1>
                <p className="text-xs text-muted-foreground">Explore & Book</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-gold py-12 md:py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Discover Amazing Tours in Egypt
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Explore ancient wonders, beautiful beaches, and unforgettable experiences
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search tours by name, city, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-card border-0 shadow-medium"
            />
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <main className="container-custom py-8 md:py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No tours found matching your search.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                Available Tours ({filteredTours.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group"
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
                  <div className="p-5">
                    {/* Price & Location */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{tour.city}</span>
                      </div>
                      <span className="text-primary font-bold text-lg">
                        {tour.price.toLocaleString()} {tour.currency}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
                      {tour.name}
                    </h4>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                      {tour.description}
                    </p>

                    {/* Duration & Tags */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration}</span>
                      </div>
                      {tour.best_for && tour.best_for.slice(0, 1).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-primary/10 text-primary border-primary/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Book Button */}
                    <Button 
                      className="w-full gradient-gold text-primary-foreground hover:opacity-90"
                      onClick={() => handleBookClick(tour)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="container-custom text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Egypt Tours. All rights reserved.
          </p>
        </div>
      </footer>

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

            <div className="space-y-2">
              <Label htmlFor="customer_phone">Phone Number</Label>
              <Input
                id="customer_phone"
                placeholder="Enter your phone number"
                value={bookingData.customer_phone}
                onChange={(e) => setBookingData({ ...bookingData, customer_phone: e.target.value })}
              />
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

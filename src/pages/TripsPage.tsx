import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TripCard } from '@/components/trips/TripCard';
import { trips, cities, tripTypes } from '@/data/trips';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, X, Compass, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TripsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [durationRange, setDurationRange] = useState([1, 7]);
  const [showFilters, setShowFilters] = useState(false);

  // Enable dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trip.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'all' || trip.city === selectedCity;
      const matchesType = selectedType === 'all' || trip.type === selectedType;
      const matchesPrice = trip.price >= priceRange[0] && trip.price <= priceRange[1];
      const matchesDuration = trip.duration >= durationRange[0] && trip.duration <= durationRange[1];

      return matchesSearch && matchesCity && matchesType && matchesPrice && matchesDuration;
    });
  }, [searchQuery, selectedCity, selectedType, priceRange, durationRange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedType('all');
    setPriceRange([0, 10000]);
    setDurationRange([1, 7]);
  };

  const hasActiveFilters = searchQuery || selectedCity !== 'all' || selectedType !== 'all' || 
                          priceRange[0] !== 0 || priceRange[1] !== 10000 ||
                          durationRange[0] !== 1 || durationRange[1] !== 7;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30"
      >
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/explore" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Compass className="w-5 h-5 text-background" />
            </div>
            <span className="text-lg font-bold text-gradient-gold">Egypt Tours</span>
          </Link>

          {/* Back to Home */}
          <Link 
            to="/explore"
            className="flex items-center gap-2 px-4 py-2 border border-primary/50 rounded-lg text-primary hover:bg-primary/10 transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </motion.nav>

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-primary/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            All Tourist Trips
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Choose your favorite destination and book your trip now
          </motion.p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Search & Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for a trip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-border"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="h-12 gap-2">
                <X className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-card p-6 rounded-2xl border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* City Filter */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City
                      </label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Trip Type
                      </label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {tripTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Price: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} EGP
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={10000}
                        step={100}
                        className="mt-3"
                      />
                    </div>

                    {/* Duration Range */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Duration: {durationRange[0]} - {durationRange[1]} days
                      </label>
                      <Slider
                        value={durationRange}
                        onValueChange={setDurationRange}
                        min={1}
                        max={7}
                        step={1}
                        className="mt-3"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="mb-6 text-muted-foreground">
            Results: <span className="font-semibold text-foreground">{filteredTrips.length}</span> trips
          </div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <TripCard trip={trip} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">Try changing your search criteria</p>
              <Button onClick={clearFilters} className="btn-gold">Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TripsPage;
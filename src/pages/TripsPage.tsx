import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TripCard } from '@/components/trips/TripCard';
import { trips, cities, tripTypes } from '@/data/trips';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TripsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [durationRange, setDurationRange] = useState([1, 7]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch = trip.title.includes(searchQuery) || 
                           trip.description.includes(searchQuery) ||
                           trip.city.includes(searchQuery);
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
    <Layout>
      {/* Header */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4"
          >
            جميع الرحلات السياحية
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/80 text-lg max-w-2xl mx-auto"
          >
            اختر وجهتك المفضلة واحجز رحلتك الآن
          </motion.p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          {/* Search & Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن رحلة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              الفلاتر
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="h-12 gap-2">
                <X className="w-4 h-4" />
                مسح الكل
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
                <div className="bg-card p-6 rounded-2xl shadow-soft border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* City Filter */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        المدينة
                      </label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع المدن</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        نوع الرحلة
                      </label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الأنواع</SelectItem>
                          {tripTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        السعر: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} جنيه
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
                        المدة: {durationRange[0]} - {durationRange[1]} أيام
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
            عدد النتائج: <span className="font-semibold text-foreground">{filteredTrips.length}</span> رحلة
          </div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTrips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground mb-4">جرب تغيير معايير البحث</p>
              <Button onClick={clearFilters}>مسح الفلاتر</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TripsPage;

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tour, TourFormData } from '@/types/tour';
import { sampleTours } from '@/data/sampleTours';

// Map from Supabase row to frontend Tour type
function mapFromDb(row: any): Tour {
  return {
    id: row.id,
    name: row.name,
    tourism_type: row.tourism_type || undefined,
    description: row.description || '',
    city: row.city,
    price: row.price,
    currency: 'EGP',
    duration: row.duration,
    availability: row.availability ? 'available' : 'unavailable',
    image_url: row.image_url || '',
    features: row.features || [],
    last_updated: row.updated_at,
    // New enhanced fields
    starting_point: row.starting_point || undefined,
    highlights: row.highlights || [],
    included: row.included || [],
    excluded: row.excluded || [],
    experience_level: row.experience_level || undefined,
    best_for: row.best_for || [],
    cancellation_policy: row.cancellation_policy || undefined,
  };
}

// Map from frontend Tour to Supabase row
function mapToDb(data: TourFormData) {
  return {
    name: data.name,
    tourism_type: data.tourism_type || null,
    description: data.description,
    city: data.city,
    price: data.price,
    price_egp: data.price_egp || null,
    price_usd: data.price_usd || null,
    discount_percentage: data.discount_percentage || 0,
    currency: data.currency,
    duration: data.duration,
    availability: data.availability === 'available',
    image_url: data.image_url,
    features: data.features,
    starting_point: data.starting_point || null,
    highlights: data.highlights || [],
    included: data.included || [],
    excluded: data.excluded || [],
    experience_level: data.experience_level || null,
    best_for: data.best_for || [],
    cancellation_policy: data.cancellation_policy || null,
  };
}

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tours from Supabase
  const fetchTours = useCallback(async (): Promise<Tour[]> => {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tours:', error);
      return [];
    }

    return (data || []).map(mapFromDb);
  }, []);

  // Migrate sample tours to Supabase on first run
  const migrateToursIfNeeded = useCallback(async (): Promise<Tour[]> => {
    const existingTours = await fetchTours();
    
    if (existingTours.length === 0) {
      console.log('Migrating sample tours to Supabase...');
      
      const toursToInsert = sampleTours.map(tour => ({
        name: tour.name,
        description: tour.description,
        city: tour.city,
        price: tour.price,
        currency: tour.currency,
        duration: tour.duration,
        availability: tour.availability === 'available',
        image_url: tour.image_url,
        features: tour.features,
      }));

      const { error } = await supabase.from('tours').insert(toursToInsert);
      
      if (error) {
        console.error('Error migrating tours:', error);
        return [];
      }
      
      console.log('Sample tours migrated successfully!');
      return await fetchTours();
    }
    
    return existingTours;
  }, [fetchTours]);

  // Initial load
  useEffect(() => {
    const loadTours = async () => {
      setIsLoading(true);
      const data = await migrateToursIfNeeded();
      setTours(data);
      setIsLoading(false);
    };
    loadTours();
  }, [migrateToursIfNeeded]);

  const addTour = useCallback(async (data: TourFormData): Promise<Tour | null> => {
    const { data: newTour, error } = await supabase
      .from('tours')
      .insert(mapToDb(data))
      .select()
      .single();

    if (error) {
      console.error('Error adding tour:', error);
      return null;
    }

    const mappedTour = mapFromDb(newTour);
    setTours((prev) => [mappedTour, ...prev]);
    return mappedTour;
  }, []);

  const updateTour = useCallback(async (id: string, data: Partial<TourFormData>) => {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.tourism_type !== undefined) updateData.tourism_type = data.tourism_type || null;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.availability !== undefined) updateData.availability = data.availability === 'available';
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.features !== undefined) updateData.features = data.features;
    // New enhanced fields
    if (data.starting_point !== undefined) updateData.starting_point = data.starting_point || null;
    if (data.highlights !== undefined) updateData.highlights = data.highlights;
    if (data.included !== undefined) updateData.included = data.included;
    if (data.excluded !== undefined) updateData.excluded = data.excluded;
    if (data.experience_level !== undefined) updateData.experience_level = data.experience_level || null;
    if (data.best_for !== undefined) updateData.best_for = data.best_for;
    if (data.cancellation_policy !== undefined) updateData.cancellation_policy = data.cancellation_policy || null;

    const { error } = await supabase
      .from('tours')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating tour:', error);
      return;
    }

    // Refetch to get updated data
    const updatedTours = await fetchTours();
    setTours(updatedTours);
  }, [fetchTours]);

  const deleteTour = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tour:', error);
      return;
    }

    setTours((prev) => prev.filter((tour) => tour.id !== id));
  }, []);

  const toggleAvailability = useCallback(async (id: string) => {
    const tour = tours.find((t) => t.id === id);
    if (!tour) return;

    const newAvailability = tour.availability === 'available' ? false : true;

    const { error } = await supabase
      .from('tours')
      .update({ availability: newAvailability })
      .eq('id', id);

    if (error) {
      console.error('Error toggling availability:', error);
      return;
    }

    setTours((prev) =>
      prev.map((t) =>
        t.id === id 
          ? { ...t, availability: newAvailability ? 'available' : 'unavailable' } 
          : t
      )
    );
  }, [tours]);

  const getAvailableTours = useCallback(() => {
    return tours.filter((tour) => tour.availability === 'available');
  }, [tours]);

  return {
    tours,
    isLoading,
    addTour,
    updateTour,
    deleteTour,
    toggleAvailability,
    getAvailableTours,
  };
}

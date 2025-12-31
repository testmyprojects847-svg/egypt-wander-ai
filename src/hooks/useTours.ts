import { useState, useCallback } from 'react';
import { Tour, TourFormData } from '@/types/tour';
import { sampleTours } from '@/data/sampleTours';

export function useTours() {
  const [tours, setTours] = useState<Tour[]>(sampleTours);

  const addTour = useCallback((data: TourFormData) => {
    const newTour: Tour = {
      ...data,
      id: Date.now().toString(),
      last_updated: new Date().toISOString(),
    };
    setTours((prev) => [newTour, ...prev]);
    return newTour;
  }, []);

  const updateTour = useCallback((id: string, data: Partial<TourFormData>) => {
    setTours((prev) =>
      prev.map((tour) =>
        tour.id === id
          ? { ...tour, ...data, last_updated: new Date().toISOString() }
          : tour
      )
    );
  }, []);

  const deleteTour = useCallback((id: string) => {
    setTours((prev) => prev.filter((tour) => tour.id !== id));
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    setTours((prev) =>
      prev.map((tour) =>
        tour.id === id
          ? {
              ...tour,
              availability: tour.availability === 'available' ? 'unavailable' : 'available',
              last_updated: new Date().toISOString(),
            }
          : tour
      )
    );
  }, []);

  const getAvailableTours = useCallback(() => {
    return tours.filter((tour) => tour.availability === 'available');
  }, [tours]);

  return {
    tours,
    addTour,
    updateTour,
    deleteTour,
    toggleAvailability,
    getAvailableTours,
  };
}

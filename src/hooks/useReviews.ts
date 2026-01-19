import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  country_code: string;
  verified: boolean;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface NewReview {
  customer_name: string;
  rating: number;
  comment: string;
  country_code: string;
  email?: string;
  phone?: string;
}

export function useReviews() {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  const verifyBooking = async (email?: string, phone?: string): Promise<boolean> => {
    if (!email && !phone) return false;

    let query = supabase.from('bookings').select('id');
    
    if (email && phone) {
      query = query.or(`email.eq.${email},phone.eq.${phone}`);
    } else if (email) {
      query = query.eq('email', email);
    } else if (phone) {
      query = query.eq('phone', phone);
    }

    const { data, error } = await query.limit(1);
    
    if (error) {
      console.error('Error verifying booking:', error);
      return false;
    }

    return data && data.length > 0;
  };

  const submitReview = useMutation({
    mutationFn: async (newReview: NewReview) => {
      // Verify if user has a booking
      const isVerified = await verifyBooking(newReview.email, newReview.phone);

      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...newReview,
          verified: isVerified,
        }])
        .select()
        .single();

      if (error) throw error;
      return { review: data, isVerified };
    },
    onSuccess: ({ isVerified }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      if (isVerified) {
        toast.success('Thank you! Your verified review has been submitted.');
      } else {
        toast.success('Thank you for your review! Note: It will be marked as verified once you make a booking.');
      }
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    },
  });

  return {
    reviews,
    isLoading,
    error,
    submitReview,
    verifyBooking,
  };
}

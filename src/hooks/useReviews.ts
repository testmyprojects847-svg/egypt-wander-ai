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
  tour_name?: string;
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

  // Verify if user exists in tourists table with matching email, phone, AND tour_name
  const verifyTourist = async (email?: string, phone?: string, tourName?: string): Promise<boolean> => {
    if ((!email && !phone) || !tourName) return false;

    try {
      // Build query to match email OR phone AND tour_name
      let query = supabase.from('tourists').select('id, tour_name');
      
      if (email && phone) {
        // Match (email OR phone) AND tour_name
        query = query
          .or(`email.eq.${email},phone.eq.${phone}`)
          .eq('tour_name', tourName);
      } else if (email) {
        query = query.eq('email', email).eq('tour_name', tourName);
      } else if (phone) {
        query = query.eq('phone', phone).eq('tour_name', tourName);
      }

      const { data, error } = await query.limit(1);
      
      if (error) {
        console.error('Error verifying tourist:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (err) {
      console.error('Error in verifyTourist:', err);
      return false;
    }
  };

  const submitReview = useMutation({
    mutationFn: async (newReview: NewReview): Promise<{ success: boolean; verified: boolean }> => {
      // Verify if user exists in tourists table
      const isVerified = await verifyTourist(newReview.email, newReview.phone, newReview.tour_name);

      // Only save review if verified
      if (!isVerified) {
        return { success: false, verified: false };
      }

      const { error } = await supabase
        .from('reviews')
        .insert([{
          customer_name: newReview.customer_name,
          rating: newReview.rating,
          comment: newReview.comment,
          country_code: newReview.country_code,
          email: newReview.email,
          phone: newReview.phone,
          verified: true,
        }]);

      if (error) throw error;
      return { success: true, verified: true };
    },
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['reviews'] });
      }
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
    },
  });

  return {
    reviews,
    isLoading,
    error,
    submitReview,
    verifyTourist,
  };
}

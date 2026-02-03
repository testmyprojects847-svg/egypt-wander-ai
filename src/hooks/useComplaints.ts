import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Complaint {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useComplaints() {
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading, error } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Complaint[];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('complaints')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
    onError: (error) => {
      console.error('Error marking complaint as read:', error);
      toast.error('Failed to update complaint');
    },
  });

  const deleteComplaint = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint deleted');
    },
    onError: (error) => {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    },
  });

  return {
    complaints,
    isLoading,
    error,
    markAsRead,
    deleteComplaint,
    unreadCount: complaints.filter(c => !c.is_read).length,
  };
}

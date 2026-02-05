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
  status: 'new' | 'resolved';
  solution_message: string | null;
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
      return (data || []).map(item => ({
        ...item,
        status: item.status || 'new',
        solution_message: item.solution_message || null,
      })) as Complaint[];
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

  const sendSolution = useMutation({
    mutationFn: async ({ id, name, email, phone, solution_message }: { 
      id: string; 
      name: string;
      email: string;
      phone: string | null;
      solution_message: string;
    }) => {
      // Send to webhook
      const response = await fetch('https://n8n.algaml.com/webhook/1fcbb0c9-f789-4612-8bc7-f5548ff7921a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          solution_message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send solution to webhook');
      }

      // Update database
      const { error } = await supabase
        .from('complaints')
        .update({ 
          status: 'resolved',
          is_read: true,
          solution_message,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Solution sent successfully');
    },
    onError: (error) => {
      console.error('Error sending solution:', error);
      toast.error('Failed to send solution');
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
    sendSolution,
    deleteComplaint,
    unreadCount: complaints.filter(c => !c.is_read).length,
    newCount: complaints.filter(c => c.status === 'new').length,
  };
}

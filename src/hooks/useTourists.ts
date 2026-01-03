import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Tourist {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  tour_id: string | null;
  booking_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface TouristFormData {
  full_name: string;
  email: string;
  phone?: string;
  nationality?: string;
  tour_id?: string;
  booking_id?: string;
  notes?: string;
}

export const useTourists = () => {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTourists = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tourists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tourists:", error);
    } else {
      setTourists(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTourists();
  }, []);

  const addTourist = async (data: TouristFormData): Promise<Tourist | null> => {
    const insertData = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      nationality: data.nationality || null,
      tour_id: data.tour_id || null,
      booking_id: data.booking_id || null,
      notes: data.notes || null,
    };

    const { data: newTourist, error } = await supabase
      .from("tourists")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error adding tourist:", error);
      return null;
    }

    setTourists((prev) => [newTourist, ...prev]);
    return newTourist;
  };

  const updateTourist = async (id: string, data: Partial<TouristFormData>) => {
    const updateData: Record<string, unknown> = {};
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.nationality !== undefined) updateData.nationality = data.nationality || null;
    if (data.tour_id !== undefined) updateData.tour_id = data.tour_id || null;
    if (data.booking_id !== undefined) updateData.booking_id = data.booking_id || null;
    if (data.notes !== undefined) updateData.notes = data.notes || null;

    const { error } = await supabase
      .from("tourists")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating tourist:", error);
      return false;
    }

    await fetchTourists();
    return true;
  };

  const deleteTourist = async (id: string) => {
    const { error } = await supabase.from("tourists").delete().eq("id", id);

    if (error) {
      console.error("Error deleting tourist:", error);
      return false;
    }

    setTourists((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  return {
    tourists,
    isLoading,
    addTourist,
    updateTourist,
    deleteTourist,
    refetch: fetchTourists,
  };
};

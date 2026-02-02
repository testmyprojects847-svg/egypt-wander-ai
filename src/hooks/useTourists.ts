import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Tourist {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  preferred_language: string | null;
  country_of_residence: string | null;
  preferred_city: string | null;
  travel_interests: string[];
  special_requests: string | null;
  tour_name: string | null;
  total_bookings: number;
  last_booking_date: string | null;
  created_at: string;
}

export interface TouristFormData {
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  preferred_language?: string;
  country_of_residence?: string;
  preferred_city?: string;
  travel_interests?: string[];
  special_requests?: string;
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
      setTourists((data as Tourist[]) || []);
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
      phone: data.phone,
      nationality: data.nationality,
      preferred_language: data.preferred_language || null,
      country_of_residence: data.country_of_residence || null,
      preferred_city: data.preferred_city || null,
      travel_interests: data.travel_interests || [],
      special_requests: data.special_requests || null,
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

    setTourists((prev) => [newTourist as Tourist, ...prev]);
    return newTourist as Tourist;
  };

  const updateTourist = async (id: string, data: Partial<TouristFormData>) => {
    const updateData: Record<string, unknown> = {};
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.nationality !== undefined) updateData.nationality = data.nationality;
    if (data.preferred_language !== undefined) updateData.preferred_language = data.preferred_language || null;
    if (data.country_of_residence !== undefined) updateData.country_of_residence = data.country_of_residence || null;
    if (data.preferred_city !== undefined) updateData.preferred_city = data.preferred_city || null;
    if (data.travel_interests !== undefined) updateData.travel_interests = data.travel_interests || [];
    if (data.special_requests !== undefined) updateData.special_requests = data.special_requests || null;

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

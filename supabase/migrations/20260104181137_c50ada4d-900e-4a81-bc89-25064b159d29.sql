-- Drop existing tourists table and create new one with independent structure
DROP TABLE IF EXISTS public.tourists;

CREATE TABLE public.tourists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  nationality TEXT NOT NULL,
  preferred_language TEXT,
  country_of_residence TEXT,
  preferred_city TEXT,
  travel_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  special_requests TEXT,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  last_booking_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tourists ENABLE ROW LEVEL SECURITY;

-- Create public access policies for admin dashboard
CREATE POLICY "Allow all reads on tourists" ON public.tourists FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on tourists" ON public.tourists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on tourists" ON public.tourists FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all deletes on tourists" ON public.tourists FOR DELETE USING (true);
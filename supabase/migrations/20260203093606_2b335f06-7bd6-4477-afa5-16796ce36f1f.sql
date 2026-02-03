-- Add price_egp and discount_percentage to tours table
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS price_egp NUMERIC,
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;

-- Update price_egp from existing price column (price is already in EGP)
UPDATE public.tours SET price_egp = price WHERE price_egp IS NULL;

-- Create complaints table for the complaints system
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on complaints
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for complaints (admin access)
CREATE POLICY "Anyone can submit complaints" 
ON public.complaints 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read complaints" 
ON public.complaints 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update complaints" 
ON public.complaints 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete complaints" 
ON public.complaints 
FOR DELETE 
USING (true);
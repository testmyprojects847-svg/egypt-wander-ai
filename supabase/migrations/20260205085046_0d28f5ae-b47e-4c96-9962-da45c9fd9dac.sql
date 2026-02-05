-- Add status column to complaints table for tracking resolution
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS solution_message text;

-- Add booking-related columns to tourists table
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS tour_id uuid;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS tour_price_egp numeric;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS tour_price_usd numeric;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS discount_percent integer;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS starting_point text;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS number_of_people integer DEFAULT 1;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS total_price numeric;
ALTER TABLE public.tourists ADD COLUMN IF NOT EXISTS booking_date date;
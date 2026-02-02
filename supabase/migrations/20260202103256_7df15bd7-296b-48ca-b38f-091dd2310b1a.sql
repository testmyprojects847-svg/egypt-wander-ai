-- Add Arabic translation columns to tours table for i18n
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS name_ar TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS highlights_ar TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS included_ar TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS excluded_ar TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS best_for_ar TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS cancellation_policy_ar TEXT,
ADD COLUMN IF NOT EXISTS starting_point_ar TEXT,
ADD COLUMN IF NOT EXISTS tourism_type_ar TEXT,
ADD COLUMN IF NOT EXISTS price_usd NUMERIC;

-- Add tourName column to tourists table to track which tour was booked
ALTER TABLE public.tourists
ADD COLUMN IF NOT EXISTS tour_name TEXT;

-- Update existing tours with USD price calculation (1 USD = 50 EGP)
UPDATE public.tours SET price_usd = ROUND(price / 50, 2) WHERE price_usd IS NULL;
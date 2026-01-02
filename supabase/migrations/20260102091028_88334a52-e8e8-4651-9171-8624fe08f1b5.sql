-- Add new fields for enhanced tour information
ALTER TABLE public.tours
ADD COLUMN IF NOT EXISTS starting_point text,
ADD COLUMN IF NOT EXISTS highlights text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS included text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS excluded text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS experience_level text,
ADD COLUMN IF NOT EXISTS best_for text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS cancellation_policy text;
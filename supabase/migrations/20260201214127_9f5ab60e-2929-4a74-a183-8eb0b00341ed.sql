-- Add tourism_type column to tours table
ALTER TABLE public.tours 
ADD COLUMN tourism_type TEXT;

-- Add a comment describing the allowed values
COMMENT ON COLUMN public.tours.tourism_type IS 'Allowed values: Beach Tourism, Safari & Desert, Historical & Museums, Nile Cruises, Religious Tourism, Medical Tourism';
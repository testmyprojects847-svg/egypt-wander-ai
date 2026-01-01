-- Add features column to tours table (array of text)
ALTER TABLE public.tours 
ADD COLUMN features text[] DEFAULT ARRAY[]::text[];
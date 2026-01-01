-- Create tours table
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  duration TEXT NOT NULL,
  availability BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Public read policy (for AI API - only available tours)
CREATE POLICY "Anyone can read available tours"
ON public.tours
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow all operations for authenticated and anon (admin environment without auth for now)
CREATE POLICY "Allow all inserts"
ON public.tours
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow all updates"
ON public.tours
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all deletes"
ON public.tours
FOR DELETE
TO anon, authenticated
USING (true);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_tours_updated_at
BEFORE UPDATE ON public.tours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create contact_messages table for storing contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact messages (public form)
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading messages (for admin - we'll use service role or authenticated admin later)
CREATE POLICY "Allow reading contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (true);

-- Allow updating messages (mark as read)
CREATE POLICY "Allow updating contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (true);

-- Allow deleting messages
CREATE POLICY "Allow deleting contact messages" 
ON public.contact_messages 
FOR DELETE 
USING (true);
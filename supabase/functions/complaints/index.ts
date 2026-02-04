import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface ComplaintPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function validatePayload(body: unknown): { valid: true; data: ComplaintPayload } | { valid: false; error: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const { name, email, phone, message } = body as Record<string, unknown>;

  // Name validation
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'name is required and must be a non-empty string' };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'name must be less than 100 characters' };
  }

  // Email validation
  if (typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, error: 'email is required and must be a non-empty string' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (email.trim().length > 255) {
    return { valid: false, error: 'email must be less than 255 characters' };
  }

  // Phone validation (optional)
  if (phone !== undefined && phone !== null && typeof phone !== 'string') {
    return { valid: false, error: 'phone must be a string if provided' };
  }
  if (typeof phone === 'string' && phone.trim().length > 20) {
    return { valid: false, error: 'phone must be less than 20 characters' };
  }

  // Message validation
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'message is required and must be a non-empty string' };
  }
  if (message.trim().length > 2000) {
    return { valid: false, error: 'message must be less than 2000 characters' };
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: typeof phone === 'string' && phone.trim().length > 0 ? phone.trim() : undefined,
      message: message.trim(),
    },
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse JSON body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate payload
    const validation = validatePayload(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { name, email, phone, message } = validation.data;

    // Insert complaint with is_read = false by default
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        name,
        email,
        phone: phone || null,
        message,
        is_read: false,
      }])
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save complaint' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Complaint received successfully',
        data: {
          id: data.id,
          created_at: data.created_at,
        },
      }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in complaints function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});

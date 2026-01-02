import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use GET.' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters
    const url = new URL(req.url);
    const city = url.searchParams.get('city');
    const maxPrice = url.searchParams.get('max_price');

    console.log('AI Tours API called with params:', { city, maxPrice });

    // Build query - only return available tours with all fields
    let query = supabase
      .from('tours')
      .select(`
        id,
        name,
        description,
        city,
        price,
        currency,
        duration,
        availability,
        image_url,
        features,
        starting_point,
        highlights,
        included,
        excluded,
        experience_level,
        best_for,
        cancellation_policy,
        created_at,
        updated_at
      `)
      .eq('availability', true);

    // Apply optional filters
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (maxPrice) {
      const priceNum = parseFloat(maxPrice);
      if (!isNaN(priceNum)) {
        query = query.lte('price', priceNum);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tours' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`Returning ${data?.length || 0} available tours`);

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error in ai-tours function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});

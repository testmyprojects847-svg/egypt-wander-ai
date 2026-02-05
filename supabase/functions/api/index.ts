 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 serve(async (req) => {
   // Handle CORS
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   const supabase = createClient(
     Deno.env.get('SUPABASE_URL')!,
     Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
   );
 
   const url = new URL(req.url);
   const pathParts = url.pathname.split('/').filter(Boolean);
   // Expected: /api/{table} or /api/{table}/{id}
   const table = pathParts[1] || url.searchParams.get('table');
   const id = pathParts[2] || url.searchParams.get('id');
 
   const validTables = ['tourists', 'tours', 'complaints', 'bookings', 'reviews'];
 
   if (!table || !validTables.includes(table)) {
     return new Response(
       JSON.stringify({ error: 'Invalid or missing table. Valid: ' + validTables.join(', ') }),
       { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 
   try {
     // GET - Read data
     if (req.method === 'GET') {
       let query = supabase.from(table).select('*');
       
       if (id) {
         query = query.eq('id', id);
       }
 
       // Support query params for filtering
       const limit = url.searchParams.get('limit');
       const orderBy = url.searchParams.get('order_by');
       const orderDir = url.searchParams.get('order_dir') || 'desc';
 
       if (limit) {
         query = query.limit(parseInt(limit));
       }
       if (orderBy) {
         query = query.order(orderBy, { ascending: orderDir === 'asc' });
       } else {
         query = query.order('created_at', { ascending: false });
       }
 
       const { data, error } = await query;
 
       if (error) throw error;
 
       return new Response(
         JSON.stringify({ success: true, data: id ? (data?.[0] || null) : data }),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // POST - Create data
     if (req.method === 'POST') {
       const body = await req.json();
 
       if (!body || typeof body !== 'object') {
         return new Response(
           JSON.stringify({ error: 'Invalid request body' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const { data, error } = await supabase
         .from(table)
         .insert(body)
         .select()
         .single();
 
       if (error) throw error;
 
       return new Response(
         JSON.stringify({ success: true, data }),
         { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // PATCH - Update data
     if (req.method === 'PATCH') {
       if (!id) {
         return new Response(
           JSON.stringify({ error: 'ID is required for PATCH requests' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const body = await req.json();
 
       if (!body || typeof body !== 'object') {
         return new Response(
           JSON.stringify({ error: 'Invalid request body' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const { data, error } = await supabase
         .from(table)
         .update(body)
         .eq('id', id)
         .select()
         .single();
 
       if (error) throw error;
 
       return new Response(
         JSON.stringify({ success: true, data }),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // DELETE - Remove data
     if (req.method === 'DELETE') {
       if (!id) {
         return new Response(
           JSON.stringify({ error: 'ID is required for DELETE requests' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const { error } = await supabase
         .from(table)
         .delete()
         .eq('id', id);
 
       if (error) throw error;
 
       return new Response(
         JSON.stringify({ success: true, message: 'Deleted successfully' }),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     return new Response(
       JSON.stringify({ error: 'Method not allowed' }),
       { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
      const err = error as Error;
      console.error('API Error:', err);
      return new Response(
        JSON.stringify({ error: err.message || 'Internal server error' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });
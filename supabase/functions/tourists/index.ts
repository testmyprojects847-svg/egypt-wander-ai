import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // GET - Fetch tourists with optional filters
    if (req.method === "GET") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const email = url.searchParams.get("email");
      const phone = url.searchParams.get("phone");
      const nationality = url.searchParams.get("nationality");
      const dateFrom = url.searchParams.get("date_from");
      const dateTo = url.searchParams.get("date_to");

      let query = supabase.from("tourists").select("*");

      if (id) query = query.eq("id", id);
      if (email) query = query.ilike("email", `%${email}%`);
      if (phone) query = query.ilike("phone", `%${phone}%`);
      if (nationality) query = query.ilike("nationality", `%${nationality}%`);
      if (dateFrom) query = query.gte("created_at", dateFrom);
      if (dateTo) query = query.lte("created_at", dateTo);

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tourists:", error);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to fetch tourists." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Fetched ${data?.length || 0} tourists`);
      return new Response(
        JSON.stringify(data || []),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST - Register new tourist
    if (req.method === "POST") {
      const body = await req.json();
      console.log("Received tourist registration:", body);

      const {
        full_name,
        email,
        phone,
        nationality,
        preferred_language,
        country_of_residence,
        preferred_city,
        travel_interests,
        special_requests
      } = body;

      // Validate required fields
      if (!full_name || typeof full_name !== "string" || full_name.trim() === "") {
        return new Response(
          JSON.stringify({ success: false, error: "full_name is required." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return new Response(
          JSON.stringify({ success: false, error: "Valid email is required." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!phone || typeof phone !== "string" || phone.trim() === "") {
        return new Response(
          JSON.stringify({ success: false, error: "phone is required." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!nationality || typeof nationality !== "string" || nationality.trim() === "") {
        return new Response(
          JSON.stringify({ success: false, error: "nationality is required." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check for duplicate email
      const { data: existingTourist } = await supabase
        .from("tourists")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (existingTourist) {
        return new Response(
          JSON.stringify({ success: false, error: "A tourist with this email already exists." }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Insert the tourist
      const insertData = {
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        nationality: nationality.trim(),
        preferred_language: preferred_language || null,
        country_of_residence: country_of_residence || null,
        preferred_city: preferred_city || null,
        travel_interests: travel_interests || [],
        special_requests: special_requests || null,
        total_bookings: 0,
        last_booking_date: null,
      };

      const { data: newTourist, error: insertError } = await supabase
        .from("tourists")
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting tourist:", insertError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to register tourist." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Tourist registered successfully:", newTourist.id);
      return new Response(
        JSON.stringify(newTourist),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed. Use GET or POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON or server error." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

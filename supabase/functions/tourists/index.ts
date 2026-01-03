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
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    console.log("Received tourist registration:", body);

    const { full_name, email, phone, nationality, tour_id, booking_id, notes } = body;

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

    // Validate tour_id if provided
    if (tour_id) {
      const { data: tour, error: tourError } = await supabase
        .from("tours")
        .select("id")
        .eq("id", tour_id)
        .maybeSingle();

      if (tourError || !tour) {
        console.log("Invalid tour_id:", tour_id);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid tour reference. Tour does not exist." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate booking_id if provided
    if (booking_id) {
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("id")
        .eq("id", booking_id)
        .maybeSingle();

      if (bookingError || !booking) {
        console.log("Invalid booking_id:", booking_id);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid booking reference. Booking does not exist." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Insert the tourist
    const insertData = {
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      nationality: nationality || null,
      tour_id: tour_id || null,
      booking_id: booking_id || null,
      notes: notes || null,
    };

    const { data: newTourist, error: insertError } = await supabase
      .from("tourists")
      .insert(insertData)
      .select("id")
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
      JSON.stringify({ success: true, tourist_id: newTourist.id }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON or server error." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

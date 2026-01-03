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
    if (req.method !== "GET") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed. Use GET." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const booking_id = url.searchParams.get("booking_id");

    console.log("Booking inquiry for:", { email, booking_id });

    // Validate required parameters
    if (!email || !booking_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Both email and booking_id are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, status, preferred_date, travelers, customer_email, tour_id")
      .eq("id", booking_id)
      .maybeSingle();

    if (bookingError || !booking) {
      console.log("Booking not found:", booking_id);
      return new Response(
        JSON.stringify({ success: false, error: "Booking not found or invalid credentials." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify email matches
    if (booking.customer_email.toLowerCase() !== email.toLowerCase()) {
      console.log("Email mismatch for booking:", booking_id);
      return new Response(
        JSON.stringify({ success: false, error: "Booking not found or invalid credentials." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch tour info if linked
    let tourInfo = null;
    if (booking.tour_id) {
      const { data: tour } = await supabase
        .from("tours")
        .select("name, city, duration, price, currency")
        .eq("id", booking.tour_id)
        .maybeSingle();

      if (tour) {
        tourInfo = {
          name: tour.name,
          city: tour.city,
          duration: tour.duration,
          price: tour.price,
          currency: tour.currency,
        };
      }
    }

    const response = {
      success: true,
      booking: {
        booking_id: booking.id,
        status: booking.status,
        preferred_date: booking.preferred_date,
        travelers: booking.travelers,
      },
      tour: tourInfo,
    };

    console.log("Booking inquiry successful:", response);
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

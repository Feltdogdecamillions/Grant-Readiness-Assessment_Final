import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { priceId, lineItems, successUrl, cancelUrl, customerEmail, metadata } = await req.json();

    if (!priceId && (!lineItems || lineItems.length === 0)) {
      return new Response(
        JSON.stringify({ error: "Price ID or line items are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const baseUrl = req.headers.get("origin") || "http://localhost:5173";
    const finalSuccessUrl = successUrl ? `${baseUrl}${successUrl}?session_id={CHECKOUT_SESSION_ID}` : `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl ? `${baseUrl}${cancelUrl}` : `${baseUrl}/`;

    const items = lineItems && lineItems.length > 0 ? lineItems : [priceId];

    const params: Record<string, string> = {
      "mode": "payment",
      "success_url": finalSuccessUrl,
      "cancel_url": finalCancelUrl,
    };

    items.forEach((item: string, index: number) => {
      params[`line_items[${index}][price]`] = item;
      params[`line_items[${index}][quantity]`] = "1";
    });

    if (customerEmail) {
      params["customer_email"] = customerEmail;
    }

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        params[`metadata[${key}]`] = String(value);
      });
    }

    const checkoutSession = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    });

    if (!checkoutSession.ok) {
      const error = await checkoutSession.text();
      console.error("Stripe API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const session = await checkoutSession.json();

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

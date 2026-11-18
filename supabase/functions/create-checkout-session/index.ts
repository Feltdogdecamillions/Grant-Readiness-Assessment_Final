import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const AUDIT_TIER_ID = "strategy-audit";
const AUDIT_PRICE_ID = "price_strategy_audit_97";

interface PromotionSettings {
  promo_enabled: boolean;
  promo_price_cents: number;
  regular_price_cents: number;
  promo_starts_at: string;
  promo_ends_at: string;
}

// Resolve the current effective price (in cents) for the Grant Readiness Audit
// from the promotion_settings table, using America/New_York for the promo window.
async function resolveAuditPriceCents(): Promise<{ cents: number; promoActive: boolean }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return { cents: 9700, promoActive: false };
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await adminClient
    .from("promotion_settings")
    .select("promo_enabled, promo_price_cents, regular_price_cents, promo_starts_at, promo_ends_at")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    console.error("Failed to load promotion settings:", error);
    return { cents: 9700, promoActive: false };
  }

  const settings = data as PromotionSettings;
  const nowInEastern = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  ).getTime();
  const startsAt = new Date(
    new Date(settings.promo_starts_at).toLocaleString("en-US", { timeZone: "America/New_York" })
  ).getTime();
  const endsAt = new Date(
    new Date(settings.promo_ends_at).toLocaleString("en-US", { timeZone: "America/New_York" })
  ).getTime();

  const promoActive =
    settings.promo_enabled &&
    nowInEastern >= startsAt &&
    nowInEastern <= endsAt &&
    settings.promo_price_cents === 0;

  return {
    cents: promoActive ? settings.promo_price_cents : settings.regular_price_cents,
    promoActive,
  };
}

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

    let items = lineItems && lineItems.length > 0 ? lineItems : [priceId];

    // Server-side pricing: when the free promotion is active, the audit is not
    // sent to Stripe at all. Otherwise the regular Stripe price applies.
    const isAudit = priceId === AUDIT_PRICE_ID || (metadata && metadata.tierId === AUDIT_TIER_ID);
    let promoActive = false;
    if (isAudit) {
      const resolved = await resolveAuditPriceCents();
      promoActive = resolved.promoActive;
      if (promoActive && resolved.cents === 0) {
        return new Response(
          JSON.stringify({ freePromotion: true, url: null }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      items = [AUDIT_PRICE_ID];
    }

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

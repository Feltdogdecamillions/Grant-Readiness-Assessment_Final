import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function toEasternUtcIso(dateStr: string, endOfDay: boolean): string | null {
  // dateStr: YYYY-MM-DD. Convert a date interpreted in America/New_York to UTC ISO.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const timeStr = endOfDay ? "23:59:59" : "00:00:00";
  const naive = new Date(`${dateStr}T${timeStr}Z`);
  if (Number.isNaN(naive.getTime())) return null;
  // Determine EST (-5) or EDT (-4) offset for that date.
  const year = Number(dateStr.slice(0, 4));
  // DST starts second Sunday of March, ends first Sunday of November (approximation by date rules).
  const dstStart = new Date(Date.UTC(year, 2, 1));
  dstStart.setUTCDate(dstStart.getUTCDate() + ((7 - dstStart.getUTCDay()) % 7) + 7);
  const dstEnd = new Date(Date.UTC(year, 10, 1));
  dstEnd.setUTCDate(dstEnd.getUTCDate() + ((7 - dstEnd.getUTCDay()) % 7));
  const isDst = naive >= dstStart && naive < dstEnd;
  const offsetMinutes = isDst ? 240 : 300; // minutes to subtract from UTC
  const adjusted = new Date(naive.getTime() - offsetMinutes * 60000);
  return adjusted.toISOString();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const adminPassword = authHeader.replace(/^Bearer\s+/i, "");

    if (!adminPassword) {
      return new Response(JSON.stringify({ error: "Password required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: settings, error: settingsError } = await adminClient
      .from("promotion_settings")
      .select("admin_password_hash")
      .eq("id", 1)
      .maybeSingle();

    if (settingsError || !settings) {
      return new Response(JSON.stringify({ error: "Settings not found" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const providedHash = await sha256Hex(adminPassword);
    // Bootstrap: if no hash stored yet, accept the default admin password and
    // store its hash so the owner can change it later from the dashboard.
    const DEFAULT_ADMIN_PASSWORD = "admin123";
    const storedHash = settings.admin_password_hash;
    const defaultHash = await sha256Hex(DEFAULT_ADMIN_PASSWORD);

    if (storedHash !== null && storedHash !== providedHash) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (storedHash === null && providedHash !== defaultHash) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (storedHash === null) {
      await adminClient
        .from("promotion_settings")
        .update({ admin_password_hash: providedHash })
        .eq("id", 1);
    }

    if (req.method === "GET") {
      const { data: current, error: readError } = await adminClient
        .from("promotion_settings")
        .select("promo_enabled, promo_price_cents, regular_price_cents, promo_starts_at, promo_ends_at, promo_name")
        .eq("id", 1)
        .maybeSingle();
      if (readError) throw readError;
      return new Response(JSON.stringify({ settings: current }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (typeof body.promoEnabled === "boolean") updates.promo_enabled = body.promoEnabled;
      if (typeof body.promoName === "string") updates.promo_name = body.promoName;
      if (typeof body.promoPriceCents === "number" && body.promoPriceCents >= 0) updates.promo_price_cents = Math.round(body.promoPriceCents);
      if (typeof body.regularPriceCents === "number" && body.regularPriceCents >= 0) updates.regular_price_cents = Math.round(body.regularPriceCents);
      if (typeof body.newPassword === "string" && body.newPassword.length >= 8) {
        updates.admin_password_hash = await sha256Hex(body.newPassword);
      }
      if (typeof body.promoStartDate === "string") {
        const iso = toEasternUtcIso(body.promoStartDate, false);
        if (!iso) return new Response(JSON.stringify({ error: "Invalid promoStartDate, expected YYYY-MM-DD" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        updates.promo_starts_at = iso;
      }
      if (typeof body.promoEndDate === "string") {
        const iso = toEasternUtcIso(body.promoEndDate, true);
        if (!iso) return new Response(JSON.stringify({ error: "Invalid promoEndDate, expected YYYY-MM-DD" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        updates.promo_ends_at = iso;
      }

      const { error: updateError } = await adminClient
        .from("promotion_settings")
        .update(updates)
        .eq("id", 1);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in update-promotion-settings:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

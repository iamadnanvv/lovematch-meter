import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Supporters Edge Function
 * GET  → returns { count: number }
 * POST → records an anonymized supporter event, returns { count, thanked: boolean }
 *
 * Privacy: We hash IP + UA with SHA-256; we never store raw identifiers.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // ---- GET: Return count only ----
    if (req.method === "GET") {
      const { count, error } = await supabase
        .from("supporter_events")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return new Response(JSON.stringify({ count: count ?? 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- POST: Record supporter event ----
    if (req.method === "POST") {
      const forwarded = req.headers.get("x-forwarded-for") ?? "0.0.0.0";
      const ip = forwarded.split(",")[0].trim();
      const ua = req.headers.get("user-agent") ?? "unknown";

      // Hash for privacy
      const enc = new TextEncoder();
      const ipBuf = await crypto.subtle.digest("SHA-256", enc.encode(ip));
      const uaBuf = await crypto.subtle.digest("SHA-256", enc.encode(ua));

      const toHex = (buf: ArrayBuffer) =>
        [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

      const ipHash = toHex(ipBuf);
      const uaHash = toHex(uaBuf);

      // Check if already thanked (same device within 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from("supporter_events")
        .select("id")
        .eq("ip_hash", ipHash)
        .eq("ua_hash", uaHash)
        .gte("created_at", thirtyDaysAgo)
        .limit(1);

      let thanked = false;
      if (!existing || existing.length === 0) {
        await supabase.from("supporter_events").insert({ ip_hash: ipHash, ua_hash: uaHash });
        thanked = true;
      }

      // Get updated count
      const { count, error } = await supabase
        .from("supporter_events")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      return new Response(JSON.stringify({ count: count ?? 0, thanked }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Supporters edge function error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

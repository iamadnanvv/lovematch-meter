import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const shareCode = pathParts[pathParts.length - 1];

  try {
    // GET /quiz-sessions/:code - Get session by share code
    if (req.method === "GET" && shareCode && shareCode !== "quiz-sessions") {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("share_code", shareCode.toUpperCase())
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ error: "Session not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ session: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /quiz-sessions - Create new session
    if (req.method === "POST") {
      const { player1_name, selected_categories, player1_answers } = await req.json();

      if (!player1_name || !selected_categories || !player1_answers) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate unique share code
      let shareCode = generateShareCode();
      let attempts = 0;
      while (attempts < 10) {
        const { data: existing } = await supabase
          .from("quiz_sessions")
          .select("id")
          .eq("share_code", shareCode)
          .maybeSingle();

        if (!existing) break;
        shareCode = generateShareCode();
        attempts++;
      }

      const { data, error } = await supabase
        .from("quiz_sessions")
        .insert({
          share_code: shareCode,
          player1_name,
          selected_categories,
          player1_answers,
          status: "waiting",
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ session: data }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PATCH /quiz-sessions/:code - Join and complete session
    if (req.method === "PATCH" && shareCode && shareCode !== "quiz-sessions") {
      const { player2_name, player2_answers } = await req.json();

      if (!player2_name || !player2_answers) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("quiz_sessions")
        .update({
          player2_name,
          player2_answers,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("share_code", shareCode.toUpperCase())
        .eq("status", "waiting")
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ error: "Session not found or already completed" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ session: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Quiz sessions error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

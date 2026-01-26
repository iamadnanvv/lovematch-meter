import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { player1Name, player2Name, score, tier, icon } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Generate a beautiful relationship badge image
    const prompt = `Create a beautiful, elegant relationship badge for a couples compatibility quiz game called "Love Triangle".

The badge should be:
- Circular or shield-shaped badge design with ornate borders
- ${tier} tier styling with ${tier === 'Legendary' ? 'gold and amber luxury' : tier === 'Epic' ? 'purple and violet jewel tones' : tier === 'Rare' ? 'blue and silver' : tier === 'Uncommon' ? 'emerald green' : 'elegant silver'}
- Feature the ${icon} icon prominently at the top
- Display "${player1Name} & ${player2Name}" in beautiful script typography
- Show "${score}% Compatible" with the tier name "${tier}" 
- Include "Love Triangle" branding subtly at the bottom
- Add sparkles, hearts, and decorative flourishes
- Rich textures, gradients, and slight 3D effect
- 1:1 square format, perfect for social media
- Professional, premium feel like an achievement badge
- Romantic and celebratory mood

Make it look like a collectible digital badge that couples would be proud to share and show off.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway returned ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        message: data.choices?.[0]?.message?.content || "Badge generated successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating badge:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate badge";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

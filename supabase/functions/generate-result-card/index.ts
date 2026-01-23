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
    const { player1Name, player2Name, score, message, title } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Generate a beautiful shareable result card
    const prompt = `Create a beautiful, romantic Instagram-worthy result card for a couples compatibility quiz game called "Love Triangle". 

The card should be:
- Elegant with a soft pink/rose gold gradient background
- Include decorative hearts and romantic elements
- Show the couple names "${player1Name}" and "${player2Name}" prominently
- Display their compatibility score: ${score}%
- Include the title: "${title}"
- Include the message: "${message}"
- Have a subtle "Love Triangle" branding at the bottom
- Be in 1:1 square format for Instagram
- Use beautiful script fonts and modern design
- Include sparkles, hearts, and romantic decorations
- The overall mood should be warm, romantic, and celebratory

Make it look like a professional, shareable social media graphic that couples would be proud to share.`;

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
        message: data.choices?.[0]?.message?.content || "Image generated successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating result card:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
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

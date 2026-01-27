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
    const { photo, player1Name, player2Name, score, verdict } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Generate a personalized result card with the couple's photo
    const prompt = `Create a beautiful, Instagram-worthy couple compatibility result card for "Love Triangle" game.

Requirements:
- Take the provided couple photo and overlay it with a beautiful romantic gradient
- Add a semi-transparent overlay at the bottom third
- Display the compatibility score "${score}%" prominently in large, elegant typography
- Show the verdict badge: "${verdict}"
- Include the couple names "${player1Name} & ${player2Name}" in beautiful script font
- Add "Love Triangle" watermark in the corner
- Include decorative hearts, sparkles, and romantic elements
- Use rose gold, pink, and warm romantic colors
- Make it square format (1:1) perfect for Instagram
- The overall aesthetic should be premium, romantic, and shareable
- Add subtle texture and depth to make it look professional

The result should look like a high-quality, professional social media graphic that couples would proudly share.`;

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
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: photo,
                },
              },
            ],
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
        message: data.choices?.[0]?.message?.content || "Photo card generated successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating photo card:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate photo card";
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

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
    const { messages, type, documentContent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are an expert AI Study Mentor for Indian school students (NCERT curriculum). You help students with:

1. **Study Planning** - Create personalized study schedules based on their class and subjects
2. **Doubt Solving** - Explain concepts clearly with examples from their textbooks
3. **Exam Preparation** - Provide tips, strategies, and practice questions
4. **Topic Summaries** - Give concise key points of any topic

Guidelines:
- Be friendly, encouraging, and patient
- Use simple language appropriate for school students
- Provide step-by-step explanations for math and science
- Include relevant formulas, examples, and mnemonics
- Reference NCERT books when applicable
- For Class 9-10: Focus on English, Science, Social Studies, Math
- For Class 11-12: Focus on PCM (Physics, Chemistry, Math) or PCB (with Biology)
- Use markdown formatting for better readability
- Include emojis to make learning fun 📚✨`;

    if (type === "summarize") {
      systemPrompt = `You are an expert document summarizer for students. Analyze the provided document content and create:

1. **Quick Summary** - A brief 2-3 sentence overview
2. **Key Points** - Bullet points of the main concepts
3. **Important Terms** - Definitions of key vocabulary
4. **Study Tips** - How to best learn this material

Format your response with clear headings and bullet points. Be concise but comprehensive.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...(documentContent ? [{ role: "user", content: `Please summarize this document:\n\n${documentContent}` }] : messages),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI mentor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

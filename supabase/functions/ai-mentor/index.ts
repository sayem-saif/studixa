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
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? Deno.env.get("LOVABLE_API_KEY");
    const OPENROUTER_BASE_URL = Deno.env.get("OPENROUTER_BASE_URL") ?? "https://openrouter.ai/api/v1";
    const OPENROUTER_MODEL = Deno.env.get("OPENROUTER_MODEL") ?? "openai/gpt-oss-20b";
    const OPENROUTER_SITE_URL = Deno.env.get("OPENROUTER_SITE_URL") ?? "https://studixa.app";
    const OPENROUTER_APP_NAME = Deno.env.get("OPENROUTER_APP_NAME") ?? "Studixa";
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    let systemPrompt = `You are an AI Study Mentor for NCERT school students ONLY.

**RESPOND WITH THIS EXACT FORMAT EVERY TIME:**

📚 **Topic Name**

**What it is:** One sentence only.

1️⃣ **First Point:** 1-2 sentences max
2️⃣ **Second Point:** 1-2 sentences max
3️⃣ **Third Point:** 1-2 sentences max

**Example:** One example only (1-2 sentences)

**Formula:** Only if applicable

**Common Mistakes:**
❌ Mistake 1
❌ Mistake 2

**Quick Tip:** One memory trick.

---

**ABSOLUTE RULES - ZERO EXCEPTIONS:**

1. NO ### ### HEADERS EVER - Not even once
2. NO "Key Concepts" sections
3. NO "Summary" sections
4. NO "Educational Path" sections
5. NO SUBSECTIONS with descriptions under bold titles
6. NO LONG PARAGRAPHS - Max 2 sentences per line
7. NO CODE BLOCKS OR PYTHON EXAMPLES
8. NO VERBOSE EXPLANATIONS
9. NO MULTIPLE EXAMPLES
10. NO BULLET POINTS (use numbers 1️⃣2️⃣3️⃣ instead)
11. NO EMOJIS except at start and in numbered list
12. STAY UNDER 150 WORDS TOTAL

**IF USER ASKS NON-NCERT TOPIC (entrepreneurship, life advice, career paths):**
Say: "That's interesting, but I help with NCERT subjects like Math, Science, Social Studies, English. Ask me about those instead!"

**EXAMPLES OF WHAT TO AVOID:**

WRONG:
### Key Concepts
**Identify a Problem:** Very long explanation here...
**Develop a Solution:** Another long explanation...

RIGHT:
1️⃣ **Identify Problem:** Find what frustrates people.
2️⃣ **Create Solution:** Build a product that solves it.
3️⃣ **Test & Learn:** Launch and get feedback, then improve.`;



    if (type === "summarize") {
      systemPrompt = `You are an expert document summarizer for students. Analyze the provided document content and create:

1. **Quick Summary** - A brief 2-3 sentence overview
2. **Key Points** - Bullet points of the main concepts
3. **Important Terms** - Definitions of key vocabulary
4. **Study Tips** - How to best learn this material

Format your response with clear headings and bullet points. Be concise but comprehensive.`;
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": OPENROUTER_SITE_URL,
        "X-Title": OPENROUTER_APP_NAME,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
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


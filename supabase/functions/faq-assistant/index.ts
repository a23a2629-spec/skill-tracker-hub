// FAQ Assistant edge function — streams responses via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT_BASE = `You are the friendly AI Help Assistant for "In-Campus Skills Gap Tracker", a university SaaS platform that helps lecturers detect skill gaps early and helps students track their progress.

Your job:
- Answer FAQs about using the platform
- Give clear, concise step-by-step guidance (use numbered steps)
- Onboard first-time users
- Explain dashboard features in simple language
- Be warm, professional, HubSpot-style

Platform features you know about:
- Student Dashboard: skill analysis (Mastered/Developing/Intensive), progress tracking, attendance, average score, AI insights, appointments, external problem reporting, course modules
- Lecturer Dashboard: student list (3 students per course), analytics, AI insights, intervention tools, report templates & submissions, appointment management, chat with students, viewing external problems
- Skill colors: Green = Mastered, Yellow = Developing, Red = Intensive
- Theme: light/dark toggle in header
- Search: top header search bar (lecturers search students; students search modules)
- Profile menu: top-right avatar
- Notifications: bell icon

Answer rules:
- Keep replies under 120 words unless explicitly asked for detail
- Use markdown: **bold** for UI labels, numbered lists for steps
- If unsure, say so and suggest where they might find it
- Tailor answers to the user's role`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, role } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `${SYSTEM_PROMPT_BASE}\n\nThe current user role is: ${role || "unknown"}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      const status = response.status === 429 || response.status === 402 ? response.status : 500;
      return new Response(JSON.stringify({ error: text }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

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

app.post("/api/faq-assistant", async (req, res) => {
  try {
    const { messages, role, students } = req.body;
    const apiKey = process.env.LOVABLE_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: "Missing LOVABLE_API_KEY on the server" });
      return;
    }

    let system = `${SYSTEM_PROMPT_BASE}\n\nThe current user role is: ${role || "unknown"}.`;

    if (role === "lecturer" && Array.isArray(students) && students.length > 0) {
      system += `\n\nYou ALSO have access to a STUDENT DIRECTORY for this lecturer. When the lecturer mentions a student's name, matric number, or student ID (even partial / case-insensitive), look them up in the directory below and provide a clear, well-organized full report including: name, matric no, course, program/faculty, semester, enrollment & registration status, attendance %, average score, AI percentage, skill breakdown (mastered/developing/intensive with titles & scores), guardian contact, financial aid, and prior education. If multiple students match, list them and ask which one. If no match, say so politely and suggest the closest names. Format with markdown headings and bullet lists. Never invent data not present in the directory.\n\nSTUDENT DIRECTORY (JSON):\n${JSON.stringify(students)}`;
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      const status = upstream.status === 429 || upstream.status === 402 ? upstream.status : 500;
      res.status(status).json({ error: text });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = (upstream.body as any).getReader();
    const push = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) { res.end(); break; }
        res.write(value);
      }
    };
    await push();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: String(err) });
    }
  }
});

const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server listening on port ${PORT}`);
});

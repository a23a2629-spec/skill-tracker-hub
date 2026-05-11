import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, RotateCcw } from "lucide-react";
import { students as ALL_STUDENTS } from "@/data/mockData";

type Msg = { role: "user" | "assistant"; content: string };

interface AIHelpAssistantProps {
  role: "student" | "lecturer";
  userName?: string;
}

const userKey = (role: string, userName?: string) =>
  `skills-tracker:${role}:${(userName || "anon").toLowerCase().replace(/\s+/g, "-")}`;
const ONBOARD_KEY = (role: string, userName?: string) => `${userKey(role, userName)}:onboarded`;
const HISTORY_KEY = (role: string, userName?: string) => `${userKey(role, userName)}:history`;
const MAX_HISTORY = 50;

const QUICK_QUESTIONS_LECTURER = [
  "How do I filter students by course?",
  "How do I generate reports?",
  "How do I view AI Insights?",
  "How do I track student progress?",
  "How do I schedule meetings?",
];

const QUICK_QUESTIONS_STUDENT = [
  "How do I view my skill analysis?",
  "How do I report an external problem?",
  "How do I book an appointment?",
  "What do skill colors mean?",
  "How do I update my profile?",
];

const TOUR_STEPS_LECTURER = [
  "**Step 1 — Header search.** Use the top search bar to find any student by name, matric number or course.",
  "**Step 2 — Student list.** The sidebar shows your students grouped by course. Click any student to view their dashboard.",
  "**Step 3 — Analytics & AI Insights.** Switch tabs to see skill gaps, attendance, and AI-suggested interventions.",
  "**Step 4 — Reports & Meetings.** Create report templates, review submissions, and schedule meetings with students.",
  "**Step 5 — Theme & Profile.** Toggle dark mode and access your profile from the top-right.",
];

const TOUR_STEPS_STUDENT = [
  "**Step 1 — Your dashboard.** See your overall progress, attendance and average score at a glance.",
  "**Step 2 — Skill analysis.** Green = Mastered, Yellow = Developing, Red = needs Intensive support.",
  "**Step 3 — Profile modules.** Browse 16 modules covering personal, academic, financial, and health info.",
  "**Step 4 — Meetings & Problems.** Book appointments with lecturers and report any external problem affecting you.",
  "**Step 5 — Theme.** Toggle dark mode anytime from the header.",
];

export default function AIHelpAssistant({ role, userName }: AIHelpAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = role === "lecturer" ? QUICK_QUESTIONS_LECTURER : QUICK_QUESTIONS_STUDENT;
  const tourSteps = role === "lecturer" ? TOUR_STEPS_LECTURER : TOUR_STEPS_STUDENT;
  const onboardKey = ONBOARD_KEY(role, userName);
  const historyKey = HISTORY_KEY(role, userName);

  // Load persisted history & onboarding when user changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(historyKey);
      setMessages(raw ? (JSON.parse(raw) as Msg[]) : []);
    } catch { setMessages([]); }
    setTourStep(null);
    setShowOnboarding(false);

    const seen = localStorage.getItem(onboardKey);
    if (!seen) {
      const t = setTimeout(() => {
        setShowOnboarding(true);
        setOpen(true);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [onboardKey, historyKey]);

  // Persist history
  useEffect(() => {
    try {
      const trimmed = messages.slice(-MAX_HISTORY);
      localStorage.setItem(historyKey, JSON.stringify(trimmed));
    } catch { /* ignore quota */ }
  }, [messages, historyKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, tourStep, showOnboarding]);

  const dismissOnboarding = () => {
    localStorage.setItem(onboardKey, "1");
    setShowOnboarding(false);
    setTourStep(null);
  };

  const startTour = () => {
    setShowOnboarding(false);
    setTourStep(0);
    localStorage.setItem(onboardKey, "1");
  };

  const advanceTour = () => {
    if (tourStep === null) return;
    if (tourStep + 1 < tourSteps.length) setTourStep(tourStep + 1);
    else setTourStep(null);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/faq-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: next,
          role,
          students: role === "lecturer"
            ? ALL_STUDENTS.map(s => ({
                id: s.id,
                name: s.name,
                matricNo: s.matricNo,
                course: s.course,
                attendance: s.attendance,
                averageScore: s.averageScore,
                aiPercentage: s.aiPercentage,
                skills: s.skills.map(a => ({
                  title: a.title,
                  status: a.status,
                  score: a.score,
                  maxScore: a.maxScore,
                  completed: a.completed,
                })),
                profile: {
                  studentId: s.profile.studentId,
                  email: s.profile.email,
                  phone: s.profile.phone,
                  program: s.profile.program,
                  faculty: s.profile.faculty,
                  semester: s.profile.semester,
                  enrollmentStatus: s.profile.enrollmentStatus,
                  registrationStatus: s.profile.registrationStatus,
                  guardian: s.profile.guardian,
                  guardianPhone: s.profile.guardianPhone,
                  financialAid: s.profile.financialAid,
                  previousSchool: s.profile.previousSchool,
                  previousQualification: s.profile.previousQualification,
                  achievements: s.profile.achievements,
                },
              }))
            : undefined,
        }),
      });

      if (!res.ok || !res.body) {
        const errText = res.status === 429
          ? "Too many requests. Please wait a moment and try again."
          : res.status === 402
          ? "AI usage limit reached. Please add credits in workspace settings."
          : "Sorry, I couldn't reach the assistant. Please try again.";
        setMessages([...next, { role: "assistant", content: errText }]);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages(m => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      setMessages([...next, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setTourStep(null);
    try { localStorage.removeItem(historyKey); } catch { /* ignore */ }
  };

  const renderMarkdown = (text: string) => {
    // light markdown: **bold** and \n
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**")) {
        return <strong key={i}>{p.slice(2, -2)}</strong>;
      }
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-full gradient-brand text-white shadow-2xl hover:scale-105 transition-transform"
          aria-label="Open AI Help Assistant"
        >
          <MessageCircle size={20} />
          <span className="hidden sm:inline text-sm font-semibold">Need help?</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-96 z-[60] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ maxHeight: "min(640px, calc(100vh - 3rem))" }}>
          {/* Header */}
          <div className="px-4 py-3 gradient-brand text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Help Assistant</p>
                <p className="text-[10px] opacity-90">AI-powered · Always here for you</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetChat} className="p-1.5 rounded-lg hover:bg-white/20 transition" aria-label="Reset chat">
                <RotateCcw size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition" aria-label="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background/50">
            {showOnboarding && (
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Welcome to In-Campus Skills Gap Tracker 👋
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {userName ? `Hi ${userName.split(" ")[0]}! ` : ""}Would you like a quick tour to learn the basics?
                </p>
                <div className="flex gap-2">
                  <button onClick={startTour} className="flex-1 px-3 py-2 rounded-lg gradient-brand text-white text-xs font-semibold hover:opacity-90 transition">
                    Start Tour
                  </button>
                  <button onClick={dismissOnboarding} className="px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition">
                    Skip
                  </button>
                </div>
              </div>
            )}

            {tourStep !== null && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1.5">
                  Tour · {tourStep + 1} of {tourSteps.length}
                </p>
                <p className="text-xs text-foreground leading-relaxed mb-3">
                  {renderMarkdown(tourSteps[tourStep])}
                </p>
                <div className="flex gap-2">
                  <button onClick={advanceTour} className="flex-1 px-3 py-1.5 rounded-lg gradient-brand text-white text-xs font-semibold hover:opacity-90 transition">
                    {tourStep + 1 < tourSteps.length ? "Next" : "Finish"}
                  </button>
                  <button onClick={() => setTourStep(null)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition">
                    End tour
                  </button>
                </div>
              </div>
            )}

            {messages.length === 0 && !showOnboarding && tourStep === null && (
              <>
                <div className="bg-secondary/60 rounded-xl p-3">
                  <p className="text-xs text-foreground leading-relaxed">
                    Hi! I'm your AI Help Assistant. Ask me anything about using the platform — I'll guide you step by step.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-1">
                    Common questions
                  </p>
                  {quickQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:bg-secondary/40 transition text-xs text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                }`}>
                  {renderMarkdown(m.content || (loading && i === messages.length - 1 ? "…" : ""))}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="border-t border-border bg-card p-3 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl bg-secondary/60 border border-transparent text-xs placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl gradient-brand text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
              aria-label="Send"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

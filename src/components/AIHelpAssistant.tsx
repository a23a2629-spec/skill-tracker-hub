import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, RotateCcw } from "lucide-react";
import { getAnswer } from "@/lib/assistantFAQ";

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
  "**Step 2 — Student list.** Click **Students** in the sidebar to see all students grouped by course. Click any student to open their full profile.",
  "**Step 3 — Analytics & AI Insights.** Click **Analytics** for charts, or **AI Insights** for smart summaries and intervention suggestions.",
  "**Step 4 — Reports & Meetings.** Use **Reports** to create assessment templates and review submissions. Use **Appointments** to schedule or manage meetings.",
  "**Step 5 — Theme & Profile.** Toggle dark mode from the sun/moon icon in the header. Your profile is in the top-right corner.",
];

const TOUR_STEPS_STUDENT = [
  "**Step 1 — Your dashboard.** Click **Dashboard** in the sidebar to see your attendance, average score, and a CRM-style overview of your record.",
  "**Step 2 — Skill analysis.** In the Dashboard, click the **Academic** tab to see your quiz results and skill breakdown. 🟢 Green = Mastered · 🟡 Yellow = Developing · 🔴 Red = Intensive.",
  "**Step 3 — Profile modules.** Click **My Profile** in the sidebar. Browse 16 modules — Personal, Academic, Financial, Health, Activities — and edit any section.",
  "**Step 4 — Meetings & Cases.** Click **Meetings** to book an appointment with your lecturer. Click **Cases** to report any external problem affecting your studies.",
  "**Step 5 — Theme.** Toggle dark mode anytime using the sun/moon icon in the top header.",
];

function simulateTyping(text: string, onChunk: (partial: string) => void, onDone: () => void) {
  let i = 0;
  const words = text.split(" ");
  const tick = () => {
    if (i >= words.length) { onDone(); return; }
    const chunk = words.slice(0, i + 1).join(" ");
    onChunk(chunk);
    i++;
    setTimeout(tick, 18 + Math.random() * 20);
  };
  setTimeout(tick, 300);
}

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

  useEffect(() => {
    try {
      localStorage.setItem(historyKey, JSON.stringify(messages.slice(-MAX_HISTORY)));
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

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const answer = getAnswer(trimmed, role);
    simulateTyping(
      answer,
      (partial) => setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: partial };
        return copy;
      }),
      () => {
        setMessages(m => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: answer };
          return copy;
        });
        setLoading(false);
      },
    );
  };

  const resetChat = () => {
    setMessages([]);
    setTourStep(null);
    try { localStorage.removeItem(historyKey); } catch { /* ignore */ }
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, li) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      );
      return <span key={li}>{rendered}{li < lines.length - 1 && <br />}</span>;
    });
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-full gradient-brand text-white shadow-2xl hover:scale-105 transition-transform"
          aria-label="Open Help Assistant"
        >
          <MessageCircle size={20} />
          <span className="hidden sm:inline text-sm font-semibold">Need help?</span>
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-96 z-[60] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ maxHeight: "min(640px, calc(100vh - 3rem))" }}
        >
          {/* Header */}
          <div className="px-4 py-3 gradient-brand text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Help Assistant</p>
                <p className="text-[10px] opacity-90">Built-in guide · Always available</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetChat} className="p-1.5 rounded-lg hover:bg-white/20 transition" title="Reset chat">
                <RotateCcw size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition" aria-label="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background/50">
            {/* Onboarding */}
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

            {/* Tour step */}
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
                    {tourStep + 1 < tourSteps.length ? "Next →" : "Finish"}
                  </button>
                  <button onClick={() => setTourStep(null)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition">
                    End tour
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {messages.length === 0 && !showOnboarding && tourStep === null && (
              <>
                <div className="bg-secondary/60 rounded-xl p-3">
                  <p className="text-xs text-foreground leading-relaxed">
                    Hi{userName ? ` ${userName.split(" ")[0]}` : ""}! 👋 I can walk you through how the platform works. Click a question below or type your own.
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
                  <button
                    onClick={startTour}
                    className="w-full text-left px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition text-xs text-primary font-semibold"
                  >
                    🗺️ Take a guided tour of the platform
                  </button>
                </div>
              </>
            )}

            {/* Messages */}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                }`}>
                  {m.content
                    ? renderMarkdown(m.content)
                    : <span className="opacity-50">…</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input); }}
            className="border-t border-border bg-card p-3 flex items-center gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about the platform…"
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

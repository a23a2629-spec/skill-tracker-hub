import { useState, useRef, useEffect } from "react";
import { students } from "@/data/mockData";
import { getRegisteredStudents, getRegisteredLecturers, getStudentPassword } from "@/lib/userRegistry";
import { User, BookOpen, Lock, AlertCircle, Eye, EyeOff, Bot, ChevronRight, Send, X, RotateCcw, Sparkles } from "lucide-react";

export type AuthSession =
  | { role: "student"; studentId: string; name: string }
  | { role: "lecturer"; name: string };

interface Props {
  onLogin: (session: AuthSession) => void;
  onShowSignup: () => void;
}

const DEMO_LECTURERS = [
  { username: "zainab",   password: "lecturer123", name: "Dr. Zainab binti Mohd Noor" },
  { username: "rashidah", password: "lecturer123", name: "Pn. Rashidah binti Rahim" },
  { username: "hairul",   password: "lecturer123", name: "Prof. Madya Dr. Hairul" },
  { username: "faridz",   password: "lecturer123", name: "En. Faridz bin Azman" },
  { username: "asma",     password: "lecturer123", name: "Dr. Asma binti Sulaiman" },
];

const STUDENT_DEFAULT_PASSWORD = "student123";

// ── Inline mini AI assistant for the login page ──────────────────────────────
type Msg = { role: "user" | "assistant"; content: string };

function LoginAIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/faq-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, role: "visitor" }),
      });
      if (!res.ok || !res.body) {
        setMessages([...next, { role: "assistant", content: "Sorry, I couldn't reach the assistant right now." }]);
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
    } catch {
      setMessages(prev => [...prev.slice(0, -0), { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQs = [
    "How do I log in?",
    "What are the demo credentials?",
    "What is Skills Gap Tracker?",
    "How do I create an account?",
  ];

  const renderMarkdown = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    );

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 pl-2 pr-3 py-2 rounded-full bg-[#1a3a6b] text-white shadow-2xl hover:scale-[1.02] transition-transform border border-[#2a4a8b]"
        >
          <span className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center relative">
            <Bot size={18} className="text-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1a3a6b]" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-xs font-semibold">Need help?</span>
            <span className="block text-[10px] opacity-70">AI Assistant</span>
          </span>
          <ChevronRight size={14} className="opacity-70" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ maxHeight: "480px" }}>
          <div className="px-4 py-3 bg-[#1a3a6b] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles size={15} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Help Assistant</p>
                <p className="text-[10px] opacity-80">AI-powered · Always here</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMessages([])} className="p-1.5 rounded-lg hover:bg-white/20 transition" title="Reset">
                <RotateCcw size={13} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition">
                <X size={15} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-gray-50">
            {messages.length === 0 && (
              <>
                <div className="bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
                  Hi! Ask me anything about logging in or using the platform.
                </div>
                <div className="space-y-1.5">
                  {quickQs.map(q => (
                    <button key={q} onClick={() => send(q)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#2563EB]/40 text-xs text-gray-700 transition">
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-[#2563EB] text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                }`}>
                  {renderMarkdown(m.content || (loading && i === messages.length - 1 ? "…" : ""))}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={e => { e.preventDefault(); send(input); }}
            className="border-t border-gray-200 bg-white p-2.5 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask a question…" disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl bg-gray-100 text-xs placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition" />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#1d4ed8] transition">
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// ── Main Login Component ──────────────────────────────────────────────────────
export default function Login({ onLogin, onShowSignup }: Props) {
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "student") {
      const mockStudent = students.find(
        s => s.matricNo.toLowerCase() === identifier.trim().toLowerCase()
          || s.profile.icNumber === identifier.trim(),
      );
      if (mockStudent) {
        if (password !== STUDENT_DEFAULT_PASSWORD) { setError("Incorrect password."); return; }
        onLogin({ role: "student", studentId: mockStudent.id, name: mockStudent.name });
        return;
      }
      const regStudents = getRegisteredStudents();
      const regStudent = regStudents.find(
        s => s.matricNo.toLowerCase() === identifier.trim().toLowerCase()
          || s.profile.icNumber === identifier.trim(),
      );
      if (!regStudent) { setError("Matric Number or IC not found. Please check and try again."); return; }
      const storedPass = getStudentPassword(regStudent.id);
      if (password !== storedPass) { setError("Incorrect password."); return; }
      onLogin({ role: "student", studentId: regStudent.id, name: regStudent.name });
    } else {
      const demoLect = DEMO_LECTURERS.find(l => l.username.toLowerCase() === identifier.trim().toLowerCase());
      if (demoLect) {
        if (demoLect.password !== password) { setError("Incorrect password."); return; }
        onLogin({ role: "lecturer", name: demoLect.name });
        return;
      }
      const regLecturers = getRegisteredLecturers();
      const regLect = regLecturers.find(l => l.username === identifier.trim().toLowerCase());
      if (!regLect) { setError("Lecturer username not found."); return; }
      if (regLect.password !== password) { setError("Incorrect password."); return; }
      onLogin({ role: "lecturer", name: regLect.name });
    }
  };

  const fillDemo = () => {
    if (role === "student") {
      setIdentifier(students[0].matricNo);
      setPassword(STUDENT_DEFAULT_PASSWORD);
    } else {
      setIdentifier("zainab");
      setPassword("lecturer123");
    }
    setError("");
  };

  const features = [
    {
      icon: "🔍",
      color: "bg-[#2563EB]",
      title: "AI-Powered Insights",
      desc: "Smart analysis to detect at-risk students early.",
    },
    {
      icon: "🎯",
      color: "bg-emerald-500",
      title: "Actionable Interventions",
      desc: "Targeted support for students based on real data.",
    },
    {
      icon: "📈",
      color: "bg-purple-500",
      title: "Better Student Success",
      desc: "Improve learning outcomes and reduce dropout risks.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-[700px]">

        {/* ── LEFT PANEL ── */}
        <aside className="hidden lg:flex flex-col w-[42%] bg-[#1a3a6b] text-white p-10 xl:p-12 relative overflow-hidden">
          {/* Background circles */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute bottom-20 -right-16 w-64 h-64 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <img src="/logo.png" alt="In-Campus" className="h-12 object-contain" />
              <div>
                <p className="text-lg font-extrabold leading-tight">In-Campus</p>
                <p className="text-xs text-blue-200 font-medium">— Skills Gap Tracker</p>
              </div>
            </div>

            {/* Headline */}
            <div className="mb-6">
              <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight">
                Early Insight.<br />Better Outcomes.
              </h2>
              <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-xs">
                Identify skill gaps early, provide targeted interventions, and empower students to reach their full potential.
              </p>
            </div>

            {/* Hero image */}
            <div className="flex justify-center my-4">
              <img
                src="/login-hero.png"
                alt="Student analytics"
                className="w-full max-w-[280px] object-contain drop-shadow-xl"
              />
            </div>

            {/* Features */}
            <div className="space-y-4 mt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${f.color} flex items-center justify-center text-base shrink-0 shadow-lg`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{f.title}</p>
                    <p className="text-xs text-blue-200 mt-0.5 leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 flex items-center gap-3 border-t border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Lock size={15} className="text-blue-200" />
              </div>
              <div>
                <p className="text-xs font-semibold">Secure & Private</p>
                <p className="text-[11px] text-blue-200">All sessions are stored locally on your device.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="flex-1 flex items-center justify-center p-8 xl:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <img src="/logo.png" alt="In-Campus" className="h-12 object-contain" />
              <div>
                <p className="font-extrabold text-[#1a3a6b]">In-Campus</p>
                <p className="text-xs text-gray-400">Skills Gap Tracker</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332] mb-1">Welcome back!</h2>
            <p className="text-sm text-gray-500 mb-7">Choose your role and enter your credentials to continue.</p>

            {/* Role tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6">
              <button
                type="button"
                onClick={() => { setRole("student"); setError(""); setIdentifier(""); setPassword(""); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  role === "student"
                    ? "bg-[#2563EB] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                data-testid="tab-role-student"
              >
                <User size={15} /> Student
              </button>
              <button
                type="button"
                onClick={() => { setRole("lecturer"); setError(""); setIdentifier(""); setPassword(""); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  role === "lecturer"
                    ? "bg-[#2563EB] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                data-testid="tab-role-lecturer"
              >
                <BookOpen size={15} /> Lecturer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier */}
              <div>
                <label className="block text-sm font-semibold text-[#1a2332] mb-1.5">
                  {role === "student" ? "Matric Number or IC" : "Lecturer Username"}
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={role === "student" ? "e.g. 01DPB22F1001" : "e.g. zainab"}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] focus:bg-white transition"
                    data-testid="input-identifier"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#1a2332] mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] focus:bg-white transition"
                    data-testid="input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button type="button" className="text-xs font-semibold text-[#2563EB] hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 mt-1"
                data-testid="button-submit-login"
              >
                <Lock size={15} /> Sign in as {role === "student" ? "Student" : "Lecturer"}
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-[#2563EB]/40 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                data-testid="button-fill-demo"
              >
                <span className="text-base">✨</span> Use demo credentials
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-5 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-[11px] text-[#2563EB] font-bold uppercase tracking-wider mb-2">Demo Credentials</p>
              {role === "student" ? (
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>· <span className="font-mono font-semibold text-gray-800">01DPB22F1001</span> – <span className="font-mono font-semibold text-[#2563EB]">student123</span> (Ahmad Farhan)</li>
                  <li>· <span className="font-mono font-semibold text-gray-800">01DPA22F1010</span> – <span className="font-mono font-semibold text-[#2563EB]">student123</span> (Lim Chee Keong)</li>
                  <li className="text-[11px] italic text-gray-400 mt-1.5">Any matric number from the system works with password <span className="font-mono text-[#2563EB]">student123</span>.</li>
                </ul>
              ) : (
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>· <span className="font-mono font-semibold text-gray-800">zainab</span> – <span className="font-mono font-semibold text-[#2563EB]">lecturer123</span> (Dr. Zainab)</li>
                  <li>· <span className="font-mono font-semibold text-gray-800">hairul</span> – <span className="font-mono font-semibold text-[#2563EB]">lecturer123</span> (Prof. Hairul)</li>
                  <li className="text-[11px] italic text-gray-400 mt-1.5">Other lecturers: rashidah, faridz, asma — all use password <span className="font-mono text-[#2563EB]">lecturer123</span>.</li>
                </ul>
              )}
            </div>

            <p className="text-center text-sm text-gray-500 mt-5">
              New user?{" "}
              <button
                onClick={onShowSignup}
                className="text-[#2563EB] font-semibold hover:underline"
                data-testid="button-go-signup"
              >
                Create an account
              </button>
            </p>
          </div>
        </main>
      </div>

      {/* Functional AI Assistant */}
      <LoginAIAssistant />
    </div>
  );
}

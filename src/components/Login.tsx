import { useState, useRef, useEffect } from "react";
import { students } from "@/data/mockData";
import { getRegisteredStudents, getRegisteredLecturers, getStudentPassword } from "@/lib/userRegistry";
import { User, BookOpen, Lock, AlertCircle, Eye, EyeOff, Bot, ChevronRight, Send, X, RotateCcw, Sparkles, TrendingUp, Brain, Target } from "lucide-react";
import { getAnswer } from "@/lib/assistantFAQ";

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

type Msg = { role: "user" | "assistant"; content: string };

function simulateTyping(text: string, onChunk: (p: string) => void, onDone: () => void) {
  let i = 0;
  const words = text.split(" ");
  const tick = () => {
    if (i >= words.length) { onDone(); return; }
    onChunk(words.slice(0, i + 1).join(" "));
    i++;
    setTimeout(tick, 18 + Math.random() * 20);
  };
  setTimeout(tick, 280);
}

function LoginAIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const answer = getAnswer(trimmed, "visitor");
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

  const quickQs = [
    "How do I log in?",
    "What are the demo credentials?",
    "What is Skills Gap Tracker?",
    "How do I create an account?",
  ];

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
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pl-2 pr-3.5 py-2.5 rounded-full text-white shadow-2xl hover:scale-105 transition-all duration-200 group"
          style={{
            background: "linear-gradient(135deg, #1e3a8a, #2563EB)",
            border: "1px solid rgba(99,155,255,0.3)",
            boxShadow: "0 0 0 1px rgba(37,99,235,0.2), 0 8px 32px rgba(37,99,235,0.35)",
          }}
        >
          <span className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Bot size={16} className="text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1e3a8a]" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-xs font-semibold">Need help?</span>
            <span className="block text-[10px] opacity-70">AI Assistant</span>
          </span>
          <ChevronRight size={13} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            maxHeight: "480px",
            background: "rgba(15,23,42,0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99,155,255,0.2)",
            boxShadow: "0 0 0 1px rgba(37,99,235,0.1), 0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #1e3a8a, #2563EB)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-white">Help Assistant</p>
                <p className="text-[10px] opacity-75 text-blue-100">AI-powered · Always here</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMessages([])} className="p-1.5 rounded-lg hover:bg-white/20 transition text-white" title="Reset">
                <RotateCcw size={12} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition text-white">
                <X size={14} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5" style={{ background: "rgba(15,23,42,0.6)" }}>
            {messages.length === 0 && (
              <>
                <div className="rounded-xl p-3 text-xs leading-relaxed text-blue-100" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Hi! Ask me anything about logging in or using the platform.
                </div>
                <div className="space-y-1.5">
                  {quickQs.map(q => (
                    <button key={q} onClick={() => send(q)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-blue-100 hover:text-white transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(99,155,255,0.4)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
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
                    ? "text-white rounded-br-sm"
                    : "text-blue-100 rounded-bl-sm"
                }`}
                style={m.role === "user"
                  ? { background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }
                  : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
                }>
                  {renderMarkdown(m.content || (loading && i === messages.length - 1 ? "…" : ""))}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={e => { e.preventDefault(); send(input); }}
            className="p-2.5 flex gap-2" style={{ background: "rgba(15,23,42,0.8)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask a question…" disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl text-xs text-blue-100 placeholder:text-blue-300/40 focus:outline-none transition"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-xl text-white flex items-center justify-center disabled:opacity-30 transition"
              style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// ── Animated background particles ────────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  dur: 5 + Math.random() * 7,
  delay: Math.random() * 6,
}));

// ── Stat cards shown behind login card ────────────────────────────────────────
const PREVIEW_STATS = [
  { icon: <TrendingUp size={14} />, label: "Average Score", value: "78%", color: "#06B6D4", pos: "top-[12%] left-[3%]" },
  { icon: <Brain size={14} />, label: "AI Insights", value: "Active", color: "#8B5CF6", pos: "top-[18%] right-[3%]" },
  { icon: <Target size={14} />, label: "At-Risk Students", value: "3", color: "#EF4444", pos: "bottom-[20%] left-[3%]" },
];

// ── Main Login ────────────────────────────────────────────────────────────────
export default function Login({ onLogin, onShowSignup }: Props) {
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

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

  return (
    <>
      <style>{`
        @keyframes float-bg {
          0%,100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-15px) translateX(8px); }
          66% { transform: translateY(8px) translateX(-5px); }
        }
        @keyframes orbit-orb {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @keyframes orbit-orb2 {
          from { transform: rotate(180deg) translateX(110px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(110px) rotate(-540deg); }
        }
        @keyframes btn-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .login-bg {
          background: radial-gradient(ellipse at 25% 25%, #0f2957 0%, #0F172A 50%, #060d1f 100%);
        }
        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 0 0 1px rgba(37,99,235,0.08), 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .glass-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          color: white;
          transition: all 0.2s;
        }
        .glass-input::placeholder { color: rgba(148,163,184,0.5); }
        .glass-input:focus {
          outline: none;
          background: rgba(255,255,255,0.08);
          border-color: rgba(37,99,235,0.6);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 40%, #06B6D4 100%);
          background-size: 200% auto;
          transition: background-position 0.4s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 24px rgba(37,99,235,0.4);
        }
        .btn-gradient:hover {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(37,99,235,0.5);
        }
        .btn-gradient:active { transform: translateY(0); }
        .role-tab-active {
          background: linear-gradient(135deg, #2563EB, #1d4ed8);
          box-shadow: 0 2px 16px rgba(37,99,235,0.4);
          color: white;
        }
        .role-tab-inactive {
          background: transparent;
          color: rgba(148,163,184,0.7);
        }
        .role-tab-inactive:hover { color: rgba(148,163,184,1); background: rgba(255,255,255,0.04); }
        .stat-float {
          background: rgba(15,23,42,0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: float-bg 6s ease-in-out infinite;
        }
        .demo-badge {
          background: rgba(37,99,235,0.1);
          border: 1px solid rgba(37,99,235,0.25);
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center login-bg relative overflow-hidden">

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)" }} />

        {/* Floating particles */}
        {BG_PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full bg-blue-400 pointer-events-none"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              opacity: 0.12 + Math.random() * 0.18,
              animation: `float-bg ${p.dur}s ${p.delay}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Floating stat preview cards */}
        {PREVIEW_STATS.map((s, i) => (
          <div key={i}
            className={`absolute stat-float rounded-xl px-3 py-2 hidden lg:flex items-center gap-2.5 ${s.pos}`}
            style={{ animationDelay: `${i * 1.5}s` }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 leading-none mb-0.5">{s.label}</p>
              <p className="text-sm font-bold text-white leading-none">{s.value}</p>
            </div>
          </div>
        ))}

        {/* ── LOGIN CARD ── */}
        <div
          className={`relative z-10 w-full max-w-md mx-4 glass-card rounded-3xl p-8 sm:p-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-3" style={{ filter: "drop-shadow(0 0 16px rgba(37,99,235,0.5))" }}>
              <img src="/logo.png" alt="In-Campus" className="h-14 object-contain" />
            </div>
            <h1 className="text-lg font-extrabold text-white leading-tight">In-Campus</h1>
            <p className="text-xs font-medium tracking-widest uppercase mt-0.5"
              style={{ color: "rgba(6,182,212,0.8)" }}>
              Skills Gap Tracker
            </p>
            <div className="mt-4 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.4), rgba(6,182,212,0.4), transparent)" }} />
          </div>

          {/* Welcome */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex gap-1.5 p-1.5 rounded-2xl mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={() => { setRole("student"); setError(""); setIdentifier(""); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                role === "student" ? "role-tab-active" : "role-tab-inactive"
              }`}
              data-testid="tab-role-student"
            >
              <User size={14} /> Student
            </button>
            <button
              type="button"
              onClick={() => { setRole("lecturer"); setError(""); setIdentifier(""); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                role === "lecturer" ? "role-tab-active" : "role-tab-inactive"
              }`}
              data-testid="tab-role-lecturer"
            >
              <BookOpen size={14} /> Lecturer
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(148,163,184,0.9)" }}>
                {role === "student" ? "Matric Number or IC" : "Lecturer Username"}
              </label>
              <div className="relative">
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(99,155,255,0.6)" }} />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder={role === "student" ? "e.g. 01DPB22F1001" : "e.g. zainab"}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-sm"
                  data-testid="input-identifier"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(148,163,184,0.9)" }}>
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(99,155,255,0.6)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl glass-input text-sm"
                  data-testid="input-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(99,155,255,0.5)" }}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button type="button" className="text-xs font-semibold transition-colors" style={{ color: "rgba(99,155,255,0.7)" }}>
                  Forgot password?
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-gradient text-white font-bold text-sm flex items-center justify-center gap-2"
              data-testid="button-submit-login"
            >
              <Lock size={14} />
              Sign in as {role === "student" ? "Student" : "Lecturer"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(148,163,184,0.9)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.4)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "rgba(148,163,184,0.9)"; }}
              data-testid="button-fill-demo"
            >
              <span>✨</span> Use demo credentials
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-4 rounded-2xl demo-badge">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(99,155,255,0.8)" }}>
              Demo Credentials
            </p>
            {role === "student" ? (
              <ul className="space-y-1" style={{ color: "rgba(148,163,184,0.8)" }}>
                <li className="text-xs">· <span className="font-mono font-semibold text-white">01DPB22F1001</span> – <span className="font-mono font-semibold" style={{ color: "#60a5fa" }}>student123</span> (Ahmad Farhan)</li>
                <li className="text-xs">· <span className="font-mono font-semibold text-white">01DPA22F1010</span> – <span className="font-mono font-semibold" style={{ color: "#60a5fa" }}>student123</span> (Lim Chee Keong)</li>
                <li className="text-[11px] italic mt-1.5" style={{ color: "rgba(148,163,184,0.5)" }}>Any matric no. works with password <span className="font-mono" style={{ color: "#60a5fa" }}>student123</span>.</li>
              </ul>
            ) : (
              <ul className="space-y-1" style={{ color: "rgba(148,163,184,0.8)" }}>
                <li className="text-xs">· <span className="font-mono font-semibold text-white">zainab</span> – <span className="font-mono font-semibold" style={{ color: "#60a5fa" }}>lecturer123</span> (Dr. Zainab)</li>
                <li className="text-xs">· <span className="font-mono font-semibold text-white">hairul</span> – <span className="font-mono font-semibold" style={{ color: "#60a5fa" }}>lecturer123</span> (Prof. Hairul)</li>
                <li className="text-[11px] italic mt-1.5" style={{ color: "rgba(148,163,184,0.5)" }}>Others: rashidah, faridz, asma — all use <span className="font-mono" style={{ color: "#60a5fa" }}>lecturer123</span>.</li>
              </ul>
            )}
          </div>

          {/* Signup link */}
          <p className="text-center text-sm mt-5" style={{ color: "rgba(148,163,184,0.6)" }}>
            New user?{" "}
            <button
              onClick={onShowSignup}
              className="font-semibold transition-colors"
              style={{ color: "rgba(99,155,255,0.9)" }}
              data-testid="button-go-signup"
            >
              Create an account
            </button>
          </p>

          {/* Bottom tagline */}
          <div className="mt-6 pt-5 flex items-center justify-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(148,163,184,0.4)" }}>
              Early Detection · Smarter Intervention
            </p>
          </div>
        </div>
      </div>

      <LoginAIAssistant />
    </>
  );
}

import { useState } from "react";
import { students } from "@/data/mockData";
import { getRegisteredStudents, getRegisteredLecturers, getStudentPassword } from "@/lib/userRegistry";
import { User, BookOpen, Lock, AlertCircle, Eye, EyeOff, Sparkles, Target, TrendingUp, ShieldCheck, Bot, ChevronRight } from "lucide-react";
import heroImage from "@/assets/login-hero.png";

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

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* LEFT — Brand / Hero */}
      <aside className="hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-primary-soft/60 dark:bg-secondary/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="In-Campus Skills Gap Tracker" className="h-14 object-contain" />
            <div className="leading-tight">
              <h1 className="text-2xl font-extrabold text-foreground">In-Campus</h1>
              <p className="text-xs text-muted-foreground font-medium">— Skills Gap Tracker</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            Early Insight.<br />Better Outcomes.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-md leading-relaxed">
            Identify skill gaps early, provide targeted interventions, and empower students to reach their full potential.
          </p>

          <div className="mt-8 flex justify-center">
            <img
              src={heroImage}
              alt="Student analytics illustration"
              width={1024}
              height={1024}
              className="w-full max-w-sm object-contain drop-shadow-xl"
            />
          </div>

          <div className="mt-8 space-y-4 max-w-md">
            {[
              { icon: Sparkles, color: "bg-primary text-primary-foreground", title: "AI-Powered Insights", desc: "Smart analysis to detect at-risk students early." },
              { icon: Target, color: "bg-status-mastered text-status-mastered-foreground", title: "Actionable Interventions", desc: "Targeted support for students based on real data." },
              { icon: TrendingUp, color: "bg-[hsl(var(--brand-accent))] text-white", title: "Better Student Success", desc: "Improve learning outcomes and reduce dropout risks." },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <f.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-8 flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border backdrop-blur-sm max-w-md">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
            <ShieldCheck size={16} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Secure & Private</p>
            <p className="text-[11px] text-muted-foreground">All sessions are stored locally on your device.</p>
          </div>
        </div>
      </aside>

      {/* RIGHT — Form */}
      <main className="flex items-center justify-center p-4 sm:p-8 lg:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-6">
            <img src="/logo.png" alt="In-Campus Skills Gap Tracker" className="h-16 object-contain" />
          </div>

          <div className="glass-card p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="font-extrabold text-2xl sm:text-3xl text-foreground">Welcome back!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose your role and enter your credentials to continue.
              </p>
            </div>

            {/* Role tabs */}
            <div className="flex bg-secondary rounded-xl p-1">
              <button
                type="button"
                onClick={() => { setRole("student"); setError(""); setIdentifier(""); setPassword(""); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === "student" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-role-student"
              >
                <User size={15} /> Student
              </button>
              <button
                type="button"
                onClick={() => { setRole("lecturer"); setError(""); setIdentifier(""); setPassword(""); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === "lecturer" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-role-lecturer"
              >
                <BookOpen size={15} /> Lecturer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">
                  {role === "student" ? "Matric Number or IC" : "Lecturer Username"}
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === "student" ? "e.g. 01DPB22F1001" : "e.g. zainab"}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary focus:bg-background transition-colors"
                    data-testid="input-identifier"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary focus:bg-background transition-colors"
                    data-testid="input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button type="button" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-status-intensive/10 border border-status-intensive/20 text-xs text-status-intensive">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
                data-testid="button-submit-login"
              >
                <Lock size={15} /> Sign in as {role === "student" ? "Student" : "Lecturer"}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                data-testid="button-fill-demo"
              >
                <Sparkles size={14} /> Use demo credentials
              </button>
            </form>

            {/* Demo hint */}
            <div className="p-3.5 rounded-xl bg-primary-soft/50 border border-primary/15">
              <p className="text-[11px] text-primary font-bold uppercase tracking-wider mb-2">Demo Credentials</p>
              {role === "student" ? (
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>· <span className="font-mono text-foreground font-semibold">01DPB22F1001</span> – <span className="font-mono text-foreground font-semibold">student123</span> (Ahmad Farhan)</li>
                  <li>· <span className="font-mono text-foreground font-semibold">01DPA22F1010</span> – <span className="font-mono text-foreground font-semibold">student123</span> (Lim Chee Keong)</li>
                  <li className="text-[11px] italic mt-1.5">Any matric number from the system works with password <span className="font-mono">student123</span>.</li>
                </ul>
              ) : (
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>· <span className="font-mono text-foreground font-semibold">zainab</span> – <span className="font-mono text-foreground font-semibold">lecturer123</span> (Dr. Zainab)</li>
                  <li>· <span className="font-mono text-foreground font-semibold">hairul</span> – <span className="font-mono text-foreground font-semibold">lecturer123</span> (Prof. Hairul)</li>
                  <li className="text-[11px] italic mt-1.5">Other lecturers: rashidah, faridz, asma — all use password <span className="font-mono">lecturer123</span>.</li>
                </ul>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              New user?{" "}
              <button
                onClick={onShowSignup}
                className="text-primary font-semibold hover:underline"
                data-testid="button-go-signup"
              >
                Create an account
              </button>
            </p>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-4 lg:hidden">
            Secure access · All sessions are stored locally on this device
          </p>
        </div>
      </main>
    </div>
  );
}

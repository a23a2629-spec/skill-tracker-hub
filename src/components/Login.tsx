import { useState } from "react";
import { students } from "@/data/mockData";
import { GraduationCap, User, BookOpen, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export type AuthSession =
  | { role: "student"; studentId: string; name: string }
  | { role: "lecturer"; name: string };

interface Props {
  onLogin: (session: AuthSession) => void;
}

const LECTURERS = [
  { username: "zainab",   password: "lecturer123", name: "Dr. Zainab binti Mohd Noor" },
  { username: "rashidah", password: "lecturer123", name: "Pn. Rashidah binti Rahim" },
  { username: "hairul",   password: "lecturer123", name: "Prof. Madya Dr. Hairul" },
  { username: "faridz",   password: "lecturer123", name: "En. Faridz bin Azman" },
  { username: "asma",     password: "lecturer123", name: "Dr. Asma binti Sulaiman" },
];

const STUDENT_DEFAULT_PASSWORD = "student123";

export default function Login({ onLogin }: Props) {
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "student") {
      const student = students.find(
        s => s.matricNo.toLowerCase() === identifier.trim().toLowerCase()
          || s.profile.icNumber === identifier.trim(),
      );
      if (!student) { setError("Matric Number or IC not found. Please check and try again."); return; }
      if (password !== STUDENT_DEFAULT_PASSWORD) { setError("Incorrect password. Use 'student123' for the demo account."); return; }
      onLogin({ role: "student", studentId: student.id, name: student.name });
    } else {
      const lect = LECTURERS.find(l => l.username.toLowerCase() === identifier.trim().toLowerCase());
      if (!lect) { setError("Lecturer username not found."); return; }
      if (lect.password !== password) { setError("Incorrect password. Use 'lecturer123' for the demo account."); return; }
      onLogin({ role: "lecturer", name: lect.name });
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/20">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">In-Campus Skills Gap Tracker</h1>
            <p className="text-xs text-muted-foreground">Early Detection · Smarter Intervention</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div>
            <h2 className="font-bold text-xl">Sign in</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your role and enter your credentials to continue.
            </p>
          </div>

          {/* Role tabs */}
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              type="button"
              onClick={() => { setRole("student"); setError(""); setIdentifier(""); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                role === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-role-student"
            >
              <User size={14} /> Student
            </button>
            <button
              type="button"
              onClick={() => { setRole("lecturer"); setError(""); setIdentifier(""); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                role === "lecturer" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-role-lecturer"
            >
              <BookOpen size={14} /> Lecturer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {role === "student" ? "Matric Number or IC" : "Lecturer Username"}
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === "student" ? "e.g. 01DPB22F1001" : "e.g. zainab"}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary"
                  data-testid="input-identifier"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary"
                  data-testid="input-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-status-intensive/10 border border-status-intensive/20 text-xs text-status-intensive">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              data-testid="button-submit-login"
            >
              Sign in as {role === "student" ? "Student" : "Lecturer"}
            </button>

            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2 rounded-lg bg-secondary text-secondary-foreground text-xs hover:bg-accent transition-colors"
              data-testid="button-fill-demo"
            >
              Use demo credentials
            </button>
          </form>

          {/* Demo hint */}
          <div className="p-3 rounded-lg bg-secondary/40 border border-border">
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mb-1.5">Demo Credentials</p>
            {role === "student" ? (
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>· <span className="font-mono text-foreground">01DPB22F1001</span> – <span className="font-mono text-foreground">student123</span> (Ahmad Farhan)</li>
                <li>· <span className="font-mono text-foreground">01DPA22F1010</span> – <span className="font-mono text-foreground">student123</span> (Lim Chee Keong)</li>
                <li className="text-[10px] italic mt-1">Any matric number from the system works with password <span className="font-mono">student123</span>.</li>
              </ul>
            ) : (
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>· <span className="font-mono text-foreground">zainab</span> – <span className="font-mono text-foreground">lecturer123</span> (Dr. Zainab)</li>
                <li>· <span className="font-mono text-foreground">hairul</span> – <span className="font-mono text-foreground">lecturer123</span> (Prof. Hairul)</li>
                <li className="text-[10px] italic mt-1">Other lecturers: rashidah, faridz, asma — all use password <span className="font-mono">lecturer123</span>.</li>
              </ul>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          Secure access · All sessions are stored locally on this device
        </p>
      </div>
    </div>
  );
}

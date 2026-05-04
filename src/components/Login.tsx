import { useState } from "react";
import { students } from "@/data/mockData";
import { getRegisteredStudents, getRegisteredLecturers, getStudentPassword } from "@/lib/userRegistry";
import { User, BookOpen, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

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
      // Check mock students first
      const mockStudent = students.find(
        s => s.matricNo.toLowerCase() === identifier.trim().toLowerCase()
          || s.profile.icNumber === identifier.trim(),
      );
      if (mockStudent) {
        if (password !== STUDENT_DEFAULT_PASSWORD) {
          setError("Incorrect password."); return;
        }
        onLogin({ role: "student", studentId: mockStudent.id, name: mockStudent.name });
        return;
      }

      // Check registered students
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
      // Check demo lecturers
      const demoLect = DEMO_LECTURERS.find(l => l.username.toLowerCase() === identifier.trim().toLowerCase());
      if (demoLect) {
        if (demoLect.password !== password) { setError("Incorrect password."); return; }
        onLogin({ role: "lecturer", name: demoLect.name });
        return;
      }

      // Check registered lecturers
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="In-Campus Skills Gap Tracker" className="h-20 object-contain" />
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

          <p className="text-center text-xs text-muted-foreground">
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

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          Secure access · All sessions are stored locally on this device
        </p>
      </div>
    </div>
  );
}

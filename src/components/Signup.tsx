import { useState } from "react";
import { courses } from "@/data/mockData";
import { User, BookOpen, Lock, AlertCircle, Eye, EyeOff, ArrowLeft, CheckCircle2, Mail, Phone, CreditCard, Building2, IdCard } from "lucide-react";
import { registerStudent, registerLecturer } from "@/lib/userRegistry";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export default function Signup({ onBack, onSuccess }: Props) {
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: "", matricNo: "", icNumber: "", email: "",
    phone: "", password: "", confirmPassword: "",
    courseCode: courses[0].code, gender: "Male" as "Male" | "Female", dateOfBirth: "",
  });

  const [lecturerForm, setLecturerForm] = useState({
    name: "", username: "", staffId: "", email: "",
    faculty: "Faculty of Business & Commerce",
    password: "", confirmPassword: "",
  });

  const updateStudent = (field: string, value: string) =>
    setStudentForm(f => ({ ...f, [field]: value }));

  const updateLecturer = (field: string, value: string) =>
    setLecturerForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "student") {
      if (!studentForm.name || !studentForm.matricNo || !studentForm.icNumber || !studentForm.email || !studentForm.phone || !studentForm.password || !studentForm.dateOfBirth) {
        setError("Please fill in all required fields."); return;
      }
      if (studentForm.password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (studentForm.password !== studentForm.confirmPassword) { setError("Passwords do not match."); return; }
      const result = registerStudent({
        name: studentForm.name, matricNo: studentForm.matricNo, icNumber: studentForm.icNumber,
        email: studentForm.email, phone: studentForm.phone, password: studentForm.password,
        courseCode: studentForm.courseCode, gender: studentForm.gender, dateOfBirth: studentForm.dateOfBirth,
      });
      if (!result.success) { setError(result.error ?? "Registration failed."); return; }
    } else {
      if (!lecturerForm.name || !lecturerForm.username || !lecturerForm.staffId || !lecturerForm.email || !lecturerForm.password) {
        setError("Please fill in all required fields."); return;
      }
      if (lecturerForm.password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (lecturerForm.password !== lecturerForm.confirmPassword) { setError("Passwords do not match."); return; }
      const result = registerLecturer({
        name: lecturerForm.name, username: lecturerForm.username, staffId: lecturerForm.staffId,
        email: lecturerForm.email, faculty: lecturerForm.faculty, password: lecturerForm.password,
      });
      if (!result.success) { setError(result.error ?? "Registration failed."); return; }
    }

    setSuccess(true);
    setTimeout(() => onSuccess(), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground">Account Created!</h2>
          <p className="text-sm text-muted-foreground">
            Your {role} account has been registered successfully. Redirecting to sign in…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="In-Campus Skills Gap Tracker" className="h-16 object-contain" />
        </div>

        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="font-bold text-xl">Create Account</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Register as a student or lecturer to get started.</p>
            </div>
          </div>

          {/* Role tabs */}
          <div className="flex bg-secondary rounded-lg p-1">
            <button type="button" onClick={() => { setRole("student"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${role === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <User size={14} /> Student
            </button>
            <button type="button" onClick={() => { setRole("lecturer"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${role === "lecturer" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <BookOpen size={14} /> Lecturer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {role === "student" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField icon={User} label="Full Name *" placeholder="e.g. Ahmad Farhan bin Ismail"
                    value={studentForm.name} onChange={v => updateStudent("name", v)} />
                  <FormField icon={CreditCard} label="Matric Number *" placeholder="e.g. 01DPB22F1001"
                    value={studentForm.matricNo} onChange={v => updateStudent("matricNo", v)} />
                  <FormField icon={IdCard} label="IC Number *" placeholder="e.g. 040815-14-5231"
                    value={studentForm.icNumber} onChange={v => updateStudent("icNumber", v)} />
                  <FormField icon={Mail} label="Email *" type="email" placeholder="yourname@student.edu.my"
                    value={studentForm.email} onChange={v => updateStudent("email", v)} />
                  <FormField icon={Phone} label="Phone *" placeholder="e.g. 011-2345 6789"
                    value={studentForm.phone} onChange={v => updateStudent("phone", v)} />
                  <FormField icon={User} label="Date of Birth *" type="date"
                    value={studentForm.dateOfBirth} onChange={v => updateStudent("dateOfBirth", v)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Gender *</label>
                    <select value={studentForm.gender} onChange={e => updateStudent("gender", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Course *</label>
                    <select value={studentForm.courseCode} onChange={e => updateStudent("courseCode", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary">
                      {courses.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PasswordField label="Password *" placeholder="Min. 6 characters" value={studentForm.password}
                    onChange={v => updateStudent("password", v)} show={showPassword} onToggle={() => setShowPassword(s => !s)} />
                  <FormField icon={Lock} label="Confirm Password *" type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password" value={studentForm.confirmPassword} onChange={v => updateStudent("confirmPassword", v)} />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField icon={User} label="Full Name *" placeholder="e.g. Dr. Ahmad bin Razali"
                    value={lecturerForm.name} onChange={v => updateLecturer("name", v)} />
                  <FormField icon={User} label="Username *" placeholder="e.g. ahmad.razali"
                    value={lecturerForm.username} onChange={v => updateLecturer("username", v)} />
                  <FormField icon={IdCard} label="Staff ID *" placeholder="e.g. STAFF-001"
                    value={lecturerForm.staffId} onChange={v => updateLecturer("staffId", v)} />
                  <FormField icon={Mail} label="Email *" type="email" placeholder="yourname@edu.my"
                    value={lecturerForm.email} onChange={v => updateLecturer("email", v)} />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Faculty *</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <select value={lecturerForm.faculty} onChange={e => updateLecturer("faculty", e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary">
                      <option>Faculty of Business &amp; Commerce</option>
                      <option>Faculty of Technology</option>
                      <option>Faculty of Hospitality</option>
                      <option>Faculty of Creative Arts</option>
                      <option>Faculty of Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PasswordField label="Password *" placeholder="Min. 6 characters" value={lecturerForm.password}
                    onChange={v => updateLecturer("password", v)} show={showPassword} onToggle={() => setShowPassword(s => !s)} />
                  <FormField icon={Lock} label="Confirm Password *" type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password" value={lecturerForm.confirmPassword} onChange={v => updateLecturer("confirmPassword", v)} />
                </div>
              </>
            )}

            {error && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-status-intensive/10 border border-status-intensive/20 text-xs text-status-intensive">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit"
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              Create {role === "student" ? "Student" : "Lecturer"} Account
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <button onClick={onBack} className="text-primary font-medium hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ icon: Icon, label, placeholder, value, onChange, type = "text" }: {
  icon: React.ElementType; label: string; placeholder?: string;
  value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary" />
      </div>
    </div>
  );
}

function PasswordField({ label, placeholder, value, onChange, show, onToggle }: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; show: boolean; onToggle: () => void;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

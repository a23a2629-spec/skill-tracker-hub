import { useState, useEffect } from "react";
import { students, appointments, Appointment, externalProblems, ExternalProblem } from "@/data/mockData";
import StudentDashboard from "@/components/StudentDashboard";
import LecturerDashboard from "@/components/LecturerDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import Login, { AuthSession } from "@/components/Login";
import { GraduationCap, LogOut, UserCircle2, Search, Bell } from "lucide-react";

const SESSION_KEY = "skills-tracker-session";

const Index = () => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(appointments);
  const [allProblems, setAllProblems] = useState<ExternalProblem[]>(externalProblems);

  // Resolve current student based on session role
  const activeStudentId = session?.role === "student" ? session.studentId : selectedStudentId;
  const selectedStudent = students.find((s) => s.id === activeStudentId) ?? students[0];

  const handleAddAppointment = (apt: Appointment) => setAllAppointments(prev => [...prev, apt]);
  const handleUpdateAppointmentStatus = (id: string, status: Appointment["status"]) =>
    setAllAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const handleAddProblem = (problem: ExternalProblem) => setAllProblems(prev => [...prev, problem]);

  const handleLogout = () => setSession(null);

  if (!session) return <Login onLogin={setSession} />;

  const headerInner = session.role === "lecturer"
    ? "max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4"
    : "px-4 sm:px-6 py-3 flex items-center gap-4";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/60 sticky top-0 z-50 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.06)]">
        <div className={headerInner}>
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-sm leading-tight text-foreground">Skills Gap Tracker</h1>
              <p className="text-[10px] text-muted-foreground">Early Detection · Smarter Intervention</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-auto hidden sm:block">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search students, modules, records…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/70 border border-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <button
              className="relative w-10 h-10 rounded-xl bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-colors"
              aria-label="Notifications"
            >
              <Bell size={17} className="text-foreground/80" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[hsl(var(--status-intensive))] ring-2 ring-card" />
            </button>
            <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-border/70 bg-card">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold">
                {session.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold leading-tight">{session.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{session.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/70 text-foreground hover:bg-secondary transition-colors text-xs font-medium"
              data-testid="button-logout"
            >
              <LogOut size={14} /> <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {session.role === "student" ? (
        <StudentDashboard
          student={selectedStudent}
          appointments={allAppointments.filter(a => a.studentId === selectedStudent.id)}
          onAddAppointment={handleAddAppointment}
          onUpdateStatus={handleUpdateAppointmentStatus}
          problems={allProblems.filter(p => p.studentId === selectedStudent.id)}
          onAddProblem={handleAddProblem}
          onLogout={handleLogout}
        />
      ) : (
        <LecturerDashboard
          appointments={allAppointments}
          onAddAppointment={handleAddAppointment}
          onUpdateStatus={handleUpdateAppointmentStatus}
          problems={allProblems}
          lecturerName={session.name}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Index;

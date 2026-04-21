import { useState, useEffect } from "react";
import { students, appointments, Appointment, externalProblems, ExternalProblem } from "@/data/mockData";
import StudentDashboard from "@/components/StudentDashboard";
import LecturerDashboard from "@/components/LecturerDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import Login, { AuthSession } from "@/components/Login";
import { GraduationCap, LogOut, UserCircle2 } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <GraduationCap size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base">In-Campus Skills Gap Tracker</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Early Detection • Smarter Intervention</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
              <UserCircle2 size={16} className="text-primary" />
              <div className="text-left">
                <p className="text-xs font-semibold leading-tight">{session.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{session.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors text-xs font-medium"
              data-testid="button-logout"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {session.role === "lecturer" && (
          <div className="mb-6">
            <label className="text-xs text-muted-foreground mb-2 block">Viewing student profile:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary"
              data-testid="select-student-lecturer-view"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.matricNo})</option>
              ))}
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">
              You are signed in as a lecturer. The dashboard below shows aggregate data; selecting a student is for context only.
            </p>
          </div>
        )}

        {session.role === "student" ? (
          <StudentDashboard
            student={selectedStudent}
            appointments={allAppointments.filter(a => a.studentId === selectedStudent.id)}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
            problems={allProblems.filter(p => p.studentId === selectedStudent.id)}
            onAddProblem={handleAddProblem}
          />
        ) : (
          <LecturerDashboard
            appointments={allAppointments}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
            problems={allProblems}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

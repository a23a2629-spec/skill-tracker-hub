import { useState, useEffect, useRef } from "react";
import { students, appointments, Appointment, externalProblems, ExternalProblem } from "@/data/mockData";
import StudentDashboard from "@/components/StudentDashboard";
import LecturerDashboard from "@/components/LecturerDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import Login, { AuthSession } from "@/components/Login";
import { GraduationCap, LogOut, Search, Bell, ChevronDown, UserCircle2, Mail, CheckCircle2 } from "lucide-react";

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

  // Top header dropdown state
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(t)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!session) return <Login onLogin={setSession} />;

  // Build notifications based on role
  type HeaderNotif = { id: string; title: string; body: string; ts: string };
  const headerNotifs: HeaderNotif[] = session.role === "lecturer"
    ? allAppointments
        .filter(a => a.status === "pending")
        .slice(0, 6)
        .map(a => ({
          id: a.id,
          title: `Appointment request · ${students.find(s => s.id === a.studentId)?.name ?? "Student"}`,
          body: `${a.date} at ${a.time} — ${a.reason}`,
          ts: a.date,
        }))
    : (selectedStudent.notifications ?? []).slice(0, 6).map((n: any, i: number) => ({
        id: n.id ?? `n-${i}`,
        title: n.title ?? "Notification",
        body: n.message ?? n.body ?? "",
        ts: n.date ?? n.ts ?? "",
      }));

  // Search results: lecturer searches all students; student searches own modules
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery
    ? (session.role === "lecturer"
        ? students
            .filter(s =>
              s.name.toLowerCase().includes(trimmedQuery) ||
              s.matricNo.toLowerCase().includes(trimmedQuery) ||
              s.course.toLowerCase().includes(trimmedQuery))
            .slice(0, 6)
            .map(s => ({ id: s.id, label: s.name, sub: `${s.matricNo} · ${s.course}`, onClick: () => { setSelectedStudentId(s.id); setSearchOpen(false); setSearchQuery(""); } }))
        : (selectedStudent.skills ?? [])
            .filter((sk: any) => sk.name?.toLowerCase().includes(trimmedQuery))
            .slice(0, 6)
            .map((sk: any, i: number) => ({ id: `sk-${i}`, label: sk.name, sub: `Score ${sk.score ?? "—"}%`, onClick: () => { setSearchOpen(false); setSearchQuery(""); } })))
    : [];

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
          <div ref={searchRef} className="flex-1 max-w-md mx-auto hidden sm:block relative">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder={session.role === "lecturer" ? "Search students by name, matric, course…" : "Search your modules…"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/70 border border-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all"
                data-testid="input-global-search"
              />
            </div>
            {searchOpen && trimmedQuery && (
              <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No matches for "{searchQuery}"
                  </div>
                ) : (
                  <ul className="max-h-80 overflow-y-auto">
                    {searchResults.map(r => (
                      <li key={r.id}>
                        <button
                          onClick={r.onClick}
                          className="w-full text-left px-4 py-2.5 hover:bg-secondary/70 transition flex items-center gap-3 border-b border-border/40 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {r.label.split(" ").map(w => w[0]).slice(0, 2).join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{r.label}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{r.sub}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                className="relative w-10 h-10 rounded-xl bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-colors"
                aria-label="Notifications"
                data-testid="button-notifications"
              >
                <Bell size={17} className="text-foreground/80" />
                {headerNotifs.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[hsl(var(--status-intensive))] ring-2 ring-card" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
                    <p className="text-sm font-bold">Notifications</p>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {headerNotifs.length} new
                    </span>
                  </div>
                  {headerNotifs.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <CheckCircle2 size={28} className="mx-auto text-muted-foreground/60 mb-2" />
                      <p className="text-xs text-muted-foreground">You're all caught up</p>
                    </div>
                  ) : (
                    <ul className="max-h-96 overflow-y-auto">
                      {headerNotifs.map(n => (
                        <li key={n.id} className="px-4 py-3 hover:bg-secondary/70 transition border-b border-border/40 last:border-0">
                          <p className="text-xs font-semibold text-foreground leading-snug">{n.title}</p>
                          {n.body && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{n.body}</p>}
                          {n.ts && <p className="text-[10px] text-muted-foreground/70 mt-1">{n.ts}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Profile chip */}
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-xl border border-border/70 bg-card hover:bg-secondary/60 transition"
                data-testid="button-profile-menu"
              >
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold">
                  {session.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold leading-tight">{session.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{session.role}</p>
                </div>
                <ChevronDown size={13} className={`text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {session.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{session.name}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{session.role}{session.role === "student" && session.studentId ? ` · ${session.studentId}` : ""}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1.5">
                    <div className="flex items-center gap-2 px-2.5 py-2 text-[11px] text-muted-foreground">
                      <UserCircle2 size={13} /> Signed in as {session.role}
                    </div>
                    {session.role === "student" && (
                      <div className="flex items-center gap-2 px-2.5 py-2 text-[11px] text-muted-foreground">
                        <Mail size={13} /> {selectedStudent.profile?.email || "—"}
                      </div>
                    )}
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full mt-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-500/10 transition"
                    >
                      <LogOut size={13} /> Sign out
                    </button>
                  </div>
                </div>
              )}
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

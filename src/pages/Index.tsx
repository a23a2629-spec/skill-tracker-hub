import { useState, useEffect, useRef } from "react";
import { students, appointments, Appointment, externalProblems, ExternalProblem, ReportTemplate, ReportSubmission, ChatMessage } from "@/data/mockData";
import { getRegisteredStudents, getAllStudents, applyStudentOverrides } from "@/lib/userRegistry";
import StudentDashboard from "@/components/StudentDashboard";
import LecturerDashboard from "@/components/LecturerDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import AIHelpAssistant from "@/components/AIHelpAssistant";
import Login, { AuthSession } from "@/components/Login";
import Signup from "@/components/Signup";
import SplashScreen from "@/components/SplashScreen";
import { LogOut, Search, ChevronDown, UserCircle2, Mail, RefreshCw } from "lucide-react";

const SESSION_KEY = "skills-tracker-session";
const SPLASH_KEY = "skills-tracker-splash-seen";

const Index = () => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch { return null; }
  });

  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_KEY);
    } catch { return false; }
  });

  const handleSplashComplete = () => {
    try { sessionStorage.setItem(SPLASH_KEY, "1"); } catch { /* ignore */ }
    setShowSplash(false);
  };

  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  // All students = mock + registered
  const allStudents = applyStudentOverrides([...students, ...getRegisteredStudents()]);

  const [selectedStudentId, setSelectedStudentId] = useState(allStudents[0].id);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(appointments);
  const [allProblems, setAllProblems] = useState<ExternalProblem[]>(externalProblems);

  const REPORT_TEMPLATES_KEY = "skills-tracker-report-templates";
  const REPORT_SUBMISSIONS_KEY = "skills-tracker-report-submissions";
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>(() => {
    try { return JSON.parse(localStorage.getItem(REPORT_TEMPLATES_KEY) || "[]"); } catch { return []; }
  });
  const [reportSubmissions, setReportSubmissions] = useState<ReportSubmission[]>(() => {
    try { return JSON.parse(localStorage.getItem(REPORT_SUBMISSIONS_KEY) || "[]"); } catch { return []; }
  });

  // Profile overrides — persisted to localStorage
  const PROFILE_KEY = "skills-tracker-profile-updates";
  const [profileOverrides, setProfileOverrides] = useState<Record<string, any>>(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch { return {}; }
  });

  const activeStudentId = session?.role === "student" ? session.studentId : selectedStudentId;
  const baseStudent = allStudents.find((s) => s.id === activeStudentId) ?? allStudents[0];
  const override = profileOverrides[baseStudent.id];
  const selectedStudent = override
    ? { ...baseStudent, profile: { ...baseStudent.profile, ...override } }
    : baseStudent;

  const handleAddAppointment = (apt: Appointment) => setAllAppointments(prev => [...prev, apt]);
  const handleUpdateAppointmentStatus = (id: string, status: Appointment["status"]) =>
    setAllAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const handleAddProblem = (problem: ExternalProblem) => setAllProblems(prev => [...prev, problem]);
  const handleLogout = () => setSession(null);

  const CHAT_KEY = "skills-tracker-chat-messages";
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]"); } catch { return []; }
  });
  const handleSendMessage = (msg: ChatMessage) => {
    const next = [...chatMessages, msg];
    setChatMessages(next);
    localStorage.setItem(CHAT_KEY, JSON.stringify(next));
  };
  const handleMarkRead = (threadId: string) => {
    const next = chatMessages.map(m => m.threadId === threadId ? { ...m, read: true } : m);
    setChatMessages(next);
    localStorage.setItem(CHAT_KEY, JSON.stringify(next));
  };

  const handleAddTemplate = (t: ReportTemplate) => {
    const next = [t, ...reportTemplates];
    setReportTemplates(next);
    localStorage.setItem(REPORT_TEMPLATES_KEY, JSON.stringify(next));
  };
  const handleAddSubmission = (s: ReportSubmission) => {
    const next = [s, ...reportSubmissions];
    setReportSubmissions(next);
    localStorage.setItem(REPORT_SUBMISSIONS_KEY, JSON.stringify(next));
  };
  const handleUpdateSubmission = (id: string, patch: Partial<ReportSubmission>) => {
    const next = reportSubmissions.map(s => s.id === id ? { ...s, ...patch } : s);
    setReportSubmissions(next);
    localStorage.setItem(REPORT_SUBMISSIONS_KEY, JSON.stringify(next));
  };

  const handleProfileUpdate = (update: any) => {
    const merged = { ...profileOverrides[baseStudent.id], ...update };
    const next = { ...profileOverrides, [baseStudent.id]: merged };
    setProfileOverrides(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  };

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [studentSectionReq, setStudentSectionReq] = useState<string | undefined>();
  const [studentTabReq, setStudentTabReq] = useState<string | undefined>();
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

  if (!session) {
    if (showSplash) {
      return <SplashScreen onComplete={handleSplashComplete} />;
    }
    if (showSignup) {
      return (
        <Signup
          onBack={() => setShowSignup(false)}
          onSuccess={() => setShowSignup(false)}
        />
      );
    }
    return <Login onLogin={setSession} onShowSignup={() => setShowSignup(true)} />;
  }

  type HeaderNotif = { id: string; title: string; body: string; ts: string };
  const headerNotifs: HeaderNotif[] = session.role === "lecturer"
    ? allAppointments
        .filter(a => a.status === "pending")
        .slice(0, 6)
        .map(a => ({
          id: a.id,
          title: `Appointment request · ${allStudents.find(s => s.id === a.studentId)?.name ?? "Student"}`,
          body: `${a.date} at ${a.time} — ${a.reason}`,
          ts: a.date,
        }))
    : (selectedStudent.notifications ?? []).slice(0, 6).map((n: any, i: number) => ({
        id: n.id ?? `n-${i}`,
        title: n.title ?? "Notification",
        body: n.message ?? n.body ?? "",
        ts: n.date ?? n.ts ?? "",
      }));

  // Module index for student search
  const studentModules = [
    { label: "Module 1 — Personal Information", sub: "Name · nationality · race · religion · gender", section: "profile", tab: "personal" },
    { label: "Module 2 — Identification Details", sub: "IC number · Student ID · identity verification", section: "profile", tab: "personal" },
    { label: "Module 3 — Contact Information", sub: "Phone · email · address · postcode · state", section: "profile", tab: "personal" },
    { label: "Module 4 — Emergency Contact", sub: "Guardian · relationship · guardian phone & email", section: "profile", tab: "personal" },
    { label: "Module 5 — Academic Background", sub: "Previous school · SPM · results · achievements", section: "profile", tab: "academic" },
    { label: "Module 6 — University Program Details", sub: "Program · faculty · intake · semester · scholarship", section: "profile", tab: "academic" },
    { label: "Module 7 — Enrollment Information", sub: "Registration status · advisor · campus", section: "profile", tab: "academic" },
    { label: "Module 8 — Academic Performance", sub: "CGPA · GPA · attendance · assessment scores", section: "profile", tab: "academic" },
    { label: "Module 9 — Financial Information", sub: "Household income · PTPTN · payment status · B40/M40/T20", section: "profile", tab: "financial" },
    { label: "Module 10 — Family Background", sub: "Father · mother · siblings · household size · marital status", section: "profile", tab: "financial" },
    { label: "Module 11 — Health Information", sub: "Blood type · disability · insurance · medical conditions · allergies", section: "profile", tab: "health" },
    { label: "Module 12 — Mental Health Support", sub: "Counseling status · wellbeing · counselor", section: "profile", tab: "health" },
    { label: "Module 13 — Accommodation Details", sub: "Hostel · block · room · commuter", section: "profile", tab: "health" },
    { label: "Module 14 — Skills & Interests", sub: "Technical skills · soft skills · career goal · co-curricular", section: "profile", tab: "activities" },
    { label: "Module 15 — Disciplinary Records", sub: "Disciplinary record · violations · conduct", section: "profile", tab: "activities" },
    { label: "Module 16 — Uploaded Documents", sub: "IC copy · certificates · offer letter · PTPTN", section: "profile", tab: "activities" },
    { label: "Integrity & Trust Index", sub: "Risk score · trust index · verification flags", section: "profile", tab: "integrity" },
    { label: "My Dashboard", sub: "Overview · assessments · appointments · timeline", section: "dashboard", tab: "" },
    { label: "Cases", sub: "Reported issues · support tickets", section: "cases", tab: "" },
    { label: "Meetings", sub: "Appointments with lecturers and advisors", section: "meetings", tab: "" },
    { label: "Analytics", sub: "Skills radar · progress charts", section: "analytics", tab: "" },
  ];

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery
    ? (session.role === "lecturer"
        ? allStudents
            .filter(s =>
              s.name.toLowerCase().includes(trimmedQuery) ||
              s.matricNo.toLowerCase().includes(trimmedQuery) ||
              s.course.toLowerCase().includes(trimmedQuery))
            .slice(0, 6)
            .map(s => ({ id: s.id, label: s.name, sub: `${s.matricNo} · ${s.course}`, onClick: () => { setSelectedStudentId(s.id); setSearchOpen(false); setSearchQuery(""); } }))
        : studentModules
            .filter(m =>
              m.label.toLowerCase().includes(trimmedQuery) ||
              m.sub.toLowerCase().includes(trimmedQuery))
            .slice(0, 8)
            .map((m, i) => ({
              id: `m-${i}`,
              label: m.label,
              sub: m.sub,
              onClick: () => {
                setStudentSectionReq(m.section + "-" + Date.now());
                setStudentTabReq(m.tab + "-" + Date.now());
                setSearchOpen(false);
                setSearchQuery("");
              },
            })))
    : [];

  const headerInner = session.role === "lecturer"
    ? "max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4"
    : "px-4 sm:px-6 py-3 flex items-center gap-4";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/60 sticky top-0 z-50 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.06)]">
        <div className={headerInner}>
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="In-Campus Skills Gap Tracker" className="h-20 object-contain" />
            <div className="hidden lg:block">
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
                            {r.label.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
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
                    {session.role === "student" && (
                      <div className="relative">
                        <button
                          onClick={() => setSwitchOpen(o => !o)}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-secondary/60 transition"
                        >
                          <RefreshCw size={13} /> Switch Account
                          <ChevronDown size={11} className={`ml-auto transition-transform ${switchOpen ? "rotate-180" : ""}`} />
                        </button>
                        {switchOpen && (
                          <div className="mx-1 mb-1 rounded-lg border border-border bg-secondary/40 overflow-hidden">
                            {allStudents.slice(0, 8).map(s => (
                              <button
                                key={s.id}
                                onClick={() => {
                                  setSession({ role: "student", studentId: s.id, name: s.name });
                                  setProfileOpen(false);
                                  setSwitchOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-[11px] hover:bg-card transition flex items-center gap-2 ${session.role === "student" && session.studentId === s.id ? "text-primary font-semibold" : "text-foreground"}`}
                              >
                                <div className="w-5 h-5 rounded bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center shrink-0">
                                  {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate">{s.name}</p>
                                  <p className="text-muted-foreground font-mono text-[9px]">{s.matricNo}</p>
                                </div>
                                {session.role === "student" && session.studentId === s.id && (
                                  <span className="ml-auto text-[9px] text-primary">✓ active</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
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
          onProfileUpdate={handleProfileUpdate}
          sectionRequest={studentSectionReq}
          profileTabRequest={studentTabReq}
          reportTemplates={reportTemplates}
          reportSubmissions={reportSubmissions}
          onAddSubmission={handleAddSubmission}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          onMarkRead={handleMarkRead}
        />
      ) : (
        <LecturerDashboard
          appointments={allAppointments}
          onAddAppointment={handleAddAppointment}
          onUpdateStatus={handleUpdateAppointmentStatus}
          problems={allProblems}
          lecturerName={session.name}
          onLogout={handleLogout}
          reportTemplates={reportTemplates}
          reportSubmissions={reportSubmissions}
          onAddTemplate={handleAddTemplate}
          onUpdateSubmission={handleUpdateSubmission}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          onMarkRead={handleMarkRead}
        />
      )}

      <AIHelpAssistant role={session.role} userName={session.name} />
    </div>
  );
};

export default Index;

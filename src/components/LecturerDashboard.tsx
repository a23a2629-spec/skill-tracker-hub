import { useState } from "react";
import {
  students, courses, Course, SkillStatus,
  Appointment, ExternalProblem, externalProblems,
} from "@/data/mockData";
import {
  Users, BookOpen, AlertTriangle, TrendingUp, MessageSquare, ChevronUp, PlusCircle,
  CalendarDays, AlertCircle, LayoutDashboard, BarChart3, FileText, Sparkles,
  Settings as SettingsIcon, LogOut, Search, Bell, Download, Menu, X as XIcon,
  ChevronRight, ArrowLeft, GraduationCap, Circle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import StudentProfile from "./StudentProfile";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";

interface Props {
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
  problems: ExternalProblem[];
  lecturerName: string;
  onLogout: () => void;
}

type Section =
  | "dashboard" | "students" | "analytics" | "appointments"
  | "cases" | "reports" | "ai" | "settings";

const navItems: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "students", label: "Students", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "cases", label: "Cases / Problems", icon: AlertCircle },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "ai", label: "AI Insights", icon: Sparkles },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const getOverallStatus = (score: number): SkillStatus => {
  if (score >= 75) return "mastered";
  if (score >= 50) return "developing";
  return "intensive";
};

const LecturerDashboard = ({
  appointments: lecturerAppointments,
  onAddAppointment,
  onUpdateStatus,
  problems,
  lecturerName,
  onLogout,
}: Props) => {
  const [active, setActive] = useState<Section>("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [newComment, setNewComment] = useState("");
  const [newAssessment, setNewAssessment] = useState({ title: "", dueDate: "", maxScore: "100", courseId: "" });
  const [createdAssessments, setCreatedAssessments] = useState<{ title: string; dueDate: string; maxScore: number; courseCode: string }[]>([]);
  const [showLecturerBooking, setShowLecturerBooking] = useState(false);
  const [lecturerBookingForm, setLecturerBookingForm] = useState({ studentId: "", date: "", time: "", reason: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const displayStudents = selectedCourse
    ? students.filter((s) => selectedCourse.students.includes(s.id))
    : students;

  const avgAttendance = Math.round(displayStudents.reduce((a, s) => a + s.attendance, 0) / displayStudents.length);
  const avgScore = Math.round(displayStudents.reduce((a, s) => a + s.averageScore, 0) / displayStudents.length);
  const intensiveCount = displayStudents.filter((s) => s.averageScore < 50).length;
  const avgAI = Math.round(displayStudents.reduce((a, s) => a + s.aiPercentage, 0) / displayStudents.length);
  const atRiskStudents = [...displayStudents].sort((a, b) => a.averageScore - b.averageScore).slice(0, 5);

  const handleAddComment = (studentId: string, assessmentId: string) => {
    if (!newComment.trim()) return;
    setComments((prev) => ({ ...prev, [`${studentId}-${assessmentId}`]: newComment }));
    setNewComment("");
  };

  const handleCreateAssessment = () => {
    if (!newAssessment.title || !newAssessment.dueDate || !newAssessment.courseId) return;
    const course = courses.find(c => c.id === newAssessment.courseId);
    setCreatedAssessments(prev => [...prev, {
      title: newAssessment.title,
      dueDate: newAssessment.dueDate,
      maxScore: parseInt(newAssessment.maxScore) || 100,
      courseCode: course?.code || "",
    }]);
    setNewAssessment({ title: "", dueDate: "", maxScore: "100", courseId: "" });
  };

  const handleLecturerBookAppointment = () => {
    if (!lecturerBookingForm.studentId || !lecturerBookingForm.date || !lecturerBookingForm.time || !lecturerBookingForm.reason) return;
    const student = students.find(s => s.id === lecturerBookingForm.studentId);
    if (!student) return;
    const newApt: Appointment = {
      id: `apt-l-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      lecturerName: "Dr. Zainab",
      date: lecturerBookingForm.date,
      time: lecturerBookingForm.time,
      reason: lecturerBookingForm.reason,
      status: "pending",
      createdBy: "lecturer",
    };
    onAddAppointment(newApt);
    setLecturerBookingForm({ studentId: "", date: "", time: "", reason: "" });
    setShowLecturerBooking(false);
  };

  // Charts data
  const scoreDistribution = [
    { range: "0–49", count: displayStudents.filter(s => s.averageScore < 50).length, fill: "#EF4444" },
    { range: "50–74", count: displayStudents.filter(s => s.averageScore >= 50 && s.averageScore < 75).length, fill: "#F59E0B" },
    { range: "75–100", count: displayStudents.filter(s => s.averageScore >= 75).length, fill: "#22C55E" },
  ];

  const allSkillStatuses = displayStudents.flatMap(s => s.skills.filter(a => a.completed).flatMap(a => a.skills));
  const pieData = [
    { name: "Mastered", value: allSkillStatuses.filter(s => s.status === "mastered").length, color: "#22C55E" },
    { name: "Developing", value: allSkillStatuses.filter(s => s.status === "developing").length, color: "#F59E0B" },
    { name: "Intensive", value: allSkillStatuses.filter(s => s.status === "intensive").length, color: "#EF4444" },
  ];

  const courseShortNames: Record<string, string> = {
    "DPB3012": "SAD", "DPB2022": "SAK", "DPB2033": "SAR",
    "DPA1014": "SAA", "DPB1015": "SAE", "DPB3046": "SAB",
  };
  const courseBarData = courses.map(c => {
    const cs = students.filter(s => c.students.includes(s.id));
    return {
      name: courseShortNames[c.code] || c.code,
      avg: cs.length ? Math.round(cs.reduce((a, s) => a + s.averageScore, 0) / cs.length) : 0,
    };
  });

  const sectionMeta: Record<Section, { title: string; subtitle: string }> = {
    dashboard: { title: "Lecturer Dashboard", subtitle: "Monitor student progress and interventions" },
    students: { title: "Students", subtitle: "View and manage every student's full profile" },
    analytics: { title: "Analytics", subtitle: "Performance trends across courses and skills" },
    appointments: { title: "Appointments", subtitle: "Schedule and manage student meetings" },
    cases: { title: "Cases & Problems", subtitle: "Reported issues that need attention" },
    reports: { title: "Reports", subtitle: "Create assessments and view records" },
    ai: { title: "AI Insights", subtitle: "Smart summaries generated from cohort data" },
    settings: { title: "Settings", subtitle: "Manage your preferences" },
  };

  const meta = sectionMeta[active];
  const initials = lecturerName.split(" ").map(n => n[0]).slice(0, 2).join("");
  const sidebarWidth = collapsed ? "w-[76px]" : "w-[260px]";

  return (
    <div className="flex bg-background min-h-[calc(100vh-65px)]">
      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        className={`${sidebarWidth} hidden lg:flex flex-col bg-[#0F172A] text-slate-100 sticky top-[65px] h-[calc(100vh-65px)] transition-all duration-300 shrink-0`}
      >
        <SidebarContent
          collapsed={collapsed}
          active={active}
          setActive={(s) => { setActive(s); setViewingStudentId(null); }}
          lecturerName={lecturerName}
          initials={initials}
          onLogout={onLogout}
          onCollapse={() => setCollapsed(c => !c)}
        />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-[260px] bg-[#0F172A] text-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              collapsed={false}
              active={active}
              setActive={(s) => { setActive(s); setViewingStudentId(null); setSidebarOpen(false); }}
              lecturerName={lecturerName}
              initials={initials}
              onLogout={onLogout}
              onCollapse={() => setSidebarOpen(false)}
              isMobile
            />
          </aside>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Sub-header */}
        <div className="sticky top-[65px] z-30 bg-background/85 backdrop-blur-xl border-b border-border/60">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 flex-wrap">
            <button
              className="lg:hidden w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{meta.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{meta.subtitle}</p>
            </div>
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search…"
                  className="pl-9 pr-3 py-2 w-56 rounded-xl bg-secondary/70 text-sm border border-transparent focus:bg-card focus:border-primary/40 focus:ring-4 focus:ring-primary/10 focus:outline-none transition"
                />
              </div>
              <button className="w-10 h-10 rounded-xl bg-secondary/70 hover:bg-secondary flex items-center justify-center transition relative">
                <Bell size={16} />
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-card" />
              </button>
              <button className="px-3 py-2 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                <Download size={14} /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Section content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* If viewing a single student profile, show that overlay regardless of section */}
          {viewingStudentId && active === "students" ? (
            <StudentProfileView
              studentId={viewingStudentId}
              problems={externalProblems.filter(p => p.studentId === viewingStudentId)}
              onBack={() => setViewingStudentId(null)}
            />
          ) : (
            <>
              {active === "dashboard" && (
                <DashboardSection
                  totalStudents={displayStudents.length}
                  avgAttendance={avgAttendance}
                  avgAI={avgAI}
                  intensiveCount={intensiveCount}
                  avgScore={avgScore}
                  scoreDistribution={scoreDistribution}
                  pieData={pieData}
                  atRiskStudents={atRiskStudents}
                  appointments={lecturerAppointments}
                  problems={problems}
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                />
              )}

              {active === "students" && (
                <StudentsSection
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                  displayStudents={displayStudents}
                  onView={setViewingStudentId}
                />
              )}

              {active === "analytics" && (
                <AnalyticsSection
                  scoreDistribution={scoreDistribution}
                  pieData={pieData}
                  courseBarData={courseBarData}
                />
              )}

              {active === "appointments" && (
                <AppointmentsSection
                  lecturerAppointments={lecturerAppointments}
                  showLecturerBooking={showLecturerBooking}
                  setShowLecturerBooking={setShowLecturerBooking}
                  lecturerBookingForm={lecturerBookingForm}
                  setLecturerBookingForm={setLecturerBookingForm}
                  handleLecturerBookAppointment={handleLecturerBookAppointment}
                  handleAppointmentStatus={onUpdateStatus}
                />
              )}

              {active === "cases" && <CasesSection problems={problems} />}

              {active === "reports" && (
                <ReportsSection
                  newAssessment={newAssessment}
                  setNewAssessment={setNewAssessment}
                  handleCreateAssessment={handleCreateAssessment}
                  createdAssessments={createdAssessments}
                  displayStudents={displayStudents}
                  comments={comments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleAddComment={handleAddComment}
                />
              )}

              {active === "ai" && <AIInsightsSection displayStudents={displayStudents} avgScore={avgScore} avgAttendance={avgAttendance} avgAI={avgAI} />}

              {active === "settings" && <SettingsSection lecturerName={lecturerName} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Sidebar Content ────────────────────────────────────────────────────
function SidebarContent({
  collapsed, active, setActive, lecturerName, initials, onLogout, onCollapse, isMobile,
}: {
  collapsed: boolean;
  active: Section;
  setActive: (s: Section) => void;
  lecturerName: string;
  initials: string;
  onLogout: () => void;
  onCollapse: () => void;
  isMobile?: boolean;
}) {
  return (
    <>
      <div className={`flex items-center gap-3 px-4 pt-5 pb-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-white truncate">Skills Gap Tracker</p>
            <p className="text-[10px] text-slate-400 truncate">University Edition</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 mb-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Workspace</p>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary/25 to-primary/5 text-white shadow-[inset_2px_0_0_hsl(221_83%_53%)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className={isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-200"} />
              {!collapsed && <span className="truncate">{label}</span>}
              {isActive && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-2">
        <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/5 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#0F172A]" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{lecturerName}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Circle size={6} fill="currentColor" /> Online · Lecturer
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={15} />
          {!collapsed && <span>Logout</span>}
        </button>
        {!isMobile && (
          <button
            onClick={onCollapse}
            className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-slate-500 hover:text-slate-300 transition"
          >
            <ChevronRight size={12} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
        {isMobile && (
          <button onClick={onCollapse} className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-slate-500 hover:text-slate-300 transition">
            <XIcon size={12} /> Close
          </button>
        )}
      </div>
    </>
  );
}

// ── KPI Card ────────────────────────────────────────────────────────────
function KPICard({ title, value, suffix, icon: Icon, tone, hint }: {
  title: string; value: string | number; suffix?: string; icon: React.ElementType;
  tone: "primary" | "success" | "warning" | "danger"; hint?: string;
}) {
  const toneCls = {
    primary: { bg: "bg-blue-500/10", text: "text-blue-600", value: "text-blue-600" },
    success: { bg: "bg-emerald-500/10", text: "text-emerald-600", value: "text-emerald-600" },
    warning: { bg: "bg-amber-500/10", text: "text-amber-600", value: "text-amber-600" },
    danger: { bg: "bg-red-500/10", text: "text-red-600", value: "text-red-600" },
  }[tone];
  return (
    <div className="premium-card p-5 group cursor-default">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-xl ${toneCls.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon size={16} className={toneCls.text} />
        </div>
      </div>
      <p className={`text-3xl font-bold tracking-tight ${toneCls.value}`}>
        {value}{suffix && <span className="text-base ml-0.5">{suffix}</span>}
      </p>
      {hint && <p className="text-[10px] text-muted-foreground mt-2">{hint}</p>}
    </div>
  );
}

// ── Course Filter Pills ─────────────────────────────────────────────────
function CourseFilter({ selectedCourse, setSelectedCourse }: {
  selectedCourse: Course | null;
  setSelectedCourse: (c: Course | null) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setSelectedCourse(null)}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          !selectedCourse ? "gradient-brand text-white shadow-lg shadow-primary/30" : "bg-card border border-border/70 text-foreground hover:border-primary/40"
        }`}
      >
        All Students
      </button>
      {courses.map((c) => (
        <button
          key={c.id}
          onClick={() => setSelectedCourse(c)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCourse?.id === c.id ? "gradient-brand text-white shadow-lg shadow-primary/30" : "bg-card border border-border/70 text-foreground hover:border-primary/40"
          }`}
        >
          <span className="hidden sm:inline">{c.name}</span>
          <span className="sm:hidden">{c.code}</span>
        </button>
      ))}
    </div>
  );
}

// ── Dashboard Section ───────────────────────────────────────────────────
function DashboardSection({
  totalStudents, avgAttendance, avgAI, intensiveCount, avgScore,
  scoreDistribution, pieData, atRiskStudents, appointments, problems,
  selectedCourse, setSelectedCourse,
}: any) {
  return (
    <div className="space-y-6">
      <CourseFilter selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Students" value={totalStudents} icon={Users} tone="primary" hint="Across all monitored courses" />
        <KPICard title="Avg Attendance" value={avgAttendance} suffix="%" icon={TrendingUp} tone="success" hint="Cohort average" />
        <KPICard title="AI Usage" value={avgAI} suffix="%" icon={BookOpen} tone={avgAI > 25 ? "warning" : "primary"} hint={avgAI > 25 ? "Above threshold" : "Within range"} />
        <KPICard title="Need Intervention" value={intensiveCount} icon={AlertTriangle} tone="danger" hint="Students scoring below 50%" />
      </div>

      {/* Row 2: Performance + AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 premium-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight">Class Average Score</h3>
              <p className="text-[10px] text-muted-foreground">Distribution across performance bands</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 font-semibold">{avgScore}%</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-bold tracking-tight text-gradient-brand">{avgScore}<span className="text-2xl">%</span></span>
            <StatusBadge status={getOverallStatus(avgScore)} />
          </div>
          <div className="flex h-3 rounded-full overflow-hidden mb-3 bg-secondary/60">
            <div className="bg-emerald-500 transition-all" style={{ width: `${(scoreDistribution[2].count / totalStudents) * 100}%` }} />
            <div className="bg-amber-500 transition-all" style={{ width: `${(scoreDistribution[1].count / totalStudents) * 100}%` }} />
            <div className="bg-red-500 transition-all" style={{ width: `${(scoreDistribution[0].count / totalStudents) * 100}%` }} />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {scoreDistribution[2].count} Mastered</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {scoreDistribution[1].count} Developing</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> {scoreDistribution[0].count} Intensive</span>
          </div>
        </div>

        <div className="premium-card p-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/30">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">AI Cohort Insight</h3>
                <p className="text-[10px] text-muted-foreground">Auto-generated</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-xl border ${avgScore >= 70 ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-amber-500/10 text-amber-700 border-amber-500/20"}`}>
                Class average is {avgScore}% — {avgScore >= 70 ? "trending well above pass mark." : "below the comfortable mark."}
              </div>
              {intensiveCount > 0 && (
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-700 border border-red-500/20">
                  {intensiveCount} student{intensiveCount > 1 ? "s" : ""} need{intensiveCount > 1 ? "" : "s"} intensive support.
                </div>
              )}
              {avgAI > 25 && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  Cohort AI usage at {avgAI}% — review academic integrity.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="premium-card p-5">
          <h3 className="text-sm font-bold tracking-tight mb-1">Score Distribution</h3>
          <p className="text-[10px] text-muted-foreground mb-3">How students are spread across bands</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {scoreDistribution.map((entry: any, i: number) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-card p-5">
          <h3 className="text-sm font-bold tracking-tight mb-1">Skill Status Breakdown</h3>
          <p className="text-[10px] text-muted-foreground mb-3">Mastered vs developing skills</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={50} outerRadius={85} paddingAngle={3}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={3} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Alerts + Meetings + At-risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="premium-card p-5">
          <h3 className="text-sm font-bold tracking-tight mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center"><AlertCircle size={14} className="text-red-500" /></span>
            Recent Alerts
          </h3>
          {problems.length === 0 ? (
            <p className="text-xs text-muted-foreground">No active alerts.</p>
          ) : (
            <div className="space-y-2">
              {problems.slice(0, 3).map((p: ExternalProblem) => {
                const s = students.find(st => st.id === p.studentId);
                return (
                  <div key={p.id} className="p-2.5 rounded-xl bg-secondary/40 border border-border/40">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold truncate">{s?.name ?? "Student"}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        p.severity === "high" ? "bg-red-500/15 text-red-600" :
                        p.severity === "medium" ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"
                      }`}>{p.severity}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="premium-card p-5">
          <h3 className="text-sm font-bold tracking-tight mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center"><CalendarDays size={14} className="text-blue-600" /></span>
            Upcoming Meetings
          </h3>
          {appointments.length === 0 ? (
            <p className="text-xs text-muted-foreground">No meetings scheduled.</p>
          ) : (
            <div className="space-y-2">
              {appointments.slice(0, 3).map((a: Appointment) => (
                <div key={a.id} className="p-2.5 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate">{a.studentName}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 font-semibold">{a.status}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{a.date} · {a.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="premium-card p-5">
          <h3 className="text-sm font-bold tracking-tight mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center"><AlertTriangle size={14} className="text-amber-600" /></span>
            Top At-Risk Students
          </h3>
          <div className="space-y-2">
            {atRiskStudents.slice(0, 4).map((s: any) => (
              <div key={s.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-secondary/40 transition">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {s.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.matricNo}</p>
                </div>
                <span className={`text-xs font-bold ${s.averageScore < 50 ? "text-red-500" : s.averageScore < 75 ? "text-amber-500" : "text-emerald-500"}`}>
                  {s.averageScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const chartTooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  boxShadow: "0 8px 24px -12px rgba(15,23,42,0.18)",
};

// ── Students Section ────────────────────────────────────────────────────
function StudentsSection({ selectedCourse, setSelectedCourse, displayStudents, onView }: any) {
  return (
    <div className="space-y-5">
      <CourseFilter selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
      <div className="premium-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              {selectedCourse ? selectedCourse.name : "All Students"}
            </h3>
            <p className="text-[10px] text-muted-foreground">Click any row to open the full student profile</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">{displayStudents.length} students</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground text-[10px] uppercase tracking-wider bg-secondary/40">
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-3 py-3 font-semibold">Course</th>
                <th className="px-3 py-3 text-center font-semibold">Attendance</th>
                <th className="px-3 py-3 text-center font-semibold">AI %</th>
                <th className="px-3 py-3 text-center font-semibold">Avg Score</th>
                <th className="px-3 py-3 text-center font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.map((student: any) => (
                <tr
                  key={student.id}
                  className="border-t border-border/40 hover:bg-secondary/30 cursor-pointer transition-colors group"
                  onClick={() => onView(student.id)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {student.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{student.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{student.matricNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{student.course}</td>
                  <td className="px-3 py-3 text-center text-xs font-medium">{student.attendance}%</td>
                  <td className={`px-3 py-3 text-center text-xs font-medium ${student.aiPercentage > 25 ? "text-red-500" : ""}`}>{student.aiPercentage}%</td>
                  <td className="px-3 py-3 text-center text-sm font-bold">{student.averageScore}%</td>
                  <td className="px-3 py-3 text-center"><StatusBadge status={getOverallStatus(student.averageScore)} /></td>
                  <td className="px-5 py-3 text-right">
                    <ChevronRight size={15} className="text-muted-foreground inline group-hover:text-primary group-hover:translate-x-0.5 transition" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Single student profile view (for lecturer) ─────────────────────────
function StudentProfileView({ studentId, problems, onBack }: { studentId: string; problems: ExternalProblem[]; onBack: () => void }) {
  const student = students.find(s => s.id === studentId);
  if (!student) return null;
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={15} /> Back to all students
      </button>
      <StudentProfile student={student} problems={problems} />
    </div>
  );
}

// ── Analytics Section ───────────────────────────────────────────────────
function AnalyticsSection({ scoreDistribution, pieData, courseBarData }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="premium-card p-5">
          <h3 className="text-sm font-bold tracking-tight mb-1">Score Distribution</h3>
          <p className="text-[10px] text-muted-foreground mb-3">Cohort spread by performance band</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {scoreDistribution.map((entry: any, i: number) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="premium-card p-5">
          <h3 className="text-sm font-bold tracking-tight mb-1">Skill Status Breakdown</h3>
          <p className="text-[10px] text-muted-foreground mb-3">Across completed assessments</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {pieData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={3} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="premium-card p-5">
        <h3 className="text-sm font-bold tracking-tight mb-1">Average Score by Course</h3>
        <p className="text-[10px] text-muted-foreground mb-3">Comparing performance across all programs</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={courseBarData}>
            <defs>
              <linearGradient id="grad-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(221 83% 53%)" />
                <stop offset="100%" stopColor="hsl(199 89% 48%)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Bar dataKey="avg" fill="url(#grad-bar)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Appointments Section ────────────────────────────────────────────────
function AppointmentsSection({
  lecturerAppointments, showLecturerBooking, setShowLecturerBooking,
  lecturerBookingForm, setLecturerBookingForm, handleLecturerBookAppointment,
  handleAppointmentStatus,
}: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">{lecturerAppointments.length} appointment{lecturerAppointments.length !== 1 ? "s" : ""} on your calendar</p>
        <button
          onClick={() => setShowLecturerBooking(!showLecturerBooking)}
          className="text-xs px-3.5 py-2 rounded-xl gradient-brand text-white shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
        >
          <PlusCircle size={14} /> Set Appointment
        </button>
      </div>

      {showLecturerBooking && (
        <div className="premium-card p-5 space-y-3">
          <p className="text-sm font-bold">Schedule with student</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select className="text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={lecturerBookingForm.studentId} onChange={(e: any) => setLecturerBookingForm((p: any) => ({ ...p, studentId: e.target.value }))}>
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.matricNo})</option>)}
            </select>
            <input type="date" className="text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={lecturerBookingForm.date} onChange={(e: any) => setLecturerBookingForm((p: any) => ({ ...p, date: e.target.value }))} />
            <select className="text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={lecturerBookingForm.time} onChange={(e: any) => setLecturerBookingForm((p: any) => ({ ...p, time: e.target.value }))}>
              <option value="">Select time</option>
              {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map(t => <option key={t}>{t}</option>)}
            </select>
            <input type="text" placeholder="Reason for appointment…"
              className="text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={lecturerBookingForm.reason} onChange={(e: any) => setLecturerBookingForm((p: any) => ({ ...p, reason: e.target.value }))} />
          </div>
          <button onClick={handleLecturerBookAppointment}
            disabled={!lecturerBookingForm.studentId || !lecturerBookingForm.date || !lecturerBookingForm.time || !lecturerBookingForm.reason}
            className="px-4 py-2 gradient-brand text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed">
            Set Appointment
          </button>
        </div>
      )}

      {lecturerAppointments.length === 0 ? (
        <div className="premium-card p-10 text-center">
          <CalendarDays size={32} className="mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No appointments scheduled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lecturerAppointments.map((apt: Appointment) => (
            <div key={apt.id} className="premium-card p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{apt.studentName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{apt.date} · {apt.time}</p>
                <p className="text-xs mt-1.5 text-foreground/80">{apt.reason}</p>
                {apt.createdBy === "lecturer" && <span className="text-[10px] text-primary font-semibold mt-1 inline-block">Set by you</span>}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                  apt.status === "confirmed" ? "bg-emerald-500/15 text-emerald-600" :
                  apt.status === "pending" ? "bg-amber-500/15 text-amber-600" :
                  apt.status === "completed" ? "bg-secondary text-foreground" :
                  "bg-red-500/15 text-red-600"
                }`}>{apt.status}</span>
                {apt.status === "pending" && apt.createdBy === "student" && (
                  <div className="flex gap-1">
                    <button onClick={() => handleAppointmentStatus(apt.id, "confirmed")}
                      className="text-[10px] px-2 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition">Accept</button>
                    <button onClick={() => handleAppointmentStatus(apt.id, "cancelled")}
                      className="text-[10px] px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Decline</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Cases Section ──────────────────────────────────────────────────────
function CasesSection({ problems }: { problems: ExternalProblem[] }) {
  if (problems.length === 0) {
    return (
      <div className="premium-card p-10 text-center">
        <AlertCircle size={32} className="mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No external problems reported by students.</p>
      </div>
    );
  }
  const grouped = problems.reduce((acc, p) => {
    if (!acc[p.studentId]) acc[p.studentId] = [];
    acc[p.studentId].push(p);
    return acc;
  }, {} as Record<string, typeof problems>);
  const categoryLabels: Record<string, string> = {
    financial: "💰 Financial", health: "🏥 Health", family: "👨‍👩‍👧 Family",
    mental: "🧠 Mental Health", academic: "📚 Academic", other: "📝 Other",
  };
  const severityCls: Record<string, string> = {
    low: "bg-emerald-500/15 text-emerald-600",
    medium: "bg-amber-500/15 text-amber-600",
    high: "bg-red-500/15 text-red-600",
  };
  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([sid, probs]) => {
        const s = students.find(st => st.id === sid);
        if (!s) return null;
        return (
          <div key={sid} className="premium-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-xs">
                {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-semibold text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.matricNo} · {s.course}</p>
              </div>
              <span className="ml-auto text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                {probs.length} issue{probs.length > 1 ? "s" : ""}
              </span>
            </div>
            {probs.map(p => (
              <div key={p.id} className="flex items-start justify-between gap-3 p-3 bg-secondary/40 rounded-xl border border-border/40">
                <div className="min-w-0">
                  <p className="font-semibold text-xs">{categoryLabels[p.category] || p.category}</p>
                  <p className="text-xs mt-1 text-foreground/80">{p.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{p.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${severityCls[p.severity]}`}>
                  {p.severity}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Reports Section ────────────────────────────────────────────────────
function ReportsSection({
  newAssessment, setNewAssessment, handleCreateAssessment, createdAssessments,
  displayStudents, comments, newComment, setNewComment, handleAddComment,
}: any) {
  return (
    <div className="space-y-4">
      <div className="premium-card p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><PlusCircle size={16} className="text-primary" /></div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Create New Assessment</h3>
            <p className="text-[10px] text-muted-foreground">Publish to your selected course</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Title</label>
            <input type="text" placeholder="e.g. Quiz 3 — Transportation Models"
              className="w-full text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={newAssessment.title} onChange={(e: any) => setNewAssessment((p: any) => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Course</label>
            <select className="w-full text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={newAssessment.courseId} onChange={(e: any) => setNewAssessment((p: any) => ({ ...p, courseId: e.target.value }))}>
              <option value="">Select a course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Due Date</label>
            <input type="date"
              className="w-full text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={newAssessment.dueDate} onChange={(e: any) => setNewAssessment((p: any) => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Max Score</label>
            <input type="number"
              className="w-full text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              value={newAssessment.maxScore} onChange={(e: any) => setNewAssessment((p: any) => ({ ...p, maxScore: e.target.value }))} />
          </div>
        </div>
        <button onClick={handleCreateAssessment}
          disabled={!newAssessment.title || !newAssessment.dueDate || !newAssessment.courseId}
          className="px-4 py-2 gradient-brand text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <PlusCircle size={16} /> Create Assessment
        </button>
      </div>

      {createdAssessments.length > 0 && (
        <div className="premium-card p-5 space-y-3">
          <h3 className="text-sm font-bold tracking-tight">Recently Created</h3>
          {createdAssessments.map((a: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary/40 rounded-xl border border-border/40">
              <div>
                <p className="font-semibold text-sm">{a.title}</p>
                <p className="text-[11px] text-muted-foreground">{a.courseCode} · Due {a.dueDate} · Max {a.maxScore}</p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 font-semibold">Active</span>
            </div>
          ))}
        </div>
      )}

      <div className="premium-card p-5 space-y-3">
        <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><MessageSquare size={14} className="text-primary" /></span>
          Quick Feedback
        </h3>
        <p className="text-xs text-muted-foreground -mt-1">Leave a quick note on any student's most recent assessment</p>
        <div className="space-y-2">
          {displayStudents.slice(0, 5).map((s: any) => {
            const last = s.skills.filter((a: any) => a.completed).slice(-1)[0];
            if (!last) return null;
            return (
              <div key={s.id} className="p-3 bg-secondary/40 rounded-xl border border-border/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold">{s.name} · {last.title}</p>
                    <p className="text-[10px] text-muted-foreground">Score {last.score}/{last.maxScore}</p>
                  </div>
                  <StatusBadge status={last.status} />
                </div>
                {comments[`${s.id}-${last.id}`] && (
                  <p className="text-[11px] p-2 bg-primary/5 border border-primary/20 rounded-lg">{comments[`${s.id}-${last.id}`]}</p>
                )}
                <div className="flex gap-2">
                  <input type="text" placeholder="Add a comment…"
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-card border border-border/60 focus:border-primary/40 focus:outline-none"
                    value={newComment} onChange={(e: any) => setNewComment(e.target.value)}
                    onKeyDown={(e: any) => e.key === "Enter" && handleAddComment(s.id, last.id)} />
                  <button onClick={() => handleAddComment(s.id, last.id)}
                    className="px-2.5 py-1.5 gradient-brand text-white rounded-lg text-xs flex items-center gap-1">
                    <MessageSquare size={12} /> Send
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── AI Insights Section ────────────────────────────────────────────────
function AIInsightsSection({ displayStudents, avgScore, avgAttendance, avgAI }: any) {
  const insights = [
    { tone: avgScore >= 70 ? "positive" : "warning", text: `Cohort average score is ${avgScore}% — ${avgScore >= 70 ? "performing strongly" : "needs reinforcement"}.` },
    { tone: avgAttendance >= 85 ? "positive" : "warning", text: `Attendance trending at ${avgAttendance}% across the cohort.` },
    { tone: avgAI > 25 ? "warning" : "info", text: `AI tool usage at ${avgAI}% — ${avgAI > 25 ? "monitor for academic integrity concerns" : "within acceptable bounds"}.` },
    { tone: "info", text: `${displayStudents.filter((s: any) => s.averageScore >= 75).length} students have crossed the mastery threshold.` },
  ];
  const toneCls: Record<string, string> = {
    positive: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  };
  return (
    <div className="space-y-4">
      <div className="premium-card p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Cohort Intelligence</h3>
              <p className="text-xs text-muted-foreground">Auto-generated narrative summary</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className={`p-3.5 rounded-xl border text-sm ${toneCls[ins.tone]}`}>
                {ins.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="premium-card p-5">
        <h3 className="text-sm font-bold tracking-tight mb-3">Student-level signals</h3>
        <div className="space-y-2">
          {displayStudents.map((s: any) => {
            const signal = s.averageScore < 50 ? { tone: "warning", text: "Performance below 50% — recommend intensive support." }
              : s.aiPercentage > 25 ? { tone: "info", text: "Higher than average AI usage — review submissions." }
              : s.attendance < 75 ? { tone: "warning", text: "Attendance dropping — schedule a check-in." }
              : { tone: "positive", text: "On track. Keep monitoring." };
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
                <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {s.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{signal.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Settings Section ───────────────────────────────────────────────────
function SettingsSection({ lecturerName }: { lecturerName: string }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="premium-card p-5">
        <h3 className="text-sm font-bold tracking-tight mb-1">Profile</h3>
        <p className="text-xs text-muted-foreground mb-4">Lecturer account details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Name</label>
            <input type="text" defaultValue={lecturerName}
              className="w-full text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">Faculty</label>
            <input type="text" defaultValue="Faculty of Business"
              className="w-full text-sm px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/60 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10" />
          </div>
        </div>
      </div>
      <div className="premium-card p-5">
        <h3 className="text-sm font-bold tracking-tight mb-1">Notifications</h3>
        <p className="text-xs text-muted-foreground mb-4">Choose what you want to be alerted on</p>
        {["Email digest of risk alerts", "Weekly cohort report", "New appointment requests", "Assessment submissions"].map((t, i) => (
          <label key={i} className="flex items-center justify-between py-2.5 border-t border-border/40 first:border-t-0 cursor-pointer">
            <span className="text-sm">{t}</span>
            <input type="checkbox" defaultChecked={i < 3} className="w-9 h-5 rounded-full appearance-none bg-secondary checked:bg-primary relative cursor-pointer transition before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4" />
          </label>
        ))}
      </div>
    </div>
  );
}

export default LecturerDashboard;

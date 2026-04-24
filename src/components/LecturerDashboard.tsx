import { useState, useEffect } from "react";
import {
  students, students as initialStudents, courses, Course, SkillStatus, Student,
  Appointment, ExternalProblem, externalProblems,
} from "@/data/mockData";
import {
  Users, BookOpen, AlertTriangle, TrendingUp, MessageSquare, ChevronUp, PlusCircle,
  CalendarDays, AlertCircle, LayoutDashboard, BarChart3, FileText, Sparkles,
  Settings as SettingsIcon, LogOut, Menu, X as XIcon,
  ChevronRight, ArrowLeft, GraduationCap, Circle, Trash2, UserPlus, Pencil,
  Building2, Search as SearchIcon, CheckCircle2, Layers,
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
  | "cases" | "reports" | "ai" | "academic" | "settings";

const navItems: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "students", label: "Students", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "cases", label: "Cases / Problems", icon: AlertCircle },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "ai", label: "AI Insights", icon: Sparkles },
  { key: "academic", label: "Academic Management", icon: Building2 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

export interface Faculty {
  id: string;
  name: string;
  code: string;
  createdDate: string;
}

const seedFaculties: Faculty[] = [
  { id: "f1", name: "Faculty of Business & Management", code: "FBM", createdDate: "2024-01-15" },
  { id: "f2", name: "Faculty of Technology", code: "FOT", createdDate: "2024-01-15" },
  { id: "f3", name: "Faculty of Hospitality", code: "FOH", createdDate: "2024-03-20" },
];

interface ManagedCourse extends Course {
  facultyId: string;
}

const seedManagedCourses: ManagedCourse[] = [
  { id: "c1", name: "Logistic and Distribution", code: "DPB3012", students: ["s1", "s2", "s3"], facultyId: "f1" },
  { id: "c2", name: "Commerce", code: "DPB2022", students: ["s4", "s5", "s6"], facultyId: "f1" },
  { id: "c3", name: "Retailing", code: "DPB2033", students: ["s7", "s8", "s9"], facultyId: "f1" },
  { id: "c4", name: "Accounting", code: "DPA1014", students: ["s10", "s11", "s12"], facultyId: "f1" },
  { id: "c5", name: "Entrepreneurship", code: "DPB1015", students: ["s13", "s14", "s15"], facultyId: "f1" },
  { id: "c6", name: "Islamic Banking and Finance", code: "DPB3046", students: ["s16", "s17", "s18"], facultyId: "f1" },
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
  const [studentsList, setStudentsList] = useState<Student[]>(initialStudents);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);

  const handleAddStudent = (s: Student) => setStudentsList(prev => [s, ...prev]);
  const handleRemoveStudent = (id: string) => {
    setStudentsList(prev => prev.filter(s => s.id !== id));
    setConfirmRemoveId(null);
    if (viewingStudentId === id) setViewingStudentId(null);
  };
  const handleUpdateStudent = (updated: Student) => {
    setStudentsList(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditStudentId(null);
  };

  // Academic management state
  const [facultiesList, setFacultiesList] = useState<Faculty[]>(seedFaculties);
  const [coursesList, setCoursesList] = useState<ManagedCourse[]>(seedManagedCourses);
  const [toast, setToast] = useState<{ msg: string; tone: "success" | "danger" } | null>(null);
  const showToast = (msg: string, tone: "success" | "danger" = "success") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2800);
  };

  const displayStudents = selectedCourse
    ? studentsList.filter((s) => selectedCourse.students.includes(s.id))
    : studentsList;

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
    const student = studentsList.find(s => s.id === lecturerBookingForm.studentId);
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
    const cs = studentsList.filter(s => c.students.includes(s.id));
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
    academic: { title: "Academic Management", subtitle: "Manage faculties and courses across the institution" },
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
          </div>
        </div>

        {/* Section content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* If viewing a single student profile, show that overlay regardless of section */}
          {viewingStudentId && active === "students" ? (
            <StudentProfileView
              studentId={viewingStudentId}
              students={studentsList}
              problems={externalProblems.filter(p => p.studentId === viewingStudentId)}
              onBack={() => setViewingStudentId(null)}
              onEdit={() => setEditStudentId(viewingStudentId)}
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
                  onAdd={() => setShowAddStudent(true)}
                  onRequestRemove={setConfirmRemoveId}
                  onRequestEdit={setEditStudentId}
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

              {active === "academic" && (
                <AcademicManagementSection
                  faculties={facultiesList}
                  setFaculties={setFacultiesList}
                  courses={coursesList}
                  setCourses={setCoursesList}
                  showToast={showToast}
                />
              )}

              {active === "settings" && <SettingsSection lecturerName={lecturerName} />}
            </>
          )}
        </div>
      </div>

      {showAddStudent && (
        <AddStudentModal
          existingIds={studentsList.map(s => s.id)}
          onClose={() => setShowAddStudent(false)}
          onCreate={(s) => { handleAddStudent(s); setShowAddStudent(false); }}
        />
      )}

      {confirmRemoveId && (
        <ConfirmRemoveModal
          student={studentsList.find(s => s.id === confirmRemoveId)!}
          onCancel={() => setConfirmRemoveId(null)}
          onConfirm={() => handleRemoveStudent(confirmRemoveId)}
        />
      )}

      {editStudentId && (
        <EditStudentModal
          student={studentsList.find(s => s.id === editStudentId)!}
          onClose={() => setEditStudentId(null)}
          onSave={handleUpdateStudent}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[80] animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${
            toast.tone === "success"
              ? "bg-emerald-500/95 border-emerald-400 text-white"
              : "bg-red-500/95 border-red-400 text-white"
          }`}>
            {toast.tone === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p className="text-sm font-semibold">{toast.msg}</p>
          </div>
        </div>
      )}
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
function StudentsSection({ selectedCourse, setSelectedCourse, displayStudents, onView, onAdd, onRequestRemove, onRequestEdit }: any) {
  return (
    <div className="space-y-5">
      <CourseFilter selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
      <div className="premium-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              {selectedCourse ? selectedCourse.name : "All Students"}
            </h3>
            <p className="text-[10px] text-muted-foreground">Click any row to open the full student profile</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">{displayStudents.length} students</span>
            <button
              onClick={onAdd}
              className="px-3 py-1.5 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <UserPlus size={13} /> Add Student
            </button>
          </div>
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
                <th className="px-3 py-3 text-center font-semibold w-32">Actions</th>
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
                  <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onRequestEdit(student.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                        title="Edit student"
                        aria-label="Edit student"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onRequestRemove(student.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition"
                        title="Remove student"
                        aria-label="Remove student"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
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
function StudentProfileView({ studentId, students, problems, onBack, onEdit }: { studentId: string; students: Student[]; problems: ExternalProblem[]; onBack: () => void; onEdit: () => void }) {
  const student = students.find(s => s.id === studentId);
  if (!student) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={15} /> Back to all students
        </button>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl gradient-brand text-white text-xs font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
        >
          <Pencil size={14} /> Edit Student Profile
        </button>
      </div>
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

// ── Add Student Modal ──────────────────────────────────────────────────
function AddStudentModal({
  existingIds, onClose, onCreate,
}: {
  existingIds: string[];
  onClose: () => void;
  onCreate: (s: Student) => void;
}) {
  const [form, setForm] = useState({
    name: "", matricNo: "", course: courses[0].code,
    email: "", phone: "", attendance: "90", averageScore: "70", aiPercentage: "10",
  });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.name.trim() || !form.matricNo.trim()) {
      setError("Name and matric number are required.");
      return;
    }
    const id = `s-new-${Date.now()}`;
    if (existingIds.includes(id)) {
      setError("Could not generate a unique ID. Try again.");
      return;
    }
    const newStudent: Student = {
      id, name: form.name.trim(), matricNo: form.matricNo.trim().toUpperCase(),
      course: form.course,
      attendance: clampNum(form.attendance, 0, 100, 90),
      aiPercentage: clampNum(form.aiPercentage, 0, 100, 10),
      averageScore: clampNum(form.averageScore, 0, 100, 70),
      skills: [], notifications: [],
      profile: makeBlankProfile(form),
    };
    onCreate(newStudent);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/30">
              <UserPlus size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Add New Student</h3>
              <p className="text-xs text-muted-foreground">Enrol a student into a course</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition">
            <XIcon size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name" required>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="modal-input" placeholder="e.g. Ahmad Farhan" />
          </Field>
          <Field label="Matric number" required>
            <input value={form.matricNo} onChange={e => setForm(p => ({ ...p, matricNo: e.target.value }))}
              className="modal-input" placeholder="e.g. 01DPB22F1099" />
          </Field>
          <Field label="Course">
            <select value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))} className="modal-input">
              {courses.map(c => <option key={c.id} value={c.code}>{c.code} — {c.name}</option>)}
            </select>
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="modal-input" placeholder="name@student.edu" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="modal-input" placeholder="011-234 5678" />
          </Field>
          <Field label="Attendance %">
            <input type="number" min={0} max={100} value={form.attendance}
              onChange={e => setForm(p => ({ ...p, attendance: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Average score %">
            <input type="number" min={0} max={100} value={form.averageScore}
              onChange={e => setForm(p => ({ ...p, averageScore: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="AI usage %">
            <input type="number" min={0} max={100} value={form.aiPercentage}
              onChange={e => setForm(p => ({ ...p, aiPercentage: e.target.value }))} className="modal-input" />
          </Field>
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-600 text-xs border border-red-500/20">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            Cancel
          </button>
          <button onClick={submit} className="px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition flex items-center gap-1.5">
            <UserPlus size={14} /> Add Student
          </button>
        </div>
      </div>
      <style>{`.modal-input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.625rem; background: hsl(var(--background)); border: 1px solid hsl(var(--border)); font-size: 0.8125rem; outline: none; transition: all 0.15s; }
.modal-input:focus { border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15); }`}</style>
    </div>
  );
}

// ── Confirm Remove Modal ───────────────────────────────────────────────
function ConfirmRemoveModal({
  student, onCancel, onConfirm,
}: {
  student: Student;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const initials = student.name.split(" ").map(n => n[0]).slice(0, 2).join("");
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">Remove student?</h3>
            <p className="text-xs text-muted-foreground">This will remove them from the lecturer's roster.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border/60 mb-4">
          <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold">{initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{student.name}</p>
            <p className="text-[11px] text-muted-foreground">{student.matricNo} · {student.course}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition flex items-center gap-1.5">
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function clampNum(v: string, min: number, max: number, fallback: number): number {
  const n = Number(v);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function makeBlankProfile(form: { name: string; matricNo: string; email: string; phone: string }): Student["profile"] {
  return {
    dateOfBirth: "2005-01-01", gender: "Male", nationality: "Malaysian", race: "—", religion: "—",
    icNumber: "—", studentId: form.matricNo.toUpperCase(), identityVerified: "Pending",
    phone: form.phone || "—", email: form.email || `${form.matricNo.toLowerCase()}@student.edu.my`,
    address: "—", postcode: "—", state: "—",
    guardian: "—", guardianPhone: "—", guardianRelation: "Father", guardianEmail: "—",
    previousSchool: "—", previousQualification: "SPM", previousResults: "—", achievements: [],
    academicVerified: "Pending",
    program: "Diploma", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma",
    intake: "June 2026", semester: 1, financialAid: "None",
    registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "—", campus: "Main Campus",
    cgpa: 0, gpa: 0, hostel: false,
    monthlyHouseholdIncome: 0, incomeCategory: "M40", paymentStatus: "Pending", sponsorAmount: 0, financialVerified: "Pending",
    fatherName: "—", fatherOccupation: "—", fatherIncome: 0,
    motherName: "—", motherOccupation: "—", motherIncome: 0,
    siblings: 0, householdSize: 1, parentMaritalStatus: "Married", familyVerified: "Pending",
    bloodType: "—", medicalConditions: [], allergies: [], disabilityStatus: "None",
    healthInsurance: "None", healthVerified: "Pending",
    counselingStatus: "None", mentalHealthVerified: "Pending",
    technicalSkills: [], softSkills: [], careerGoal: "—", cocurricular: [],
    disciplinaryRecord: "Clean", violations: 0,
    documentsUploaded: [],
  };
}

// ── Edit Student Modal ─────────────────────────────────────────────────
function EditStudentModal({
  student, onClose, onSave,
}: {
  student: Student;
  onClose: () => void;
  onSave: (s: Student) => void;
}) {
  const [form, setForm] = useState({
    name: student.name,
    matricNo: student.matricNo,
    course: student.course,
    email: student.profile?.email ?? "",
    phone: student.profile?.phone ?? "",
    advisor: student.profile?.advisor ?? "",
    semester: String(student.profile?.semester ?? 1),
    registrationStatus: (student.profile?.registrationStatus ?? "Registered") as "Registered" | "Deferral" | "Withdrawn",
    enrollmentStatus: (student.profile?.enrollmentStatus ?? "Active") as "Active" | "At-Risk" | "Probation" | "Academic Warning",
    attendance: String(student.attendance),
    averageScore: String(student.averageScore),
    aiPercentage: String(student.aiPercentage),
  });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.name.trim() || !form.matricNo.trim()) {
      setError("Name and matric number are required.");
      return;
    }
    const updated: Student = {
      ...student,
      name: form.name.trim(),
      matricNo: form.matricNo.trim().toUpperCase(),
      course: form.course,
      attendance: clampNum(form.attendance, 0, 100, student.attendance),
      averageScore: clampNum(form.averageScore, 0, 100, student.averageScore),
      aiPercentage: clampNum(form.aiPercentage, 0, 100, student.aiPercentage),
      profile: {
        ...student.profile,
        email: form.email.trim(),
        phone: form.phone.trim(),
        advisor: form.advisor.trim() || "—",
        semester: clampNum(form.semester, 1, 12, student.profile?.semester ?? 1),
        registrationStatus: form.registrationStatus,
        enrollmentStatus: form.enrollmentStatus,
      },
    };
    onSave(updated);
  };

  const initials = student.name.split(" ").map(n => n[0]).slice(0, 2).join("");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/30">
              {initials}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Edit Student Profile</h3>
              <p className="text-xs text-muted-foreground">Update {student.name}'s details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition">
            <XIcon size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name" required>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Matric number" required>
            <input value={form.matricNo} onChange={e => setForm(p => ({ ...p, matricNo: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Course">
            <select value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))} className="modal-input">
              {courses.map(c => <option key={c.id} value={c.code}>{c.code} — {c.name}</option>)}
            </select>
          </Field>
          <Field label="Semester">
            <input type="number" min={1} max={12} value={form.semester}
              onChange={e => setForm(p => ({ ...p, semester: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Advisor">
            <input value={form.advisor} onChange={e => setForm(p => ({ ...p, advisor: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Registration status">
            <select value={form.registrationStatus} onChange={e => setForm(p => ({ ...p, registrationStatus: e.target.value as typeof p.registrationStatus }))} className="modal-input">
              <option value="Registered">Registered</option>
              <option value="Deferral">Deferral</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </Field>
          <Field label="Enrollment status">
            <select value={form.enrollmentStatus} onChange={e => setForm(p => ({ ...p, enrollmentStatus: e.target.value as typeof p.enrollmentStatus }))} className="modal-input">
              <option value="Active">Active</option>
              <option value="At-Risk">At-Risk</option>
              <option value="Probation">Probation</option>
              <option value="Academic Warning">Academic Warning</option>
            </select>
          </Field>
          <Field label="Attendance %">
            <input type="number" min={0} max={100} value={form.attendance}
              onChange={e => setForm(p => ({ ...p, attendance: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="Average score %">
            <input type="number" min={0} max={100} value={form.averageScore}
              onChange={e => setForm(p => ({ ...p, averageScore: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="AI usage %">
            <input type="number" min={0} max={100} value={form.aiPercentage}
              onChange={e => setForm(p => ({ ...p, aiPercentage: e.target.value }))} className="modal-input" />
          </Field>
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-600 text-xs border border-red-500/20">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            Cancel
          </button>
          <button onClick={submit} className="px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition flex items-center gap-1.5">
            <Pencil size={14} /> Save Changes
          </button>
        </div>
      </div>
      <style>{`.modal-input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.625rem; background: hsl(var(--background)); border: 1px solid hsl(var(--border)); font-size: 0.8125rem; outline: none; transition: all 0.15s; }
.modal-input:focus { border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15); }`}</style>
    </div>
  );
}

// ── Academic Management Section ────────────────────────────────────────
type AcademicTab = "faculty" | "course";

function AcademicManagementSection({
  faculties, setFaculties, courses, setCourses, showToast,
}: {
  faculties: Faculty[];
  setFaculties: React.Dispatch<React.SetStateAction<Faculty[]>>;
  courses: ManagedCourse[];
  setCourses: React.Dispatch<React.SetStateAction<ManagedCourse[]>>;
  showToast: (msg: string, tone?: "success" | "danger") => void;
}) {
  const [tab, setTab] = useState<AcademicTab>("faculty");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // Modal state
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ManagedCourse | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<
    { kind: "faculty" | "course"; id: string; name: string } | null
  >(null);
  const [facultyFilter, setFacultyFilter] = useState<string>("");

  // Reset page when search/tab changes
  useEffect(() => { setPage(1); }, [search, tab, facultyFilter]);

  // ── Faculty CRUD ────────────────────────────────────────────────────
  const facultyCount = (fid: string) => courses.filter(c => c.facultyId === fid).length;

  const filteredFaculties = faculties.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCourses = courses
    .filter(c => !facultyFilter || c.facultyId === facultyFilter)
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    );

  const list: any[] = tab === "faculty" ? filteredFaculties : filteredCourses;
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const saveFaculty = (data: { name: string; code: string }) => {
    if (editingFaculty) {
      setFaculties(prev => prev.map(f => f.id === editingFaculty.id ? { ...f, ...data } : f));
      showToast("Faculty updated successfully");
    } else {
      const newF: Faculty = {
        id: `f-${Date.now()}`, ...data,
        createdDate: new Date().toISOString().slice(0, 10),
      };
      setFaculties(prev => [newF, ...prev]);
      showToast("Faculty added successfully");
    }
    setShowFacultyModal(false);
    setEditingFaculty(null);
  };

  const saveCourse = (data: { name: string; code: string; facultyId: string }) => {
    if (editingCourse) {
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...data } : c));
      showToast("Course updated successfully");
    } else {
      const newC: ManagedCourse = {
        id: `c-${Date.now()}`, ...data, students: [],
      };
      setCourses(prev => [newC, ...prev]);
      showToast("Course added successfully");
    }
    setShowCourseModal(false);
    setEditingCourse(null);
  };

  const performDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.kind === "faculty") {
      // also remove courses under this faculty
      setCourses(prev => prev.filter(c => c.facultyId !== confirmDelete.id));
      setFaculties(prev => prev.filter(f => f.id !== confirmDelete.id));
      showToast("Faculty deleted successfully");
    } else {
      setCourses(prev => prev.filter(c => c.id !== confirmDelete.id));
      showToast("Course deleted successfully");
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-xl border border-border w-fit">
        {[
          { key: "faculty", label: "Faculty Management", icon: Building2 },
          { key: "course", label: "Course Management", icon: Layers },
        ].map(t => {
          const Icon = t.icon;
          const active = tab === (t.key as AcademicTab);
          return (
            <button
              key={t.key}
              onClick={() => { setTab(t.key as AcademicTab); setSearch(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                active
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="premium-card p-4 sm:p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tab === "faculty" ? "Search faculty…" : "Search course…"}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary/70 border border-transparent text-sm focus:bg-card focus:border-primary/40 focus:ring-4 focus:ring-primary/10 focus:outline-none transition"
            />
          </div>
          {tab === "course" && (
            <select
              value={facultyFilter}
              onChange={e => setFacultyFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-secondary/70 border border-transparent text-sm focus:bg-card focus:border-primary/40 focus:ring-4 focus:ring-primary/10 focus:outline-none transition"
            >
              <option value="">All Faculties</option>
              {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          )}
          <div className="ml-auto">
            {tab === "faculty" ? (
              <button
                onClick={() => { setEditingFaculty(null); setShowFacultyModal(true); }}
                className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #FF7A59, #FF5C35)", boxShadow: "0 8px 20px -8px rgba(255,92,53,0.55)" }}
              >
                <PlusCircle size={14} /> Add Faculty
              </button>
            ) : (
              <button
                onClick={() => { setEditingCourse(null); setShowCourseModal(true); }}
                className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #FF7A59, #FF5C35)", boxShadow: "0 8px 20px -8px rgba(255,92,53,0.55)" }}
              >
                <PlusCircle size={14} /> Add Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                {tab === "faculty" ? (
                  <>
                    <th className="px-5 py-3 font-semibold">Faculty</th>
                    <th className="px-3 py-3 font-semibold">Code</th>
                    <th className="px-3 py-3 text-center font-semibold">Total Courses</th>
                    <th className="px-3 py-3 font-semibold">Created Date</th>
                    <th className="px-5 py-3 text-right font-semibold w-32">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-5 py-3 font-semibold">Course</th>
                    <th className="px-3 py-3 font-semibold">Code</th>
                    <th className="px-3 py-3 font-semibold">Faculty</th>
                    <th className="px-3 py-3 text-center font-semibold">Students</th>
                    <th className="px-5 py-3 text-right font-semibold w-32">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {tab === "faculty" ? <Building2 size={28} /> : <Layers size={28} />}
                      <p className="text-sm font-medium">No {tab === "faculty" ? "faculties" : "courses"} found</p>
                      <p className="text-xs">Try adjusting your search or add a new {tab === "faculty" ? "faculty" : "course"}.</p>
                    </div>
                  </td>
                </tr>
              ) : tab === "faculty" ? (
                pageItems.map((f: Faculty) => (
                  <tr key={f.id} className="border-b border-border/50 hover:bg-secondary/40 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Building2 size={15} />
                        </div>
                        <p className="text-sm font-semibold text-foreground">{f.name}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="px-2 py-1 rounded-md bg-secondary text-[11px] font-mono font-semibold">{f.code}</span></td>
                    <td className="px-3 py-3 text-center text-sm font-bold">{facultyCount(f.id)}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{f.createdDate}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => { setEditingFaculty(f); setShowFacultyModal(true); }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                          title="Edit"
                        ><Pencil size={14} /></button>
                        <button
                          onClick={() => setConfirmDelete({ kind: "faculty", id: f.id, name: f.name })}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition"
                          title="Delete"
                        ><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                pageItems.map((c: ManagedCourse) => {
                  const fac = faculties.find(f => f.id === c.facultyId);
                  return (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/40 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/70 flex items-center justify-center shrink-0">
                            <BookOpen size={15} />
                          </div>
                          <p className="text-sm font-semibold text-foreground">{c.name}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3"><span className="px-2 py-1 rounded-md bg-secondary text-[11px] font-mono font-semibold">{c.code}</span></td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{fac?.name ?? "—"}</td>
                      <td className="px-3 py-3 text-center text-sm font-bold">{c.students.length}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => { setEditingCourse(c); setShowCourseModal(true); }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                            title="Edit"
                          ><Pencil size={14} /></button>
                          <button
                            onClick={() => setConfirmDelete({ kind: "course", id: c.id, name: c.name })}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition"
                            title="Delete"
                          ><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {list.length > PAGE_SIZE && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-secondary/30">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, list.length)}</span> of <span className="font-semibold text-foreground">{list.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-border text-xs font-semibold hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
              ><ArrowLeft size={13} /></button>
              <span className="px-3 text-xs font-semibold">{safePage} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-border text-xs font-semibold hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
              ><ChevronRight size={13} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFacultyModal && (
        <FacultyModal
          initial={editingFaculty}
          onClose={() => { setShowFacultyModal(false); setEditingFaculty(null); }}
          onSave={saveFaculty}
        />
      )}
      {showCourseModal && (
        <CourseModal
          initial={editingCourse}
          faculties={faculties}
          onClose={() => { setShowCourseModal(false); setEditingCourse(null); }}
          onSave={saveCourse}
        />
      )}
      {confirmDelete && (
        <ConfirmDeleteModal
          kind={confirmDelete.kind}
          name={confirmDelete.name}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={performDelete}
        />
      )}
    </div>
  );
}

// ── Faculty Modal ──────────────────────────────────────────────────────
function FacultyModal({
  initial, onClose, onSave,
}: {
  initial: Faculty | null;
  onClose: () => void;
  onSave: (data: { name: string; code: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim() || !code.trim()) {
      setError("Name and short code are required.");
      return;
    }
    onSave({ name: name.trim(), code: code.trim().toUpperCase() });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, #FF7A59, #FF5C35)" }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">{initial ? "Edit Faculty" : "Add New Faculty"}</h3>
              <p className="text-xs text-muted-foreground">{initial ? "Update faculty details" : "Create a new academic faculty"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition">
            <XIcon size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Faculty name" required>
            <input value={name} onChange={e => setName(e.target.value)} className="modal-input" placeholder="e.g. Faculty of Engineering" />
          </Field>
          <Field label="Short code" required>
            <input value={code} onChange={e => setCode(e.target.value)} className="modal-input" placeholder="e.g. FOE" maxLength={8} />
          </Field>
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-600 text-xs border border-red-500/20">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg flex items-center gap-1.5 transition hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #FF7A59, #FF5C35)", boxShadow: "0 8px 20px -8px rgba(255,92,53,0.55)" }}
          >
            <CheckCircle2 size={14} /> {initial ? "Save Changes" : "Save Faculty"}
          </button>
        </div>
      </div>
      <style>{`.modal-input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.625rem; background: hsl(var(--background)); border: 1px solid hsl(var(--border)); font-size: 0.8125rem; outline: none; transition: all 0.15s; }
.modal-input:focus { border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15); }`}</style>
    </div>
  );
}

// ── Course Modal ───────────────────────────────────────────────────────
function CourseModal({
  initial, faculties, onClose, onSave,
}: {
  initial: ManagedCourse | null;
  faculties: Faculty[];
  onClose: () => void;
  onSave: (data: { name: string; code: string; facultyId: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [facultyId, setFacultyId] = useState(initial?.facultyId ?? (faculties[0]?.id ?? ""));
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim() || !code.trim() || !facultyId) {
      setError("Name, code and faculty are all required.");
      return;
    }
    onSave({ name: name.trim(), code: code.trim().toUpperCase(), facultyId });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, #FF7A59, #FF5C35)" }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">{initial ? "Edit Course" : "Add New Course"}</h3>
              <p className="text-xs text-muted-foreground">{initial ? "Update course details" : "Create a new course offering"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition">
            <XIcon size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Course name" required>
            <input value={name} onChange={e => setName(e.target.value)} className="modal-input" placeholder="e.g. Diploma in Marketing" />
          </Field>
          <Field label="Faculty" required>
            <select value={facultyId} onChange={e => setFacultyId(e.target.value)} className="modal-input">
              {faculties.length === 0 && <option value="">No faculties yet</option>}
              {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </Field>
          <Field label="Course code" required>
            <input value={code} onChange={e => setCode(e.target.value)} className="modal-input" placeholder="e.g. DPM2024" maxLength={12} />
          </Field>
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-600 text-xs border border-red-500/20">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg flex items-center gap-1.5 transition hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #FF7A59, #FF5C35)", boxShadow: "0 8px 20px -8px rgba(255,92,53,0.55)" }}
          >
            <CheckCircle2 size={14} /> {initial ? "Save Changes" : "Save Course"}
          </button>
        </div>
      </div>
      <style>{`.modal-input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.625rem; background: hsl(var(--background)); border: 1px solid hsl(var(--border)); font-size: 0.8125rem; outline: none; transition: all 0.15s; }
.modal-input:focus { border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15); }`}</style>
    </div>
  );
}

// ── Confirm Delete (Faculty/Course) ────────────────────────────────────
function ConfirmDeleteModal({
  kind, name, onCancel, onConfirm,
}: {
  kind: "faculty" | "course";
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">Delete {kind === "faculty" ? "Faculty" : "Course"}?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-foreground/80 mb-1">
          Are you sure you want to delete <span className="font-semibold">{name}</span>?
        </p>
        {kind === "faculty" && (
          <p className="text-xs text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">
            Warning: All courses under this faculty will also be deleted.
          </p>
        )}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition flex items-center gap-1.5 shadow-lg shadow-red-500/30"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default LecturerDashboard;

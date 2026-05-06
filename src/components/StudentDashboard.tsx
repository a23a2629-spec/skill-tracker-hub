import { useState, useRef } from "react";
import { Student, Appointment, ExternalProblem, ReportTemplate, ReportSubmission, ChatMessage } from "@/data/mockData";
import {
  CalendarDays, Bell, BookOpen, Brain, UserCheck, TrendingUp, Clock, PlusCircle,
  Check, X, AlertCircle, Sparkles, Activity, LayoutDashboard, Users, Phone,
  AtSign, FileText, BarChart3, Settings as SettingsIcon, LogOut, Menu, ChevronRight,
  Search, StickyNote, Mail, Calendar, Briefcase, Target, ClipboardList, Heart,
  GraduationCap, MapPin, ShieldCheck, Award, Zap, Circle, User as UserIcon, Upload,
} from "lucide-react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";
import StatusBadge from "./StatusBadge";
import StudentProfile from "./StudentProfile";

interface Props {
  student: Student;
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
  problems: ExternalProblem[];
  onAddProblem: (problem: ExternalProblem) => void;
  onLogout: () => void;
  onProfileUpdate?: (update: Partial<Student["profile"]> & { avatar?: string }) => void;
  sectionRequest?: string;
  profileTabRequest?: string;
  reportTemplates: ReportTemplate[];
  reportSubmissions: ReportSubmission[];
  onAddSubmission: (s: ReportSubmission) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onMarkRead: (threadId: string) => void;
}

type Section =
  | "dashboard" | "profile" | "students" | "contacts" | "cases" | "meetings"
  | "analytics" | "reports" | "ai" | "settings";

const navItems: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "My Profile", icon: UserIcon },
  { key: "students", label: "Students", icon: Users },
  { key: "contacts", label: "Contacts", icon: AtSign },
  { key: "cases", label: "Cases", icon: AlertCircle },
  { key: "meetings", label: "Meetings", icon: CalendarDays },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "ai", label: "AI Insights", icon: Sparkles },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const StudentDashboard = ({
  student, appointments: studentAppointments, onAddAppointment, onUpdateStatus,
  problems, onAddProblem, onLogout, onProfileUpdate, sectionRequest, profileTabRequest,
  reportTemplates, reportSubmissions, onAddSubmission,
  chatMessages, onSendMessage, onMarkRead,
}: Props) => {
  const [active, setActive] = useState<Section>("dashboard");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigate when a search result is clicked (strip timestamp suffix e.g. "profile-1234")
  const prevSecReq = useRef(sectionRequest);
  if (sectionRequest && sectionRequest !== prevSecReq.current) {
    prevSecReq.current = sectionRequest;
    const secName = sectionRequest.replace(/-\d+$/, "") as Section;
    setActive(secName);
  }

  const completedAssessments = student.skills.filter((s) => s.completed);
  const pendingAssessments = student.skills.filter((s) => !s.completed);
  const lecturerSetAppointments = studentAppointments.filter(a => a.createdBy === "lecturer" && a.status === "pending");
  const initials = student.name.split(" ").map(n => n[0]).slice(0, 2).join("");

  const sectionMeta: Record<Section, { title: string; subtitle: string }> = {
    dashboard: { title: "Student Record", subtitle: "Your personal CRM-style overview" },
    profile: { title: "My Profile", subtitle: "Your full academic & personal record" },
    students: { title: "My Cohort", subtitle: "Classmates and peers in your course" },
    contacts: { title: "Contacts", subtitle: "Your lecturers, advisors and support staff" },
    cases: { title: "Cases", subtitle: "Reported issues and ongoing support tickets" },
    meetings: { title: "Meetings", subtitle: "Past and upcoming appointments" },
    analytics: { title: "Analytics", subtitle: "Trends across your assessments" },
    reports: { title: "Reports", subtitle: "Detailed assessment results and feedback" },
    ai: { title: "AI Insights", subtitle: "Smart recommendations from your activity" },
    settings: { title: "Settings", subtitle: "Profile and notification preferences" },
  };
  const meta = sectionMeta[active];

  return (
    <div className="flex bg-[#F5F8FA] min-h-[calc(100vh-65px)]">
      {/* ── Sidebar (HubSpot style: white, light borders, orange active) ── */}
      <aside className="w-[240px] hidden lg:flex flex-col bg-white border-r border-[#E5E7EB] sticky top-[65px] h-[calc(100vh-65px)] shrink-0">
        <SidebarContent
          active={active}
          setActive={setActive}
          studentName={student.name}
          studentMatric={student.matricNo}
          initials={initials}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-[240px] bg-white flex flex-col border-r border-[#E5E7EB]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              active={active}
              setActive={(s) => { setActive(s); setSidebarOpen(false); }}
              studentName={student.name}
              studentMatric={student.matricNo}
              initials={initials}
              onLogout={onLogout}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Sub-header */}
        <div className="sticky top-[65px] z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-3 flex-wrap">
            <button
              className="lg:hidden w-10 h-10 rounded-lg bg-[#F5F8FA] border border-[#E5E7EB] flex items-center justify-center"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-[#213343] tracking-tight">{meta.title}</h1>
              <p className="text-xs text-[#516F90] mt-0.5">{meta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Section content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {active === "dashboard" && (
            <DashboardSection
              student={student} initials={initials}
              activeTab={activeTab} setActiveTab={setActiveTab}
              completedAssessments={completedAssessments}
              pendingAssessments={pendingAssessments}
              studentAppointments={studentAppointments}
              lecturerSetAppointments={lecturerSetAppointments}
              onUpdateStatus={onUpdateStatus}
              problems={problems}
            />
          )}
          {active === "profile" && (
            <SectionShell>
              <StudentProfile student={student} problems={problems} onProfileUpdate={onProfileUpdate} tabRequest={profileTabRequest} />
            </SectionShell>
          )}
          {active === "students" && <CohortSection student={student} />}
          {active === "contacts" && <ContactsSection student={student} chatMessages={chatMessages} onSendMessage={onSendMessage} onMarkRead={onMarkRead} />}
          {active === "cases" && (
            <CasesSection problems={problems} studentId={student.id} onAddProblem={onAddProblem} />
          )}
          {active === "meetings" && (
            <MeetingsSection
              student={student}
              studentAppointments={studentAppointments}
              onAddAppointment={onAddAppointment}
              onUpdateStatus={onUpdateStatus}
            />
          )}
          {active === "analytics" && <AnalyticsSection student={student} />}
          {active === "reports" && <ReportsSection student={student} reportTemplates={reportTemplates} reportSubmissions={reportSubmissions} onAddSubmission={onAddSubmission} />}
          {active === "ai" && <AISection student={student} />}
          {active === "settings" && <SettingsSection student={student} />}
        </div>
      </div>
    </div>
  );
};

// ── Sidebar Content ─────────────────────────────────────────────────────
function SidebarContent({
  active, setActive, studentName, studentMatric, initials, onLogout,
}: {
  active: Section;
  setActive: (s: Section) => void;
  studentName: string;
  studentMatric: string;
  initials: string;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#E5E7EB]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF7A59] to-[#FF5C35] flex items-center justify-center shadow-sm shrink-0">
          <Briefcase size={17} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold leading-tight text-[#213343] truncate">Skills Gap Tracker</p>
          <p className="text-[10px] text-[#7C98B6]">Student CRM</p>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-[#FFF5F2] text-[#FF5C35] shadow-[inset_3px_0_0_#FF7A59]"
                  : "text-[#516F90] hover:bg-[#F5F8FA] hover:text-[#213343]"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[#FF5C35]" : "text-[#7C98B6] group-hover:text-[#516F90]"} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-2.5 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[#F5F8FA] transition mb-1">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white text-[11px] font-bold">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#213343] truncate">{studentName}</p>
            <p className="text-[10px] text-[#7C98B6] truncate">{studentMatric}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] text-[#516F90] hover:bg-[#F5F8FA] hover:text-[#213343] transition"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </>
  );
}

// ── Dashboard Section (Hero + grid + tabs + right panel) ───────────────
function DashboardSection({
  student, initials, activeTab, setActiveTab,
  completedAssessments, pendingAssessments,
  studentAppointments, lecturerSetAppointments, onUpdateStatus, problems,
}: any) {
  const riskScore = computeRiskScore(student);
  const riskLabel = riskScore >= 70 ? "High Risk" : riskScore >= 40 ? "Medium Risk" : "Low Risk";
  const riskTone = riskScore >= 70 ? "bg-red-50 text-red-600 border-red-200"
    : riskScore >= 40 ? "bg-amber-50 text-amber-600 border-amber-200"
    : "bg-emerald-50 text-emerald-600 border-emerald-200";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 max-w-[1500px] mx-auto">
      {/* ── Main column ── */}
      <div className="space-y-5 min-w-0">
        {/* Hero CRM card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#2563EB]/25">
                {initials}
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-[3px] ring-white" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#213343]">{student.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                  <Circle size={6} fill="currentColor" /> Active
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                  <ShieldCheck size={11} /> High Trust
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${riskTone}`}>{riskLabel}</span>
              </div>
              <p className="text-sm text-[#516F90]">
                <span className="font-mono text-[12px] bg-[#F5F8FA] px-1.5 py-0.5 rounded">{student.matricNo}</span>
                <span className="mx-2">·</span>
                {student.course}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <ContactRow icon={AtSign} label="Email" value={`${student.matricNo.toLowerCase()}@student.edu`} />
                <ContactRow icon={Phone} label="Phone" value="+60 12-345 6789" />
                <ContactRow icon={GraduationCap} label="Semester" value="Sem 4 · 2026" />
                <ContactRow icon={MapPin} label="Faculty" value="Business" />
              </div>
            </div>
          </div>
        </div>

        {/* CRM info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="Contact Information" icon={AtSign}>
            <KV k="Matric" v={student.matricNo} />
            <KV k="Course" v={student.course} />
            <KV k="Email" v={`${student.matricNo.toLowerCase()}@student.edu`} />
            <KV k="Phone" v="+60 12-345 6789" />
          </InfoCard>
          <InfoCard title="Academic Performance" icon={Award}>
            <KV k="Average Score" v={`${student.averageScore}%`} accent={student.averageScore >= 75 ? "good" : student.averageScore >= 50 ? "warn" : "bad"} />
            <KV k="Completed" v={`${completedAssessments.length}/${student.skills.length}`} />
            <KV k="Mastered Skills" v={`${countByStatus(student, "mastered")}`} />
            <KV k="Needs Support" v={`${countByStatus(student, "intensive")}`} accent="bad" />
          </InfoCard>
          <InfoCard title="Attendance" icon={UserCheck}>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-3xl font-bold ${student.attendance >= 85 ? "text-emerald-600" : student.attendance >= 70 ? "text-amber-500" : "text-red-500"}`}>
                {student.attendance}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#F5F8FA] overflow-hidden">
              <div
                className={`h-full rounded-full ${student.attendance >= 85 ? "bg-emerald-500" : student.attendance >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${student.attendance}%` }}
              />
            </div>
            <p className="text-[11px] text-[#7C98B6] mt-2">
              {student.attendance >= 85 ? "Excellent — keep it up." : "Below 85% target. Schedule a check-in."}
            </p>
          </InfoCard>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl">
          <div className="border-b border-[#E5E7EB] px-2 sm:px-4 overflow-x-auto">
            <div className="flex gap-1">
              {(["overview", "academic", "financial", "health", "activities", "integrity", "timeline"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3.5 py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === t
                      ? "border-[#FF7A59] text-[#FF5C35]"
                      : "border-transparent text-[#516F90] hover:text-[#213343]"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            {activeTab === "overview" && <OverviewTab student={student} />}
            {activeTab === "academic" && <AcademicTab completedAssessments={completedAssessments} pendingAssessments={pendingAssessments} />}
            {activeTab === "financial" && <PlaceholderTab title="No financial issues" subtitle="Fees and bursary status are up to date." />}
            {activeTab === "health" && <PlaceholderTab title="Health is private" subtitle="No health-related cases reported." />}
            {activeTab === "activities" && <ActivitiesTab student={student} appointments={studentAppointments} />}
            {activeTab === "integrity" && <IntegrityTab student={student} />}
            {activeTab === "timeline" && <ActivityTimeline student={student} appointments={studentAppointments} />}
          </div>
        </div>

        {/* Lecturer requests + pending assessments inline */}
        {lecturerSetAppointments.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 border-l-[3px] border-l-[#FF7A59] space-y-3">
            <h3 className="text-sm font-bold text-[#213343] flex items-center gap-2">
              <CalendarDays size={16} className="text-[#FF7A59]" /> Appointment Requests from Lecturer
            </h3>
            {lecturerSetAppointments.map((apt: Appointment) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-[#F5F8FA] rounded-lg">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#213343]">with {apt.lecturerName}</p>
                  <p className="text-xs text-[#516F90]">{apt.date} · {apt.time}</p>
                  <p className="text-xs mt-1 text-[#213343]/80 truncate">{apt.reason}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => onUpdateStatus(apt.id, "confirmed")}
                    className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex items-center gap-1">
                    <Check size={12} /> Accept
                  </button>
                  <button onClick={() => onUpdateStatus(apt.id, "cancelled")}
                    className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1">
                    <X size={12} /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right action panel ── */}
      <aside className="space-y-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sticky top-[145px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF5F2] flex items-center justify-center">
              <Target size={15} className="text-[#FF5C35]" />
            </div>
            <h3 className="text-sm font-bold text-[#213343]">Next Best Action</h3>
          </div>
          <div className="p-3.5 rounded-lg bg-gradient-to-br from-[#FFF5F2] to-white border border-[#FFD4C7]">
            <p className="text-sm font-semibold text-[#213343] mb-1">
              {student.attendance < 75 ? "Schedule intervention session" :
                student.averageScore < 60 ? "Book tutoring with Dr. Zainab" :
                "Continue current pace"}
            </p>
            <p className="text-xs text-[#516F90] leading-relaxed">
              Suggested by AI based on this week's signals.
            </p>
            <button className="mt-3 w-full px-3 py-2 bg-[#FF7A59] hover:bg-[#FF8F73] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition">
              <Zap size={12} /> Take action
            </button>
          </div>

          <div className="mt-5 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Sparkles size={15} className="text-[#2563EB]" />
            </div>
            <h3 className="text-sm font-bold text-[#213343]">AI Recommendation</h3>
          </div>
          <ul className="space-y-2 text-xs">
            {buildRecommendations(student).map((r, i) => (
              <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F5F8FA]">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  r.tone === "warning" ? "bg-amber-500" : r.tone === "bad" ? "bg-red-500" : "bg-emerald-500"
                }`} />
                <span className="text-[#213343]/85 leading-relaxed">{r.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ClipboardList size={15} className="text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-[#213343]">Tasks</h3>
          </div>
          <div className="space-y-1.5">
            {[
              { label: "Follow up with advisor", done: false },
              { label: "Review Quiz 2 grade", done: false },
              { label: "Submit attendance excuse", done: true },
              { label: "Confirm next appointment", done: false },
            ].map((t, i) => (
              <label key={i} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[#F5F8FA] cursor-pointer transition">
                <input type="checkbox" defaultChecked={t.done} className="w-4 h-4 accent-[#FF7A59]" />
                <span className={`text-xs ${t.done ? "line-through text-[#7C98B6]" : "text-[#213343]"}`}>{t.label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────
function ContactRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 min-w-0 text-left">
      <div className="w-7 h-7 rounded-md bg-[#F5F8FA] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-[#516F90]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[#7C98B6] font-semibold">{label}</p>
        <p className="text-xs text-[#213343] font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, primary }: { icon: React.ElementType; label: string; primary?: boolean }) {
  return (
    <button
      className={`px-3.5 py-2 rounded-md text-[12px] font-semibold flex items-center gap-1.5 transition ${
        primary
          ? "bg-[#FF7A59] hover:bg-[#FF8F73] text-white shadow-sm"
          : "bg-white border border-[#E5E7EB] text-[#213343] hover:bg-[#F5F8FA]"
      }`}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

function InfoCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E5E7EB]/70">
        <div className="w-7 h-7 rounded-md bg-[#F5F8FA] flex items-center justify-center">
          <Icon size={14} className="text-[#516F90]" />
        </div>
        <h3 className="text-[13px] font-bold text-[#213343]">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function KV({ k, v, accent }: { k: string; v: string | number; accent?: "good" | "warn" | "bad" }) {
  const cls = accent === "good" ? "text-emerald-600" : accent === "warn" ? "text-amber-600" : accent === "bad" ? "text-red-500" : "text-[#213343]";
  return (
    <div className="flex items-center justify-between text-[13px] py-1">
      <span className="text-[#516F90]">{k}</span>
      <span className={`font-semibold ${cls}`}>{v}</span>
    </div>
  );
}

function DocRow({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[#F5F8FA] cursor-pointer transition">
      <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
        <FileText size={13} className="text-[#2563EB]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-[#213343] truncate">{name}</p>
        <p className="text-[10px] text-[#7C98B6]">Uploaded {date}</p>
      </div>
      <ChevronRight size={13} className="text-[#7C98B6]" />
    </div>
  );
}

// ── Tab content ────────────────────────────────────────────────────────
function OverviewTab({ student }: { student: Student }) {
  const items = [
    { label: "Attendance", value: `${student.attendance}%`, icon: UserCheck, tone: student.attendance >= 85 ? "good" : student.attendance >= 70 ? "warn" : "bad" },
    { label: "Average Score", value: `${student.averageScore}%`, icon: TrendingUp, tone: student.averageScore >= 75 ? "good" : student.averageScore >= 50 ? "warn" : "bad" },
    { label: "AI Usage", value: `${student.aiPercentage}%`, icon: Brain, tone: student.aiPercentage > 25 ? "warn" : "good" },
    { label: "Skills Mastered", value: countByStatus(student, "mastered"), icon: Award, tone: "good" },
  ];
  const toneCls = { good: "text-emerald-600 bg-emerald-50", warn: "text-amber-600 bg-amber-50", bad: "text-red-500 bg-red-50" } as const;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <div key={i} className="p-3.5 rounded-lg bg-[#F5F8FA] border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-[#7C98B6] font-bold">{it.label}</p>
            <div className={`w-7 h-7 rounded-md ${toneCls[it.tone as keyof typeof toneCls]} flex items-center justify-center`}>
              <it.icon size={13} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#213343]">{it.value}</p>
        </div>
      ))}
    </div>
  );
}

function AcademicTab({ completedAssessments, pendingAssessments }: any) {
  return (
    <div className="space-y-2.5">
      {pendingAssessments.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-wider text-[#7C98B6] font-bold">Upcoming</p>
          {pendingAssessments.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-[#F5F8FA] rounded-lg border border-[#E5E7EB]">
              <div>
                <p className="text-sm font-semibold text-[#213343]">{a.title}</p>
                <p className="text-xs text-[#516F90]">Due {a.dueDate}</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">Pending</span>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-1.5 pt-2">
        <p className="text-[11px] uppercase tracking-wider text-[#7C98B6] font-bold">Completed</p>
        {completedAssessments.map((a: any) => (
          <div key={a.id} className="flex items-center justify-between p-3 bg-[#F5F8FA] rounded-lg border border-[#E5E7EB]">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#213343] truncate">{a.title}</p>
              <p className="text-xs text-[#516F90]">{a.date}</p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-sm font-bold text-[#213343]">{a.score}<span className="text-[#7C98B6] text-xs">/{a.maxScore}</span></span>
              <StatusBadge status={a.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivitiesTab({ student, appointments }: { student: Student; appointments: Appointment[] }) {
  const events = [
    ...student.notifications.map(n => ({ kind: n.type, text: n.message, date: n.date })),
    ...appointments.map(a => ({ kind: "appointment" as const, text: `Appointment with ${a.lecturerName} (${a.status})`, date: a.date })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);

  return (
    <div className="space-y-2">
      {events.map((e, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-[#F5F8FA] rounded-lg border border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
            <Activity size={13} className="text-[#516F90]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-[#213343]">{e.text}</p>
            <p className="text-[11px] text-[#7C98B6]">{e.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IntegrityTab({ student }: { student: Student }) {
  const score = 100 - student.aiPercentage;
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-lg bg-[#F5F8FA] border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[#213343]">Academic Integrity Score</p>
          <span className={`text-2xl font-bold ${score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-500"}`}>{score}%</span>
        </div>
        <div className="h-2 rounded-full bg-white overflow-hidden">
          <div className={`h-full rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score}%` }} />
        </div>
        <p className="text-xs text-[#7C98B6] mt-2">
          Based on detected AI usage of {student.aiPercentage}% across submissions.
        </p>
      </div>
    </div>
  );
}

function PlaceholderTab({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center py-8">
      <Heart size={28} className="mx-auto text-[#7C98B6] mb-2" />
      <p className="text-sm font-semibold text-[#213343]">{title}</p>
      <p className="text-xs text-[#516F90] mt-0.5">{subtitle}</p>
    </div>
  );
}

// ── Activity Timeline ─────────────────────────────────────────────────
function ActivityTimeline({ student, appointments }: { student: Student; appointments: Appointment[] }) {
  type Event = { date: string; title: string; subtitle: string; tone: "primary" | "mastered" | "developing" | "intensive" };
  const events: Event[] = [];
  student.skills.filter(s => s.completed).slice(0, 3).forEach(s => events.push({
    date: s.date, title: `Completed ${s.title}`, subtitle: `Scored ${s.score}/${s.maxScore} · ${s.status}`,
    tone: s.status === "mastered" ? "mastered" : s.status === "developing" ? "developing" : "intensive",
  }));
  appointments.slice(0, 2).forEach(a => events.push({
    date: a.date, title: `Appointment with ${a.lecturerName}`, subtitle: `${a.time} · ${a.status}`, tone: "primary",
  }));
  student.notifications.slice(0, 3).forEach(n => events.push({ date: n.date, title: n.message, subtitle: n.type, tone: "developing" }));
  events.sort((a, b) => (a.date < b.date ? 1 : -1));

  const toneCls = {
    primary: "bg-[#2563EB]", mastered: "bg-emerald-500",
    developing: "bg-[#FF7A59]", intensive: "bg-red-500",
  };

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-[#FF7A59]/50 via-[#E5E7EB] to-transparent" />
      <div className="space-y-4">
        {events.slice(0, 8).map((e, i) => (
          <div key={i} className="relative">
            <div className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full ${toneCls[e.tone]} ring-4 ring-white`} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#213343] leading-tight">{e.title}</p>
                <p className="text-xs text-[#516F90] mt-0.5">{e.subtitle}</p>
              </div>
              <span className="text-[11px] text-[#7C98B6] whitespace-nowrap font-medium">{e.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Other Sections ─────────────────────────────────────────────────────
function SectionShell({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1500px] mx-auto space-y-4">{children}</div>;
}

function CohortSection({ student }: { student: Student }) {
  const peers = [
    { name: "Lim Chee Keong", id: "01DPA22F1010", score: 82 },
    { name: "Nurul Aisyah", id: "01DPB22F1020", score: 76 },
    { name: "Tan Wei Ming", id: "01DPB22F1031", score: 64 },
    { name: "Siti Aminah", id: "01DPB22F1042", score: 90 },
  ];
  return (
    <SectionShell>
      <div className="bg-white border border-[#E5E7EB] rounded-xl">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#213343]">Peers in {student.course}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF5F2] text-[#FF5C35] font-semibold">{peers.length} peers</span>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {peers.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-4 hover:bg-[#F5F8FA] transition">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold">
                {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#213343] truncate">{p.name}</p>
                <p className="text-[11px] text-[#7C98B6]">{p.id}</p>
              </div>
              <span className={`text-sm font-bold ${p.score >= 75 ? "text-emerald-600" : p.score >= 50 ? "text-amber-600" : "text-red-500"}`}>{p.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

const CHAT_CONTACTS = [
  { name: "Dr. Zainab binti Mohd Noor", role: "Course Lecturer", email: "zainab@university.edu" },
  { name: "Dr. Ahmad Ridzuan", role: "Academic Advisor", email: "ridzuan@university.edu" },
  { name: "Counselling Office", role: "Student Support", email: "counselling@university.edu" },
];

function ContactsSection({ student, chatMessages, onSendMessage, onMarkRead }: {
  student: Student;
  chatMessages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onMarkRead: (threadId: string) => void;
}) {
  const [openChat, setOpenChat] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getThreadId = (contactName: string) => `${student.id}|${contactName}`;

  const openThread = (contactName: string) => {
    const tid = getThreadId(contactName);
    if (openChat === contactName) { setOpenChat(null); return; }
    setOpenChat(contactName);
    onMarkRead(tid);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const sendMsg = (contactName: string) => {
    const body = (drafts[contactName] ?? "").trim();
    if (!body) return;
    onSendMessage({
      id: `msg-${Date.now()}`,
      threadId: getThreadId(contactName),
      studentId: student.id,
      studentName: student.name,
      contactName,
      senderRole: "student",
      body,
      timestamp: new Date().toISOString(),
      read: true,
    });
    setDrafts(d => ({ ...d, [contactName]: "" }));
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <SectionShell>
      {CHAT_CONTACTS.map((c, i) => {
        const tid = getThreadId(c.name);
        const msgs = chatMessages.filter(m => m.threadId === tid);
        const unread = msgs.filter(m => m.senderRole === "lecturer" && !m.read).length;
        const isOpen = openChat === c.name;
        return (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF7A59] to-[#FF5C35] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#213343]">{c.name}</p>
                <p className="text-xs text-[#516F90]">{c.role}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#516F90]">
                <AtSign size={13} /> {c.email}
              </div>
              <button
                onClick={() => openThread(c.name)}
                className={`relative px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isOpen ? "bg-[#2563EB] text-white" : "border border-[#E5E7EB] text-[#213343] hover:bg-[#F5F8FA]"
                }`}>
                <Mail size={13} />
                {isOpen ? "Close" : "Chat"}
                {unread > 0 && !isOpen && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">{unread}</span>
                )}
              </button>
            </div>

            {isOpen && (
              <div className="border-t border-[#E5E7EB]">
                <div className="h-56 overflow-y-auto px-4 py-3 space-y-2 bg-[#F5F8FA]">
                  {msgs.length === 0 && (
                    <p className="text-xs text-[#7C98B6] text-center py-6">No messages yet. Say hello!</p>
                  )}
                  {msgs.map(m => (
                    <div key={m.id} className={`flex ${m.senderRole === "student" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        m.senderRole === "student"
                          ? "bg-[#2563EB] text-white rounded-br-sm"
                          : "bg-white border border-[#E5E7EB] text-[#213343] rounded-bl-sm"
                      }`}>
                        <p>{m.body}</p>
                        <p className={`text-[9px] mt-0.5 ${m.senderRole === "student" ? "text-blue-200" : "text-[#7C98B6]"}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 px-4 py-3 border-t border-[#E5E7EB] bg-white">
                  <input
                    type="text"
                    placeholder="Type a message…"
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F5F8FA] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                    value={drafts[c.name] ?? ""}
                    onChange={e => setDrafts(d => ({ ...d, [c.name]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && sendMsg(c.name)}
                  />
                  <button
                    onClick={() => sendMsg(c.name)}
                    disabled={!(drafts[c.name] ?? "").trim()}
                    className="px-3 py-2 bg-[#2563EB] text-white rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center gap-1">
                    <Mail size={12} /> Send
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </SectionShell>
  );
}

function CasesSection({ problems, studentId, onAddProblem }: { problems: ExternalProblem[]; studentId: string; onAddProblem: (p: ExternalProblem) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "" as ExternalProblem["category"] | "", description: "", severity: "" as ExternalProblem["severity"] | "" });
  const handleSubmit = () => {
    if (!form.category || !form.description || !form.severity) return;
    onAddProblem({
      id: `ep-${Date.now()}`, studentId,
      category: form.category as ExternalProblem["category"],
      description: form.description,
      date: new Date().toISOString().split("T")[0],
      severity: form.severity as ExternalProblem["severity"],
    });
    setForm({ category: "", description: "", severity: "" });
    setShowForm(false);
  };
  const sevCls: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-red-50 text-red-600 border-red-200",
  };
  const catLabels: Record<string, string> = {
    financial: "Financial", health: "Health", family: "Family",
    mental: "Mental Health", academic: "Academic", other: "Other",
  };
  return (
    <SectionShell>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-[#516F90]">{problems.length} case{problems.length !== 1 ? "s" : ""} on file</p>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-2 bg-[#FF7A59] hover:bg-[#FF8F73] text-white rounded-md text-xs font-semibold flex items-center gap-1.5">
          <PlusCircle size={13} /> Report Issue
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))}
              className="text-sm px-3 py-2 rounded-md bg-white border border-[#E5E7EB] focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/15 focus:outline-none">
              <option value="">Select category</option>
              {Object.entries(catLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value as any }))}
              className="text-sm px-3 py-2 rounded-md bg-white border border-[#E5E7EB] focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/15 focus:outline-none">
              <option value="">Severity</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <textarea placeholder="Describe your situation…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-md bg-white border border-[#E5E7EB] focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/15 focus:outline-none min-h-[80px]" />
          <button onClick={handleSubmit} disabled={!form.category || !form.description || !form.severity}
            className="px-4 py-2 bg-[#FF7A59] hover:bg-[#FF8F73] text-white rounded-md text-sm font-semibold disabled:opacity-50">
            Submit Report
          </button>
        </div>
      )}

      {problems.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center">
          <ShieldCheck size={28} className="mx-auto text-emerald-500 mb-2" />
          <p className="text-sm font-semibold text-[#213343]">No active cases</p>
          <p className="text-xs text-[#516F90] mt-0.5">You're all clear. Keep going!</p>
        </div>
      ) : (
        problems.map(p => (
          <div key={p.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#213343]">{catLabels[p.category]}</p>
              <p className="text-xs text-[#516F90] mt-1">{p.description}</p>
              <p className="text-[11px] text-[#7C98B6] mt-1">Reported {p.date}</p>
            </div>
            <span className={`text-[11px] px-2 py-1 rounded-full font-bold border shrink-0 ${sevCls[p.severity]}`}>{p.severity}</span>
          </div>
        ))
      )}
    </SectionShell>
  );
}

function MeetingsSection({ student, studentAppointments, onAddAppointment, onUpdateStatus }: any) {
  const [showBooking, setShowBooking] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", reason: "" });
  const handleBook = () => {
    if (!form.date || !form.time || !form.reason) return;
    onAddAppointment({
      id: `apt-s-${Date.now()}`, studentId: student.id, studentName: student.name,
      lecturerName: "Dr. Zainab", date: form.date, time: form.time, reason: form.reason,
      status: "pending", createdBy: "student",
    });
    setForm({ date: "", time: "", reason: "" });
    setShowBooking(false);
  };
  const statusCls: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    completed: "bg-[#F5F8FA] text-[#516F90]",
    cancelled: "bg-red-50 text-red-600",
  };
  return (
    <SectionShell>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-[#516F90]">{studentAppointments.length} meeting{studentAppointments.length !== 1 ? "s" : ""} scheduled</p>
        <button onClick={() => setShowBooking(!showBooking)} className="px-3 py-2 bg-[#FF7A59] hover:bg-[#FF8F73] text-white rounded-md text-xs font-semibold flex items-center gap-1.5">
          <PlusCircle size={13} /> Book Appointment
        </button>
      </div>
      {showBooking && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold text-[#213343]">Book with Dr. Zainab</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="text-sm px-3 py-2 rounded-md bg-white border border-[#E5E7EB] focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/15 focus:outline-none" />
            <select value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
              className="text-sm px-3 py-2 rounded-md bg-white border border-[#E5E7EB] focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/15 focus:outline-none">
              <option value="">Select time</option>
              {["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <input type="text" placeholder="Reason…" value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-md bg-white border border-[#E5E7EB] focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/15 focus:outline-none" />
          <button onClick={handleBook} disabled={!form.date || !form.time || !form.reason}
            className="px-4 py-2 bg-[#FF7A59] hover:bg-[#FF8F73] text-white rounded-md text-sm font-semibold disabled:opacity-50">
            Submit Request
          </button>
        </div>
      )}
      {studentAppointments.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center">
          <CalendarDays size={28} className="mx-auto text-[#7C98B6] mb-2" />
          <p className="text-sm text-[#516F90]">No appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {studentAppointments.map((apt: Appointment) => (
            <div key={apt.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#213343]">with {apt.lecturerName}</p>
                <p className="text-xs text-[#516F90] mt-0.5">{apt.date} · {apt.time}</p>
                <p className="text-xs mt-1.5 text-[#213343]/80">{apt.reason}</p>
                {apt.createdBy === "lecturer" && <span className="text-[10px] text-[#FF5C35] font-semibold">Set by lecturer</span>}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${statusCls[apt.status]}`}>{apt.status}</span>
                {apt.status === "pending" && apt.createdBy === "lecturer" && (
                  <div className="flex gap-1">
                    <button onClick={() => onUpdateStatus(apt.id, "confirmed")} className="text-[10px] px-2 py-1 bg-emerald-500 text-white rounded-md">Accept</button>
                    <button onClick={() => onUpdateStatus(apt.id, "cancelled")} className="text-[10px] px-2 py-1 bg-red-500 text-white rounded-md">Decline</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

function AnalyticsSection({ student }: { student: Student }) {
  const completed = student.skills.filter(s => s.completed);
  const data = completed.length > 0
    ? completed.map(s => ({ name: s.title.length > 12 ? s.title.slice(0, 12) + "…" : s.title, score: Math.round((s.score / s.maxScore) * 100) }))
    : Array.from({ length: 6 }).map((_, i) => ({ name: `W${i + 1}`, score: 60 + Math.round(Math.sin(i) * 15 + i * 3) }));
  return (
    <SectionShell>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#213343]">Performance Trend</h3>
            <p className="text-[11px] text-[#7C98B6]">Assessment scores over time</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">{student.averageScore}% avg</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-orange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF7A59" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#FF7A59" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#7C98B6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#7C98B6" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#FF7A59" strokeWidth={2.5} fill="url(#grad-orange)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(["mastered", "developing", "intensive"] as const).map(s => {
          const c = countByStatus(student, s);
          const tone = s === "mastered" ? "text-emerald-600 bg-emerald-50" : s === "developing" ? "text-amber-600 bg-amber-50" : "text-red-500 bg-red-50";
          return (
            <div key={s} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <p className="text-[11px] uppercase tracking-wider text-[#7C98B6] font-bold">{s}</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-3xl font-bold text-[#213343]">{c}</p>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${tone}`}>skills</div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

function ReportsSection({ student, reportTemplates, reportSubmissions, onAddSubmission }: {
  student: Student;
  reportTemplates: ReportTemplate[];
  reportSubmissions: ReportSubmission[];
  onAddSubmission: (s: ReportSubmission) => void;
}) {
  const mySubmissions = reportSubmissions.filter(s => s.studentId === student.id);
  const [submitFor, setSubmitFor] = useState<string | null>(null);
  const [standaloneTitle, setStandaloneTitle] = useState("");
  const [standaloneDesc, setStandaloneDesc] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (templateId?: string) => {
    if (!selectedFile) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const template = templateId ? reportTemplates.find(t => t.id === templateId) : null;
      const sub: ReportSubmission = {
        id: `sub-${Date.now()}`,
        templateId,
        studentId: student.id,
        studentName: student.name,
        title: template ? template.title : standaloneTitle,
        description: standaloneDesc || undefined,
        fileName: selectedFile.name,
        fileDataUrl: reader.result as string,
        fileType: selectedFile.type,
        submittedDate: new Date().toISOString().slice(0, 10),
        status: "submitted",
      };
      onAddSubmission(sub);
      setDone(templateId ?? "standalone");
      setSubmitFor(null);
      setSelectedFile(null);
      setStandaloneTitle("");
      setStandaloneDesc("");
      setUploading(false);
      setTimeout(() => setDone(null), 3000);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <SectionShell>
      {done && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold">
          <Check size={14} /> File submitted successfully!
        </div>
      )}

      {reportTemplates.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#213343] flex items-center gap-2">
            <FileText size={15} className="text-[#2563EB]" /> Assigned Reports
          </h3>
          <div className="space-y-2">
            {reportTemplates.map(t => {
              const already = mySubmissions.find(s => s.templateId === t.id);
              return (
                <div key={t.id} className="p-3 rounded-xl border border-[#E5E7EB] bg-[#F5F8FA]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#213343]">{t.title}</p>
                      {t.description && <p className="text-[11px] text-[#516F90] mt-0.5">{t.description}</p>}
                      <p className="text-[10px] text-[#7C98B6] mt-0.5 capitalize">{t.type}{t.dueDate ? ` · Due ${t.dueDate}` : ""}</p>
                    </div>
                    {already ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold whitespace-nowrap">✓ Submitted</span>
                    ) : (
                      <button onClick={() => setSubmitFor(submitFor === t.id ? null : t.id)}
                        className="text-[11px] px-3 py-1 rounded-lg bg-[#2563EB] text-white font-semibold whitespace-nowrap">
                        Submit File
                      </button>
                    )}
                  </div>
                  {already && already.lecturerNote && (
                    <p className="text-[10px] mt-1.5 text-[#516F90]">
                      Feedback: <span className="italic">"{already.lecturerNote}"</span>
                      {already.status !== "submitted" && <span className="ml-1 font-semibold capitalize text-[#2563EB]">({already.status})</span>}
                    </p>
                  )}
                  {submitFor === t.id && (
                    <div className="mt-3 space-y-2 border-t border-[#E5E7EB] pt-3">
                      <input type="file"
                        className="block w-full text-xs text-[#516F90] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EEF4FF] file:text-[#2563EB] cursor-pointer"
                        onChange={handleFileChange} />
                      <div className="flex gap-2">
                        <button onClick={() => handleSubmit(t.id)} disabled={!selectedFile || uploading}
                          className="px-3 py-1.5 bg-[#2563EB] text-white text-xs rounded-lg font-semibold disabled:opacity-50">
                          {uploading ? "Uploading…" : "Confirm Upload"}
                        </button>
                        <button onClick={() => { setSubmitFor(null); setSelectedFile(null); }}
                          className="px-3 py-1.5 border border-[#E5E7EB] text-[#516F90] text-xs rounded-lg">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#213343] flex items-center gap-2">
            <Upload size={15} className="text-[#FF7A59]" /> Submit a Report
          </h3>
          {submitFor !== "standalone" && (
            <button onClick={() => setSubmitFor("standalone")}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#2563EB] text-[#2563EB] font-semibold flex items-center gap-1">
              <PlusCircle size={12} /> New Submission
            </button>
          )}
        </div>
        {submitFor === "standalone" && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#7C98B6] font-semibold block mb-1">Report Title *</label>
              <input type="text" placeholder="e.g. Progress Report Week 5"
                className="w-full text-sm px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F5F8FA] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                value={standaloneTitle} onChange={e => setStandaloneTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#7C98B6] font-semibold block mb-1">Notes (optional)</label>
              <textarea placeholder="Brief notes about this file…"
                className="w-full text-sm px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#F5F8FA] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none h-16"
                value={standaloneDesc} onChange={e => setStandaloneDesc(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#7C98B6] font-semibold block mb-1">Attach File *</label>
              <input type="file"
                className="block w-full text-xs text-[#516F90] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EEF4FF] file:text-[#2563EB] cursor-pointer"
                onChange={handleFileChange} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleSubmit()} disabled={!selectedFile || !standaloneTitle || uploading}
                className="px-4 py-2 bg-[#2563EB] text-white text-xs rounded-lg font-semibold disabled:opacity-50">
                {uploading ? "Uploading…" : "Submit Report"}
              </button>
              <button onClick={() => { setSubmitFor(null); setSelectedFile(null); setStandaloneTitle(""); setStandaloneDesc(""); }}
                className="px-4 py-2 border border-[#E5E7EB] text-[#516F90] text-xs rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}
        {reportTemplates.length === 0 && submitFor !== "standalone" && (
          <p className="text-xs text-[#7C98B6]">Use <span className="font-semibold">New Submission</span> to send a file to your lecturer without an assignment.</p>
        )}
      </div>

      {mySubmissions.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#213343]">My Submissions ({mySubmissions.length})</h3>
          <div className="space-y-2">
            {mySubmissions.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-[#F5F8FA] rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#213343] truncate">{s.title}</p>
                    <p className="text-[10px] text-[#7C98B6] truncate">{s.fileName} · {s.submittedDate}</p>
                    {s.lecturerNote && <p className="text-[10px] text-[#516F90] mt-0.5 italic">"{s.lecturerNote}"</p>}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ml-2 ${
                  s.status === "acknowledged" ? "bg-emerald-100 text-emerald-700" :
                  s.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  );
}

function AISection({ student }: { student: Student }) {
  const recs = buildRecommendations(student);
  return (
    <SectionShell>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-[#FF7A59]/20 to-[#2563EB]/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF7A59] to-[#FF5C35] flex items-center justify-center shadow-lg shadow-[#FF7A59]/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#213343]">Your AI Insights</h3>
              <p className="text-xs text-[#516F90]">Personalised based on your latest activity</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recs.map((r, i) => (
              <div key={i} className={`p-3.5 rounded-lg border text-sm ${
                r.tone === "warning" ? "bg-amber-50 text-amber-800 border-amber-200" :
                r.tone === "bad" ? "bg-red-50 text-red-700 border-red-200" :
                "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}>
                {r.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function SettingsSection({ student }: { student: Student }) {
  return (
    <SectionShell>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 max-w-2xl">
        <h3 className="text-sm font-bold text-[#213343] mb-1">Profile</h3>
        <p className="text-xs text-[#516F90] mb-4">Read-only details from your enrolment record</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ["Name", student.name], ["Matric", student.matricNo],
            ["Course", student.course], ["Email", `${student.matricNo.toLowerCase()}@student.edu`],
          ].map(([k, v]) => (
            <div key={k}>
              <label className="text-[10px] uppercase tracking-wider text-[#7C98B6] font-bold block mb-1">{k}</label>
              <input value={v} readOnly className="w-full text-sm px-3 py-2.5 rounded-md bg-[#F5F8FA] border border-[#E5E7EB] text-[#213343]" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 max-w-2xl">
        <h3 className="text-sm font-bold text-[#213343] mb-1">Notifications</h3>
        <p className="text-xs text-[#516F90] mb-3">Choose what you want to be alerted on</p>
        {["Assessment reminders", "Lecturer comments", "Appointment changes", "Weekly progress digest"].map((t, i) => (
          <label key={i} className="flex items-center justify-between py-2.5 border-t border-[#E5E7EB] first:border-t-0 cursor-pointer">
            <span className="text-sm text-[#213343]">{t}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#FF7A59]" />
          </label>
        ))}
      </div>
    </SectionShell>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────
function countByStatus(student: Student, status: "mastered" | "developing" | "intensive") {
  return student.skills.filter(a => a.completed).flatMap(a => a.skills).filter(s => s.status === status).length;
}

function computeRiskScore(student: Student): number {
  let risk = 0;
  if (student.attendance < 75) risk += 35;
  else if (student.attendance < 85) risk += 15;
  if (student.averageScore < 50) risk += 35;
  else if (student.averageScore < 70) risk += 15;
  if (student.aiPercentage > 25) risk += 20;
  return Math.min(risk, 100);
}

function buildRecommendations(student: Student): { tone: "good" | "warning" | "bad"; text: string }[] {
  const out: { tone: "good" | "warning" | "bad"; text: string }[] = [];
  if (student.attendance < 75) out.push({ tone: "bad", text: `Attendance dropped to ${student.attendance}% — consider an attendance improvement plan.` });
  else if (student.attendance < 85) out.push({ tone: "warning", text: `Attendance at ${student.attendance}% — monitor for further decline.` });
  else out.push({ tone: "good", text: `Excellent attendance at ${student.attendance}%. Keep it up.` });

  if (student.averageScore < 50) out.push({ tone: "bad", text: `Average score ${student.averageScore}% — book intensive tutoring.` });
  else if (student.averageScore < 70) out.push({ tone: "warning", text: `Score ${student.averageScore}% trending below mastery — review weak topics.` });
  else out.push({ tone: "good", text: `Strong score of ${student.averageScore}% — performing above cohort.` });

  if (student.aiPercentage > 25) out.push({ tone: "warning", text: `AI usage at ${student.aiPercentage}% exceeds threshold — focus on original work.` });
  else out.push({ tone: "good", text: `AI usage of ${student.aiPercentage}% within acceptable range.` });

  return out;
}

export default StudentDashboard;

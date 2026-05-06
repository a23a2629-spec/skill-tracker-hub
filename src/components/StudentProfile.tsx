import { useState, useRef } from "react";
import {
  Student, StudentProfile as SPType, courses,
  analyzeIntegrity, ExternalProblem, ConsistencyFlag, VerificationStatus, TrustIndex,
} from "@/data/mockData";
import {
  Phone, Mail, MapPin, Calendar, GraduationCap, Users, Pencil, Check, X, Camera,
  CreditCard, Building2, Home, Globe, Shield, AlertTriangle, CheckCircle2, Info,
  BookOpen, UserRound, BadgeCheck, Heart, Brain, FileText, Star, AlertCircle,
  Banknote, School, Stethoscope, Activity, Award, Folder, Lock, ChevronDown, ChevronUp,
} from "lucide-react";

interface Props {
  student: Student;
  problems: ExternalProblem[];
  onProfileUpdate?: (profile: Partial<SPType> & { avatar?: string }) => void;
  tabRequest?: string;
}

type Tab = "personal" | "academic" | "financial" | "health" | "activities" | "integrity";

const tabConfig: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "personal", label: "Personal", icon: UserRound },
  { key: "academic", label: "Academic", icon: GraduationCap },
  { key: "financial", label: "Financial & Family", icon: Banknote },
  { key: "health", label: "Health & Wellbeing", icon: Stethoscope },
  { key: "activities", label: "Activities & Records", icon: Star },
  { key: "integrity", label: "Integrity", icon: Shield },
];

const verifStyles: Record<VerificationStatus, { label: string; cls: string }> = {
  Verified: { label: "Verified", cls: "bg-status-mastered/15 text-status-mastered" },
  Pending: { label: "Pending", cls: "bg-status-developing/15 text-status-developing" },
  Inconsistent: { label: "Inconsistent / Needs Review", cls: "bg-status-intensive/15 text-status-intensive" },
};

const trustColors: Record<TrustIndex, { bar: string; text: string; bg: string }> = {
  High: { bar: "bg-status-mastered", text: "text-status-mastered", bg: "bg-status-mastered/10 border border-status-mastered/30" },
  Medium: { bar: "bg-status-developing", text: "text-status-developing", bg: "bg-status-developing/10 border border-status-developing/30" },
  Low: { bar: "bg-status-intensive", text: "text-status-intensive", bg: "bg-status-intensive/10 border border-status-intensive/30" },
};

const enrollStatusCls: Record<SPType["enrollmentStatus"], string> = {
  Active: "bg-status-mastered/15 text-status-mastered",
  "At-Risk": "bg-status-developing/15 text-status-developing",
  "Academic Warning": "bg-status-intensive/15 text-status-intensive",
  Probation: "bg-status-intensive/25 text-status-intensive font-bold",
};

const flagStyles: Record<ConsistencyFlag["type"], { icon: React.ElementType; cls: string; bg: string }> = {
  ok: { icon: CheckCircle2, cls: "text-status-mastered", bg: "bg-status-mastered/10 border border-status-mastered/20" },
  warning: { icon: AlertTriangle, cls: "text-status-developing", bg: "bg-status-developing/10 border border-status-developing/20" },
  alert: { icon: Shield, cls: "text-status-intensive", bg: "bg-status-intensive/10 border border-status-intensive/20" },
};

const domainIcons: Record<string, React.ElementType> = {
  financial: Banknote, academic: GraduationCap, health: Stethoscope,
  family: Users, mental: Brain, identity: CreditCard, integrity: Shield,
};

export default function StudentProfile({ student, problems, onProfileUpdate, tabRequest }: Props) {
  const { profile: p } = student;
  const courseName = courses.find(c => c.code === student.course)?.name || student.course;
  const initials = student.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();

  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [editing, setEditing] = useState(false);

  // Navigate to a specific tab when requested from outside (e.g. search)
  const prevTabReq = useRef(tabRequest);
  if (tabRequest && tabRequest !== prevTabReq.current && tabConfig.some(t => t.key === tabRequest)) {
    prevTabReq.current = tabRequest;
    setActiveTab(tabRequest as Tab);
  }
  const [avatar, setAvatar] = useState<string | undefined>(p.avatar);

  const initForm = () => ({
    // M1
    nationality: p.nationality, race: p.race, religion: p.religion,
    // M3
    phone: p.phone, email: p.email, address: p.address, postcode: p.postcode, state: p.state,
    // M4
    guardian: p.guardian, guardianPhone: p.guardianPhone, guardianEmail: p.guardianEmail, guardianRelation: p.guardianRelation,
    // M5
    previousSchool: p.previousSchool, previousQualification: p.previousQualification, previousResults: p.previousResults,
    achievementsStr: p.achievements.join(", "),
    // M6
    program: p.program, faculty: p.faculty, levelOfStudy: p.levelOfStudy, intake: p.intake,
    semester: String(p.semester), financialAid: p.financialAid,
    // M7
    registrationStatus: p.registrationStatus, enrollmentStatus: p.enrollmentStatus,
    advisor: p.advisor, campus: p.campus,
    // M8
    cgpa: String(p.cgpa), gpa: String(p.gpa),
    // M9
    monthlyHouseholdIncome: String(p.monthlyHouseholdIncome),
    incomeCategory: p.incomeCategory,
    paymentStatus: p.paymentStatus,
    sponsorAmount: String(p.sponsorAmount),
    // M10
    fatherName: p.fatherName, fatherOccupation: p.fatherOccupation, fatherIncome: String(p.fatherIncome),
    motherName: p.motherName, motherOccupation: p.motherOccupation, motherIncome: String(p.motherIncome),
    siblings: String(p.siblings), householdSize: String(p.householdSize),
    parentMaritalStatus: p.parentMaritalStatus,
    // M11
    bloodType: p.bloodType, disabilityStatus: p.disabilityStatus, healthInsurance: p.healthInsurance,
    medicalConditionsStr: p.medicalConditions.join(", "),
    allergiesStr: p.allergies.join(", "),
    // M12
    counselingStatus: p.counselingStatus,
    // M13
    hostelBlock: p.hostelBlock ?? "", hostelRoom: p.hostelRoom ?? "",
    // M14
    careerGoal: p.careerGoal,
    technicalSkillsStr: p.technicalSkills.join(", "),
    softSkillsStr: p.softSkills.join(", "),
    cocurricularStr: p.cocurricular.join(", "),
  });

  const [form, setForm] = useState(initForm);
  const setF = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
  const fileRef = useRef<HTMLInputElement>(null);

  // Build a live patched student so analyzeIntegrity re-runs in real time while editing
  const livePatch = (): Partial<SPType> => ({
    nationality: form.nationality, race: form.race, religion: form.religion,
    phone: form.phone, email: form.email, address: form.address, postcode: form.postcode, state: form.state,
    guardian: form.guardian, guardianPhone: form.guardianPhone, guardianEmail: form.guardianEmail, guardianRelation: form.guardianRelation,
    previousSchool: form.previousSchool, previousQualification: form.previousQualification, previousResults: form.previousResults,
    achievements: form.achievementsStr.split(",").map(s => s.trim()).filter(Boolean),
    program: form.program, faculty: form.faculty, levelOfStudy: form.levelOfStudy, intake: form.intake,
    semester: Number(form.semester) || p.semester,
    financialAid: form.financialAid as SPType["financialAid"],
    registrationStatus: form.registrationStatus as SPType["registrationStatus"],
    enrollmentStatus: form.enrollmentStatus as SPType["enrollmentStatus"],
    advisor: form.advisor, campus: form.campus,
    cgpa: Number(form.cgpa) || p.cgpa,
    gpa: Number(form.gpa) || p.gpa,
    monthlyHouseholdIncome: Number(form.monthlyHouseholdIncome) || p.monthlyHouseholdIncome,
    incomeCategory: form.incomeCategory as SPType["incomeCategory"],
    paymentStatus: form.paymentStatus as SPType["paymentStatus"],
    sponsorAmount: Number(form.sponsorAmount) || p.sponsorAmount,
    fatherName: form.fatherName, fatherOccupation: form.fatherOccupation, fatherIncome: Number(form.fatherIncome) || 0,
    motherName: form.motherName, motherOccupation: form.motherOccupation, motherIncome: Number(form.motherIncome) || 0,
    siblings: Number(form.siblings) || 0, householdSize: Number(form.householdSize) || 0,
    parentMaritalStatus: form.parentMaritalStatus as SPType["parentMaritalStatus"],
    bloodType: form.bloodType, disabilityStatus: form.disabilityStatus as SPType["disabilityStatus"],
    healthInsurance: form.healthInsurance as SPType["healthInsurance"],
    medicalConditions: form.medicalConditionsStr.split(",").map(s => s.trim()).filter(Boolean),
    allergies: form.allergiesStr.split(",").map(s => s.trim()).filter(Boolean),
    counselingStatus: form.counselingStatus as SPType["counselingStatus"],
    hostelBlock: form.hostelBlock, hostelRoom: form.hostelRoom,
    careerGoal: form.careerGoal, avatar,
    technicalSkills: form.technicalSkillsStr.split(",").map(s => s.trim()).filter(Boolean),
    softSkills: form.softSkillsStr.split(",").map(s => s.trim()).filter(Boolean),
    cocurricular: form.cocurricularStr.split(",").map(s => s.trim()).filter(Boolean),
  });

  const liveStudent = editing ? { ...student, profile: { ...p, ...livePatch() } } : student;
  const report = analyzeIntegrity(liveStudent, problems);
  const alertCount = report.flags.filter(f => f.type === "alert").length;
  const warnCount = report.flags.filter(f => f.type === "warning").length;

  const handleSave = () => {
    onProfileUpdate?.({ ...livePatch() });
    setEditing(false);
  };
  const handleCancel = () => {
    setForm(initForm());
    setAvatar(p.avatar);
    setEditing(false);
  };

  return (
    <div className="premium-card p-6 sm:p-8 space-y-6">
      {/* ── Header / Profile Card ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/[0.06] via-card to-[hsl(var(--accent-cyan))]/[0.06] border border-border/60 p-5 sm:p-6">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-[hsl(var(--accent-cyan))]/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 rounded-2xl gradient-brand opacity-80 blur-md" />
              {avatar
                ? <img src={avatar} alt={student.name} className="relative w-20 h-20 rounded-2xl object-cover ring-4 ring-card shadow-lg" />
                : <div className="relative w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold ring-4 ring-card shadow-lg">{initials}</div>}
              {editing && (
                <button onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setAvatar(ev.target?.result as string); r.readAsDataURL(f); }} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xl sm:text-2xl leading-tight tracking-tight text-foreground">{student.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {student.matricNo} <span className="opacity-50">·</span> {p.studentId}
              </p>
              <p className="text-xs text-muted-foreground/90 mt-0.5">{courseName}</p>
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {p.enrollmentStatus}
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-blue-500/15 text-blue-600 ring-1 ring-blue-500/20">
                  Trust: {report.trustIndex} · {report.trustScore}%
                </span>
                {alertCount > 0 && (
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-600 ring-1 ring-orange-500/20 font-semibold inline-flex items-center gap-1">
                    <AlertTriangle size={10} /> {alertCount} Risk Alert{alertCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            {editing ? (
              <>
                <button onClick={handleSave} className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 transition-all hover:scale-105"><Check size={16} /></button>
                <button onClick={handleCancel} className="p-2.5 rounded-xl bg-red-500/15 text-red-600 hover:bg-red-500/25 transition-all hover:scale-105"><X size={16} /></button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="p-2.5 rounded-xl bg-card border border-border/70 hover:border-primary/40 hover:text-primary transition-all hover:scale-105 shadow-sm"><Pencil size={16} /></button>
            )}
          </div>
        </div>

        {/* Risk Score Progress Bar */}
        <div className="relative mt-5 pt-5 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Student Risk Score</p>
              {editing && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold animate-pulse">
                  ● LIVE
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-foreground">{100 - report.trustScore}<span className="text-muted-foreground font-medium">/100</span></p>
          </div>
          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                report.trustScore >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                : report.trustScore >= 60 ? "bg-gradient-to-r from-amber-400 to-orange-500"
                : "bg-gradient-to-r from-orange-500 to-red-600"
              }`}
              style={{ width: `${100 - report.trustScore}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {report.trustScore >= 80 ? "✓ Low risk — student is performing well across domains."
            : report.trustScore >= 60 ? "⚠ Moderate risk — some areas need attention."
            : "⚠ Elevated risk — counselor review recommended."}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB NAVIGATION BAR                                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-border/60 scrollbar-hide">
        {tabConfig.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-[1px]
              ${activeTab === key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: PERSONAL (Modules 1, 2, 3, 4)                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === "personal" && (
        <div className="space-y-4">
          <Section icon={UserRound} title="Module 1 — Personal Information">
            <Grid>
              <InfoRow icon={UserRound} label="Full Name" value={student.name} />
              <InfoRow icon={Calendar} label="Date of Birth" value={`${p.dateOfBirth} (Age ${age})`} />
              <InfoRow icon={UserRound} label="Gender" value={p.gender} />
              {editing ? (
                <>
                  <EditRow icon={Globe} label="Nationality" value={form.nationality} onChange={v => setF("nationality", v)} />
                  <EditRow icon={Globe} label="Race / Ethnicity" value={form.race} onChange={v => setF("race", v)} />
                  <EditRow icon={Star} label="Religion" value={form.religion} onChange={v => setF("religion", v)} />
                </>
              ) : (
                <>
                  <InfoRow icon={Globe} label="Nationality" value={p.nationality} />
                  <InfoRow icon={Globe} label="Race / Ethnicity" value={p.race} />
                  <InfoRow icon={Star} label="Religion" value={p.religion} />
                </>
              )}
            </Grid>
          </Section>

          <Section icon={CreditCard} title="Module 2 — Identification Details"
            badge={<VerifBadge status={p.identityVerified} />}>
            <Grid>
              <InfoRow icon={CreditCard} label="IC Number" value={p.icNumber} />
              {p.passportNumber && <InfoRow icon={CreditCard} label="Passport Number" value={p.passportNumber} />}
              <InfoRow icon={BadgeCheck} label="Student ID" value={p.studentId} />
              <InfoRow icon={Shield} label="Identity Verification" value={verifStyles[p.identityVerified].label} />
            </Grid>
          </Section>

          <Section icon={Mail} title="Module 3 — Contact Information">
            <Grid>
              {editing ? (
                <>
                  <EditRow icon={Mail} label="Email" value={form.email} onChange={v => setF("email", v)} />
                  <EditRow icon={Phone} label="Phone" value={form.phone} onChange={v => setF("phone", v)} />
                  <div className="sm:col-span-2"><EditRow icon={MapPin} label="Street Address" value={form.address} onChange={v => setF("address", v)} /></div>
                  <EditRow icon={MapPin} label="Postcode" value={form.postcode} onChange={v => setF("postcode", v)} />
                  <EditRow icon={MapPin} label="State" value={form.state} onChange={v => setF("state", v)} />
                </>
              ) : (
                <>
                  <InfoRow icon={Mail} label="Email" value={p.email} />
                  <InfoRow icon={Phone} label="Phone" value={p.phone} />
                  <InfoRow icon={MapPin} label="Address" value={`${p.address}, ${p.postcode} ${p.state}`} />
                </>
              )}
            </Grid>
          </Section>

          <Section icon={Users} title="Module 4 — Emergency Contact">
            <Grid>
              {editing ? (
                <>
                  <EditRow icon={Users} label="Guardian Name" value={form.guardian} onChange={v => setF("guardian", v)} />
                  <EditRow icon={UserRound} label="Relationship" value={form.guardianRelation} onChange={v => setF("guardianRelation", v)} />
                  <EditRow icon={Phone} label="Guardian Phone" value={form.guardianPhone} onChange={v => setF("guardianPhone", v)} />
                  <EditRow icon={Mail} label="Guardian Email" value={form.guardianEmail} onChange={v => setF("guardianEmail", v)} />
                </>
              ) : (
                <>
                  <InfoRow icon={Users} label="Guardian Name" value={p.guardian} />
                  <InfoRow icon={UserRound} label="Relationship" value={p.guardianRelation} />
                  <InfoRow icon={Phone} label="Phone" value={p.guardianPhone} />
                  <InfoRow icon={Mail} label="Email" value={p.guardianEmail} />
                </>
              )}
            </Grid>
          </Section>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: ACADEMIC (Modules 5, 6, 7, 8)                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === "academic" && (
        <div className="space-y-4">
          <Section icon={School} title="Module 5 — Academic Background"
            badge={<VerifBadge status={p.academicVerified} />}>
            {editing ? (
              <div className="space-y-2">
                <EditRow icon={School} label="Previous School" value={form.previousSchool} onChange={v => setF("previousSchool", v)} />
                <EditRow icon={FileText} label="Qualification (e.g. SPM 2021)" value={form.previousQualification} onChange={v => setF("previousQualification", v)} />
                <EditRow icon={Award} label="Results (e.g. 5A 2B)" value={form.previousResults} onChange={v => setF("previousResults", v)} />
                <EditRow icon={Star} label="Achievements (comma-separated)" value={form.achievementsStr} onChange={v => setF("achievementsStr", v)} />
              </div>
            ) : (
              <>
                <Grid>
                  <InfoRow icon={School} label="Previous School" value={p.previousSchool} />
                  <InfoRow icon={FileText} label="Qualification" value={p.previousQualification} />
                  <InfoRow icon={Award} label="Results" value={p.previousResults} />
                </Grid>
                {p.achievements.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Achievements</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.achievements.map((a, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Section>

          <Section icon={BookOpen} title="Module 6 — University Program Details">
            {editing ? (
              <div className="space-y-2">
                <EditRow icon={BookOpen} label="Program" value={form.program} onChange={v => setF("program", v)} />
                <EditRow icon={Building2} label="Faculty" value={form.faculty} onChange={v => setF("faculty", v)} />
                <EditRow icon={GraduationCap} label="Level of Study" value={form.levelOfStudy} onChange={v => setF("levelOfStudy", v)} />
                <EditRow icon={Calendar} label="Intake" value={form.intake} onChange={v => setF("intake", v)} />
                <EditRow icon={Calendar} label="Current Semester" value={form.semester} onChange={v => setF("semester", v)} />
                <SelectRow icon={Award} label="Financial Aid / Scholarship" value={form.financialAid} onChange={v => setF("financialAid", v)} options={["PTPTN", "JPA Scholarship", "State Scholarship", "PTPTN (Processing)", "None"]} />
              </div>
            ) : (
              <Grid>
                <InfoRow icon={BookOpen} label="Program" value={p.program} />
                <InfoRow icon={Building2} label="Faculty" value={p.faculty} />
                <InfoRow icon={GraduationCap} label="Level of Study" value={p.levelOfStudy} />
                <InfoRow icon={Calendar} label="Intake" value={p.intake} />
                <InfoRow icon={Calendar} label="Current Semester" value={`Semester ${p.semester}`} />
                <InfoRow icon={Award} label="Financial Aid / Scholarship" value={p.financialAid} />
              </Grid>
            )}
          </Section>

          <Section icon={BadgeCheck} title="Module 7 — Enrollment Information">
            {editing ? (
              <div className="space-y-2">
                <SelectRow icon={BadgeCheck} label="Registration Status" value={form.registrationStatus} onChange={v => setF("registrationStatus", v)} options={["Registered", "Deferral", "Withdrawn"]} />
                <SelectRow icon={BadgeCheck} label="Enrollment Status" value={form.enrollmentStatus} onChange={v => setF("enrollmentStatus", v)} options={["Active", "At-Risk", "Probation", "Academic Warning"]} />
                <EditRow icon={UserRound} label="Academic Advisor" value={form.advisor} onChange={v => setF("advisor", v)} />
                <EditRow icon={Building2} label="Campus" value={form.campus} onChange={v => setF("campus", v)} />
              </div>
            ) : (
              <Grid>
                <InfoRow icon={BadgeCheck} label="Registration Status" value={p.registrationStatus} />
                <InfoRow icon={BadgeCheck} label="Enrollment Status" value={p.enrollmentStatus} />
                <InfoRow icon={UserRound} label="Academic Advisor" value={p.advisor} />
                <InfoRow icon={Building2} label="Campus" value={p.campus} />
              </Grid>
            )}
          </Section>

          <Section icon={Activity} title="Module 8 — Academic Performance">
            {editing ? (
              <div className="space-y-2">
                <EditRow icon={Activity} label="CGPA (Cumulative)" value={form.cgpa} onChange={v => setF("cgpa", v)} />
                <EditRow icon={Activity} label="GPA (Current Sem)" value={form.gpa} onChange={v => setF("gpa", v)} />
                <Grid>
                  <InfoRow icon={Activity} label="Attendance Rate" value={`${student.attendance}%`} />
                  <InfoRow icon={Activity} label="Average Assessment Score" value={`${student.averageScore}%`} />
                  <InfoRow icon={Brain} label="AI Usage Rate" value={`${student.aiPercentage}%`} />
                  <InfoRow icon={BookOpen} label="Assessments Completed" value={`${student.skills.filter(s => s.completed).length} / ${student.skills.length}`} />
                </Grid>
              </div>
            ) : (
              <Grid>
                <InfoRow icon={Activity} label="CGPA (Cumulative)" value={p.cgpa.toFixed(2)} />
                <InfoRow icon={Activity} label="GPA (Current Sem)" value={p.gpa.toFixed(2)} />
                <InfoRow icon={Activity} label="Attendance Rate" value={`${student.attendance}%`} />
                <InfoRow icon={Activity} label="Average Assessment Score" value={`${student.averageScore}%`} />
                <InfoRow icon={Brain} label="AI Usage Rate" value={`${student.aiPercentage}%`} />
                <InfoRow icon={BookOpen} label="Assessments Completed" value={`${student.skills.filter(s => s.completed).length} / ${student.skills.length}`} />
              </Grid>
            )}
          </Section>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: FINANCIAL & FAMILY (Modules 9, 10)                        */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === "financial" && (
        <div className="space-y-4">
          <Section icon={Banknote} title="Module 9 — Financial Information"
            badge={<VerifBadge status={p.financialVerified} />}>
            {editing ? (
              <div className="space-y-2">
                <EditRow icon={Banknote} label="Monthly Household Income (RM)" value={form.monthlyHouseholdIncome} onChange={v => setF("monthlyHouseholdIncome", v)} />
                <SelectRow icon={Banknote} label="Income Category" value={form.incomeCategory} onChange={v => setF("incomeCategory", v)} options={["B40","M40","T20"]} />
                <SelectRow icon={Award} label="Financial Aid / Sponsorship" value={form.financialAid} onChange={v => setF("financialAid", v)} options={["PTPTN","JPA Scholarship","State Scholarship","PTPTN (Processing)","None"]} />
                <EditRow icon={Banknote} label="Sponsor Amount (RM/year, 0 if none)" value={form.sponsorAmount} onChange={v => setF("sponsorAmount", v)} />
                <SelectRow icon={BadgeCheck} label="Tuition Payment Status" value={form.paymentStatus} onChange={v => setF("paymentStatus", v)} options={["Paid","Pending","Overdue"]} />
              </div>
            ) : (
              <Grid>
                <InfoRow icon={Banknote} label="Monthly Household Income" value={`RM ${p.monthlyHouseholdIncome.toLocaleString()}`} />
                <InfoRow icon={Banknote} label="Income Category" value={p.incomeCategory} />
                <InfoRow icon={Award} label="Sponsorship / Loan" value={p.financialAid} />
                <InfoRow icon={Banknote} label="Sponsor Amount" value={p.sponsorAmount > 0 ? `RM ${p.sponsorAmount.toLocaleString()}/year` : "None"} />
                <InfoRow icon={BadgeCheck} label="Tuition Payment Status"
                  value={p.paymentStatus}
                  valueClass={p.paymentStatus === "Paid" ? "text-status-mastered" : p.paymentStatus === "Pending" ? "text-status-developing" : "text-status-intensive font-bold"} />
              </Grid>
            )}
          </Section>

          <Section icon={Users} title="Module 10 — Family Background"
            badge={<VerifBadge status={p.familyVerified} />}>
            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold px-1">Father</p>
                    <EditRow icon={UserRound} label="Father's Name" value={form.fatherName} onChange={v => setF("fatherName", v)} />
                    <EditRow icon={Building2} label="Father's Occupation" value={form.fatherOccupation} onChange={v => setF("fatherOccupation", v)} />
                    <EditRow icon={Banknote} label="Father's Monthly Income (RM)" value={form.fatherIncome} onChange={v => setF("fatherIncome", v)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold px-1">Mother</p>
                    <EditRow icon={UserRound} label="Mother's Name" value={form.motherName} onChange={v => setF("motherName", v)} />
                    <EditRow icon={Building2} label="Mother's Occupation" value={form.motherOccupation} onChange={v => setF("motherOccupation", v)} />
                    <EditRow icon={Banknote} label="Mother's Monthly Income (RM, 0 if N/A)" value={form.motherIncome} onChange={v => setF("motherIncome", v)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SelectRow icon={Users} label="Parents' Marital Status" value={form.parentMaritalStatus} onChange={v => setF("parentMaritalStatus", v)} options={["Married","Divorced","Widowed","Single Parent"]} />
                  <EditRow icon={Users} label="Household Size (persons)" value={form.householdSize} onChange={v => setF("householdSize", v)} />
                  <EditRow icon={Users} label="Number of Siblings" value={form.siblings} onChange={v => setF("siblings", v)} />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Father</p>
                    <InfoRow icon={UserRound} label="Name" value={p.fatherName} />
                    <InfoRow icon={Building2} label="Occupation" value={p.fatherOccupation} />
                    <InfoRow icon={Banknote} label="Monthly Income" value={`RM ${p.fatherIncome.toLocaleString()}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Mother</p>
                    <InfoRow icon={UserRound} label="Name" value={p.motherName} />
                    <InfoRow icon={Building2} label="Occupation" value={p.motherOccupation} />
                    <InfoRow icon={Banknote} label="Monthly Income" value={p.motherIncome > 0 ? `RM ${p.motherIncome.toLocaleString()}` : "Not employed"} />
                  </div>
                </div>
                <div className="mt-3">
                  <Grid>
                    <InfoRow icon={Users} label="Marital Status" value={p.parentMaritalStatus} />
                    <InfoRow icon={Users} label="Household Size" value={`${p.householdSize} person(s)`} />
                    <InfoRow icon={Users} label="Number of Siblings" value={`${p.siblings}`} />
                    <InfoRow icon={Banknote} label="Combined Household Income"
                      value={`RM ${(p.fatherIncome + p.motherIncome).toLocaleString()}/month`} />
                  </Grid>
                </div>
              </>
            )}
          </Section>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: HEALTH & WELLBEING (Modules 11, 12, 13)                   */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === "health" && (
        <div className="space-y-4">
          <Section icon={Stethoscope} title="Module 11 — Health Information"
            badge={<VerifBadge status={p.healthVerified} />}>
            {editing ? (
              <div className="space-y-2">
                <EditRow icon={Heart} label="Blood Type (e.g. B+, O-)" value={form.bloodType} onChange={v => setF("bloodType", v)} />
                <SelectRow icon={Stethoscope} label="Disability Status" value={form.disabilityStatus} onChange={v => setF("disabilityStatus", v)} options={["None","Physical","Visual","Hearing","Learning"]} />
                <SelectRow icon={Shield} label="Health Insurance" value={form.healthInsurance} onChange={v => setF("healthInsurance", v)} options={["Active","None"]} />
                <EditRow icon={Stethoscope} label="Medical Conditions (comma-separated, or leave blank)" value={form.medicalConditionsStr} onChange={v => setF("medicalConditionsStr", v)} />
                <EditRow icon={Heart} label="Allergies (comma-separated, or leave blank)" value={form.allergiesStr} onChange={v => setF("allergiesStr", v)} />
              </div>
            ) : (
              <>
                <Grid>
                  <InfoRow icon={Heart} label="Blood Type" value={p.bloodType} />
                  <InfoRow icon={Stethoscope} label="Disability Status" value={p.disabilityStatus} />
                  <InfoRow icon={Shield} label="Health Insurance" value={p.healthInsurance} />
                </Grid>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Medical Conditions</p>
                    {p.medicalConditions.length === 0
                      ? <p className="text-sm text-muted-foreground">None reported</p>
                      : p.medicalConditions.map((c, i) => <Tag key={i} label={c} color="intensive" />)}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Allergies</p>
                    {p.allergies.length === 0
                      ? <p className="text-sm text-muted-foreground">None</p>
                      : p.allergies.map((a, i) => <Tag key={i} label={a} color="developing" />)}
                  </div>
                </div>
              </>
            )}
          </Section>

          <Section icon={Brain} title="Module 12 — Mental Health Support"
            badge={<span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Lock size={10} /> Restricted Access</span>}>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 mb-3">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Lock size={12} className="text-primary" />
                Mental health information is protected under strict privacy controls. Only authorized counselors and welfare officers may access full records.
              </p>
            </div>
            {editing ? (
              <SelectRow icon={Brain} label="Counseling Status (self-reported)" value={form.counselingStatus} onChange={v => setF("counselingStatus", v)} options={["None","Active","Referred","Completed"]} />
            ) : (
              <Grid>
                <InfoRow icon={Brain} label="Counseling Status" value={p.counselingStatus}
                  valueClass={p.counselingStatus === "Active" || p.counselingStatus === "Referred" ? "text-status-developing" : p.counselingStatus === "Completed" ? "text-status-mastered" : ""} />
                {p.lastCounselorVisit && <InfoRow icon={Calendar} label="Last Counselor Visit" value={p.lastCounselorVisit} />}
                {p.counselorName && <InfoRow icon={UserRound} label="Assigned Counselor" value={p.counselorName} />}
              </Grid>
            )}
            <div className="mt-2 p-2 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
              ⚖️ Ethical Note: This system does not make determinations based on mental health data. All decisions require human counselor review.
            </div>
          </Section>

          <Section icon={Home} title="Module 13 — Accommodation Details">
            <Grid>
              <InfoRow icon={Home} label="Hostel Resident" value={p.hostel ? "Yes — On Campus" : "No — Commuter"} />
              {editing ? (
                <>
                  <EditRow icon={Building2} label="Block (if on campus)" value={form.hostelBlock} onChange={v => setF("hostelBlock", v)} />
                  <EditRow icon={Building2} label="Room (if on campus)" value={form.hostelRoom} onChange={v => setF("hostelRoom", v)} />
                </>
              ) : (
                <>
                  {p.hostel && p.hostelBlock && <InfoRow icon={Building2} label="Block" value={p.hostelBlock} />}
                  {p.hostel && p.hostelRoom && <InfoRow icon={Building2} label="Room" value={p.hostelRoom} />}
                </>
              )}
            </Grid>
          </Section>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: ACTIVITIES & RECORDS (Modules 14, 15, 16)                 */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === "activities" && (
        <div className="space-y-4">
          <Section icon={Star} title="Module 14 — Skills & Interests">
            {editing ? (
              <div className="space-y-3">
                <EditRow icon={Star} label="Career Goal" value={form.careerGoal} onChange={v => setF("careerGoal", v)} />
                <EditRow icon={BookOpen} label="Technical Skills (comma-separated)" value={form.technicalSkillsStr} onChange={v => setF("technicalSkillsStr", v)} />
                <EditRow icon={Heart} label="Soft Skills (comma-separated)" value={form.softSkillsStr} onChange={v => setF("softSkillsStr", v)} />
                <EditRow icon={Star} label="Co-Curricular Activities (comma-separated)" value={form.cocurricularStr} onChange={v => setF("cocurricularStr", v)} />
                <p className="text-[10px] text-muted-foreground">Separate multiple entries with commas, e.g. "Excel, SAP, Python"</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Technical Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.technicalSkills.length > 0 ? p.technicalSkills.map((s, i) => <Tag key={i} label={s} color="primary" />) : <p className="text-sm text-muted-foreground">None listed</p>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Soft Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.softSkills.length > 0 ? p.softSkills.map((s, i) => <Tag key={i} label={s} color="mastered" />) : <p className="text-sm text-muted-foreground">None listed</p>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Co-Curricular Activities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.cocurricular.length > 0 ? p.cocurricular.map((c, i) => <Tag key={i} label={c} color="developing" />) : <p className="text-sm text-muted-foreground">None listed</p>}
                  </div>
                </div>
                <InfoRow icon={Star} label="Career Goal" value={p.careerGoal} />
              </div>
            )}
          </Section>

          <Section icon={AlertCircle} title="Module 15 — Disciplinary Records">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.disciplinaryRecord === "Clean" ? "bg-status-mastered/15 text-status-mastered" : p.disciplinaryRecord === "Warning" ? "bg-status-intensive/15 text-status-intensive" : "bg-status-intensive/25 text-status-intensive"}`}>
                {p.disciplinaryRecord}
              </span>
              <span className="text-xs text-muted-foreground">{p.violations} violation(s) on record</span>
            </div>
            {p.disciplinaryNotes
              ? <div className="p-3 rounded-lg bg-status-intensive/10 border border-status-intensive/20 text-xs">{p.disciplinaryNotes}</div>
              : <p className="text-sm text-muted-foreground">No disciplinary cases. Clean record maintained.</p>}
          </Section>

          <Section icon={Folder} title="Module 16 — Uploaded Documents">
            <div className="flex flex-wrap gap-2">
              {p.documentsUploaded.map((doc, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs border border-border">
                  <FileText size={12} className="text-primary" />
                  {doc}
                  <CheckCircle2 size={11} className="text-status-mastered ml-1" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{p.documentsUploaded.length} document(s) uploaded · Stored securely in encrypted records system</p>
          </Section>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: INTEGRITY (Verification Layer + Trust Index)              */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === "integrity" && (
        <div className="space-y-4">
          {/* Trust Index */}
          {editing && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
              Your edits are reflected live below. Save to make them permanent, or cancel to discard.
            </div>
          )}
          <div className={`p-4 rounded-xl ${trustColors[report.trustIndex].bg}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Overall Student Trust Index</p>
                <p className={`text-2xl font-bold mt-0.5 ${trustColors[report.trustIndex].text}`}>{report.trustIndex}</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${trustColors[report.trustIndex].text}`}>{report.trustScore}<span className="text-sm">%</span></p>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${trustColors[report.trustIndex].bar}`} style={{ width: `${report.trustScore}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              ⚖️ This index is a system aid only. It does NOT automatically determine any outcomes. All flagged items require human review before action.
            </p>
          </div>

          {/* Domain Verification Summary */}
          <Section icon={BadgeCheck} title="Domain Verification Status">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(report.domainStatuses).map(([domain, status]) => {
                const v = verifStyles[status];
                return (
                  <div key={domain} className={`p-2 rounded-lg text-center ${v.cls} bg-opacity-10`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide">{domain}</p>
                    <p className={`text-xs font-bold mt-0.5 ${v.cls}`}>{v.label}</p>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Summary badges */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full bg-status-mastered/10 text-status-mastered font-medium">✓ {report.flags.filter(f => f.type === "ok").length} Verified</span>
            {warnCount > 0 && <span className="text-xs px-3 py-1 rounded-full bg-status-developing/10 text-status-developing font-medium">⚠ {warnCount} Warning{warnCount > 1 ? "s" : ""}</span>}
            {alertCount > 0 && <span className="text-xs px-3 py-1 rounded-full bg-status-intensive/10 text-status-intensive font-medium">✕ {alertCount} Alert{alertCount > 1 ? "s" : ""}</span>}
          </div>

          {/* Flags grouped by domain */}
          {(["financial", "academic", "health", "family", "mental", "identity"] as const).map(domain => {
            const domainFlags = report.flags.filter(f => f.domain === domain);
            if (domainFlags.length === 0) return null;
            const DomainIcon = domainIcons[domain];
            const domainLabel = domain === "mental" ? "Mental Health" : domain.charAt(0).toUpperCase() + domain.slice(1);
            return (
              <FlagGroup key={domain} icon={DomainIcon} label={`${domainLabel} Verification`} flags={domainFlags} />
            );
          })}

          <div className="p-3 bg-secondary/50 rounded-lg border border-border">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">🔐 System Ethical Constraints</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>· This system does NOT assume dishonesty. Flags indicate areas requiring review, not confirmed violations.</li>
              <li>· No student is rejected or penalized based on automated flags alone. Human review is mandatory.</li>
              <li>· Facial and emotional profiling are strictly prohibited.</li>
              <li>· Mental health and disability data are protected with restricted access controls.</li>
              <li>· All alerts are advisory. Final decisions rest with authorized human officers.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children, badge }: { icon: React.ElementType; title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-12px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(37,99,235,0.18)]">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/40 transition-colors">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon size={14} className="text-primary" />
          </span>
          <span className="text-sm font-semibold tracking-tight">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          {open ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
        </div>
      </button>
      {open && <div className="px-5 pb-5 pt-1 space-y-2.5 border-t border-border/40">{children}</div>}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{children}</div>;
}

function InfoRow({ icon: Icon, label, value, valueClass = "" }: { icon: React.ElementType; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-xl border border-transparent hover:border-primary/20 hover:bg-secondary/60 transition-all">
      <span className="w-7 h-7 rounded-lg bg-card border border-border/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-sm break-words mt-0.5 font-medium ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function EditRow({ icon: Icon, label, value, onChange }: { icon: React.ElementType; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
      <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-full text-sm bg-background border border-border rounded px-2 py-1 mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
    </div>
  );
}

function SelectRow({ icon: Icon, label, value, onChange, options }: { icon: React.ElementType; label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
      <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full text-sm bg-background border border-border rounded px-2 py-1 mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function VerifBadge({ status }: { status: VerificationStatus }) {
  const s = verifStyles[status];
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${s.cls}`}>{s.label}</span>;
}

function Tag({ label, color }: { label: string; color: "primary" | "mastered" | "developing" | "intensive" }) {
  const cls = {
    primary: "bg-primary/10 text-primary",
    mastered: "bg-status-mastered/10 text-status-mastered",
    developing: "bg-status-developing/10 text-status-developing",
    intensive: "bg-status-intensive/10 text-status-intensive",
  }[color];
  return <span className={`text-xs px-2 py-0.5 rounded-full ${cls} inline-block mb-1`}>{label}</span>;
}

function FlagGroup({ icon: Icon, label, flags }: { icon: React.ElementType; label: string; flags: ConsistencyFlag[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 bg-secondary/30 hover:bg-secondary/50 transition-colors">
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-primary" />
          <span className="text-xs font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {flags.filter(f => f.type === "alert").length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-status-intensive/20 text-status-intensive font-bold">
              {flags.filter(f => f.type === "alert").length} alert
            </span>
          )}
          {open ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="p-3 space-y-2">
          {flags.map((flag, i) => {
            const s = flagStyles[flag.type];
            const FIcon = s.icon;
            return (
              <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${s.bg}`}>
                <FIcon size={13} className={`${s.cls} shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wide ${s.cls}`}>{flag.category}</p>
                  <p className="text-xs mt-0.5 leading-relaxed">{flag.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

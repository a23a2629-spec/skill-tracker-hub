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

export default function StudentProfile({ student, problems, onProfileUpdate }: Props) {
  const { profile: p } = student;
  const courseName = courses.find(c => c.code === student.course)?.name || student.course;
  const initials = student.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();

  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(p.avatar);
  const [form, setForm] = useState({ phone: p.phone, email: p.email, address: p.address });
  const fileRef = useRef<HTMLInputElement>(null);

  const report = analyzeIntegrity(student, problems);
  const alertCount = report.flags.filter(f => f.type === "alert").length;
  const warnCount = report.flags.filter(f => f.type === "warning").length;

  const handleSave = () => { onProfileUpdate?.({ ...form, avatar }); setEditing(false); };
  const handleCancel = () => { setForm({ phone: p.phone, email: p.email, address: p.address }); setAvatar(p.avatar); setEditing(false); };

  return (
    <div className="glass-card p-5 space-y-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {avatar
              ? <img src={avatar} alt={student.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/30" />
              : <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">{initials}</div>}
            {editing && (
              <button onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setAvatar(ev.target?.result as string); r.readAsDataURL(f); }} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{student.name}</h3>
            <p className="text-xs text-muted-foreground">{student.matricNo} · {p.studentId}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{courseName}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${enrollStatusCls[p.enrollmentStatus]}`}>{p.enrollmentStatus}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${trustColors[report.trustIndex].bg} ${trustColors[report.trustIndex].text}`}>
                Trust: {report.trustIndex} ({report.trustScore}%)
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-start">
          {alertCount > 0 && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-status-intensive/20 text-status-intensive font-bold flex items-center gap-1">
              <AlertTriangle size={10} /> {alertCount} Alert{alertCount > 1 ? "s" : ""}
            </span>
          )}
          {editing ? (
            <>
              <button onClick={handleSave} className="p-2 rounded-lg bg-status-mastered/20 text-status-mastered hover:bg-status-mastered/30 transition-colors"><Check size={16} /></button>
              <button onClick={handleCancel} className="p-2 rounded-lg bg-status-intensive/20 text-status-intensive hover:bg-status-intensive/30 transition-colors"><X size={16} /></button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"><Pencil size={16} /></button>
          )}
        </div>
      </div>

      {/* ── Quick Action Row (HubSpot-style) ─────────────────────────── */}
      <div className="flex items-center gap-2 py-2 border-y border-border">
        {[
          { icon: Mail, label: "Email" },
          { icon: Phone, label: "Call" },
          { icon: Calendar, label: "Meet" },
          { icon: FileText, label: "Note" },
          { icon: BookOpen, label: "Log" },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground">
            <Icon size={16} className="text-primary" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Bar (underline style) ───────────────────────────────── */}
      <div className="flex gap-1 flex-wrap border-b border-border -mx-5 px-5">
        {tabConfig.map(({ key, label, icon: Icon }) => {
          const isInteg = key === "integrity";
          const hasIssue = isInteg && (alertCount + warnCount) > 0;
          const isActive = activeTab === key;
          return (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`relative px-3 py-2.5 text-xs font-semibold transition-all flex items-center gap-1.5 -mb-px border-b-2 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}>
              <Icon size={13} /> {label}
              {hasIssue && (
                <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${alertCount > 0 ? "bg-status-intensive" : "bg-status-developing"}`}>
                  {alertCount + warnCount}
                </span>
              )}
            </button>
          );
        })}
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
              <InfoRow icon={Globe} label="Nationality" value={p.nationality} />
              <InfoRow icon={Globe} label="Race / Ethnicity" value={p.race} />
              <InfoRow icon={Star} label="Religion" value={p.religion} />
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
                  <EditRow icon={Mail} label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
                  <EditRow icon={Phone} label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
                  <div className="sm:col-span-2"><EditRow icon={MapPin} label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} /></div>
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
              <InfoRow icon={Users} label="Guardian Name" value={p.guardian} />
              <InfoRow icon={UserRound} label="Relationship" value={p.guardianRelation} />
              <InfoRow icon={Phone} label="Phone" value={p.guardianPhone} />
              <InfoRow icon={Mail} label="Email" value={p.guardianEmail} />
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
          </Section>

          <Section icon={BookOpen} title="Module 6 — University Program Details">
            <Grid>
              <InfoRow icon={BookOpen} label="Program" value={p.program} />
              <InfoRow icon={Building2} label="Faculty" value={p.faculty} />
              <InfoRow icon={GraduationCap} label="Level of Study" value={p.levelOfStudy} />
              <InfoRow icon={Calendar} label="Intake" value={p.intake} />
              <InfoRow icon={Calendar} label="Current Semester" value={`Semester ${p.semester}`} />
              <InfoRow icon={Award} label="Financial Aid / Scholarship" value={p.financialAid} />
            </Grid>
          </Section>

          <Section icon={BadgeCheck} title="Module 7 — Enrollment Information">
            <Grid>
              <InfoRow icon={BadgeCheck} label="Registration Status" value={p.registrationStatus} />
              <InfoRow icon={BadgeCheck} label="Enrollment Status" value={p.enrollmentStatus} />
              <InfoRow icon={UserRound} label="Academic Advisor" value={p.advisor} />
              <InfoRow icon={Building2} label="Campus" value={p.campus} />
            </Grid>
          </Section>

          <Section icon={Activity} title="Module 8 — Academic Performance">
            <Grid>
              <InfoRow icon={Activity} label="CGPA (Cumulative)" value={p.cgpa.toFixed(2)} />
              <InfoRow icon={Activity} label="GPA (Current Sem)" value={p.gpa.toFixed(2)} />
              <InfoRow icon={Activity} label="Attendance Rate" value={`${student.attendance}%`} />
              <InfoRow icon={Activity} label="Average Assessment Score" value={`${student.averageScore}%`} />
              <InfoRow icon={Brain} label="AI Usage Rate" value={`${student.aiPercentage}%`} />
              <InfoRow icon={BookOpen} label="Assessments Completed" value={`${student.skills.filter(s => s.completed).length} / ${student.skills.length}`} />
            </Grid>
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
            <Grid>
              <InfoRow icon={Banknote} label="Monthly Household Income" value={`RM ${p.monthlyHouseholdIncome.toLocaleString()}`} />
              <InfoRow icon={Banknote} label="Income Category" value={p.incomeCategory} />
              <InfoRow icon={Award} label="Sponsorship / Loan" value={p.financialAid} />
              <InfoRow icon={Banknote} label="Sponsor Amount" value={p.sponsorAmount > 0 ? `RM ${p.sponsorAmount.toLocaleString()}/year` : "None"} />
              <InfoRow icon={BadgeCheck} label="Tuition Payment Status"
                value={p.paymentStatus}
                valueClass={p.paymentStatus === "Paid" ? "text-status-mastered" : p.paymentStatus === "Pending" ? "text-status-developing" : "text-status-intensive font-bold"} />
            </Grid>
          </Section>

          <Section icon={Users} title="Module 10 — Family Background"
            badge={<VerifBadge status={p.familyVerified} />}>
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
          </Section>

          <Section icon={Brain} title="Module 12 — Mental Health Support"
            badge={<span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Lock size={10} /> Restricted Access</span>}>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 mb-3">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Lock size={12} className="text-primary" />
                Mental health information is protected under strict privacy controls. Only authorized counselors and welfare officers may access full records.
              </p>
            </div>
            <Grid>
              <InfoRow icon={Brain} label="Counseling Status" value={p.counselingStatus}
                valueClass={p.counselingStatus === "Active" || p.counselingStatus === "Referred" ? "text-status-developing" : p.counselingStatus === "Completed" ? "text-status-mastered" : ""} />
              {p.lastCounselorVisit && <InfoRow icon={Calendar} label="Last Counselor Visit" value={p.lastCounselorVisit} />}
              {p.counselorName && <InfoRow icon={UserRound} label="Assigned Counselor" value={p.counselorName} />}
            </Grid>
            <div className="mt-2 p-2 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
              ⚖️ Ethical Note: This system does not make determinations based on mental health data. All decisions require human counselor review.
            </div>
          </Section>

          <Section icon={Home} title="Module 13 — Accommodation Details">
            <Grid>
              <InfoRow icon={Home} label="Hostel Resident" value={p.hostel ? "Yes — On Campus" : "No — Commuter"} />
              {p.hostel && p.hostelBlock && <InfoRow icon={Building2} label="Block" value={p.hostelBlock} />}
              {p.hostel && p.hostelRoom && <InfoRow icon={Building2} label="Room" value={p.hostelRoom} />}
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
                  {p.softSkills.map((s, i) => <Tag key={i} label={s} color="mastered" />)}
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
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 bg-secondary/40 hover:bg-secondary/60 transition-colors">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-primary" />
          <span className="text-xs font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </button>
      {open && <div className="p-3 space-y-2">{children}</div>}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{children}</div>;
}

function InfoRow({ icon: Icon, label, value, valueClass = "" }: { icon: React.ElementType; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
      <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={`text-sm break-words ${valueClass}`}>{value}</p>
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

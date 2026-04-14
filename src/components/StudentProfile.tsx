import { useState, useRef } from "react";
import { Student, StudentProfile as StudentProfileType, courses, analyzeConsistency, ExternalProblem, ConsistencyFlag } from "@/data/mockData";
import {
  Phone, Mail, MapPin, Calendar, GraduationCap, Users, Pencil, Check, X, Camera,
  CreditCard, Building2, Home, Globe, Shield, AlertTriangle, CheckCircle2, Info,
  BookOpen, UserRound, BadgeCheck,
} from "lucide-react";

interface Props {
  student: Student;
  problems: ExternalProblem[];
  onProfileUpdate?: (profile: Partial<StudentProfileType> & { avatar?: string }) => void;
}

const flagTypeStyles: Record<ConsistencyFlag["type"], { icon: React.ElementType; className: string; bg: string }> = {
  ok: { icon: CheckCircle2, className: "text-status-mastered", bg: "bg-status-mastered/10 border border-status-mastered/20" },
  warning: { icon: AlertTriangle, className: "text-status-developing", bg: "bg-status-developing/10 border border-status-developing/20" },
  alert: { icon: Shield, className: "text-status-intensive", bg: "bg-status-intensive/10 border border-status-intensive/20" },
};

const enrollmentStatusStyles: Record<StudentProfileType["enrollmentStatus"], string> = {
  "Active": "bg-status-mastered/20 text-status-mastered",
  "At-Risk": "bg-status-developing/20 text-status-developing",
  "Academic Warning": "bg-status-intensive/20 text-status-intensive",
  "Probation": "bg-status-intensive/30 text-status-intensive font-bold",
};

const StudentProfile = ({ student, problems, onProfileUpdate }: Props) => {
  const { profile } = student;
  const courseName = courses.find(c => c.code === student.course)?.name || student.course;
  const initials = student.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(student.profile.avatar);
  const [activeTab, setActiveTab] = useState<"info" | "analysis">("info");
  const [form, setForm] = useState({
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flags = analyzeConsistency(student, problems);
  const alertCount = flags.filter(f => f.type === "alert").length;
  const warningCount = flags.filter(f => f.type === "warning").length;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setAvatar(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onProfileUpdate?.({ ...form, avatar });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ phone: profile.phone, email: profile.email, address: profile.address });
    setAvatar(student.profile.avatar);
    setEditing(false);
  };

  const age = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear();

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {avatar ? (
              <img src={avatar} alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                {initials}
              </div>
            )}
            {editing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 w-16 h-16 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={18} className="text-white" />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.matricNo}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{courseName}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${enrollmentStatusStyles[profile.enrollmentStatus]}`}>
              {profile.enrollmentStatus}
            </span>
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
              <button onClick={handleSave} className="p-2 rounded-lg bg-status-mastered/20 text-status-mastered hover:bg-status-mastered/30 transition-colors">
                <Check size={16} />
              </button>
              <button onClick={handleCancel} className="p-2 rounded-lg bg-status-intensive/20 text-status-intensive hover:bg-status-intensive/30 transition-colors">
                <X size={16} />
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors">
              <Pencil size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === "info" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
        >
          <UserRound size={12} /> Profile Info
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 relative ${activeTab === "analysis" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
        >
          <BadgeCheck size={12} /> Data Analysis
          {(alertCount + warningCount) > 0 && (
            <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${alertCount > 0 ? "bg-status-intensive text-white" : "bg-status-developing text-white"}`}>
              {alertCount + warningCount}
            </span>
          )}
        </button>
      </div>

      {/* Profile Info Tab */}
      {activeTab === "info" && (
        <div className="space-y-3">
          {/* Identity Section */}
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Identity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={CreditCard} label="IC Number" value={profile.icNumber} />
            <InfoRow icon={UserRound} label="Gender" value={profile.gender} />
            <InfoRow icon={Calendar} label="Date of Birth" value={`${profile.dateOfBirth} (Age ${age})`} />
            <InfoRow icon={Globe} label="Nationality / Race" value={`${profile.nationality} · ${profile.race}`} />
          </div>

          {/* Academic Section */}
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold pt-1">Academic</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={BookOpen} label="Program" value={profile.program} />
            <InfoRow icon={GraduationCap} label="Semester" value={`Semester ${profile.semester}`} />
            <InfoRow icon={Calendar} label="Intake" value={profile.intake} />
            <InfoRow icon={Building2} label="Financial Aid" value={profile.financialAid} />
            <InfoRow icon={Home} label="Hostel Resident" value={profile.hostel ? "Yes — On Campus" : "No — Commuter"} />
          </div>

          {/* Contact Section */}
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold pt-1">Contact</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {editing ? (
              <>
                <EditRow icon={Mail} label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
                <EditRow icon={Phone} label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
                <div className="sm:col-span-2">
                  <EditRow icon={MapPin} label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
                </div>
              </>
            ) : (
              <>
                <InfoRow icon={Mail} label="Email" value={profile.email} />
                <InfoRow icon={Phone} label="Phone" value={profile.phone} />
                <div className="sm:col-span-2">
                  <InfoRow icon={MapPin} label="Address" value={profile.address} />
                </div>
              </>
            )}
          </div>

          {/* Guardian Section */}
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold pt-1">Guardian</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={Users} label="Guardian Name" value={profile.guardian} />
            <InfoRow icon={Phone} label="Guardian Phone" value={profile.guardianPhone} />
          </div>
        </div>
      )}

      {/* Data Analysis Tab */}
      {activeTab === "analysis" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Info size={14} className="text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              This analysis cross-checks profile data, academic performance, and reported problems to detect inconsistencies and ensure information integrity.
            </p>
          </div>

          {/* Summary badges */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full bg-status-mastered/15 text-status-mastered font-medium">
              ✓ {flags.filter(f => f.type === "ok").length} Verified
            </span>
            {warningCount > 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-status-developing/15 text-status-developing font-medium">
                ⚠ {warningCount} Warning{warningCount > 1 ? "s" : ""}
              </span>
            )}
            {alertCount > 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-status-intensive/15 text-status-intensive font-medium">
                ✕ {alertCount} Alert{alertCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Flag list */}
          <div className="space-y-2">
            {flags.map((flag, i) => {
              const style = flagTypeStyles[flag.type];
              const Icon = style.icon;
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${style.bg}`}>
                  <Icon size={15} className={`${style.className} shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wide ${style.className}`}>{flag.category}</p>
                    <p className="text-xs mt-0.5 leading-relaxed">{flag.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance snapshot */}
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold pt-1">Performance Snapshot</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-secondary/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground">Attendance</p>
              <p className={`text-base font-bold ${student.attendance >= 80 ? "text-status-mastered" : "text-status-intensive"}`}>
                {student.attendance}%
              </p>
            </div>
            <div className="p-2 bg-secondary/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground">AI Usage</p>
              <p className={`text-base font-bold ${student.aiPercentage > 25 ? "text-status-intensive" : student.aiPercentage > 15 ? "text-status-developing" : "text-primary"}`}>
                {student.aiPercentage}%
              </p>
            </div>
            <div className="p-2 bg-secondary/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground">Avg Score</p>
              <p className={`text-base font-bold ${student.averageScore >= 75 ? "text-status-mastered" : student.averageScore >= 50 ? "text-status-developing" : "text-status-intensive"}`}>
                {student.averageScore}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
    <Icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm break-words">{value}</p>
    </div>
  </div>
);

const EditRow = ({ icon: Icon, label, value, onChange }: { icon: React.ElementType; label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
    <Icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
    <div className="flex-1">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm bg-background border border-border rounded px-2 py-1 mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  </div>
);

export default StudentProfile;

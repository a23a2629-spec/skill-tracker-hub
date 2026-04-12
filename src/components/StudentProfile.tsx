import { useState, useRef } from "react";
import { Student, StudentProfile as StudentProfileType, courses } from "@/data/mockData";
import { Phone, Mail, MapPin, Calendar, GraduationCap, Users, Pencil, Check, X, Camera } from "lucide-react";

interface Props {
  student: Student;
  onProfileUpdate?: (profile: Partial<StudentProfileType> & { avatar?: string }) => void;
}

const StudentProfile = ({ student, onProfileUpdate }: Props) => {
  const { profile } = student;
  const courseName = courses.find(c => c.code === student.course)?.name || student.course;
  const initials = student.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(student.profile.avatar);
  const [form, setForm] = useState({
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
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
          </div>
        </div>
        <div className="flex gap-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {editing ? (
          <>
            <EditRow icon={Mail} label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
            <EditRow icon={Phone} label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
            <EditRow icon={MapPin} label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
            <InfoRow icon={GraduationCap} label="Semester" value={`Semester ${profile.semester}`} />
            <InfoRow icon={Calendar} label="Intake" value={profile.intake} />
            <InfoRow icon={Users} label="Guardian" value={`${profile.guardian} (${profile.guardianPhone})`} />
          </>
        ) : (
          <>
            <InfoRow icon={Mail} label="Email" value={profile.email} />
            <InfoRow icon={Phone} label="Phone" value={profile.phone} />
            <InfoRow icon={MapPin} label="Address" value={profile.address} />
            <InfoRow icon={GraduationCap} label="Semester" value={`Semester ${profile.semester}`} />
            <InfoRow icon={Calendar} label="Intake" value={profile.intake} />
            <InfoRow icon={Users} label="Guardian" value={`${profile.guardian} (${profile.guardianPhone})`} />
          </>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
    <Icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm">{value}</p>
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

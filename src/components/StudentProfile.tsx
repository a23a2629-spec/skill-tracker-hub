import { Student, courses } from "@/data/mockData";
import { User, Phone, Mail, MapPin, Calendar, GraduationCap, Users } from "lucide-react";

interface Props {
  student: Student;
}

const StudentProfile = ({ student }: Props) => {
  const { profile } = student;
  const courseName = courses.find(c => c.code === student.course)?.name || student.course;
  const initials = student.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h3 className="font-bold text-lg">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.matricNo}</p>
          <p className="text-xs text-primary font-medium mt-0.5">{courseName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoRow icon={Mail} label="Email" value={profile.email} />
        <InfoRow icon={Phone} label="Phone" value={profile.phone} />
        <InfoRow icon={MapPin} label="Address" value={profile.address} />
        <InfoRow icon={GraduationCap} label="Semester" value={`Semester ${profile.semester}`} />
        <InfoRow icon={Calendar} label="Intake" value={profile.intake} />
        <InfoRow icon={Users} label="Guardian" value={`${profile.guardian} (${profile.guardianPhone})`} />
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

export default StudentProfile;

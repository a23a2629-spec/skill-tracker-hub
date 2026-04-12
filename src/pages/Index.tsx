import { useState } from "react";
import { students, appointments, Appointment } from "@/data/mockData";
import StudentDashboard from "@/components/StudentDashboard";
import LecturerDashboard from "@/components/LecturerDashboard";
import { GraduationCap, User, BookOpen } from "lucide-react";

const Index = () => {
  const [view, setView] = useState<"student" | "lecturer">("student");
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const selectedStudent = students.find((s) => s.id === selectedStudentId)!;
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(appointments);

  const handleAddAppointment = (apt: Appointment) => {
    setAllAppointments(prev => [...prev, apt]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAllAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <GraduationCap size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base">In-Campus Skills Gap Tracker</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Early Detection • Smarter Intervention</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                onClick={() => setView("student")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User size={14} /> Student
              </button>
              <button
                onClick={() => setView("lecturer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === "lecturer" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen size={14} /> Lecturer
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {view === "student" && (
          <div className="mb-6">
            <label className="text-xs text-muted-foreground mb-2 block">Viewing as student:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.matricNo})
                </option>
              ))}
            </select>
          </div>
        )}

        {view === "student" ? (
          <StudentDashboard
            student={selectedStudent}
            appointments={allAppointments.filter(a => a.studentId === selectedStudent.id)}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        ) : (
          <LecturerDashboard
            appointments={allAppointments}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

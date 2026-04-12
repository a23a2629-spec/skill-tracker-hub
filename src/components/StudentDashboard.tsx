import { useState } from "react";
import { Student, appointments, Appointment } from "@/data/mockData";
import { CalendarDays, Bell, BookOpen, Brain, UserCheck, TrendingUp, Clock, PlusCircle, User } from "lucide-react";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import StudentProfile from "./StudentProfile";

interface Props {
  student: Student;
}

const StudentDashboard = ({ student }: Props) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [studentAppointments, setStudentAppointments] = useState<Appointment[]>(
    appointments.filter(a => a.studentId === student.id)
  );
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: "", time: "", reason: "" });

  const unreadCount = student.notifications.filter((n) => !n.read).length;
  const completedAssessments = student.skills.filter((s) => s.completed);
  const pendingAssessments = student.skills.filter((s) => !s.completed);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleBookAppointment = () => {
    if (!bookingForm.date || !bookingForm.time || !bookingForm.reason) return;
    const newApt: Appointment = {
      id: `apt-new-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      lecturerName: "Dr. Zainab",
      date: bookingForm.date,
      time: bookingForm.time,
      reason: bookingForm.reason,
      status: "pending",
    };
    setStudentAppointments(prev => [...prev, newApt]);
    setBookingForm({ date: "", time: "", reason: "" });
    setShowBooking(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, <span className="text-primary">{student.name.split(" ")[0]}</span>! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {student.matricNo} • Here's your learning progress overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowProfile(!showProfile)}
            className="p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
            <User size={20} />
          </button>
          <button onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-intensive text-status-intensive-foreground text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Profile Panel */}
      {showProfile && <StudentProfile student={student} />}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><Bell size={16} /> Notifications</h3>
          {student.notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications</p>
          ) : (
            student.notifications.map((n) => (
              <div key={n.id} className={`p-3 rounded-lg text-sm flex items-start gap-3 ${
                n.read ? "bg-secondary/50" : "bg-primary/10 border border-primary/30"
              }`}>
                <span className="mt-0.5">
                  {n.type === "reminder" ? <Clock size={14} className="text-status-developing" /> :
                   n.type === "result" ? <TrendingUp size={14} className="text-status-mastered" /> :
                   n.type === "comment" ? <BookOpen size={14} className="text-primary" /> :
                   <Bell size={14} className="text-status-intensive" />}
                </span>
                <div>
                  <p>{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                </div>
                {!n.read && <span className="ml-auto w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={student.attendance} suffix="%" icon={UserCheck} color="text-status-mastered" />
        <StatCard title="AI Usage" value={student.aiPercentage} suffix="%" icon={Brain} color={student.aiPercentage > 25 ? "text-status-intensive" : "text-primary"} description={student.aiPercentage > 25 ? "⚠ Above threshold" : "Within acceptable range"} />
        <StatCard title="Average Score" value={student.averageScore} suffix="%" icon={TrendingUp} color={student.averageScore >= 75 ? "text-status-mastered" : student.averageScore >= 50 ? "text-status-developing" : "text-status-intensive"} />
        <StatCard title="Assessments" value={`${completedAssessments.length}/${student.skills.length}`} icon={BookOpen} color="text-primary" />
      </div>

      {/* Pending Assessments */}
      {pendingAssessments.length > 0 && (
        <div className="glass-card p-5 border-l-4 border-l-status-developing">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <CalendarDays size={18} className="text-status-developing" /> Upcoming Assessments
          </h3>
          {pendingAssessments.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">Due: {a.dueDate}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-status-developing text-status-developing-foreground font-semibold">Pending</span>
            </div>
          ))}
        </div>
      )}

      {/* Appointments */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2"><CalendarDays size={18} className="text-primary" /> Appointments</h3>
          <button onClick={() => setShowBooking(!showBooking)}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
            <PlusCircle size={14} /> Book Appointment
          </button>
        </div>

        {showBooking && (
          <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
            <p className="text-sm font-medium">Book with Dr. Zainab</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="date" className="text-sm px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} />
              <select className="text-sm px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                value={bookingForm.time} onChange={e => setBookingForm(p => ({ ...p, time: e.target.value }))}>
                <option value="">Select time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
            <input type="text" placeholder="Reason for appointment..."
              className="w-full text-sm px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              value={bookingForm.reason} onChange={e => setBookingForm(p => ({ ...p, reason: e.target.value }))} />
            <button onClick={handleBookAppointment}
              disabled={!bookingForm.date || !bookingForm.time || !bookingForm.reason}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              Submit Request
            </button>
          </div>
        )}

        {studentAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments yet. Book one above!</p>
        ) : (
          studentAppointments.map(apt => (
            <div key={apt.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">with {apt.lecturerName}</p>
                <p className="text-xs text-muted-foreground">{apt.date} at {apt.time}</p>
                <p className="text-xs mt-1">{apt.reason}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                apt.status === "confirmed" ? "bg-status-mastered text-status-mastered-foreground" :
                apt.status === "pending" ? "bg-status-developing text-status-developing-foreground" :
                apt.status === "completed" ? "bg-secondary text-secondary-foreground" :
                "bg-status-intensive text-status-intensive-foreground"
              }`}>{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span>
            </div>
          ))
        )}
      </div>

      {/* Completed Assessments */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Assessment Results</h3>
        {completedAssessments.map((assessment) => (
          <div key={assessment.id} className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{assessment.title}</h4>
                <p className="text-xs text-muted-foreground">{assessment.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  <span className={
                    assessment.status === "mastered" ? "text-status-mastered" :
                    assessment.status === "developing" ? "text-status-developing" :
                    "text-status-intensive"
                  }>{assessment.score}</span>
                  <span className="text-sm text-muted-foreground">/{assessment.maxScore}</span>
                </p>
                <StatusBadge status={assessment.status} />
              </div>
            </div>
            {assessment.skills.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {assessment.skills.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg text-sm">
                    <span>{skill.name}</span>
                    <StatusBadge status={skill.status} />
                  </div>
                ))}
              </div>
            )}
            {assessment.lecturerComment && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">💬 Lecturer's Comment</p>
                <p className="text-sm">{assessment.lecturerComment}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;

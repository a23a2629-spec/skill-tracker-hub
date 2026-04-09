import { useState } from "react";
import { students, courses, Course, Student, SkillStatus, appointments, Appointment } from "@/data/mockData";
import { Users, BookOpen, AlertTriangle, TrendingUp, MessageSquare, ChevronDown, ChevronUp, PlusCircle, CalendarDays, Eye } from "lucide-react";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const LecturerDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "create" | "appointments">("overview");
  const [newAssessment, setNewAssessment] = useState({ title: "", dueDate: "", maxScore: "100", courseId: "" });
  const [createdAssessments, setCreatedAssessments] = useState<{ title: string; dueDate: string; maxScore: number; courseCode: string }[]>([]);
  const [lecturerAppointments, setLecturerAppointments] = useState<Appointment[]>(appointments);

  const displayStudents = selectedCourse
    ? students.filter((s) => selectedCourse.students.includes(s.id))
    : students;

  const avgAttendance = Math.round(displayStudents.reduce((a, s) => a + s.attendance, 0) / displayStudents.length);
  const avgScore = Math.round(displayStudents.reduce((a, s) => a + s.averageScore, 0) / displayStudents.length);
  const intensiveCount = displayStudents.filter((s) => s.averageScore < 50).length;
  const avgAI = Math.round(displayStudents.reduce((a, s) => a + s.aiPercentage, 0) / displayStudents.length);

  const getOverallStatus = (score: number): SkillStatus => {
    if (score >= 75) return "mastered";
    if (score >= 50) return "developing";
    return "intensive";
  };

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

  const handleAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setLecturerAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Chart data
  const scoreDistribution = [
    { range: "0-49", count: displayStudents.filter(s => s.averageScore < 50).length, fill: "hsl(0, 84%, 60%)" },
    { range: "50-74", count: displayStudents.filter(s => s.averageScore >= 50 && s.averageScore < 75).length, fill: "hsl(45, 93%, 47%)" },
    { range: "75-100", count: displayStudents.filter(s => s.averageScore >= 75).length, fill: "hsl(142, 71%, 45%)" },
  ];

  const allSkillStatuses = displayStudents.flatMap(s => s.skills.filter(a => a.completed).flatMap(a => a.skills));
  const pieData = [
    { name: "Mastered", value: allSkillStatuses.filter(s => s.status === "mastered").length, color: "hsl(142, 71%, 45%)" },
    { name: "Developing", value: allSkillStatuses.filter(s => s.status === "developing").length, color: "hsl(45, 93%, 47%)" },
    { name: "Intensive", value: allSkillStatuses.filter(s => s.status === "intensive").length, color: "hsl(0, 84%, 60%)" },
  ];

  const courseShortNames: Record<string, string> = {
    "DPB3012": "SAD",
    "DPB2022": "SAK",
    "DPB2033": "SAR",
    "DPA1014": "SAA",
    "DPB1015": "SAE",
    "DPB3046": "SAB",
  };
  const courseBarData = courses.map(c => {
    const cs = students.filter(s => c.students.includes(s.id));
    return { name: courseShortNames[c.code] || c.code, avg: cs.length ? Math.round(cs.reduce((a, s) => a + s.averageScore, 0) / cs.length) : 0 };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor student progress and provide feedback</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-border pb-3">
        {(["overview", "students", "create", "appointments"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}>
            {tab === "overview" && <Eye size={14} />}
            {tab === "students" && <Users size={14} />}
            {tab === "create" && <PlusCircle size={14} />}
            {tab === "appointments" && <CalendarDays size={14} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Course Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setSelectedCourse(null); setExpandedStudent(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !selectedCourse ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}>All Students</button>
        {courses.map((c) => (
          <button key={c.id} onClick={() => { setSelectedCourse(c); setExpandedStudent(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCourse?.id === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}>
            <span className="hidden sm:inline">{c.name}</span>
            <span className="sm:hidden">{c.code}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Students" value={displayStudents.length} icon={Users} color="text-primary" />
        <StatCard title="Avg Attendance" value={avgAttendance} suffix="%" icon={TrendingUp} color="text-status-mastered" />
        <StatCard title="Avg AI Usage" value={avgAI} suffix="%" icon={BookOpen} color={avgAI > 25 ? "text-status-intensive" : "text-primary"} />
        <StatCard title="Need Intervention" value={intensiveCount} icon={AlertTriangle} color="text-status-intensive" />
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-1">Class Average Score</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">{avgScore}%</span>
              <StatusBadge status={getOverallStatus(avgScore)} />
            </div>
            <div className="flex h-3 rounded-full overflow-hidden mb-2">
              <div className="bg-status-mastered" style={{ width: `${(displayStudents.filter(s => s.averageScore >= 75).length / displayStudents.length) * 100}%` }} />
              <div className="bg-status-developing" style={{ width: `${(displayStudents.filter(s => s.averageScore >= 50 && s.averageScore < 75).length / displayStudents.length) * 100}%` }} />
              <div className="bg-status-intensive" style={{ width: `${(displayStudents.filter(s => s.averageScore < 50).length / displayStudents.length) * 100}%` }} />
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-mastered" /> Mastered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-developing" /> Developing</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-intensive" /> Intensive</span>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreDistribution}>
                  <XAxis dataKey="range" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(220, 25%, 14%)", border: "1px solid hsl(220, 20%, 22%)", borderRadius: 8, color: "hsl(210, 40%, 96%)" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {scoreDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4">Skill Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(220, 25%, 14%)", border: "1px solid hsl(220, 20%, 22%)", borderRadius: 8, color: "hsl(210, 40%, 96%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {!selectedCourse && (
              <div className="glass-card p-5 lg:col-span-2">
                <h3 className="font-semibold mb-4">Average Score by Course</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={courseBarData}>
                    <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(220, 25%, 14%)", border: "1px solid hsl(220, 20%, 22%)", borderRadius: 8, color: "hsl(210, 40%, 96%)" }} />
                    <Bar dataKey="avg" fill="hsl(210, 80%, 55%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDENTS TAB */}
      {activeTab === "students" && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">
            {selectedCourse ? `${selectedCourse.name} Students` : "All Students"}
            <span className="text-sm font-normal text-muted-foreground ml-2">({displayStudents.length})</span>
          </h3>

          {/* All students table-like overview */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground text-xs">
                    <th className="p-3">Student</th>
                    <th className="p-3">Course</th>
                    <th className="p-3 text-center">Attendance</th>
                    <th className="p-3 text-center">AI %</th>
                    <th className="p-3 text-center">Avg Score</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayStudents.map(student => (
                    <tr key={student.id} className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
                      onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{student.name.charAt(0)}</div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.matricNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{student.course}</td>
                      <td className="p-3 text-center">{student.attendance}%</td>
                      <td className={`p-3 text-center ${student.aiPercentage > 25 ? "text-status-intensive font-semibold" : ""}`}>{student.aiPercentage}%</td>
                      <td className="p-3 text-center font-semibold">{student.averageScore}%</td>
                      <td className="p-3 text-center"><StatusBadge status={getOverallStatus(student.averageScore)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expanded student detail */}
          {expandedStudent && (() => {
            const student = displayStudents.find(s => s.id === expandedStudent);
            if (!student) return null;
            return (
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{student.name.charAt(0)}</div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.matricNo} • {student.course}</p>
                    </div>
                  </div>
                  <button onClick={() => setExpandedStudent(null)} className="text-muted-foreground hover:text-foreground"><ChevronUp size={20} /></button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-muted-foreground text-xs">Attendance</p>
                    <p className="font-bold text-status-mastered">{student.attendance}%</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-muted-foreground text-xs">AI Usage</p>
                    <p className={`font-bold ${student.aiPercentage > 25 ? "text-status-intensive" : "text-primary"}`}>{student.aiPercentage}%</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-muted-foreground text-xs">Avg Score</p>
                    <p className={`font-bold ${student.averageScore >= 75 ? "text-status-mastered" : student.averageScore >= 50 ? "text-status-developing" : "text-status-intensive"}`}>{student.averageScore}%</p>
                  </div>
                </div>

                {student.skills.filter(a => a.completed).map((assessment) => (
                  <div key={assessment.id} className="p-3 bg-secondary/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{assessment.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{assessment.score}/{assessment.maxScore}</span>
                        <StatusBadge status={assessment.status} />
                      </div>
                    </div>
                    {assessment.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {assessment.skills.map((skill, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-background rounded">
                            {skill.name}: <StatusBadge status={skill.status} className="text-[10px] px-1.5 py-0" />
                          </span>
                        ))}
                      </div>
                    )}
                    {(assessment.lecturerComment || comments[`${student.id}-${assessment.id}`]) && (
                      <div className="p-2 bg-primary/10 rounded text-sm">
                        <p className="text-xs text-muted-foreground mb-1">💬 Your Comment</p>
                        {comments[`${student.id}-${assessment.id}`] || assessment.lecturerComment}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input type="text" placeholder="Add a comment..."
                        className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                        value={newComment} onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(student.id, assessment.id)} />
                      <button onClick={() => handleAddComment(student.id, assessment.id)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-1">
                        <MessageSquare size={14} /> Send
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* CREATE ASSESSMENT TAB */}
      {activeTab === "create" && (
        <div className="space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><PlusCircle size={18} /> Create New Assessment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Assessment Title</label>
                <input type="text" placeholder="e.g. Quiz 3 - Transportation Models"
                  className="w-full text-sm px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  value={newAssessment.title} onChange={e => setNewAssessment(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Course</label>
                <select className="w-full text-sm px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  value={newAssessment.courseId} onChange={e => setNewAssessment(p => ({ ...p, courseId: e.target.value }))}>
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Due Date</label>
                <input type="date"
                  className="w-full text-sm px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  value={newAssessment.dueDate} onChange={e => setNewAssessment(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Max Score</label>
                <input type="number"
                  className="w-full text-sm px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  value={newAssessment.maxScore} onChange={e => setNewAssessment(p => ({ ...p, maxScore: e.target.value }))} />
              </div>
            </div>
            <button onClick={handleCreateAssessment}
              disabled={!newAssessment.title || !newAssessment.dueDate || !newAssessment.courseId}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <PlusCircle size={16} /> Create Assessment
            </button>
          </div>

          {createdAssessments.length > 0 && (
            <div className="glass-card p-5 space-y-3">
              <h3 className="font-semibold">Created Assessments</h3>
              {createdAssessments.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.courseCode} • Due: {a.dueDate} • Max: {a.maxScore}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-status-developing text-status-developing-foreground font-semibold">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><CalendarDays size={18} /> Student Appointments</h3>
          {lecturerAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments scheduled.</p>
          ) : (
            lecturerAppointments.map(apt => (
              <div key={apt.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{apt.studentName}</p>
                  <p className="text-xs text-muted-foreground">{apt.date} at {apt.time}</p>
                  <p className="text-xs mt-1">{apt.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    apt.status === "confirmed" ? "bg-status-mastered text-status-mastered-foreground" :
                    apt.status === "pending" ? "bg-status-developing text-status-developing-foreground" :
                    apt.status === "completed" ? "bg-secondary text-secondary-foreground" :
                    "bg-status-intensive text-status-intensive-foreground"
                  }`}>{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span>
                  {apt.status === "pending" && (
                    <>
                      <button onClick={() => handleAppointmentStatus(apt.id, "confirmed")}
                        className="text-xs px-2 py-1 bg-status-mastered text-status-mastered-foreground rounded hover:opacity-90">Confirm</button>
                      <button onClick={() => handleAppointmentStatus(apt.id, "cancelled")}
                        className="text-xs px-2 py-1 bg-status-intensive text-status-intensive-foreground rounded hover:opacity-90">Decline</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;

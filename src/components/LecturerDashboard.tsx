import { useState } from "react";
import { students, courses, Course, Student, SkillStatus } from "@/data/mockData";
import { Users, BookOpen, AlertTriangle, TrendingUp, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

const LecturerDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [newComment, setNewComment] = useState("");

  const courseStudents = students.filter((s) => selectedCourse.students.includes(s.id));
  const avgAttendance = Math.round(courseStudents.reduce((a, s) => a + s.attendance, 0) / courseStudents.length);
  const avgScore = Math.round(courseStudents.reduce((a, s) => a + s.averageScore, 0) / courseStudents.length);
  const intensiveCount = courseStudents.filter((s) => s.averageScore < 50).length;
  const avgAI = Math.round(courseStudents.reduce((a, s) => a + s.aiPercentage, 0) / courseStudents.length);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor student progress and provide feedback</p>
      </div>

      {/* Course Selector */}
      <div className="flex gap-2 flex-wrap">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => { setSelectedCourse(c); setExpandedStudent(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCourse.id === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Students" value={courseStudents.length} icon={Users} color="text-primary" />
        <StatCard title="Avg Attendance" value={avgAttendance} suffix="%" icon={TrendingUp} color="text-status-mastered" />
        <StatCard title="Avg AI Usage" value={avgAI} suffix="%" icon={BookOpen} color={avgAI > 25 ? "text-status-intensive" : "text-primary"} />
        <StatCard title="Need Intervention" value={intensiveCount} icon={AlertTriangle} color="text-status-intensive" />
      </div>

      {/* Class Overview */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-1">Class Average Score</h3>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold">{avgScore}%</span>
          <StatusBadge status={getOverallStatus(avgScore)} />
        </div>

        {/* Student distribution bar */}
        <div className="flex h-3 rounded-full overflow-hidden mb-2">
          <div className="bg-status-mastered" style={{ width: `${(courseStudents.filter(s => s.averageScore >= 75).length / courseStudents.length) * 100}%` }} />
          <div className="bg-status-developing" style={{ width: `${(courseStudents.filter(s => s.averageScore >= 50 && s.averageScore < 75).length / courseStudents.length) * 100}%` }} />
          <div className="bg-status-intensive" style={{ width: `${(courseStudents.filter(s => s.averageScore < 50).length / courseStudents.length) * 100}%` }} />
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-mastered" /> Mastered</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-developing" /> Developing</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-intensive" /> Intensive</span>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Students</h3>
        {courseStudents.map((student) => (
          <div key={student.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {student.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.matricNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{student.averageScore}%</p>
                  <p className="text-xs text-muted-foreground">Att: {student.attendance}% | AI: {student.aiPercentage}%</p>
                </div>
                <StatusBadge status={getOverallStatus(student.averageScore)} />
                {expandedStudent === student.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {expandedStudent === student.id && (
              <div className="p-4 pt-0 space-y-3 border-t border-border">
                <div className="grid grid-cols-3 gap-3 text-center text-sm py-3">
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
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                        value={expandedStudent === student.id ? newComment : ""}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(student.id, assessment.id)}
                      />
                      <button
                        onClick={() => handleAddComment(student.id, assessment.id)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
                      >
                        <MessageSquare size={14} /> Send
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerDashboard;

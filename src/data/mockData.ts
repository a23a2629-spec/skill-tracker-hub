export type SkillStatus = "mastered" | "developing" | "intensive";

export interface Student {
  id: string;
  name: string;
  matricNo: string;
  course: string;
  attendance: number; // percentage
  aiPercentage: number; // AI usage percentage
  averageScore: number;
  skills: SkillAssessment[];
  notifications: Notification[];
}

export interface SkillAssessment {
  id: string;
  title: string;
  date: string;
  dueDate?: string;
  score: number;
  maxScore: number;
  status: SkillStatus;
  skills: { name: string; status: SkillStatus }[];
  lecturerComment?: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: "reminder" | "result" | "comment" | "general";
}

export interface Course {
  id: string;
  name: string;
  code: string;
  students: string[];
}

export const courses: Course[] = [
  { id: "c1", name: "Logistic and Distribution", code: "DPB3012", students: ["s1", "s2", "s3"] },
  { id: "c2", name: "Commerce", code: "DPB2022", students: ["s1", "s4", "s5"] },
  { id: "c3", name: "Retailing", code: "DPB2033", students: ["s2", "s5", "s6"] },
  { id: "c4", name: "Accounting", code: "DPA1014", students: ["s3", "s4", "s6"] },
  { id: "c5", name: "Entrepreneurship", code: "DPB1015", students: ["s1", "s3", "s5"] },
  { id: "c6", name: "Islamic Banking and Finance", code: "DPB3046", students: ["s2", "s4", "s6"] },
];

export const students: Student[] = [
  {
    id: "s1",
    name: "Ahmad Farhan bin Ismail",
    matricNo: "01DPB22F1001",
    course: "DPB3012",
    attendance: 92,
    aiPercentage: 15,
    averageScore: 78,
    skills: [
      {
        id: "a1", title: "Quiz 1 - Supply Chain Basics", date: "2026-03-10", score: 85, maxScore: 100, status: "mastered", completed: true,
        skills: [
          { name: "Critical Reading", status: "mastered" },
          { name: "Source Synthesis", status: "developing" },
          { name: "Algebraic Fluency", status: "mastered" },
        ],
        lecturerComment: "Excellent understanding of core concepts. Keep it up!",
      },
      {
        id: "a2", title: "Quiz 2 - Inventory Management", date: "2026-03-24", score: 62, maxScore: 100, status: "developing", completed: true,
        skills: [
          { name: "Statistical Reasoning", status: "intensive" },
          { name: "Applied Data Interpretation", status: "developing" },
          { name: "Disciplinary Vocabulary", status: "mastered" },
        ],
        lecturerComment: "Needs improvement in statistical analysis. Please review Chapter 5.",
      },
      {
        id: "a3", title: "Quiz 3 - Transportation Models", date: "2026-04-14", dueDate: "2026-04-14", score: 0, maxScore: 100, status: "developing", completed: false,
        skills: [],
      },
    ],
    notifications: [
      { id: "n1", message: "Quiz 3 - Transportation Models is due on April 14", date: "2026-04-07", read: false, type: "reminder" },
      { id: "n2", message: "Lecturer commented on Quiz 2", date: "2026-03-25", read: true, type: "comment" },
      { id: "n3", message: "Quiz 1 results released - Score: 85%", date: "2026-03-12", read: true, type: "result" },
    ],
  },
  {
    id: "s2",
    name: "Nurul Aisyah binti Abdullah",
    matricNo: "01DPB22F1002",
    course: "DPB2033",
    attendance: 88,
    aiPercentage: 22,
    averageScore: 65,
    skills: [
      {
        id: "a4", title: "Quiz 1 - Supply Chain Basics", date: "2026-03-10", score: 70, maxScore: 100, status: "developing", completed: true,
        skills: [
          { name: "Critical Reading", status: "developing" },
          { name: "Source Synthesis", status: "intensive" },
          { name: "Algebraic Fluency", status: "developing" },
        ],
        lecturerComment: "Fair attempt. Focus on synthesis skills in next assessment.",
      },
      {
        id: "a5", title: "Quiz 2 - Inventory Management", date: "2026-03-24", score: 45, maxScore: 100, status: "intensive", completed: true,
        skills: [
          { name: "Statistical Reasoning", status: "intensive" },
          { name: "Applied Data Interpretation", status: "intensive" },
          { name: "Disciplinary Vocabulary", status: "developing" },
        ],
        lecturerComment: "Please attend the extra tutorial session on Thursdays.",
      },
    ],
    notifications: [
      { id: "n4", message: "You are flagged for intensive support in Statistical Reasoning", date: "2026-03-26", read: false, type: "general" },
      { id: "n5", message: "Quiz 3 - Transportation Models is due on April 14", date: "2026-04-07", read: false, type: "reminder" },
    ],
  },
  {
    id: "s3",
    name: "Muhammad Hafiz bin Razak",
    matricNo: "01DPA22F1003",
    course: "DPA1014",
    attendance: 95,
    aiPercentage: 8,
    averageScore: 88,
    skills: [
      {
        id: "a6", title: "Quiz 1 - Supply Chain Basics", date: "2026-03-10", score: 92, maxScore: 100, status: "mastered", completed: true,
        skills: [
          { name: "Critical Reading", status: "mastered" },
          { name: "Source Synthesis", status: "mastered" },
          { name: "Algebraic Fluency", status: "mastered" },
        ],
        lecturerComment: "Outstanding work! Consider mentoring peers.",
      },
      {
        id: "a7", title: "Quiz 2 - Inventory Management", date: "2026-03-24", score: 80, maxScore: 100, status: "mastered", completed: true,
        skills: [
          { name: "Statistical Reasoning", status: "developing" },
          { name: "Applied Data Interpretation", status: "mastered" },
          { name: "Disciplinary Vocabulary", status: "mastered" },
        ],
      },
    ],
    notifications: [
      { id: "n6", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" },
    ],
  },
  {
    id: "s4",
    name: "Siti Nurhaliza binti Kamal",
    matricNo: "01DPB22F1004",
    course: "DPB2022",
    attendance: 75,
    aiPercentage: 35,
    averageScore: 52,
    skills: [
      {
        id: "a8", title: "Quiz 1 - Supply Chain Basics", date: "2026-03-10", score: 55, maxScore: 100, status: "developing", completed: true,
        skills: [
          { name: "Critical Reading", status: "developing" },
          { name: "Source Synthesis", status: "intensive" },
          { name: "Algebraic Fluency", status: "intensive" },
        ],
        lecturerComment: "High AI usage detected. Please ensure original work.",
      },
      {
        id: "a9", title: "Quiz 2 - Inventory Management", date: "2026-03-24", score: 48, maxScore: 100, status: "intensive", completed: true,
        skills: [
          { name: "Statistical Reasoning", status: "intensive" },
          { name: "Applied Data Interpretation", status: "intensive" },
          { name: "Disciplinary Vocabulary", status: "developing" },
        ],
        lecturerComment: "Attendance is low. Please see me during office hours.",
      },
    ],
    notifications: [
      { id: "n7", message: "Warning: Attendance below 80%", date: "2026-04-01", read: false, type: "general" },
    ],
  },
  {
    id: "s5",
    name: "Lee Wei Jian",
    matricNo: "01DPB22F1005",
    course: "DPB1015",
    attendance: 90,
    aiPercentage: 12,
    averageScore: 74,
    skills: [
      {
        id: "a10", title: "Quiz 1 - Supply Chain Basics", date: "2026-03-10", score: 78, maxScore: 100, status: "mastered", completed: true,
        skills: [
          { name: "Critical Reading", status: "mastered" },
          { name: "Source Synthesis", status: "developing" },
          { name: "Algebraic Fluency", status: "developing" },
        ],
      },
      {
        id: "a11", title: "Quiz 2 - Inventory Management", date: "2026-03-24", score: 70, maxScore: 100, status: "developing", completed: true,
        skills: [
          { name: "Statistical Reasoning", status: "developing" },
          { name: "Applied Data Interpretation", status: "developing" },
          { name: "Disciplinary Vocabulary", status: "mastered" },
        ],
        lecturerComment: "Good progress. Keep working on statistical reasoning.",
      },
    ],
    notifications: [
      { id: "n8", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" },
    ],
  },
  {
    id: "s6",
    name: "Priya a/p Kumaran",
    matricNo: "01DPB22F1006",
    course: "DPB3046",
    attendance: 85,
    aiPercentage: 18,
    averageScore: 71,
    skills: [
      {
        id: "a12", title: "Quiz 1 - Supply Chain Basics", date: "2026-03-10", score: 75, maxScore: 100, status: "developing", completed: true,
        skills: [
          { name: "Critical Reading", status: "developing" },
          { name: "Source Synthesis", status: "mastered" },
          { name: "Algebraic Fluency", status: "developing" },
        ],
        lecturerComment: "Solid effort. Work on critical reading for next quiz.",
      },
      {
        id: "a13", title: "Quiz 2 - Inventory Management", date: "2026-03-24", score: 68, maxScore: 100, status: "developing", completed: true,
        skills: [
          { name: "Statistical Reasoning", status: "developing" },
          { name: "Applied Data Interpretation", status: "developing" },
          { name: "Disciplinary Vocabulary", status: "developing" },
        ],
      },
    ],
    notifications: [
      { id: "n9", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" },
    ],
  },
];

export function getStatusColor(status: SkillStatus): string {
  switch (status) {
    case "mastered": return "status-mastered";
    case "developing": return "status-developing";
    case "intensive": return "status-intensive";
  }
}

export function getStatusLabel(status: SkillStatus): string {
  switch (status) {
    case "mastered": return "Mastered";
    case "developing": return "Developing";
    case "intensive": return "Intensive";
  }
}

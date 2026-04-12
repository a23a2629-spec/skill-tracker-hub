export type SkillStatus = "mastered" | "developing" | "intensive";

export interface StudentProfile {
  phone: string;
  email: string;
  address: string;
  semester: number;
  intake: string;
  guardian: string;
  guardianPhone: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  matricNo: string;
  course: string;
  attendance: number;
  aiPercentage: number;
  averageScore: number;
  skills: SkillAssessment[];
  notifications: Notification[];
  profile: StudentProfile;
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

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  lecturerName: string;
  date: string;
  time: string;
  reason: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export const courses: Course[] = [
  { id: "c1", name: "Logistic and Distribution", code: "DPB3012", students: ["s1", "s2", "s3"] },
  { id: "c2", name: "Commerce", code: "DPB2022", students: ["s4", "s5", "s6"] },
  { id: "c3", name: "Retailing", code: "DPB2033", students: ["s7", "s8", "s9"] },
  { id: "c4", name: "Accounting", code: "DPA1014", students: ["s10", "s11", "s12"] },
  { id: "c5", name: "Entrepreneurship", code: "DPB1015", students: ["s13", "s14", "s15"] },
  { id: "c6", name: "Islamic Banking and Finance", code: "DPB3046", students: ["s16", "s17", "s18"] },
];

const makeSkills = (
  prefix: string,
  scores: [number, number],
  statuses: [SkillStatus, SkillStatus],
  skillSets: { name: string; status: SkillStatus }[][],
  comments: (string | undefined)[],
  pending?: { title: string; dueDate: string }
): SkillAssessment[] => {
  const result: SkillAssessment[] = [
    {
      id: `${prefix}-a1`, title: "Quiz 1 - Supply Chain Basics", date: "2026-03-10",
      score: scores[0], maxScore: 100, status: statuses[0], completed: true,
      skills: skillSets[0], lecturerComment: comments[0],
    },
    {
      id: `${prefix}-a2`, title: "Quiz 2 - Inventory Management", date: "2026-03-24",
      score: scores[1], maxScore: 100, status: statuses[1], completed: true,
      skills: skillSets[1], lecturerComment: comments[1],
    },
  ];
  if (pending) {
    result.push({
      id: `${prefix}-a3`, title: pending.title, date: "2026-04-14",
      dueDate: pending.dueDate, score: 0, maxScore: 100, status: "developing",
      completed: false, skills: [],
    });
  }
  return result;
};

export const students: Student[] = [
  // Course 1: Logistic and Distribution (s1, s2, s3)
  {
    id: "s1", name: "Ahmad Farhan bin Ismail", matricNo: "01DPB22F1001", course: "DPB3012",
    attendance: 92, aiPercentage: 15, averageScore: 78,
    skills: makeSkills("s1", [85, 62], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "intensive" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Excellent understanding of core concepts.", "Needs improvement in statistical analysis."],
      { title: "Quiz 3 - Transportation Models", dueDate: "2026-04-14" }),
    notifications: [
      { id: "n1", message: "Quiz 3 - Transportation Models is due on April 14", date: "2026-04-07", read: false, type: "reminder" },
      { id: "n2", message: "Lecturer commented on Quiz 2", date: "2026-03-25", read: true, type: "comment" },
    ],
  },
  {
    id: "s2", name: "Nurul Aisyah binti Abdullah", matricNo: "01DPB22F1002", course: "DPB3012",
    attendance: 88, aiPercentage: 22, averageScore: 58,
    skills: makeSkills("s2", [70, 45], ["developing", "intensive"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "intensive" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Fair attempt. Focus on synthesis skills.", "Please attend extra tutorial sessions."],
      { title: "Quiz 3 - Transportation Models", dueDate: "2026-04-14" }),
    notifications: [
      { id: "n3", message: "You are flagged for intensive support in Statistical Reasoning", date: "2026-03-26", read: false, type: "general" },
    ],
  },
  {
    id: "s3", name: "Muhammad Hafiz bin Razak", matricNo: "01DPB22F1003", course: "DPB3012",
    attendance: 95, aiPercentage: 8, averageScore: 88,
    skills: makeSkills("s3", [92, 80], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Outstanding work! Consider mentoring peers.", undefined]),
    notifications: [{ id: "n4", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" }],
  },

  // Course 2: Commerce (s4, s5, s6)
  {
    id: "s4", name: "Siti Nurhaliza binti Kamal", matricNo: "01DPB22F1004", course: "DPB2022",
    attendance: 75, aiPercentage: 35, averageScore: 52,
    skills: makeSkills("s4", [55, 48], ["developing", "intensive"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "intensive" }],
       [{ name: "Statistical Reasoning", status: "intensive" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["High AI usage detected. Ensure original work.", "Attendance is low. Please see me."]),
    notifications: [{ id: "n5", message: "Warning: Attendance below 80%", date: "2026-04-01", read: false, type: "general" }],
  },
  {
    id: "s5", name: "Lee Wei Jian", matricNo: "01DPB22F1005", course: "DPB2022",
    attendance: 90, aiPercentage: 12, averageScore: 74,
    skills: makeSkills("s5", [78, 70], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      [undefined, "Good progress. Keep working on statistical reasoning."]),
    notifications: [{ id: "n6", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" }],
  },
  {
    id: "s6", name: "Priya a/p Kumaran", matricNo: "01DPB22F1006", course: "DPB2022",
    attendance: 85, aiPercentage: 18, averageScore: 71,
    skills: makeSkills("s6", [75, 68], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Solid effort. Work on critical reading.", undefined]),
    notifications: [{ id: "n7", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" }],
  },

  // Course 3: Retailing (s7, s8, s9)
  {
    id: "s7", name: "Mohd Amir bin Yusof", matricNo: "01DPB22F1007", course: "DPB2033",
    attendance: 93, aiPercentage: 10, averageScore: 82,
    skills: makeSkills("s7", [88, 76], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "mastered" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Great analysis skills.", "Keep improving data interpretation."]),
    notifications: [],
  },
  {
    id: "s8", name: "Tan Mei Ling", matricNo: "01DPB22F1008", course: "DPB2033",
    attendance: 78, aiPercentage: 28, averageScore: 55,
    skills: makeSkills("s8", [60, 50], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Needs more effort on synthesis.", "Please reduce AI dependency."]),
    notifications: [{ id: "n8", message: "Warning: AI usage above threshold", date: "2026-04-02", read: false, type: "general" }],
  },
  {
    id: "s9", name: "Kavitha a/p Rajan", matricNo: "01DPB22F1009", course: "DPB2033",
    attendance: 91, aiPercentage: 14, averageScore: 79,
    skills: makeSkills("s9", [82, 76], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Very good work!", "Solid performance."]),
    notifications: [],
  },

  // Course 4: Accounting (s10, s11, s12)
  {
    id: "s10", name: "Lim Chee Keong", matricNo: "01DPA22F1010", course: "DPA1014",
    attendance: 96, aiPercentage: 5, averageScore: 91,
    skills: makeSkills("s10", [95, 87], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "mastered" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Excellent! Top student.", "Maintain this level."]),
    notifications: [],
  },
  {
    id: "s11", name: "Farah binti Hassan", matricNo: "01DPA22F1011", course: "DPA1014",
    attendance: 82, aiPercentage: 20, averageScore: 63,
    skills: makeSkills("s11", [68, 58], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "intensive" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Work on algebraic skills.", "Seek help if needed."]),
    notifications: [],
  },
  {
    id: "s12", name: "Rajesh a/l Muthu", matricNo: "01DPA22F1012", course: "DPA1014",
    attendance: 70, aiPercentage: 40, averageScore: 45,
    skills: makeSkills("s12", [50, 40], ["developing", "intensive"],
      [[{ name: "Critical Reading", status: "intensive" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "intensive" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "intensive" }]],
      ["Very high AI usage. Must submit original work.", "Urgent: Please see me."]),
    notifications: [
      { id: "n9", message: "Warning: Attendance below 80%", date: "2026-04-01", read: false, type: "general" },
      { id: "n10", message: "Warning: AI usage critically high", date: "2026-04-03", read: false, type: "general" },
    ],
  },

  // Course 5: Entrepreneurship (s13, s14, s15)
  {
    id: "s13", name: "Wong Siew Mei", matricNo: "01DPB22F1013", course: "DPB1015",
    attendance: 89, aiPercentage: 16, averageScore: 76,
    skills: makeSkills("s13", [80, 72], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Good entrepreneurial thinking.", "Needs more analytical depth."]),
    notifications: [],
  },
  {
    id: "s14", name: "Amirul bin Zakaria", matricNo: "01DPB22F1014", course: "DPB1015",
    attendance: 84, aiPercentage: 25, averageScore: 60,
    skills: makeSkills("s14", [65, 55], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "intensive" }],
       [{ name: "Statistical Reasoning", status: "intensive" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Fair work, needs more depth.", "Watch AI usage carefully."]),
    notifications: [],
  },
  {
    id: "s15", name: "Divya a/p Suresh", matricNo: "01DPB22F1015", course: "DPB1015",
    attendance: 97, aiPercentage: 7, averageScore: 85,
    skills: makeSkills("s15", [88, 82], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "mastered" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Outstanding creativity!", "Well done."]),
    notifications: [],
  },

  // Course 6: Islamic Banking and Finance (s16, s17, s18)
  {
    id: "s16", name: "Nur Syafiqah binti Omar", matricNo: "01DPB22F1016", course: "DPB3046",
    attendance: 94, aiPercentage: 11, averageScore: 80,
    skills: makeSkills("s16", [84, 76], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Good understanding of Islamic finance principles.", "Keep it up."]),
    notifications: [],
  },
  {
    id: "s17", name: "Chen Wei Lin", matricNo: "01DPB22F1017", course: "DPB3046",
    attendance: 80, aiPercentage: 30, averageScore: 56,
    skills: makeSkills("s17", [62, 50], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Reduce AI reliance.", "More practice needed."]),
    notifications: [{ id: "n11", message: "Warning: AI usage above threshold", date: "2026-04-02", read: false, type: "general" }],
  },
  {
    id: "s18", name: "Arif bin Mohd Noor", matricNo: "01DPB22F1018", course: "DPB3046",
    attendance: 87, aiPercentage: 19, averageScore: 72,
    skills: makeSkills("s18", [76, 68], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Solid grasp of concepts.", "Continue revising."]),
    notifications: [],
  },
];

export const appointments: Appointment[] = [
  { id: "apt1", studentId: "s1", studentName: "Ahmad Farhan bin Ismail", lecturerName: "Dr. Zainab", date: "2026-04-10", time: "10:00 AM", reason: "Discuss Quiz 2 performance", status: "confirmed" },
  { id: "apt2", studentId: "s4", studentName: "Siti Nurhaliza binti Kamal", lecturerName: "Dr. Zainab", date: "2026-04-11", time: "2:00 PM", reason: "AI usage warning discussion", status: "pending" },
  { id: "apt3", studentId: "s12", studentName: "Rajesh a/l Muthu", lecturerName: "Dr. Zainab", date: "2026-04-12", time: "11:00 AM", reason: "Academic intervention meeting", status: "confirmed" },
  { id: "apt4", studentId: "s2", studentName: "Nurul Aisyah binti Abdullah", lecturerName: "Dr. Zainab", date: "2026-04-09", time: "3:00 PM", reason: "Extra tutorial discussion", status: "completed" },
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

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
  dateOfBirth: string;
  gender: "Male" | "Female";
  icNumber: string;
  financialAid: "PTPTN" | "JPA Scholarship" | "State Scholarship" | "None" | "PTPTN (Processing)";
  hostel: boolean;
  enrollmentStatus: "Active" | "At-Risk" | "Probation" | "Academic Warning";
  program: string;
  nationality: string;
  race: string;
}

export interface ConsistencyFlag {
  type: "ok" | "warning" | "alert";
  category: string;
  message: string;
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

export interface ExternalProblem {
  id: string;
  studentId: string;
  category: "financial" | "health" | "family" | "mental" | "academic" | "other";
  description: string;
  date: string;
  severity: "low" | "medium" | "high";
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
  createdBy: "student" | "lecturer";
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
    profile: {
      phone: "011-2345 6781", email: "farhan.ismail@student.edu.my",
      address: "No. 12, Jalan Merbau, Kuala Lumpur",
      semester: 3, intake: "June 2022",
      guardian: "Ismail bin Ahmad", guardianPhone: "012-3456 7890",
      dateOfBirth: "2004-08-15", gender: "Male", icNumber: "040815-14-5231",
      financialAid: "PTPTN", hostel: false, enrollmentStatus: "Active",
      program: "Diploma in Business (Logistic and Distribution)",
      nationality: "Malaysian", race: "Malay",
    },
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
    profile: {
      phone: "011-2345 6782", email: "aisyah.abdullah@student.edu.my",
      address: "Blok C, Apt Sri Dahlia, Petaling Jaya",
      semester: 3, intake: "June 2022",
      guardian: "Abdullah bin Yusof", guardianPhone: "013-4567 8901",
      dateOfBirth: "2004-02-20", gender: "Female", icNumber: "040220-10-6172",
      financialAid: "PTPTN (Processing)", hostel: true, enrollmentStatus: "Academic Warning",
      program: "Diploma in Business (Logistic and Distribution)",
      nationality: "Malaysian", race: "Malay",
    },
  },
  {
    id: "s3", name: "Muhammad Hafiz bin Razak", matricNo: "01DPB22F1003", course: "DPB3012",
    attendance: 95, aiPercentage: 8, averageScore: 88,
    skills: makeSkills("s3", [92, 80], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Outstanding work! Consider mentoring peers.", undefined]),
    notifications: [{ id: "n4", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" }],
    profile: {
      phone: "011-2345 6783", email: "hafiz.razak@student.edu.my",
      address: "No. 5, Taman Melati, Shah Alam",
      semester: 3, intake: "June 2022",
      guardian: "Razak bin Hamid", guardianPhone: "014-5678 9012",
      dateOfBirth: "2004-05-03", gender: "Male", icNumber: "040503-10-3847",
      financialAid: "JPA Scholarship", hostel: true, enrollmentStatus: "Active",
      program: "Diploma in Business (Logistic and Distribution)",
      nationality: "Malaysian", race: "Malay",
    },
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
    profile: {
      phone: "011-2345 6784", email: "nurhaliza.kamal@student.edu.my",
      address: "No. 8, Jalan Kenanga, Klang",
      semester: 3, intake: "June 2022",
      guardian: "Kamal bin Osman", guardianPhone: "015-6789 0123",
      dateOfBirth: "2004-11-09", gender: "Female", icNumber: "041109-10-8834",
      financialAid: "PTPTN", hostel: false, enrollmentStatus: "At-Risk",
      program: "Diploma in Business (Commerce)",
      nationality: "Malaysian", race: "Malay",
    },
  },
  {
    id: "s5", name: "Lee Wei Jian", matricNo: "01DPB22F1005", course: "DPB2022",
    attendance: 90, aiPercentage: 12, averageScore: 74,
    skills: makeSkills("s5", [78, 70], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      [undefined, "Good progress. Keep working on statistical reasoning."]),
    notifications: [{ id: "n6", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" }],
    profile: {
      phone: "011-2345 6785", email: "weijian.lee@student.edu.my",
      address: "No. 22, Taman Desa, Subang Jaya",
      semester: 3, intake: "June 2022",
      guardian: "Lee Ah Kow", guardianPhone: "016-7890 1234",
      dateOfBirth: "2004-03-17", gender: "Male", icNumber: "040317-14-2291",
      financialAid: "PTPTN", hostel: false, enrollmentStatus: "Active",
      program: "Diploma in Business (Commerce)",
      nationality: "Malaysian", race: "Chinese",
    },
  },
  {
    id: "s6", name: "Priya a/p Kumaran", matricNo: "01DPB22F1006", course: "DPB2022",
    attendance: 85, aiPercentage: 18, averageScore: 71,
    skills: makeSkills("s6", [75, 68], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Solid effort. Work on critical reading.", undefined]),
    notifications: [{ id: "n7", message: "Quiz 3 due on April 14", date: "2026-04-07", read: false, type: "reminder" }],
    profile: {
      phone: "011-2345 6786", email: "priya.kumaran@student.edu.my",
      address: "No. 15, Jalan Puteri, Puchong",
      semester: 3, intake: "June 2022",
      guardian: "Kumaran a/l Raju", guardianPhone: "017-8901 2345",
      dateOfBirth: "2004-07-22", gender: "Female", icNumber: "040722-14-5563",
      financialAid: "State Scholarship", hostel: true, enrollmentStatus: "Active",
      program: "Diploma in Business (Commerce)",
      nationality: "Malaysian", race: "Indian",
    },
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
    profile: {
      phone: "011-2345 6787", email: "amir.yusof@student.edu.my",
      address: "No. 3, Kampung Baru, Ampang",
      semester: 3, intake: "June 2022",
      guardian: "Yusof bin Ali", guardianPhone: "018-9012 3456",
      dateOfBirth: "2004-01-11", gender: "Male", icNumber: "040111-14-4417",
      financialAid: "PTPTN", hostel: true, enrollmentStatus: "Active",
      program: "Diploma in Business (Retailing)",
      nationality: "Malaysian", race: "Malay",
    },
  },
  {
    id: "s8", name: "Tan Mei Ling", matricNo: "01DPB22F1008", course: "DPB2033",
    attendance: 78, aiPercentage: 28, averageScore: 55,
    skills: makeSkills("s8", [60, 50], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Needs more effort on synthesis.", "Please reduce AI dependency."]),
    notifications: [{ id: "n8", message: "Warning: AI usage above threshold", date: "2026-04-02", read: false, type: "general" }],
    profile: {
      phone: "011-2345 6788", email: "meiling.tan@student.edu.my",
      address: "No. 18, Jalan SS2, Petaling Jaya",
      semester: 3, intake: "June 2022",
      guardian: "Tan Ah Huat", guardianPhone: "019-0123 4567",
      dateOfBirth: "2004-09-30", gender: "Female", icNumber: "040930-14-7712",
      financialAid: "PTPTN", hostel: true, enrollmentStatus: "Academic Warning",
      program: "Diploma in Business (Retailing)",
      nationality: "Malaysian", race: "Chinese",
    },
  },
  {
    id: "s9", name: "Kavitha a/p Rajan", matricNo: "01DPB22F1009", course: "DPB2033",
    attendance: 91, aiPercentage: 14, averageScore: 79,
    skills: makeSkills("s9", [82, 76], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Very good work!", "Solid performance."]),
    notifications: [],
    profile: {
      phone: "011-2345 6789", email: "kavitha.rajan@student.edu.my",
      address: "No. 7, Taman Sentosa, Klang",
      semester: 3, intake: "June 2022",
      guardian: "Rajan a/l Krishnan", guardianPhone: "012-1234 5678",
      dateOfBirth: "2004-04-25", gender: "Female", icNumber: "040425-10-3384",
      financialAid: "State Scholarship", hostel: false, enrollmentStatus: "Active",
      program: "Diploma in Business (Retailing)",
      nationality: "Malaysian", race: "Indian",
    },
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
    profile: {
      phone: "011-3456 7890", email: "cheekeong.lim@student.edu.my",
      address: "No. 10, Jalan Mawar, Cheras",
      semester: 3, intake: "June 2022",
      guardian: "Lim Ah Seng", guardianPhone: "013-2345 6789",
      dateOfBirth: "2004-06-12", gender: "Male", icNumber: "040612-14-1129",
      financialAid: "JPA Scholarship", hostel: false, enrollmentStatus: "Active",
      program: "Diploma in Accountancy",
      nationality: "Malaysian", race: "Chinese",
    },
  },
  {
    id: "s11", name: "Farah binti Hassan", matricNo: "01DPA22F1011", course: "DPA1014",
    attendance: 82, aiPercentage: 20, averageScore: 63,
    skills: makeSkills("s11", [68, 58], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "intensive" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Work on algebraic skills.", "Seek help if needed."]),
    notifications: [],
    profile: {
      phone: "011-3456 7891", email: "farah.hassan@student.edu.my",
      address: "Blok A, Pangsapuri Harmoni, Rawang",
      semester: 3, intake: "June 2022",
      guardian: "Hassan bin Idris", guardianPhone: "014-3456 7890",
      dateOfBirth: "2004-12-01", gender: "Female", icNumber: "041201-10-9943",
      financialAid: "PTPTN", hostel: true, enrollmentStatus: "Active",
      program: "Diploma in Accountancy",
      nationality: "Malaysian", race: "Malay",
    },
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
    profile: {
      phone: "011-3456 7892", email: "rajesh.muthu@student.edu.my",
      address: "No. 25, Taman Seri, Kajang",
      semester: 3, intake: "June 2022",
      guardian: "Muthu a/l Samy", guardianPhone: "015-4567 8901",
      dateOfBirth: "2003-10-07", gender: "Male", icNumber: "031007-14-8823",
      financialAid: "None", hostel: false, enrollmentStatus: "Probation",
      program: "Diploma in Accountancy",
      nationality: "Malaysian", race: "Indian",
    },
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
    profile: {
      phone: "011-4567 8901", email: "siewmei.wong@student.edu.my",
      address: "No. 30, Jalan Anggerik, Seremban",
      semester: 3, intake: "June 2022",
      guardian: "Wong Ah Keat", guardianPhone: "016-5678 9012",
      dateOfBirth: "2004-03-08", gender: "Female", icNumber: "040308-06-6651",
      financialAid: "PTPTN", hostel: false, enrollmentStatus: "Active",
      program: "Diploma in Business (Entrepreneurship)",
      nationality: "Malaysian", race: "Chinese",
    },
  },
  {
    id: "s14", name: "Amirul bin Zakaria", matricNo: "01DPB22F1014", course: "DPB1015",
    attendance: 84, aiPercentage: 25, averageScore: 60,
    skills: makeSkills("s14", [65, 55], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "intensive" }],
       [{ name: "Statistical Reasoning", status: "intensive" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Fair work, needs more depth.", "Watch AI usage carefully."]),
    notifications: [],
    profile: {
      phone: "011-4567 8902", email: "amirul.zakaria@student.edu.my",
      address: "Blok D, Flat Seri Kembangan",
      semester: 3, intake: "June 2022",
      guardian: "Zakaria bin Wahab", guardianPhone: "017-6789 0123",
      dateOfBirth: "2004-08-19", gender: "Male", icNumber: "040819-14-3312",
      financialAid: "PTPTN", hostel: true, enrollmentStatus: "Active",
      program: "Diploma in Business (Entrepreneurship)",
      nationality: "Malaysian", race: "Malay",
    },
  },
  {
    id: "s15", name: "Divya a/p Suresh", matricNo: "01DPB22F1015", course: "DPB1015",
    attendance: 97, aiPercentage: 7, averageScore: 85,
    skills: makeSkills("s15", [88, 82], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "mastered" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Outstanding creativity!", "Well done."]),
    notifications: [],
    profile: {
      phone: "011-4567 8903", email: "divya.suresh@student.edu.my",
      address: "No. 9, Taman Jasmin, Nilai",
      semester: 3, intake: "June 2022",
      guardian: "Suresh a/l Kumar", guardianPhone: "018-7890 1234",
      dateOfBirth: "2004-05-27", gender: "Female", icNumber: "040527-05-7734",
      financialAid: "State Scholarship", hostel: false, enrollmentStatus: "Active",
      program: "Diploma in Business (Entrepreneurship)",
      nationality: "Malaysian", race: "Indian",
    },
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
    profile: {
      phone: "011-5678 9012", email: "syafiqah.omar@student.edu.my",
      address: "No. 14, Jalan Cempaka, Bangi",
      semester: 3, intake: "June 2022",
      guardian: "Omar bin Yaakob", guardianPhone: "019-8901 2345",
      dateOfBirth: "2004-02-14", gender: "Female", icNumber: "040214-06-4421",
      financialAid: "PTPTN", hostel: true, enrollmentStatus: "Active",
      program: "Diploma in Business (Islamic Banking and Finance)",
      nationality: "Malaysian", race: "Malay",
    },
  },
  {
    id: "s17", name: "Chen Wei Lin", matricNo: "01DPB22F1017", course: "DPB3046",
    attendance: 80, aiPercentage: 30, averageScore: 56,
    skills: makeSkills("s17", [62, 50], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Reduce AI reliance.", "More practice needed."]),
    notifications: [{ id: "n11", message: "Warning: AI usage above threshold", date: "2026-04-02", read: false, type: "general" }],
    profile: {
      phone: "011-5678 9013", email: "weilin.chen@student.edu.my",
      address: "No. 20, Taman Bukit, Serdang",
      semester: 3, intake: "June 2022",
      guardian: "Chen Ah Beng", guardianPhone: "012-9012 3456",
      dateOfBirth: "2004-10-16", gender: "Male", icNumber: "041016-10-5598",
      financialAid: "PTPTN", hostel: false, enrollmentStatus: "Academic Warning",
      program: "Diploma in Business (Islamic Banking and Finance)",
      nationality: "Malaysian", race: "Chinese",
    },
  },
  {
    id: "s18", name: "Arif bin Mohd Noor", matricNo: "01DPB22F1018", course: "DPB3046",
    attendance: 87, aiPercentage: 19, averageScore: 72,
    skills: makeSkills("s18", [76, 68], ["developing", "developing"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Solid grasp of concepts.", "Continue revising."]),
    notifications: [],
    profile: {
      phone: "011-5678 9014", email: "arif.noor@student.edu.my",
      address: "No. 6, Kampung Melayu, Semenyih",
      semester: 3, intake: "June 2022",
      guardian: "Mohd Noor bin Ismail", guardianPhone: "013-0123 4567",
      dateOfBirth: "2004-07-05", gender: "Male", icNumber: "040705-10-2267",
      financialAid: "PTPTN", hostel: false, enrollmentStatus: "Active",
      program: "Diploma in Business (Islamic Banking and Finance)",
      nationality: "Malaysian", race: "Malay",
    },
  },
];

export const appointments: Appointment[] = [
  { id: "apt1", studentId: "s1", studentName: "Ahmad Farhan bin Ismail", lecturerName: "Dr. Zainab", date: "2026-04-10", time: "10:00 AM", reason: "Discuss Quiz 2 performance", status: "confirmed", createdBy: "student" },
  { id: "apt2", studentId: "s4", studentName: "Siti Nurhaliza binti Kamal", lecturerName: "Dr. Zainab", date: "2026-04-11", time: "2:00 PM", reason: "AI usage warning discussion", status: "pending", createdBy: "lecturer" },
  { id: "apt3", studentId: "s12", studentName: "Rajesh a/l Muthu", lecturerName: "Dr. Zainab", date: "2026-04-12", time: "11:00 AM", reason: "Academic intervention meeting", status: "confirmed", createdBy: "student" },
  { id: "apt4", studentId: "s2", studentName: "Nurul Aisyah binti Abdullah", lecturerName: "Dr. Zainab", date: "2026-04-09", time: "3:00 PM", reason: "Extra tutorial discussion", status: "completed", createdBy: "student" },
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

export const externalProblems: ExternalProblem[] = [
  { id: "ep1", studentId: "s2", category: "financial", description: "Unable to afford textbooks and study materials for this semester. PTPTN application still processing.", date: "2026-03-15", severity: "high" },
  { id: "ep2", studentId: "s4", category: "family", description: "Family issues affecting focus and attendance. Parents undergoing separation, causing emotional distress.", date: "2026-03-20", severity: "high" },
  { id: "ep3", studentId: "s8", category: "mental", description: "Experiencing anxiety during exams and presentations, leading to reduced study effectiveness.", date: "2026-04-01", severity: "medium" },
  { id: "ep4", studentId: "s12", category: "health", description: "Chronic headaches making it hard to concentrate in class and during study sessions.", date: "2026-03-28", severity: "medium" },
  { id: "ep5", studentId: "s14", category: "academic", description: "Struggling to keep up with coursework due to weak foundation from secondary school.", date: "2026-04-05", severity: "low" },
];

/**
 * Analyzes student profile data against their academic performance and reported problems
 * to detect inconsistencies and verify the integrity of submitted information.
 */
export function analyzeConsistency(student: Student, problems: ExternalProblem[]): ConsistencyFlag[] {
  const flags: ConsistencyFlag[] = [];
  const myProblems = problems.filter(p => p.studentId === student.id);
  const hasFinancialProblem = myProblems.some(p => p.category === "financial");
  const hasHealthProblem = myProblems.some(p => p.category === "health");
  const hasFamilyProblem = myProblems.some(p => p.category === "family");
  const hasMentalProblem = myProblems.some(p => p.category === "mental");
  const hasAcademicProblem = myProblems.some(p => p.category === "academic");

  // 1. Attendance vs. Enrollment Status
  if (student.attendance < 75 && student.profile.enrollmentStatus === "Active") {
    flags.push({
      type: "alert",
      category: "Enrollment Status",
      message: `Attendance is critically low (${student.attendance}%) but enrollment status shows "Active" — status should reflect Academic Warning or Probation.`,
    });
  } else if (student.attendance >= 90 && student.profile.enrollmentStatus === "Probation") {
    flags.push({
      type: "alert",
      category: "Enrollment Status",
      message: `Attendance is high (${student.attendance}%) but enrollment status shows "Probation" — this is inconsistent with attendance data.`,
    });
  } else if (student.attendance < 80 && student.profile.enrollmentStatus === "Active") {
    flags.push({
      type: "warning",
      category: "Enrollment Status",
      message: `Attendance (${student.attendance}%) is below the 80% threshold but enrollment status is still "Active". Consider updating status.`,
    });
  } else {
    flags.push({
      type: "ok",
      category: "Enrollment Status",
      message: `Enrollment status "${student.profile.enrollmentStatus}" is consistent with attendance record (${student.attendance}%).`,
    });
  }

  // 2. Financial Aid vs. Financial Problem
  if (hasFinancialProblem && (student.profile.financialAid === "JPA Scholarship" || student.profile.financialAid === "State Scholarship")) {
    flags.push({
      type: "alert",
      category: "Financial Consistency",
      message: `Student reported a financial problem but holds a full scholarship (${student.profile.financialAid}). Verify if the problem arose after scholarship award or is misrepresented.`,
    });
  } else if (hasFinancialProblem && student.profile.financialAid === "None") {
    flags.push({
      type: "ok",
      category: "Financial Consistency",
      message: "Reported financial hardship is consistent — student has no active financial aid. Support referral is recommended.",
    });
  } else if (hasFinancialProblem && student.profile.financialAid === "PTPTN (Processing)") {
    flags.push({
      type: "ok",
      category: "Financial Consistency",
      message: "Reported financial difficulty is consistent with PTPTN still under processing. Student may need interim support.",
    });
  } else if (!hasFinancialProblem && student.profile.financialAid === "None") {
    flags.push({
      type: "warning",
      category: "Financial Consistency",
      message: "Student has no financial aid and no reported financial problem. Verify whether financial assistance is needed.",
    });
  } else {
    flags.push({
      type: "ok",
      category: "Financial Consistency",
      message: `Financial aid (${student.profile.financialAid}) and problem reports are consistent.`,
    });
  }

  // 3. AI Usage vs. Academic Problem
  if (student.aiPercentage > 30 && !hasAcademicProblem) {
    flags.push({
      type: "warning",
      category: "AI Usage Integrity",
      message: `Very high AI usage (${student.aiPercentage}%) with no academic difficulty reported. This may indicate academic dishonesty rather than genuine need.`,
    });
  } else if (student.aiPercentage > 30 && hasAcademicProblem) {
    flags.push({
      type: "ok",
      category: "AI Usage Integrity",
      message: `High AI usage (${student.aiPercentage}%) aligns with a reported academic problem. Consider providing structured academic support to reduce dependency.`,
    });
  } else if (student.aiPercentage > 20 && student.averageScore < 60) {
    flags.push({
      type: "warning",
      category: "AI Usage Integrity",
      message: `AI usage is elevated (${student.aiPercentage}%) but scores remain low (${student.averageScore}%). Heavy AI use is not improving performance — intervention needed.`,
    });
  } else if (student.aiPercentage <= 20) {
    flags.push({
      type: "ok",
      category: "AI Usage Integrity",
      message: `AI usage (${student.aiPercentage}%) is within the acceptable range. Work appears to reflect genuine student effort.`,
    });
  }

  // 4. Low Attendance vs. External Problems
  if (student.attendance < 80 && !hasHealthProblem && !hasFamilyProblem && !hasMentalProblem) {
    flags.push({
      type: "alert",
      category: "Attendance Justification",
      message: `Attendance is below 80% (${student.attendance}%) but no health, family, or mental health problem has been reported. Absence may be unjustified.`,
    });
  } else if (student.attendance < 80 && (hasHealthProblem || hasFamilyProblem || hasMentalProblem)) {
    flags.push({
      type: "ok",
      category: "Attendance Justification",
      message: `Low attendance (${student.attendance}%) is supported by a reported ${hasFamilyProblem ? "family" : hasHealthProblem ? "health" : "mental health"} problem. Documented and verified.`,
    });
  } else {
    flags.push({
      type: "ok",
      category: "Attendance Justification",
      message: `Attendance (${student.attendance}%) is satisfactory and no concerning absence patterns detected.`,
    });
  }

  // 5. Score vs. Performance Claim
  if (student.averageScore >= 75 && student.profile.enrollmentStatus !== "Active") {
    flags.push({
      type: "alert",
      category: "Academic Performance",
      message: `Average score is strong (${student.averageScore}%) but enrollment status is "${student.profile.enrollmentStatus}". This combination is inconsistent — review status assignment.`,
    });
  } else if (student.averageScore < 50 && student.profile.enrollmentStatus === "Active") {
    flags.push({
      type: "warning",
      category: "Academic Performance",
      message: `Average score is critically low (${student.averageScore}%) but student is still marked "Active". Enrollment status should be updated to reflect academic standing.`,
    });
  } else {
    flags.push({
      type: "ok",
      category: "Academic Performance",
      message: `Average score (${student.averageScore}%) is consistent with enrollment status "${student.profile.enrollmentStatus}".`,
    });
  }

  return flags;
}

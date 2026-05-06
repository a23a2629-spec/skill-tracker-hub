export type SkillStatus = "mastered" | "developing" | "intensive";
export type VerificationStatus = "Verified" | "Pending" | "Inconsistent";
export type TrustIndex = "High" | "Medium" | "Low";

export interface StudentProfile {
  // Module 1: Personal Information
  dateOfBirth: string;
  gender: "Male" | "Female";
  nationality: string;
  race: string;
  religion: string;
  avatar?: string;

  // Module 2: Identification
  icNumber: string;
  passportNumber?: string;
  studentId: string;
  identityVerified: VerificationStatus;

  // Module 3: Contact Information
  phone: string;
  email: string;
  address: string;
  postcode: string;
  state: string;

  // Module 4: Emergency Contact
  guardian: string;
  guardianPhone: string;
  guardianRelation: string;
  guardianEmail: string;

  // Module 5: Academic Background
  previousSchool: string;
  previousQualification: string;
  previousResults: string;
  achievements: string[];
  academicVerified: VerificationStatus;

  // Module 6: University Program Details
  program: string;
  faculty: string;
  levelOfStudy: string;
  intake: string;
  semester: number;
  financialAid: "PTPTN" | "JPA Scholarship" | "State Scholarship" | "None" | "PTPTN (Processing)";

  // Module 7: Enrollment Information
  registrationStatus: "Registered" | "Deferral" | "Withdrawn";
  enrollmentStatus: "Active" | "At-Risk" | "Probation" | "Academic Warning";
  advisor: string;
  campus: string;

  // Module 8: Academic Performance
  cgpa: number;
  gpa: number;
  hostel: boolean;

  // Module 9: Financial Information
  monthlyHouseholdIncome: number;
  incomeCategory: "B40" | "M40" | "T20";
  paymentStatus: "Paid" | "Pending" | "Overdue";
  sponsorAmount: number;
  financialVerified: VerificationStatus;

  // Module 10: Family Background
  fatherName: string;
  fatherOccupation: string;
  fatherIncome: number;
  motherName: string;
  motherOccupation: string;
  motherIncome: number;
  siblings: number;
  householdSize: number;
  parentMaritalStatus: "Married" | "Divorced" | "Widowed" | "Single Parent";
  familyVerified: VerificationStatus;

  // Module 11: Health Information
  bloodType: string;
  medicalConditions: string[];
  allergies: string[];
  disabilityStatus: "None" | "Physical" | "Visual" | "Hearing" | "Learning";
  healthInsurance: "Active" | "None";
  healthVerified: VerificationStatus;

  // Module 12: Mental Health (high privacy)
  counselingStatus: "None" | "Active" | "Referred" | "Completed";
  lastCounselorVisit?: string;
  counselorName?: string;
  mentalHealthVerified: VerificationStatus;

  // Module 13: Accommodation (part of hostel above)
  hostelBlock?: string;
  hostelRoom?: string;

  // Module 14: Skills & Interests
  technicalSkills: string[];
  softSkills: string[];
  careerGoal: string;
  cocurricular: string[];

  // Module 15: Disciplinary Records
  disciplinaryRecord: "Clean" | "Warning" | "Suspension";
  violations: number;
  disciplinaryNotes?: string;

  // Module 16: Documents
  documentsUploaded: string[];
}

export interface ConsistencyFlag {
  type: "ok" | "warning" | "alert";
  category: string;
  message: string;
  domain: "financial" | "academic" | "health" | "family" | "mental" | "identity" | "integrity";
}

export interface IntegrityReport {
  trustIndex: TrustIndex;
  trustScore: number;
  flags: ConsistencyFlag[];
  domainStatuses: Record<string, VerificationStatus>;
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

export interface ChatMessage {
  id: string;
  threadId: string;
  studentId: string;
  studentName: string;
  contactName: string;
  senderRole: "student" | "lecturer";
  body: string;
  timestamp: string;
  read: boolean;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  type: "assignment" | "progress" | "incident" | "general";
  courseId?: string;
  dueDate?: string;
  createdDate: string;
}

export interface ReportSubmission {
  id: string;
  templateId?: string;
  studentId: string;
  studentName: string;
  title: string;
  description?: string;
  fileName: string;
  fileDataUrl: string;
  fileType: string;
  submittedDate: string;
  status: "submitted" | "reviewed" | "acknowledged";
  lecturerNote?: string;
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
  // ── Course 1: Logistic and Distribution ──────────────────────────────────
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
      dateOfBirth: "2004-08-15", gender: "Male", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "040815-14-5231", studentId: "01DPB22F1001", identityVerified: "Verified",
      phone: "011-2345 6781", email: "farhan.ismail@student.edu.my", address: "No. 12, Jalan Merbau", postcode: "50480", state: "Kuala Lumpur",
      guardian: "Ismail bin Ahmad", guardianPhone: "012-3456 7890", guardianRelation: "Father", guardianEmail: "ismail.ahmad@gmail.com",
      previousSchool: "SMK Dato' Harun, Kuala Lumpur", previousQualification: "SPM (2021)", previousResults: "4A 3B 2C", achievements: ["Best Student Award 2021", "Prefect Board Secretary"],
      academicVerified: "Verified",
      program: "Diploma in Business (Logistic and Distribution)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Dr. Zainab binti Mohd Noor", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.12, gpa: 3.05, hostel: false,
      monthlyHouseholdIncome: 3200, incomeCategory: "B40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Ismail bin Ahmad", fatherOccupation: "Technician (Telco)", fatherIncome: 2800, motherName: "Rohani binti Salleh", motherOccupation: "Housewife", motherIncome: 0, siblings: 3, householdSize: 6, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "B+", medicalConditions: [], allergies: ["Dust allergy (mild)"], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      hostelBlock: undefined, hostelRoom: undefined,
      technicalSkills: ["Microsoft Excel", "Logistics Software (SAP basics)", "Data Entry"], softSkills: ["Communication", "Teamwork", "Time Management"], careerGoal: "Supply Chain Manager", cocurricular: ["Badminton Club", "Student Council"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Offer Letter"],
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
    notifications: [{ id: "n3", message: "You are flagged for intensive support in Statistical Reasoning", date: "2026-03-26", read: false, type: "general" }],
    profile: {
      dateOfBirth: "2004-02-20", gender: "Female", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "040220-10-6172", studentId: "01DPB22F1002", identityVerified: "Verified",
      phone: "011-2345 6782", email: "aisyah.abdullah@student.edu.my", address: "Blok C, Apt Sri Dahlia", postcode: "47810", state: "Selangor",
      guardian: "Abdullah bin Yusof", guardianPhone: "013-4567 8901", guardianRelation: "Father", guardianEmail: "abdullah.yusof@gmail.com",
      previousSchool: "SMK Sri Muda, Shah Alam", previousQualification: "SPM (2021)", previousResults: "3A 4B 2C", achievements: ["Volleyball Team Member"],
      academicVerified: "Verified",
      program: "Diploma in Business (Logistic and Distribution)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN (Processing)",
      registrationStatus: "Registered", enrollmentStatus: "Academic Warning", advisor: "Dr. Zainab binti Mohd Noor", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.45, gpa: 2.30, hostel: true,
      monthlyHouseholdIncome: 1800, incomeCategory: "B40", paymentStatus: "Pending", sponsorAmount: 0, financialVerified: "Pending",
      fatherName: "Abdullah bin Yusof", fatherOccupation: "Lorry Driver", fatherIncome: 1800, motherName: "Fatimah binti Kassim", motherOccupation: "Housewife", motherIncome: 0, siblings: 4, householdSize: 7, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "O+", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "None", healthVerified: "Pending",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      hostelBlock: "Blok B", hostelRoom: "B-214",
      technicalSkills: ["Microsoft Word", "Basic Excel"], softSkills: ["Hardworking", "Cooperative"], careerGoal: "Logistics Coordinator", cocurricular: ["Volleyball Club"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Application Form"],
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
      dateOfBirth: "2004-05-03", gender: "Male", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "040503-10-3847", studentId: "01DPB22F1003", identityVerified: "Verified",
      phone: "011-2345 6783", email: "hafiz.razak@student.edu.my", address: "No. 5, Taman Melati", postcode: "40150", state: "Selangor",
      guardian: "Razak bin Hamid", guardianPhone: "014-5678 9012", guardianRelation: "Father", guardianEmail: "razak.hamid@gmail.com",
      previousSchool: "SMK Seksyen 18, Shah Alam", previousQualification: "SPM (2021)", previousResults: "7A 2B", achievements: ["Best Student 2021", "Head Prefect", "MRSM Merit Award"],
      academicVerified: "Verified",
      program: "Diploma in Business (Logistic and Distribution)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "JPA Scholarship",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Dr. Zainab binti Mohd Noor", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.72, gpa: 3.68, hostel: true,
      monthlyHouseholdIncome: 5500, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 9200, financialVerified: "Verified",
      fatherName: "Razak bin Hamid", fatherOccupation: "Senior Engineer", fatherIncome: 4500, motherName: "Azizah binti Daud", motherOccupation: "Teacher", motherIncome: 3800, siblings: 2, householdSize: 5, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "A+", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      hostelBlock: "Blok A", hostelRoom: "A-105",
      technicalSkills: ["SAP Logistics", "Advanced Excel", "Power BI (basic)", "Python (basic)"], softSkills: ["Leadership", "Critical Thinking", "Public Speaking"], careerGoal: "Supply Chain Director", cocurricular: ["Debate Club (Captain)", "Student Council President", "Academic Excellence Programme"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "JPA Award Letter", "Offer Letter", "Medical Report"],
    },
  },

  // ── Course 2: Commerce ───────────────────────────────────────────────────
  {
    id: "s4", name: "Siti Nurhaliza binti Kamal", matricNo: "01DPB22F1004", course: "DPB2022",
    attendance: 75, aiPercentage: 35, averageScore: 52,
    skills: makeSkills("s4", [55, 48], ["developing", "intensive"],
      [[{ name: "Critical Reading", status: "developing" }, { name: "Source Synthesis", status: "intensive" }, { name: "Algebraic Fluency", status: "intensive" }],
       [{ name: "Statistical Reasoning", status: "intensive" }, { name: "Applied Data Interpretation", status: "intensive" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["High AI usage detected. Ensure original work.", "Attendance is low. Please see me."]),
    notifications: [{ id: "n5", message: "Warning: Attendance below 80%", date: "2026-04-01", read: false, type: "general" }],
    profile: {
      dateOfBirth: "2004-11-09", gender: "Female", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "041109-10-8834", studentId: "01DPB22F1004", identityVerified: "Verified",
      phone: "011-2345 6784", email: "nurhaliza.kamal@student.edu.my", address: "No. 8, Jalan Kenanga", postcode: "41000", state: "Selangor",
      guardian: "Kamal bin Osman", guardianPhone: "015-6789 0123", guardianRelation: "Father", guardianEmail: "kamal.osman@gmail.com",
      previousSchool: "SMK Klang Utama, Klang", previousQualification: "SPM (2021)", previousResults: "3A 5B 1C", achievements: [],
      academicVerified: "Verified",
      program: "Diploma in Business (Commerce)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "At-Risk", advisor: "Dr. Zainab binti Mohd Noor", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.20, gpa: 2.05, hostel: false,
      monthlyHouseholdIncome: 2100, incomeCategory: "B40", paymentStatus: "Pending", sponsorAmount: 6500, financialVerified: "Pending",
      fatherName: "Kamal bin Osman", fatherOccupation: "Security Guard", fatherIncome: 1200, motherName: "Rosnah binti Bakar", motherOccupation: "Freelance Seamstress", motherIncome: 900, siblings: 3, householdSize: 5, parentMaritalStatus: "Divorced", familyVerified: "Pending",
      bloodType: "A-", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "None", healthVerified: "Pending",
      counselingStatus: "Referred", lastCounselorVisit: "2026-03-28", counselorName: "Pn. Suraya (Kaunseling Pelajar)", mentalHealthVerified: "Pending",
      hostelBlock: undefined, hostelRoom: undefined,
      technicalSkills: ["Microsoft Office"], softSkills: ["Adaptable", "Caring"], careerGoal: "Business Executive", cocurricular: ["Choir Club"],
      disciplinaryRecord: "Warning", violations: 1, disciplinaryNotes: "AI policy violation — submitted AI-generated content without disclosure (2026-03-20).",
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter"],
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
      dateOfBirth: "2004-03-17", gender: "Male", nationality: "Malaysian", race: "Chinese", religion: "Buddhism",
      icNumber: "040317-14-2291", studentId: "01DPB22F1005", identityVerified: "Verified",
      phone: "011-2345 6785", email: "weijian.lee@student.edu.my", address: "No. 22, Taman Desa", postcode: "47500", state: "Selangor",
      guardian: "Lee Ah Kow", guardianPhone: "016-7890 1234", guardianRelation: "Father", guardianEmail: "leeak@gmail.com",
      previousSchool: "SMK Subang Jaya", previousQualification: "SPM (2021)", previousResults: "5A 3B 1C", achievements: ["Mathematics Olympiad Participant"],
      academicVerified: "Verified",
      program: "Diploma in Business (Commerce)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Dr. Zainab binti Mohd Noor", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.00, gpa: 2.95, hostel: false,
      monthlyHouseholdIncome: 6800, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Lee Ah Kow", fatherOccupation: "Retail Business Owner", fatherIncome: 5500, motherName: "Lim Siew Lan", motherOccupation: "Accounts Clerk", motherIncome: 2800, siblings: 1, householdSize: 4, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "O-", medicalConditions: ["Mild asthma (managed)"], allergies: ["Peanuts"], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      technicalSkills: ["Microsoft Excel (Advanced)", "Accounting Software", "SPSS"], softSkills: ["Analytical Thinking", "Diligence", "Problem Solving"], careerGoal: "Finance Analyst", cocurricular: ["Chinese Cultural Society", "Mathematics Club"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Medical Report"],
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
      dateOfBirth: "2004-07-22", gender: "Female", nationality: "Malaysian", race: "Indian", religion: "Hinduism",
      icNumber: "040722-14-5563", studentId: "01DPB22F1006", identityVerified: "Verified",
      phone: "011-2345 6786", email: "priya.kumaran@student.edu.my", address: "No. 15, Jalan Puteri", postcode: "47100", state: "Selangor",
      guardian: "Kumaran a/l Raju", guardianPhone: "017-8901 2345", guardianRelation: "Father", guardianEmail: "kumaran.raju@gmail.com",
      previousSchool: "SMK Puchong Perdana", previousQualification: "SPM (2021)", previousResults: "5A 4B", achievements: ["Best Literature Student", "Drama Club Lead"],
      academicVerified: "Verified",
      program: "Diploma in Business (Commerce)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "State Scholarship",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Dr. Zainab binti Mohd Noor", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.90, gpa: 2.85, hostel: true,
      monthlyHouseholdIncome: 8200, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 8000, financialVerified: "Verified",
      fatherName: "Kumaran a/l Raju", fatherOccupation: "Pharmacist", fatherIncome: 6500, motherName: "Vimala a/p Subramaniam", motherOccupation: "Nurse", motherIncome: 4200, siblings: 2, householdSize: 5, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "B+", medicalConditions: [], allergies: ["Penicillin (severe)"], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      hostelBlock: "Blok C", hostelRoom: "C-308",
      technicalSkills: ["Microsoft PowerPoint", "Canva", "Social Media Marketing"], softSkills: ["Creativity", "Communication", "Empathy"], careerGoal: "Marketing Manager", cocurricular: ["Drama Society", "Debate Club"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "State Scholarship Letter", "Offer Letter"],
    },
  },

  // ── Course 3: Retailing ──────────────────────────────────────────────────
  {
    id: "s7", name: "Mohd Amir bin Yusof", matricNo: "01DPB22F1007", course: "DPB2033",
    attendance: 93, aiPercentage: 10, averageScore: 82,
    skills: makeSkills("s7", [88, 76], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "developing" }],
       [{ name: "Statistical Reasoning", status: "mastered" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Great analysis skills.", "Keep improving data interpretation."]),
    notifications: [],
    profile: {
      dateOfBirth: "2004-01-11", gender: "Male", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "040111-14-4417", studentId: "01DPB22F1007", identityVerified: "Verified",
      phone: "011-2345 6787", email: "amir.yusof@student.edu.my", address: "No. 3, Kampung Baru", postcode: "68000", state: "Selangor",
      guardian: "Yusof bin Ali", guardianPhone: "018-9012 3456", guardianRelation: "Father", guardianEmail: "yusof.ali@gmail.com",
      previousSchool: "SMK Ampang", previousQualification: "SPM (2021)", previousResults: "6A 2B 1C", achievements: ["School Football Captain", "Best Discipline Award"],
      academicVerified: "Verified",
      program: "Diploma in Business (Retailing)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Pn. Rashidah binti Rahim", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.30, gpa: 3.25, hostel: true,
      monthlyHouseholdIncome: 4200, incomeCategory: "B40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Yusof bin Ali", fatherOccupation: "Plumber (Self-employed)", fatherIncome: 3200, motherName: "Ramlah binti Daud", motherOccupation: "Canteen Operator", motherIncome: 1800, siblings: 3, householdSize: 6, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "O+", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      hostelBlock: "Blok A", hostelRoom: "A-220",
      technicalSkills: ["Retail POS Systems", "Inventory Management Software", "Excel"], softSkills: ["Leadership", "Discipline", "Teamwork"], careerGoal: "Retail Operations Manager", cocurricular: ["Football Team", "Entrepreneurs Club"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Offer Letter"],
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
      dateOfBirth: "2004-09-30", gender: "Female", nationality: "Malaysian", race: "Chinese", religion: "Buddhism",
      icNumber: "040930-14-7712", studentId: "01DPB22F1008", identityVerified: "Verified",
      phone: "011-2345 6788", email: "meiling.tan@student.edu.my", address: "No. 18, Jalan SS2", postcode: "47300", state: "Selangor",
      guardian: "Tan Ah Huat", guardianPhone: "019-0123 4567", guardianRelation: "Father", guardianEmail: "tanahuat@gmail.com",
      previousSchool: "SMK SS17, Subang Jaya", previousQualification: "SPM (2021)", previousResults: "3A 5B 1C", achievements: ["School Band Member"],
      academicVerified: "Verified",
      program: "Diploma in Business (Retailing)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Academic Warning", advisor: "Pn. Rashidah binti Rahim", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.25, gpa: 2.10, hostel: true,
      monthlyHouseholdIncome: 2900, incomeCategory: "B40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Tan Ah Huat", fatherOccupation: "Hawker (Food Stall Owner)", fatherIncome: 2200, motherName: "Lim Bee Choo", motherOccupation: "Cashier", motherIncome: 1800, siblings: 2, householdSize: 5, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "AB+", medicalConditions: ["Generalized Anxiety Disorder (GAD)", "Insomnia"], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "Active", lastCounselorVisit: "2026-04-08", counselorName: "Dr. Suraya (University Counselor)", mentalHealthVerified: "Pending",
      hostelBlock: "Blok B", hostelRoom: "B-315",
      technicalSkills: ["Microsoft Office", "Canva"], softSkills: ["Creative", "Empathetic", "Detail-oriented"], careerGoal: "Visual Merchandiser", cocurricular: ["Art Club", "Mental Health Awareness Society"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Medical Report (GAD)", "Counseling Referral Letter"],
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
      dateOfBirth: "2004-04-25", gender: "Female", nationality: "Malaysian", race: "Indian", religion: "Hinduism",
      icNumber: "040425-10-3384", studentId: "01DPB22F1009", identityVerified: "Verified",
      phone: "011-2345 6789", email: "kavitha.rajan@student.edu.my", address: "No. 7, Taman Sentosa", postcode: "41000", state: "Selangor",
      guardian: "Rajan a/l Krishnan", guardianPhone: "012-1234 5678", guardianRelation: "Father", guardianEmail: "rajan.krishnan@gmail.com",
      previousSchool: "SMK Kapar", previousQualification: "SPM (2021)", previousResults: "6A 3B", achievements: ["Best Science Student", "Netball Team"],
      academicVerified: "Verified",
      program: "Diploma in Business (Retailing)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "State Scholarship",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Pn. Rashidah binti Rahim", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.18, gpa: 3.12, hostel: false,
      monthlyHouseholdIncome: 7500, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 8000, financialVerified: "Verified",
      fatherName: "Rajan a/l Krishnan", fatherOccupation: "Electrical Engineer", fatherIncome: 6200, motherName: "Meena a/p Selvam", motherOccupation: "Laboratory Technician", motherIncome: 4000, siblings: 1, householdSize: 4, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "B-", medicalConditions: [], allergies: ["Shellfish"], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      technicalSkills: ["Retail Analytics", "Excel", "Customer Relationship Tools"], softSkills: ["Interpersonal Skills", "Adaptability", "Initiative"], careerGoal: "Retail Brand Manager", cocurricular: ["Netball Team", "Student Welfare Committee"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "State Scholarship Letter", "Offer Letter"],
    },
  },

  // ── Course 4: Accounting ─────────────────────────────────────────────────
  {
    id: "s10", name: "Lim Chee Keong", matricNo: "01DPA22F1010", course: "DPA1014",
    attendance: 96, aiPercentage: 5, averageScore: 91,
    skills: makeSkills("s10", [95, 87], ["mastered", "mastered"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "mastered" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "mastered" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Excellent! Top student.", "Maintain this level."]),
    notifications: [],
    profile: {
      dateOfBirth: "2004-06-12", gender: "Male", nationality: "Malaysian", race: "Chinese", religion: "Buddhism",
      icNumber: "040612-14-1129", studentId: "01DPA22F1010", identityVerified: "Verified",
      phone: "011-3456 7890", email: "cheekeong.lim@student.edu.my", address: "No. 10, Jalan Mawar", postcode: "56000", state: "Kuala Lumpur",
      guardian: "Lim Ah Seng", guardianPhone: "013-2345 6789", guardianRelation: "Father", guardianEmail: "limseng@gmail.com",
      previousSchool: "SMJK Chung Hua, Cheras", previousQualification: "SPM (2021)", previousResults: "8A 1B", achievements: ["National Accounting Olympiad 3rd Place", "Head Prefect", "Best Student Award"],
      academicVerified: "Verified",
      program: "Diploma in Accountancy", faculty: "Faculty of Accountancy", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "JPA Scholarship",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Prof. Madya Dr. Hairul", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.91, gpa: 3.88, hostel: false,
      monthlyHouseholdIncome: 9200, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 9200, financialVerified: "Verified",
      fatherName: "Lim Ah Seng", fatherOccupation: "Accountant (Senior)", fatherIncome: 7500, motherName: "Tan Siew Peng", motherOccupation: "Bookkeeper", motherIncome: 3500, siblings: 1, householdSize: 4, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "A+", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      technicalSkills: ["MYOB Accounting", "SQL Accounting", "Excel (Expert)", "SPSS", "Python for Finance"], softSkills: ["Precision", "Integrity", "Analytical Thinking", "Leadership"], careerGoal: "Chartered Accountant (CA)", cocurricular: ["Accounting Society (President)", "Chess Club", "Academic Excellence Programme"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "JPA Award Letter", "Offer Letter", "Medical Report"],
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
      dateOfBirth: "2004-12-01", gender: "Female", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "041201-10-9943", studentId: "01DPA22F1011", identityVerified: "Verified",
      phone: "011-3456 7891", email: "farah.hassan@student.edu.my", address: "Blok A, Pangsapuri Harmoni", postcode: "48000", state: "Selangor",
      guardian: "Hassan bin Idris", guardianPhone: "014-3456 7890", guardianRelation: "Father", guardianEmail: "hassan.idris@gmail.com",
      previousSchool: "SMK Rawang", previousQualification: "SPM (2021)", previousResults: "4A 4B 1C", achievements: ["Librarian Club Member"],
      academicVerified: "Verified",
      program: "Diploma in Accountancy", faculty: "Faculty of Accountancy", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Prof. Madya Dr. Hairul", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.62, gpa: 2.55, hostel: true,
      monthlyHouseholdIncome: 5100, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Hassan bin Idris", fatherOccupation: "Site Supervisor", fatherIncome: 4200, motherName: "Noraini binti Saat", motherOccupation: "Admin Clerk", motherIncome: 2800, siblings: 2, householdSize: 5, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "O+", medicalConditions: ["Astigmatism (corrected with glasses)"], allergies: [], disabilityStatus: "Visual", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      hostelBlock: "Blok C", hostelRoom: "C-112",
      technicalSkills: ["SQL Accounting (basic)", "Microsoft Excel", "Word Processing"], softSkills: ["Diligence", "Patience", "Cooperation"], careerGoal: "Tax Consultant", cocurricular: ["Library Club", "Islamic Affairs Society"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Medical Report (Eyes)"],
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
      dateOfBirth: "2003-10-07", gender: "Male", nationality: "Malaysian", race: "Indian", religion: "Hinduism",
      icNumber: "031007-14-8823", studentId: "01DPA22F1012", identityVerified: "Verified",
      phone: "011-3456 7892", email: "rajesh.muthu@student.edu.my", address: "No. 25, Taman Seri", postcode: "43000", state: "Selangor",
      guardian: "Muthu a/l Samy", guardianPhone: "015-4567 8901", guardianRelation: "Father", guardianEmail: "muthu.samy@gmail.com",
      previousSchool: "SMK Kajang", previousQualification: "SPM (2021)", previousResults: "2A 4B 3C", achievements: [],
      academicVerified: "Pending",
      program: "Diploma in Accountancy", faculty: "Faculty of Accountancy", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "None",
      registrationStatus: "Registered", enrollmentStatus: "Probation", advisor: "Prof. Madya Dr. Hairul", campus: "Main Campus, Kuala Lumpur",
      cgpa: 1.90, gpa: 1.75, hostel: false,
      monthlyHouseholdIncome: 1500, incomeCategory: "B40", paymentStatus: "Overdue", sponsorAmount: 0, financialVerified: "Inconsistent",
      fatherName: "Muthu a/l Samy", fatherOccupation: "Odd-Job Worker", fatherIncome: 1000, motherName: "Selvi a/p Ramu", motherOccupation: "Cleaner", motherIncome: 900, siblings: 5, householdSize: 8, parentMaritalStatus: "Married", familyVerified: "Pending",
      bloodType: "B+", medicalConditions: ["Chronic Migraine Disorder", "Cervicogenic Headache"], allergies: ["Ibuprofen"], disabilityStatus: "None", healthInsurance: "None", healthVerified: "Pending",
      counselingStatus: "Referred", lastCounselorVisit: "2026-04-05", counselorName: "Pn. Suraya (Kaunseling Pelajar)", mentalHealthVerified: "Pending",
      technicalSkills: ["Basic Computer Usage"], softSkills: ["Perseverance", "Resourcefulness"], careerGoal: "Accounts Executive",
      cocurricular: [],
      disciplinaryRecord: "Warning", violations: 2, disciplinaryNotes: "AI policy violations (×2): Submitted AI-generated quiz answers without disclosure on 2026-03-12 and 2026-03-28. Academic Integrity Review in progress.",
      documentsUploaded: ["IC Copy", "SPM Certificate", "Medical Report (Migraine)"],
    },
  },

  // ── Course 5: Entrepreneurship ───────────────────────────────────────────
  {
    id: "s13", name: "Wong Siew Mei", matricNo: "01DPB22F1013", course: "DPB1015",
    attendance: 89, aiPercentage: 16, averageScore: 76,
    skills: makeSkills("s13", [80, 72], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "developing" }, { name: "Disciplinary Vocabulary", status: "mastered" }]],
      ["Good entrepreneurial thinking.", "Needs more analytical depth."]),
    notifications: [],
    profile: {
      dateOfBirth: "2004-03-08", gender: "Female", nationality: "Malaysian", race: "Chinese", religion: "Christianity",
      icNumber: "040308-06-6651", studentId: "01DPB22F1013", identityVerified: "Verified",
      phone: "011-4567 8901", email: "siewmei.wong@student.edu.my", address: "No. 30, Jalan Anggerik", postcode: "70200", state: "Negeri Sembilan",
      guardian: "Wong Ah Keat", guardianPhone: "016-5678 9012", guardianRelation: "Father", guardianEmail: "wongkeat@gmail.com",
      previousSchool: "SMK Seremban 2", previousQualification: "SPM (2021)", previousResults: "5A 4B", achievements: ["Young Entrepreneur Competition Winner", "School Magazine Editor"],
      academicVerified: "Verified",
      program: "Diploma in Business (Entrepreneurship)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "En. Faridz bin Azman", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.08, gpa: 3.05, hostel: false,
      monthlyHouseholdIncome: 6000, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Wong Ah Keat", fatherOccupation: "SME Owner (Hardware Shop)", fatherIncome: 5200, motherName: "Chen Li Fong", motherOccupation: "Admin Manager", motherIncome: 3800, siblings: 1, householdSize: 4, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "A-", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      technicalSkills: ["Business Plan Writing", "Canva", "Digital Marketing", "Basic E-Commerce"], softSkills: ["Entrepreneurial Mindset", "Creativity", "Resilience", "Networking"], careerGoal: "Startup Founder / Social Entrepreneur", cocurricular: ["Entrepreneurship Club (Vice-President)", "Young Leaders Society"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Offer Letter"],
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
      dateOfBirth: "2004-08-19", gender: "Male", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "040819-14-3312", studentId: "01DPB22F1014", identityVerified: "Verified",
      phone: "011-4567 8902", email: "amirul.zakaria@student.edu.my", address: "Blok D, Flat Seri Kembangan", postcode: "43300", state: "Selangor",
      guardian: "Zakaria bin Wahab", guardianPhone: "017-6789 0123", guardianRelation: "Father", guardianEmail: "zakaria.wahab@gmail.com",
      previousSchool: "SMK Seri Kembangan", previousQualification: "SPM (2021)", previousResults: "2A 5B 2C", achievements: [],
      academicVerified: "Verified",
      program: "Diploma in Business (Entrepreneurship)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "En. Faridz bin Azman", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.48, gpa: 2.40, hostel: true,
      monthlyHouseholdIncome: 3800, incomeCategory: "B40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Zakaria bin Wahab", fatherOccupation: "Factory Operator", fatherIncome: 2800, motherName: "Noriza binti Mat", motherOccupation: "Kindergarten Teacher", motherIncome: 1600, siblings: 4, householdSize: 7, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "O+", medicalConditions: ["Mild Dyslexia (diagnosed 2019)"], allergies: [], disabilityStatus: "Learning", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "Completed", lastCounselorVisit: "2026-02-15", counselorName: "Pn. Suraya (Kaunseling Pelajar)", mentalHealthVerified: "Verified",
      hostelBlock: "Blok D", hostelRoom: "D-407",
      technicalSkills: ["Microsoft Office (basic)", "Social Media"], softSkills: ["Persistence", "Social Skills", "Creativity"], careerGoal: "Own a Small Business", cocurricular: ["Entrepreneurship Club", "Futsal Team"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Dyslexia Assessment Report", "Counseling Completion Letter"],
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
      dateOfBirth: "2004-05-27", gender: "Female", nationality: "Malaysian", race: "Indian", religion: "Hinduism",
      icNumber: "040527-05-7734", studentId: "01DPB22F1015", identityVerified: "Verified",
      phone: "011-4567 8903", email: "divya.suresh@student.edu.my", address: "No. 9, Taman Jasmin", postcode: "71800", state: "Negeri Sembilan",
      guardian: "Suresh a/l Kumar", guardianPhone: "018-7890 1234", guardianRelation: "Father", guardianEmail: "suresh.kumar@gmail.com",
      previousSchool: "SMK Nilai", previousQualification: "SPM (2021)", previousResults: "7A 2B", achievements: ["National Science Fair Gold Medal", "School Valedictorian"],
      academicVerified: "Verified",
      program: "Diploma in Business (Entrepreneurship)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "State Scholarship",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "En. Faridz bin Azman", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.65, gpa: 3.60, hostel: false,
      monthlyHouseholdIncome: 7800, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 8000, financialVerified: "Verified",
      fatherName: "Suresh a/l Kumar", fatherOccupation: "Senior IT Manager", fatherIncome: 6500, motherName: "Rani a/p Nair", motherOccupation: "University Lecturer", motherIncome: 5800, siblings: 1, householdSize: 4, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "A+", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      technicalSkills: ["Business Analytics", "Python (intermediate)", "Digital Marketing", "Pitch Deck Design"], softSkills: ["Strategic Thinking", "Innovation", "Public Speaking", "Mentoring"], careerGoal: "Tech Entrepreneur / Venture Capitalist", cocurricular: ["Entrepreneurship Club (Treasurer)", "AIESEC Member", "Innovation Challenge Finalist"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "State Scholarship Letter", "Offer Letter", "Science Fair Certificate"],
    },
  },

  // ── Course 6: Islamic Banking and Finance ────────────────────────────────
  {
    id: "s16", name: "Nur Syafiqah binti Omar", matricNo: "01DPB22F1016", course: "DPB3046",
    attendance: 94, aiPercentage: 11, averageScore: 80,
    skills: makeSkills("s16", [84, 76], ["mastered", "developing"],
      [[{ name: "Critical Reading", status: "mastered" }, { name: "Source Synthesis", status: "developing" }, { name: "Algebraic Fluency", status: "mastered" }],
       [{ name: "Statistical Reasoning", status: "developing" }, { name: "Applied Data Interpretation", status: "mastered" }, { name: "Disciplinary Vocabulary", status: "developing" }]],
      ["Good understanding of Islamic finance principles.", "Keep it up."]),
    notifications: [],
    profile: {
      dateOfBirth: "2004-02-14", gender: "Female", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "040214-06-4421", studentId: "01DPB22F1016", identityVerified: "Verified",
      phone: "011-5678 9012", email: "syafiqah.omar@student.edu.my", address: "No. 14, Jalan Cempaka", postcode: "43650", state: "Selangor",
      guardian: "Omar bin Yaakob", guardianPhone: "019-8901 2345", guardianRelation: "Father", guardianEmail: "omar.yaakob@gmail.com",
      previousSchool: "SMKA Al-Ansar, Bangi", previousQualification: "SPM (2021)", previousResults: "5A 3B 1C", achievements: ["Quran Recitation Competition 2nd Place", "School Treasurer"],
      academicVerified: "Verified",
      program: "Diploma in Business (Islamic Banking and Finance)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Dr. Asma binti Sulaiman", campus: "Main Campus, Kuala Lumpur",
      cgpa: 3.22, gpa: 3.18, hostel: true,
      monthlyHouseholdIncome: 4500, incomeCategory: "B40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Omar bin Yaakob", fatherOccupation: "Islamic Finance Officer", fatherIncome: 3800, motherName: "Zainab binti Hashim", motherOccupation: "Islamic Studies Teacher", motherIncome: 3500, siblings: 3, householdSize: 6, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "O+", medicalConditions: [], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      hostelBlock: "Blok B", hostelRoom: "B-118",
      technicalSkills: ["Islamic Finance Principles", "Excel", "IFRS Basics"], softSkills: ["Integrity", "Communication", "Responsibility"], careerGoal: "Islamic Finance Consultant", cocurricular: ["Islamic Finance Society (Secretary)", "Quran Society"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Offer Letter"],
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
      dateOfBirth: "2004-10-16", gender: "Male", nationality: "Malaysian", race: "Chinese", religion: "Buddhism",
      icNumber: "041016-10-5598", studentId: "01DPB22F1017", identityVerified: "Verified",
      phone: "011-5678 9013", email: "weilin.chen@student.edu.my", address: "No. 20, Taman Bukit", postcode: "43400", state: "Selangor",
      guardian: "Chen Ah Beng", guardianPhone: "012-9012 3456", guardianRelation: "Father", guardianEmail: "chenab@gmail.com",
      previousSchool: "SMK Serdang", previousQualification: "SPM (2021)", previousResults: "3A 4B 2C", achievements: [],
      academicVerified: "Verified",
      program: "Diploma in Business (Islamic Banking and Finance)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Academic Warning", advisor: "Dr. Asma binti Sulaiman", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.28, gpa: 2.20, hostel: false,
      monthlyHouseholdIncome: 4900, incomeCategory: "M40", paymentStatus: "Pending", sponsorAmount: 6500, financialVerified: "Pending",
      fatherName: "Chen Ah Beng", fatherOccupation: "Mechanic (Workshop Owner)", fatherIncome: 4200, motherName: "Yap Siew Kim", motherOccupation: "Seamstress", motherIncome: 1800, siblings: 3, householdSize: 6, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "B+", medicalConditions: ["Mild Attention Deficit (not formally diagnosed)"], allergies: [], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Pending",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      technicalSkills: ["Basic Finance Software", "Excel (basic)"], softSkills: ["Friendly", "Cooperative", "Hardworking"], careerGoal: "Bank Officer", cocurricular: ["Basketball Team"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter"],
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
      dateOfBirth: "2004-07-05", gender: "Male", nationality: "Malaysian", race: "Malay", religion: "Islam",
      icNumber: "040705-10-2267", studentId: "01DPB22F1018", identityVerified: "Verified",
      phone: "011-5678 9014", email: "arif.noor@student.edu.my", address: "No. 6, Kampung Melayu", postcode: "43500", state: "Selangor",
      guardian: "Mohd Noor bin Ismail", guardianPhone: "013-0123 4567", guardianRelation: "Father", guardianEmail: "noor.ismail@gmail.com",
      previousSchool: "SMK Semenyih", previousQualification: "SPM (2021)", previousResults: "4A 4B 1C", achievements: ["Silat Team Member", "Community Service Award"],
      academicVerified: "Verified",
      program: "Diploma in Business (Islamic Banking and Finance)", faculty: "Faculty of Business & Commerce", levelOfStudy: "Diploma", intake: "June 2022", semester: 3, financialAid: "PTPTN",
      registrationStatus: "Registered", enrollmentStatus: "Active", advisor: "Dr. Asma binti Sulaiman", campus: "Main Campus, Kuala Lumpur",
      cgpa: 2.90, gpa: 2.88, hostel: false,
      monthlyHouseholdIncome: 5200, incomeCategory: "M40", paymentStatus: "Paid", sponsorAmount: 6500, financialVerified: "Verified",
      fatherName: "Mohd Noor bin Ismail", fatherOccupation: "Government Officer (Grade 41)", fatherIncome: 4500, motherName: "Haslinda binti Ghazali", motherOccupation: "Nurse (Hospital Selayang)", motherIncome: 4200, siblings: 2, householdSize: 5, parentMaritalStatus: "Married", familyVerified: "Verified",
      bloodType: "B+", medicalConditions: [], allergies: ["Seafood (mild)"], disabilityStatus: "None", healthInsurance: "Active", healthVerified: "Verified",
      counselingStatus: "None", mentalHealthVerified: "Verified",
      technicalSkills: ["Islamic Finance Principles", "Excel", "Basic Banking Software"], softSkills: ["Discipline", "Adaptability", "Work Ethic"], careerGoal: "Islamic Bank Manager", cocurricular: ["Silat Club (Treasurer)", "Community Service Club"],
      disciplinaryRecord: "Clean", violations: 0,
      documentsUploaded: ["IC Copy", "SPM Certificate", "PTPTN Letter", "Offer Letter"],
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
  { id: "ep1", studentId: "s2", category: "financial", description: "Unable to afford textbooks and study materials. PTPTN application still under processing — no disbursement received yet.", date: "2026-03-15", severity: "high" },
  { id: "ep2", studentId: "s4", category: "family", description: "Parents undergoing separation. Home environment is emotionally distressing, affecting focus and attendance.", date: "2026-03-20", severity: "high" },
  { id: "ep3", studentId: "s8", category: "mental", description: "Experiencing Generalized Anxiety Disorder (GAD). Exams and presentations trigger panic attacks. Currently under active counseling.", date: "2026-04-01", severity: "medium" },
  { id: "ep4", studentId: "s12", category: "health", description: "Chronic migraine disorder causing severe headaches up to 3x per week. Difficulty concentrating during lectures and study.", date: "2026-03-28", severity: "medium" },
  { id: "ep5", studentId: "s14", category: "academic", description: "Mild Dyslexia affecting reading speed and written comprehension. Completed counseling; support plan in place.", date: "2026-04-05", severity: "low" },
];

// ── Integrity Analysis Engine ─────────────────────────────────────────────

export function analyzeIntegrity(student: Student, problems: ExternalProblem[]): IntegrityReport {
  const flags: ConsistencyFlag[] = [];
  const p = student.profile;
  const myProblems = problems.filter(x => x.studentId === student.id);

  const hasFinancialProblem = myProblems.some(x => x.category === "financial");
  const hasHealthProblem = myProblems.some(x => x.category === "health");
  const hasFamilyProblem = myProblems.some(x => x.category === "family");
  const hasMentalProblem = myProblems.some(x => x.category === "mental");
  const hasAcademicProblem = myProblems.some(x => x.category === "academic");

  // ── A. Financial Verification ─────────────────────────────────────────
  const totalFamilyIncome = p.fatherIncome + p.motherIncome;
  const declaredIncomeMatchCategory =
    (p.incomeCategory === "B40" && totalFamilyIncome < 4850) ||
    (p.incomeCategory === "M40" && totalFamilyIncome >= 4850 && totalFamilyIncome <= 10971) ||
    (p.incomeCategory === "T20" && totalFamilyIncome > 10971);

  if (!declaredIncomeMatchCategory) {
    flags.push({ type: "alert", category: "Financial — Income Declaration", domain: "financial",
      message: `Declared household income (RM ${totalFamilyIncome.toLocaleString()}/month) does not match the stated income category "${p.incomeCategory}". Requires income proof re-submission.` });
  } else {
    flags.push({ type: "ok", category: "Financial — Income Declaration", domain: "financial",
      message: `Declared income (RM ${totalFamilyIncome.toLocaleString()}/month) is consistent with income category "${p.incomeCategory}".` });
  }

  if (hasFinancialProblem && (p.financialAid === "JPA Scholarship" || p.financialAid === "State Scholarship")) {
    flags.push({ type: "alert", category: "Financial — Aid Consistency", domain: "financial",
      message: `Student reported a financial hardship but holds a full scholarship (${p.financialAid}). Verify whether the problem arose after the scholarship was awarded.` });
  } else if (p.incomeCategory === "B40" && p.financialAid === "None") {
    flags.push({ type: "alert", category: "Financial — Aid Eligibility", domain: "financial",
      message: `Student is classified as B40 (household income RM ${totalFamilyIncome.toLocaleString()}/month) but has no financial aid. Student likely qualifies for PTPTN or hardship assistance — urgent follow-up required.` });
  } else if (hasFinancialProblem && p.financialAid === "PTPTN (Processing)") {
    flags.push({ type: "ok", category: "Financial — Aid Consistency", domain: "financial",
      message: "Reported financial difficulty is consistent with PTPTN still under processing. Interim support referral recommended." });
  } else {
    flags.push({ type: "ok", category: "Financial — Aid Consistency", domain: "financial",
      message: `Financial aid (${p.financialAid}) is appropriate for income category ${p.incomeCategory}.` });
  }

  if (p.paymentStatus === "Overdue") {
    flags.push({ type: "alert", category: "Financial — Payment Status", domain: "financial",
      message: "Tuition payment is OVERDUE. Student may face enrollment suspension. Immediate financial counseling required." });
  } else if (p.paymentStatus === "Pending") {
    flags.push({ type: "warning", category: "Financial — Payment Status", domain: "financial",
      message: "Tuition payment is pending. Verify disbursement timeline from sponsoring body." });
  } else {
    flags.push({ type: "ok", category: "Financial — Payment Status", domain: "financial",
      message: "Tuition payment is up to date." });
  }

  // ── B. Academic Verification ──────────────────────────────────────────
  const prevResultsGrade = p.previousResults.match(/(\d+)A/)?.[1];
  const aCount = prevResultsGrade ? parseInt(prevResultsGrade) : 0;
  const expectedPerformance = aCount >= 6 ? "high" : aCount >= 4 ? "medium" : "developing";
  const actualPerformance = student.averageScore >= 75 ? "high" : student.averageScore >= 55 ? "medium" : "developing";

  if (expectedPerformance === "high" && actualPerformance === "developing") {
    flags.push({ type: "warning", category: "Academic — Performance Consistency", domain: "academic",
      message: `Previous results show strong SPM performance (${p.previousResults}) but current average is low (${student.averageScore}%). Significant drop — verify whether external factors are influencing performance.` });
  } else if (expectedPerformance === "developing" && actualPerformance === "high") {
    flags.push({ type: "ok", category: "Academic — Performance Consistency", domain: "academic",
      message: `Student's current performance (${student.averageScore}%) exceeds expectations based on SPM results (${p.previousResults}). Strong improvement trajectory.` });
  } else {
    flags.push({ type: "ok", category: "Academic — Performance Consistency", domain: "academic",
      message: `Current academic performance (${student.averageScore}%) is consistent with prior qualifications (${p.previousResults}).` });
  }

  if (student.aiPercentage > 30 && !hasAcademicProblem) {
    flags.push({ type: "alert", category: "Academic — AI Usage Integrity", domain: "academic",
      message: `AI usage is critically high (${student.aiPercentage}%) with no documented academic difficulty. This pattern may indicate academic dishonesty. Human review required before any action.` });
  } else if (student.aiPercentage > 25 && student.averageScore < 60) {
    flags.push({ type: "warning", category: "Academic — AI Usage Integrity", domain: "academic",
      message: `High AI usage (${student.aiPercentage}%) is not improving scores (${student.averageScore}%). Dependency without comprehension — structured academic support recommended.` });
  } else if (student.aiPercentage <= 20) {
    flags.push({ type: "ok", category: "Academic — AI Usage Integrity", domain: "academic",
      message: `AI usage (${student.aiPercentage}%) is within acceptable limits. Work reflects genuine student effort.` });
  } else {
    flags.push({ type: "ok", category: "Academic — AI Usage Integrity", domain: "academic",
      message: `AI usage (${student.aiPercentage}%) is elevated but within review threshold.` });
  }

  if (p.violations > 0) {
    flags.push({ type: "alert", category: "Academic — Disciplinary Record", domain: "academic",
      message: `${p.violations} disciplinary violation(s) recorded: ${p.disciplinaryNotes || "See records."}` });
  } else {
    flags.push({ type: "ok", category: "Academic — Disciplinary Record", domain: "academic",
      message: "No disciplinary violations on record. Academic integrity maintained." });
  }

  // ── C. Health Verification ────────────────────────────────────────────
  if (hasHealthProblem && p.medicalConditions.length === 0) {
    flags.push({ type: "alert", category: "Health — Report Consistency", domain: "health",
      message: "Student reported a health problem but no medical conditions are recorded in the health profile. Medical documentation required to verify the reported condition." });
  } else if (hasHealthProblem && p.medicalConditions.length > 0) {
    flags.push({ type: "ok", category: "Health — Report Consistency", domain: "health",
      message: `Reported health problem is consistent with documented medical condition(s): ${p.medicalConditions.join(", ")}.` });
  } else if (p.medicalConditions.length > 0) {
    flags.push({ type: "warning", category: "Health — Report Consistency", domain: "health",
      message: `Medical conditions on record (${p.medicalConditions.join(", ")}) but no formal problem report submitted. Assess if academic accommodations are needed.` });
  } else {
    flags.push({ type: "ok", category: "Health — Report Consistency", domain: "health",
      message: "No medical conditions reported. Health profile is clear." });
  }

  if (p.disabilityStatus !== "None" && !p.documentsUploaded.some(d => d.toLowerCase().includes("medical") || d.toLowerCase().includes("assessment"))) {
    flags.push({ type: "warning", category: "Health — Disability Documentation", domain: "health",
      message: `Disability status recorded as "${p.disabilityStatus}" but no supporting medical/assessment document is uploaded. Documentation required for accommodation eligibility.` });
  } else if (p.disabilityStatus !== "None") {
    flags.push({ type: "ok", category: "Health — Disability Documentation", domain: "health",
      message: `Disability (${p.disabilityStatus}) is documented with supporting records. Accommodation plan should be reviewed.` });
  }

  // ── D. Family Background Verification ────────────────────────────────
  if (hasFamilyProblem && p.parentMaritalStatus === "Married") {
    flags.push({ type: "warning", category: "Family — Status Consistency", domain: "family",
      message: "Student reported a family problem. Parental status shows 'Married', which may not reflect current situation (e.g. separation in progress). Guardianship and household status should be re-verified." });
  } else if (hasFamilyProblem && (p.parentMaritalStatus === "Divorced" || p.parentMaritalStatus === "Single Parent")) {
    flags.push({ type: "ok", category: "Family — Status Consistency", domain: "family",
      message: `Reported family issue is consistent with household background (${p.parentMaritalStatus}). Social welfare referral may be appropriate.` });
  } else {
    flags.push({ type: "ok", category: "Family — Status Consistency", domain: "family",
      message: `Family background is verified. Household: ${p.householdSize} members, ${p.siblings} sibling(s), status: ${p.parentMaritalStatus}.` });
  }

  // ── E. Mental Health Verification ────────────────────────────────────
  if (hasMentalProblem && p.counselingStatus === "None") {
    flags.push({ type: "alert", category: "Mental Health — Support Gap", domain: "mental",
      message: "Student reported a mental health concern but has no active counseling or referral on record. Immediate referral to campus counseling services is required. (Access restricted to authorized personnel.)" });
  } else if (hasMentalProblem && (p.counselingStatus === "Active" || p.counselingStatus === "Referred")) {
    flags.push({ type: "ok", category: "Mental Health — Support Status", domain: "mental",
      message: `Mental health concern is being addressed. Counseling status: ${p.counselingStatus}. Supervised by ${p.counselorName || "campus counselor"}. (Restricted access — summary view only.)` });
  } else if (p.counselingStatus === "Active" || p.counselingStatus === "Referred") {
    flags.push({ type: "warning", category: "Mental Health — Support Tracking", domain: "mental",
      message: `Active counseling on record (${p.counselorName || "campus counselor"}) but no associated problem report submitted. Student privacy is protected — no further disclosure without consent.` });
  } else {
    flags.push({ type: "ok", category: "Mental Health — Support Status", domain: "mental",
      message: "No mental health concerns flagged. Wellbeing status: Clear. (Access to detailed records restricted.)" });
  }

  // ── Enrollment & Identity ─────────────────────────────────────────────
  if (student.attendance < 75 && p.enrollmentStatus === "Active") {
    flags.push({ type: "alert", category: "Identity — Enrollment Status", domain: "identity",
      message: `Attendance is critically low (${student.attendance}%) but status shows "Active". Enrollment status must be updated to reflect academic standing.` });
  } else if (student.attendance >= 90 && p.enrollmentStatus === "Probation") {
    flags.push({ type: "alert", category: "Identity — Enrollment Status", domain: "identity",
      message: `Attendance is high (${student.attendance}%) but status is "Probation". This is contradictory — status review required.` });
  } else {
    flags.push({ type: "ok", category: "Identity — Enrollment Status", domain: "identity",
      message: `Enrollment status "${p.enrollmentStatus}" is consistent with attendance record (${student.attendance}%) and academic standing.` });
  }

  // ── Trust Index Calculation ───────────────────────────────────────────
  const okCount = flags.filter(f => f.type === "ok").length;
  const warnCount = flags.filter(f => f.type === "warning").length;
  const alertCount = flags.filter(f => f.type === "alert").length;
  const totalFlags = flags.length;
  const rawScore = (okCount * 2 + warnCount * 1 + alertCount * 0) / (totalFlags * 2);
  const trustScore = Math.round(rawScore * 100);

  const trustIndex: TrustIndex = trustScore >= 75 ? "High" : trustScore >= 45 ? "Medium" : "Low";

  const domainStatuses: Record<string, VerificationStatus> = {
    Financial: p.financialVerified,
    Academic: p.academicVerified,
    Health: p.healthVerified,
    Family: p.familyVerified,
    Identity: p.identityVerified,
    "Mental Health": p.mentalHealthVerified,
  };

  return { trustIndex, trustScore, flags, domainStatuses };
}

// Keep legacy export for backward compat
export function analyzeConsistency(student: Student, problems: ExternalProblem[]) {
  return analyzeIntegrity(student, problems).flags;
}

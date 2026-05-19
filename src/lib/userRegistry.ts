import { Student, StudentProfile, courses } from "@/data/mockData";

const REG_STUDENTS_KEY = "skills-tracker-reg-students";
const REG_LECTURERS_KEY = "skills-tracker-reg-lecturers";

export interface RegisteredLecturer {
  id: string;
  username: string;
  password: string;
  name: string;
  staffId: string;
  email: string;
  faculty: string;
}

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getRegisteredStudents(): Student[] {
  return load<Student>(REG_STUDENTS_KEY);
}

export function getRegisteredLecturers(): RegisteredLecturer[] {
  return load<RegisteredLecturer>(REG_LECTURERS_KEY);
}

export interface StudentSignupData {
  name: string;
  matricNo: string;
  icNumber: string;
  email: string;
  phone: string;
  password: string;
  courseCode: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
}

export interface LecturerSignupData {
  name: string;
  username: string;
  staffId: string;
  email: string;
  faculty: string;
  password: string;
}

const defaultProfile = (data: StudentSignupData): StudentProfile => {
  const course = courses.find(c => c.code === data.courseCode);
  return {
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    nationality: "Malaysian",
    race: "—",
    religion: "—",
    icNumber: data.icNumber,
    studentId: data.matricNo,
    identityVerified: "Pending",
    phone: data.phone,
    email: data.email,
    address: "—",
    postcode: "—",
    state: "—",
    guardian: "—",
    guardianPhone: "—",
    guardianRelation: "—",
    guardianEmail: "—",
    previousSchool: "—",
    previousQualification: "—",
    previousResults: "—",
    achievements: [],
    academicVerified: "Pending",
    program: course?.name ?? data.courseCode,
    faculty: "Faculty of Business & Commerce",
    levelOfStudy: "Diploma",
    intake: new Date().getFullYear().toString(),
    semester: 1,
    financialAid: "None",
    registrationStatus: "Registered",
    enrollmentStatus: "Active",
    advisor: "—",
    campus: "Main Campus",
    cgpa: 0,
    gpa: 0,
    hostel: false,
    monthlyHouseholdIncome: 0,
    incomeCategory: "B40",
    paymentStatus: "Pending",
    sponsorAmount: 0,
    financialVerified: "Pending",
    fatherName: "—",
    fatherOccupation: "—",
    fatherIncome: 0,
    motherName: "—",
    motherOccupation: "—",
    motherIncome: 0,
    siblings: 0,
    householdSize: 1,
    parentMaritalStatus: "Married",
    familyVerified: "Pending",
    bloodType: "—",
    medicalConditions: [],
    allergies: [],
    disabilityStatus: "None",
    healthInsurance: "None",
    healthVerified: "Pending",
    counselingStatus: "None",
    mentalHealthVerified: "Pending",
    technicalSkills: [],
    softSkills: [],
    careerGoal: "—",
    cocurricular: [],
    disciplinaryRecord: "Clean",
    violations: 0,
    documentsUploaded: [],
  };
};

export function registerStudent(data: StudentSignupData): { success: boolean; error?: string } {
  const existing = getRegisteredStudents();
  if (existing.find(s => s.matricNo.toLowerCase() === data.matricNo.toLowerCase())) {
    return { success: false, error: "Matric number is already registered." };
  }
  const id = `reg-s-${Date.now()}`;
  const newStudent: Student = {
    id,
    name: data.name,
    matricNo: data.matricNo.toUpperCase(),
    course: data.courseCode,
    attendance: 100,
    aiPercentage: 0,
    averageScore: 0,
    skills: [],
    notifications: [],
    profile: defaultProfile(data),
  };
  save(REG_STUDENTS_KEY, [...existing, newStudent]);
  localStorage.setItem(`skills-tracker-pass-${id}`, data.password);
  return { success: true };
}

export function registerLecturer(data: LecturerSignupData): { success: boolean; error?: string } {
  const existing = getRegisteredLecturers();
  if (existing.find(l => l.username.toLowerCase() === data.username.toLowerCase())) {
    return { success: false, error: "Username is already taken." };
  }
  const id = `reg-l-${Date.now()}`;
  const newLecturer: RegisteredLecturer = {
    id,
    username: data.username.toLowerCase(),
    password: data.password,
    name: data.name,
    staffId: data.staffId,
    email: data.email,
    faculty: data.faculty,
  };
  save(REG_LECTURERS_KEY, [...existing, newLecturer]);
  return { success: true };
}

export function getStudentPassword(studentId: string): string | null {
  return localStorage.getItem(`skills-tracker-pass-${studentId}`);
}

export function getAllStudents(mockStudents: Student[]): Student[] {
  return [...mockStudents, ...getRegisteredStudents()];
}

// ── Persistent student edits (lecturer can edit any student) ──────────────
const STUDENT_OVERRIDES_KEY = "skills-tracker-student-overrides";

function loadOverrides(): Record<string, Student> {
  try {
    const raw = localStorage.getItem(STUDENT_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStudentUpdate(student: Student) {
  if (student.id.startsWith("reg-s-")) {
    const existing = getRegisteredStudents();
    save(REG_STUDENTS_KEY, existing.map(s => s.id === student.id ? student : s));
  } else {
    const overrides = loadOverrides();
    overrides[student.id] = student;
    localStorage.setItem(STUDENT_OVERRIDES_KEY, JSON.stringify(overrides));
  }
}

export function applyStudentOverrides(studentList: Student[]): Student[] {
  const overrides = loadOverrides();
  return studentList.map(s => (overrides[s.id] ? { ...s, ...overrides[s.id] } : s));
}

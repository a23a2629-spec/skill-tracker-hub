export type Role = "student" | "lecturer" | "visitor";

interface FAQEntry {
  keywords: string[];
  roles: Role[];
  answer: string;
}

const FAQ: FAQEntry[] = [
  // ── PLATFORM OVERVIEW ────────────────────────────────────────────────────
  {
    keywords: ["what is", "about", "platform", "app", "skills gap tracker", "in-campus", "incampus", "overview"],
    roles: ["student", "lecturer", "visitor"],
    answer: "**In-Campus Skills Gap Tracker** is a university platform that helps lecturers detect skill gaps early and helps students track their own progress.\n\nKey features:\n- 📊 Skill analysis (Mastered / Developing / Intensive)\n- 📅 Appointment booking between students and lecturers\n- 🤖 AI Insights and recommendations\n- 📝 Reports and case management\n- 💬 In-app messaging",
  },
  {
    keywords: ["how do i log in", "login", "sign in", "credentials", "demo"],
    roles: ["visitor", "student", "lecturer"],
    answer: "**To log in:**\n\n**As a Student:**\n1. Select the **Student** tab\n2. Enter your Matric Number (e.g. 01DPB22F1001)\n3. Enter password: **student123**\n4. Click **Sign in as Student**\n\n**As a Lecturer:**\n1. Select the **Lecturer** tab\n2. Enter username (e.g. zainab, hairul, rashidah)\n3. Enter password: **lecturer123**\n4. Click **Sign in as Lecturer**\n\nOr click **Use demo credentials** to fill them in automatically.",
  },
  {
    keywords: ["create account", "register", "signup", "sign up", "new user"],
    roles: ["visitor", "student", "lecturer"],
    answer: "**To create an account:**\n\n1. On the login page, click **Create an account**\n2. Choose your role — Student or Lecturer\n3. Fill in your details (name, matric/staff ID, email, password)\n4. Click **Create Account**\n\nYou can then log in with your new credentials.",
  },

  // ── SKILL COLORS ──────────────────────────────────────────────────────────
  {
    keywords: ["skill color", "color mean", "colour", "green", "yellow", "red", "mastered", "developing", "intensive", "status"],
    roles: ["student", "lecturer", "visitor"],
    answer: "**Skill status colors:**\n\n🟢 **Green — Mastered**\nThe student has a strong grasp of this skill (score ≥ 75%).\n\n🟡 **Yellow — Developing**\nThe student is making progress but needs more practice (50–74%).\n\n🔴 **Red — Intensive**\nThe student needs urgent support and intervention (below 50%).",
  },

  // ── STUDENT: DASHBOARD ────────────────────────────────────────────────────
  {
    keywords: ["dashboard", "overview", "my record", "student record"],
    roles: ["student"],
    answer: "**Your Student Dashboard** gives you a full CRM-style overview:\n\n1. Click **Dashboard** in the left sidebar\n2. See your **attendance %, average score, and skill summary** at the top\n3. Use the tabs below — **Overview, Academic, Financial, Health, Activities, Integrity, Timeline** — to explore each area\n4. The right panel shows your **Next Best Action** and **AI Recommendations**",
  },
  {
    keywords: ["skill analysis", "skill", "assessment", "quiz", "my skills", "view skill"],
    roles: ["student"],
    answer: "**To view your skill analysis:**\n\n1. Go to **Dashboard** in the sidebar\n2. Click the **Academic** tab in the main content area\n3. You'll see all your completed quizzes and assessments with skill breakdowns\n4. Each skill shows its status: 🟢 Mastered · 🟡 Developing · 🔴 Intensive\n\nYou can also click **Analytics** in the sidebar for chart views.",
  },
  {
    keywords: ["profile", "my profile", "update profile", "personal info", "edit profile"],
    roles: ["student"],
    answer: "**To view or update your profile:**\n\n1. Click **My Profile** in the left sidebar\n2. Browse the 16 profile modules using the tabs:\n   - **Personal** — name, ID, contact, guardian\n   - **Academic** — program, GPA, assessments\n   - **Financial** — income, PTPTN, payments\n   - **Health** — medical, counseling, accommodation\n   - **Activities** — skills, co-curricular, disciplinary\n3. Click **Edit** on any section to update your details",
  },
  {
    keywords: ["appointment", "book appointment", "meeting", "schedule", "book a meeting"],
    roles: ["student"],
    answer: "**To book an appointment with your lecturer:**\n\n1. Click **Meetings** in the left sidebar\n2. Click **Book Appointment**\n3. Select a **date and time**\n4. Enter the **reason** for the meeting\n5. Click **Submit**\n\nYour lecturer will receive the request and can confirm or reschedule it. You'll see the status update in your Meetings section.",
  },
  {
    keywords: ["external problem", "report problem", "case", "issue", "support", "report an issue"],
    roles: ["student"],
    answer: "**To report an external problem:**\n\n1. Click **Cases** in the left sidebar\n2. Click **Report a Problem**\n3. Choose a **category** (Financial, Health, Family, Mental, Academic, Other)\n4. Set the **severity** (Low / Medium / High)\n5. Describe the issue\n6. Click **Submit**\n\nYour lecturer can view and respond to your case from their dashboard.",
  },
  {
    keywords: ["message", "chat", "contact lecturer", "send message"],
    roles: ["student"],
    answer: "**To message your lecturer:**\n\n1. Click **Contacts** in the left sidebar\n2. Find your lecturer's name\n3. Click **Send Message**\n4. Type your message and click **Send**\n\nYou can view the full conversation thread in the Contacts section.",
  },
  {
    keywords: ["analytics", "chart", "progress", "trend", "performance"],
    roles: ["student"],
    answer: "**To view your analytics:**\n\n1. Click **Analytics** in the left sidebar\n2. See your score trends across assessments in a line chart\n3. Track improvement or areas that need work\n\nYour **Dashboard** also shows a quick summary with attendance, average score, and skill breakdown.",
  },
  {
    keywords: ["report", "submit report", "assignment report"],
    roles: ["student"],
    answer: "**To view or submit reports:**\n\n1. Click **Reports** in the left sidebar\n2. You'll see report templates created by your lecturer\n3. Click a template to submit your response\n4. Upload a file if required and click **Submit**\n\nYou can track the status of each submission (Submitted / Reviewed / Acknowledged).",
  },
  {
    keywords: ["ai insight", "recommendation", "suggestion", "smart", "ai section"],
    roles: ["student"],
    answer: "**To view AI Insights:**\n\n1. Click **AI Insights** in the left sidebar\n2. See personalized recommendations based on your scores, attendance, and skill gaps\n3. The right panel on your Dashboard also shows quick AI recommendations\n\nThese are generated automatically based on your real data.",
  },

  // ── LECTURER: STUDENTS ────────────────────────────────────────────────────
  {
    keywords: ["filter student", "filter by course", "search student", "find student", "student list"],
    roles: ["lecturer"],
    answer: "**To filter students by course:**\n\n1. Go to **Students** in the left sidebar\n2. Use the **Course** dropdown at the top to filter by a specific course code\n3. Or use the **header search bar** to search by student name, matric number, or course\n\nClick any student row to open their full profile.",
  },
  {
    keywords: ["student profile", "view student", "student detail", "student record"],
    roles: ["lecturer"],
    answer: "**To view a student's profile:**\n\n1. Click **Students** in the sidebar\n2. Find the student in the list (use search or filter by course)\n3. Click the student's row or the **View** button\n4. You'll see their full profile including skills, attendance, GPA, financial info, and more",
  },
  {
    keywords: ["generate report", "report template", "create report", "assessment report"],
    roles: ["lecturer"],
    answer: "**To generate or create reports:**\n\n1. Click **Reports** in the sidebar\n2. Click **New Template** to create a report assignment for students\n3. Fill in the title, type, and due date\n4. Students will see it and can submit their response\n\nYou can view all student submissions and mark them as Reviewed or Acknowledged.",
  },
  {
    keywords: ["track progress", "monitor student", "student progress"],
    roles: ["lecturer"],
    answer: "**To track student progress:**\n\n1. Go to **Dashboard** for the overall cohort overview\n2. Click **Analytics** for skill distribution charts and course comparisons\n3. Click **Students** then open a student's profile to see their detailed skill breakdown\n4. At-risk students appear highlighted in the **Dashboard** bottom section",
  },
  {
    keywords: ["schedule meeting", "book meeting", "appointment", "schedule student"],
    roles: ["lecturer"],
    answer: "**To schedule a meeting with a student:**\n\n1. Click **Appointments** in the sidebar\n2. Click **Book Appointment**\n3. Select the **student**, date, time, and reason\n4. Click **Book**\n\nThe student will receive a request and can accept or decline it. You can also approve student-initiated appointment requests from this same section.",
  },
  {
    keywords: ["ai insight", "ai recommendation", "intervention", "at risk", "at-risk"],
    roles: ["lecturer"],
    answer: "**To view AI Insights for your cohort:**\n\n1. Click **AI Insights** in the sidebar\n2. See a summary of your cohort's overall health — average scores, attendance, skill gaps\n3. At-risk students are highlighted with recommended interventions\n4. Use these insights to decide which students need immediate support",
  },
  {
    keywords: ["message student", "chat student", "send message", "messages"],
    roles: ["lecturer"],
    answer: "**To message a student:**\n\n1. Click **Messages** in the sidebar\n2. Find the student's conversation thread\n3. Type your message and press **Send**\n\nStudents can reply from their own Contacts section and you'll see their response here.",
  },
  {
    keywords: ["add student", "new student", "enroll student"],
    roles: ["lecturer"],
    answer: "**To add a new student:**\n\n1. Click **Students** in the sidebar\n2. Click **Add Student** (top right)\n3. Fill in the student's details\n4. Click **Create**\n\nThe student will appear in your list immediately.",
  },
  {
    keywords: ["case", "problem", "reported issue", "external problem", "view case"],
    roles: ["lecturer"],
    answer: "**To view student-reported cases:**\n\n1. Click **Cases / Problems** in the sidebar\n2. You'll see all problems reported by students with their severity level\n3. Click any case to view the full description\n\nCategories include: Financial, Health, Family, Mental, Academic, and Other.",
  },
  {
    keywords: ["academic management", "faculty", "course management", "manage course"],
    roles: ["lecturer"],
    answer: "**To manage faculties and courses:**\n\n1. Click **Academic Management** in the sidebar\n2. Use the **Faculties** tab to add or remove faculties\n3. Use the **Courses** tab to create or edit course codes and assign students\n\nChanges take effect immediately in the system.",
  },

  // ── SHARED ────────────────────────────────────────────────────────────────
  {
    keywords: ["dark mode", "light mode", "theme", "toggle theme"],
    roles: ["student", "lecturer", "visitor"],
    answer: "**To toggle dark/light mode:**\n\nClick the **sun/moon icon** in the top-right header area.\n\nThe theme is saved automatically and will persist the next time you log in.",
  },
  {
    keywords: ["search", "search bar", "how to search"],
    roles: ["student", "lecturer"],
    answer: "**Using the search bar:**\n\n**Lecturers:** The header search bar lets you find any student by name, matric number, or course. Results appear as a dropdown — click any result to jump to that student.\n\n**Students:** The header search bar lets you jump to any profile module (e.g. \"Health\", \"Financial\", \"Meetings\"). Click a result to navigate there instantly.",
  },
  {
    keywords: ["logout", "log out", "sign out"],
    roles: ["student", "lecturer"],
    answer: "**To log out:**\n\n- Click the **Logout** button in the bottom of the left sidebar\n- Or click your **profile avatar** in the top-right header and select **Sign out**\n\nYour session will be cleared and you'll return to the login page.",
  },
  {
    keywords: ["notification", "bell", "alert"],
    roles: ["student", "lecturer"],
    answer: "**Notifications** appear via the **bell icon** in the top header.\n\nFor **students**: reminders about upcoming quizzes, lecturer comments, and appointment requests.\n\nFor **lecturers**: pending appointment requests from students appear here.",
  },
  {
    keywords: ["settings", "preference", "account settings"],
    roles: ["student", "lecturer"],
    answer: "**To access Settings:**\n\n1. Click **Settings** at the bottom of the left sidebar\n2. Manage your profile preferences and notification options",
  },
];

export function getAnswer(text: string, role: Role): string {
  const q = text.toLowerCase();

  // Find best matching FAQ entry
  let bestMatch: FAQEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ) {
    if (!entry.roles.includes(role)) continue;
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.split(" ").length; // longer matches score higher
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) return bestMatch.answer;

  // Fallback
  return role === "visitor"
    ? "I can help you get started! Try asking:\n- \"How do I log in?\"\n- \"What is Skills Gap Tracker?\"\n- \"How do I create an account?\""
    : "I'm not sure about that specific question. Try asking about:\n- Dashboard features\n- Skill colors and analysis\n- Appointments and meetings\n- Reports and cases\n- AI Insights\n\nOr click one of the quick questions below to get started.";
}

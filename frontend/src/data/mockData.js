// ============================================================
// MOCK DATA — Replace with real API calls in production
// ============================================================

export const INITIAL_STUDENTS = [
  {
    id: "S001",
    name: "Arjun Sharma",
    email: "arjun@student.edu",
    role: "student",
    age: 21,
    dept: "Computer Science",
    stress: 72,
    anxiety: 58,
    depression: 45,
    week: 1,
    parentConsent: true,
  },
  {
    id: "S002",
    name: "Priya Nair",
    email: "priya@student.edu",
    role: "student",
    age: 20,
    dept: "Electronics",
    stress: 45,
    anxiety: 78,
    depression: 62,
    week: 1,
    parentConsent: false,
  },
  {
    id: "S003",
    name: "Rahul Verma",
    email: "rahul@student.edu",
    role: "student",
    age: 22,
    dept: "Mechanical",
    stress: 30,
    anxiety: 35,
    depression: 28,
    week: 1,
    parentConsent: true,
  },
  {
    id: "S004",
    name: "Sneha Patel",
    email: "sneha@student.edu",
    role: "student",
    age: 21,
    dept: "Civil",
    stress: 85,
    anxiety: 80,
    depression: 75,
    week: 2,
    parentConsent: true,
  },
  {
    id: "S005",
    name: "Kiran Reddy",
    email: "kiran@student.edu",
    role: "student",
    age: 23,
    dept: "Computer Science",
    stress: 55,
    anxiety: 50,
    depression: 40,
    week: 1,
    parentConsent: false,
  },
];

export const WEEKLY_TRENDS = [
  { week: "Week 1", stress: 55, anxiety: 48, depression: 38 },
  { week: "Week 2", stress: 62, anxiety: 54, depression: 42 },
  { week: "Week 3", stress: 58, anxiety: 61, depression: 48 },
  { week: "Week 4", stress: 72, anxiety: 65, depression: 52 },
];

export const DEPT_BREAKDOWN = [
  { dept: "Computer Science", stress: 65, anxiety: 60, depression: 48 },
  { dept: "Electronics",       stress: 52, anxiety: 74, depression: 55 },
  { dept: "Mechanical",        stress: 38, anxiety: 40, depression: 32 },
  { dept: "Civil",             stress: 80, anxiety: 76, depression: 70 },
];

export const DEMO_USERS = {
  student: {
    id: "S001",
    name: "Arjun Sharma",
    email: "arjun@student.edu",
    role: "student",
    age: 21,
    dept: "Computer Science",
    stress: 72,
    anxiety: 58,
    depression: 45,
    parentConsent: true,
  },
  teacher: {
    id: "T001",
    name: "Prof. Ramesh Kumar",
    email: "ramesh@college.edu",
    role: "teacher",
    dept: "CSE",
    stress: 0,
    anxiety: 0,
    depression: 0,
  },
};

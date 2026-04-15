// ============================================================
// ASSESSMENT QUESTIONS
// Based on PSS (Stress), GAD-7 (Anxiety), PHQ-9 (Depression)
// ============================================================

export const STRESS_QUESTIONS = [
  {
    id: 1,
    text: "How often have you felt unable to control the important things in your life?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    id: 2,
    text: "How often have you felt nervous and stressed due to academic workload?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    id: 3,
    text: "How often have you been upset because of something that happened unexpectedly?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    id: 4,
    text: "How often have you felt difficulties were piling up so high that you could not overcome them?",
    options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
  },
  {
    id: 5,
    text: "How often have you been able to control irritations in your life?",
    options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"],
  },
  {
    id: 6,
    text: "How often have you felt confident about your ability to handle your personal problems?",
    options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"],
  },
  {
    id: 7,
    text: "How often have you felt that things were going your way in your academics?",
    options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"],
  },
];

export const ANXIETY_QUESTIONS = [
  {
    id: 1,
    text: "Feeling nervous, anxious, or on edge about your studies or future?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 2,
    text: "Not being able to stop or control worrying about exams or results?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 3,
    text: "Worrying too much about different academic or personal things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 4,
    text: "Trouble relaxing when you have time off from studies?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 5,
    text: "Being so restless that it's hard to sit still during lectures?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 6,
    text: "Becoming easily annoyed or irritable with peers or faculty?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 7,
    text: "Feeling afraid, as if something awful might happen regarding your academics?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
];

export const DEPRESSION_QUESTIONS = [
  {
    id: 1,
    text: "Little interest or pleasure in doing things you used to enjoy?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 2,
    text: "Feeling down, depressed, or hopeless about your future?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 3,
    text: "Trouble falling or staying asleep, or sleeping too much?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 4,
    text: "Feeling tired or having little energy for daily activities?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 5,
    text: "Feeling bad about yourself — or that you are a failure or have let your family down?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 6,
    text: "Trouble concentrating on things, such as studying or watching TV?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 7,
    text: "Thoughts that you would be better off not participating in activities or being with people?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
];

export const ASSESSMENT_CONFIG = {
  stress: {
    title: "Stress Assessment",
    subtitle: "Based on the Perceived Stress Scale (PSS)",
    icon: "😤",
    color: "#ef4444",
    bg: "#fef2f2",
    questions: STRESS_QUESTIONS,
  },
  anxiety: {
    title: "Anxiety Assessment",
    subtitle: "Based on the GAD-7 Scale",
    icon: "😰",
    color: "#f59e0b",
    bg: "#fffbeb",
    questions: ANXIETY_QUESTIONS,
  },
  depression: {
    title: "Depression Assessment",
    subtitle: "Based on the PHQ-9 Scale",
    icon: "😞",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    questions: DEPRESSION_QUESTIONS,
  },
};

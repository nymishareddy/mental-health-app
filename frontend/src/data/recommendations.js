
// WELLNESS RECOMMENDATIONS DATA

export const RECOMMENDATIONS = {
  breathing: [
    {
      title: "4-7-8 Breathing",
      desc: "Inhale 4s, hold 7s, exhale 8s. Activates parasympathetic nervous system for deep calm.",
      icon: "🫁",
      duration: "5 min",
      tags: ["stress", "anxiety"],
    },
    {
      title: "Box Breathing",
      desc: "4 counts in, hold, out, hold. Used by Navy SEALs for calm under pressure.",
      icon: "📦",
      duration: "5 min",
      tags: ["stress"],
    },
    {
      title: "Diaphragmatic Breathing",
      desc: "Deep belly breathing to reduce cortisol and calm racing thoughts.",
      icon: "🌬️",
      duration: "10 min",
      tags: ["anxiety", "depression"],
    },
  ],
  exercise: [
    {
      title: "Morning Walk",
      desc: "15-minute brisk walk releases endorphins and reduces cortisol naturally.",
      icon: "🚶",
      duration: "15 min",
      tags: ["depression", "stress"],
    },
    {
      title: "Yoga Nidra",
      desc: "Guided relaxation between sleep and wakefulness — deeply restorative.",
      icon: "🧘",
      duration: "20 min",
      tags: ["anxiety", "depression"],
    },
    {
      title: "Progressive Muscle Relaxation",
      desc: "Systematically tense and release muscle groups to melt tension.",
      icon: "💪",
      duration: "15 min",
      tags: ["stress", "anxiety"],
    },
  ],
  food: [
    {
      title: "Omega-3 Rich Foods",
      desc: "Salmon, walnuts, flaxseeds — reduce inflammation and support mood.",
      icon: "🐟",
      tags: ["depression"],
    },
    {
      title: "Magnesium Sources",
      desc: "Dark chocolate, spinach, almonds — natural stress busters.",
      icon: "🥗",
      tags: ["stress", "anxiety"],
    },
    {
      title: "Hydration & Green Tea",
      desc: "L-theanine in green tea promotes calm alertness. Aim for 8 glasses of water daily.",
      icon: "🍵",
      tags: ["anxiety"],
    },
  ],
  lifestyle: [
    {
      title: "Digital Sunset",
      desc: "No screens 1 hour before bed. Improves sleep quality by 40%.",
      icon: "🌙",
      tags: ["stress", "depression"],
    },
    {
      title: "Gratitude Journal",
      desc: "Write 3 specific things you're grateful for. Rewires the brain for positivity.",
      icon: "📔",
      tags: ["depression", "anxiety"],
    },
    {
      title: "Social Connection",
      desc: "Schedule one meaningful conversation daily — loneliness amplifies all symptoms.",
      icon: "🤝",
      tags: ["depression"],
    },
  ],
  mental: [
    {
      title: "Mindfulness Meditation",
      desc: "10 minutes daily mindfulness reduces anxiety by up to 30% in studies.",
      icon: "🧠",
      duration: "10 min",
      tags: ["anxiety", "depression"],
    },
    {
      title: "CBT Journaling",
      desc: "Identify, challenge, and reframe negative thought patterns using cognitive techniques.",
      icon: "✍️",
      tags: ["depression", "anxiety"],
    },
    {
      title: "Grounding (5-4-3-2-1)",
      desc: "Name 5 things you see, 4 touch, 3 hear, 2 smell, 1 taste. Stops panic in minutes.",
      icon: "🌿",
      tags: ["anxiety"],
    },
  ],
};

export const RECOMMENDATION_CATEGORIES = [
  { id: "all",       label: "All",       icon: "✨" },
  { id: "breathing", label: "Breathing", icon: "🫁" },
  { id: "exercise",  label: "Exercise",  icon: "🏃" },
  { id: "food",      label: "Nutrition", icon: "🥗" },
  { id: "lifestyle", label: "Lifestyle", icon: "🌙" },
  { id: "mental",    label: "Mental",    icon: "🧠" },
];

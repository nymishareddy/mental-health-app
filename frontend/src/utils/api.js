// ============================================================
// API UTILITIES
// Centralises all calls and backend REST endpoints.
// ============================================================
//import Sentiment from "sentiment";
//const sentimentAnalyzer = new Sentiment();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// ── Claude AI (Anthropic) ─────────────────────────────────────

/**
 * Calls the Anthropic Messages API.
 * @param {Array}  messages    - [{role, content}]
 * @param {string} systemPrompt
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
export async function callClaude(messages, systemPrompt, maxTokens = 800) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await response.json();
  return data.content?.map((b) => b.text || "").join("") || "";
}

/**
 * Gets AI interpretation of an assessment result.
 * @param {string} type  - "stress" | "anxiety" | "depression"
 * @param {number} score - 0–100
 * @param {string} risk  - "Low Risk" | "Moderate" | "High Risk"
 */
export async function getAssessmentInsight(type, score, risk) {
  return callClaude(
    [
      {
        role: "user",
        content: `A student scored ${score}/100 on a ${type} assessment (${risk} risk). 
        Provide a 3-sentence empathetic response: 1) Acknowledge their score warmly, 
        2) Give one specific evidence-based coping tip for ${type}, 
        3) Encourage them. Keep it personal, warm, and under 100 words.`,
      },
    ],
    "You are Mira, a compassionate AI mental health assistant for students. Always be warm, non-judgmental, and encouraging. Use simple language."
  );
}

/**
 * Sends a chatbot message to Claude and returns response + detected sentiment.
 * @param {Array} messageHistory - Full conversation history
 */
export async function getChatbotReply(messageHistory) {
  const systemPrompt = `You are Mira, a compassionate, empathetic AI mental health companion for college students. 
Guidelines:
- Always be warm, non-judgmental, and supportive
- Validate feelings before offering advice
- Suggest evidence-based coping strategies when appropriate
- If severe distress is detected, gently suggest professional help
- Keep responses under 150 words
- Use emojis sparingly but warmly
- At the END of your response, on a new line, add: [SENTIMENT:positive|neutral|negative|anxious]
- Never diagnose, always support`;

  const raw = await callClaude(messageHistory, systemPrompt);
  const sentimentMatch = raw.match(/\[SENTIMENT:(\w+)\]/);
  const sentiment = sentimentMatch ? sentimentMatch[1] : "neutral";
  const content   = raw.replace(/\[SENTIMENT:\w+\]/, "").trim();
  return { content, sentiment };
}

export async function analyseJournalSentiment(text) {
  const msg = text.toLowerCase();
  
  const highRiskWords = ["stress", "stressed", "overwhelmed", "anxious", "panic", "depressed", "tired", "exhausted", "burnout", "pressure", "hopeless"];
  const moderateWords = ["okay", "fine", "manageable", "a bit stressed", "slightly anxious", "not bad"];
  const positiveWords = ["happy", "relaxed", "calm", "good", "peaceful", "motivated", "confident"];
  
  let highScore = 0;
  let modScore = 0;
  let posScore = 0;

  // Track matched words for dynamic reflection string construction
  let matchedHigh = [];
  let matchedPos = [];

  highRiskWords.forEach(w => { if (msg.includes(w)) { highScore++; matchedHigh.push(w); } });
  moderateWords.forEach(w => { if (msg.includes(w)) modScore++; });
  positiveWords.forEach(w => { if (msg.includes(w)) { posScore++; matchedPos.push(w); } });

  let sentiment = "Moderate";
  let score = 50;
  let reflection = "You seem to be navigating the day steadily. Keep finding your balance and lean into the stable moments.";

  if (highScore > modScore && highScore >= posScore) {
    sentiment = "Needs Attention";
    score = Math.max(10, 50 - (highScore * 15)); 
    reflection = `I noticed you're feeling ${matchedHigh[0] || 'distressed'}. It's completely valid to feel this way. Please remember to go easy on yourself and take a restorative breather.`;
  } else if (posScore > modScore && posScore >= highScore) {
    sentiment = "Good";
    score = Math.min(100, 60 + (posScore * 15));
    reflection = `It sounds like you're feeling ${matchedPos[0] || 'uplifted'}. That’s wonderful! Notice what brought you this feeling and try to hold onto it.`;
  }

  return { sentiment, score, reflection };
}


// ── Backend REST Endpoints ────────────────────────────────────

/**
 * Login via backend (POST /api/login).
 * Falls back to demo login if backend is unavailable.
 */
export async function loginUser(email, password, role) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch {
    // Graceful fallback — useful during development without backend
    return null;
  }
}

export async function signupUser(userData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (err) {
    console.error("Signup fetch error:", err);
    return { success: false, message: "Backend unavailable" };
  }
}

export async function getTeacherAnalytics() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/assessment/analytics`, {
      method: "GET",
      cache: "no-store",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    });
    return await res.json();
  } catch (err) {
    console.error("Dashboard error:", err);
    return null;
  }
}

export async function sendRiskAlert(studentId, type) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_URL}/api/teacher/send-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId, type })
    });
    return await res.json();
  } catch (err) {
    console.error("SMTP Alert failure:", err);
    return { success: false };
  }
}

export async function assignCounselor(studentId, type, counselorName) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_URL}/api/teacher/assign-counselor`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId, type, counselorName })
    });
    return await res.json();
  } catch (err) {
    console.error("Counselor assign error:", err);
    return { success: false };
  }
}

export async function getAlertsStatus() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_URL}/api/teacher/alerts-status`, {
      method: "GET",
      cache: "no-store",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    });
    return await res.json();
  } catch (err) {
    console.error("Status fetch error:", err);
    return { success: false, statusMap: {} };
  }
}

export async function updateSessionStatus(studentId, type, status) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_URL}/api/teacher/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId, type, status })
    });
    return await res.json();
  } catch (err) {
    console.error("Update assign error:", err);
    return { success: false };
  }
}

export async function completeSession(studentId, type, notes) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_URL}/api/teacher/complete-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId, type, notes })
    });
    return await res.json();
  } catch (err) {
    console.error("Complete session error:", err);
    return { success: false };
  }
}

export async function scheduleFollowup(studentId, type, date) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_URL}/api/teacher/schedule-followup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId, type, date })
    });
    return await res.json();
  } catch (err) {
    console.error("Followup schedule error:", err);
    return { success: false };
  }
}

export async function submitAssessment(userId, type, score, answers) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/assessment`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId, type, score, answers }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Save journal entry to backend.
 */
export async function saveJournalEntry(userId, text, sentiment, score) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/journal`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId, text, sentiment, score }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

export async function getUserData(userId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/assessment/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getJournalEntries(userId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/journal/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return await res.json();
  } catch {
    return [];
  }
}

export async function getStudentSupport() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_URL}/api/assessment/my-support`, {
      method: "GET",
      cache: "no-store",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

const fallbacks = {
  stuck: [
    "It's completely normal to feel paralyzed when there's a lot to do. Let's just pick one tiny thing to focus on for 5 minutes. What's the easiest task on your plate right now?",
    "When I feel like I don't know where to start, I write everything down and pick just one. What is the most immediate thing you feel you need to tackle?",
    "That feeling of being stuck is so overwhelming! We can break it down together. What is the main thing occupying your mind at this very moment?"
  ],
  confusion: [
    "That sounds frustrating to sort through. Let's step back for a second—can you try explaining it to me like a story, from the very beginning?",
    "It's okay to feel confused or unsure. Sometimes clearing your head with a short walk helps you see a new angle. Would you like to map out what's confusing you step-by-step?",
    "Let's untangle this together. What is the absolute first step you think you might need to take, even if it feels small?"
  ],
  action: [
    "That is an excellent decision! I suggest setting a timer for just 15 minutes to dive into it without any pressure. You can take a short break right after.",
    "I love that plan. It's a huge step just deciding where to begin! To keep the momentum, try doing it for just 10 focused minutes and see how you feel.",
    "Great idea. Sometimes committing to just the first 5 minutes is the hardest part. Jump straight in, you've totally got this!"
  ],
  stress: [
    "It sounds like you're under a lot of pressure. I suggest starting by just organizing your thoughts. What’s one single topic you can tackle first?",
    "Stress can feel incredibly heavy, but you've got this. Try focusing on the present moment. Can we talk about what specifically triggered this feeling within the last hour?",
    "I hear how stressed you are. A good first action is drinking some water and stepping away for 5 minutes. Shall we pick one primary priority to focus on when you return?"
  ],
  anxious: [
    "Anxiety can be exhausting. Let's try the 5-4-3-2-1 grounding exercise. Tell me 5 things you can visually see around you right now.",
    "It's normal to feel worried sometimes. Take a slow, deep breath in through your nose, and out through your mouth. What is your mind focusing on the most?",
    "When your mind starts racing, focusing on one physical object can help ground you. Grab something near you—what does it feel like?"
  ],
  sad: [
    "I'm so sorry you're feeling down. Remember that it's okay not to be okay. Have you been able to do anything small that usually brings you comfort today?",
    "Feeling low is really tough, and your feelings are completely valid. What has been making you feel this heavy lately?",
    "I hear the sadness in your words. You don't have to go through this alone. Would you like to talk about what exactly happened today?"
  ],
  happy: [
    "That is so wonderful to hear! Positive moments are incredibly important. What do you think made this happen?",
    "I love hearing that! It's vital to celebrate the good moments. Who else have you shared this great energy with?",
    "That's great! I'm really glad things are looking up for you today. Want to write it down so you can look back at this moment later?"
  ],
  general: [
    "I hear what you're saying. If you could change one thing about how today is going, what would it be?",
    "That makes a lot of sense. How are you feeling about moving forward from here?",
    "Thank you for sharing that with me. What do you think your next step should stand to be?",
    "I understand. What do you think would be the most helpful thing for you right now?"
  ]
};

function getSmartFallback(message) {
  const msg = message.toLowerCase();
  
  let category = "general";
  if (msg.includes("i will ") || msg.includes("i'm going to") || msg.includes("im going to") || msg.includes("i plan to") || msg.includes("i decided") || msg.includes("start with") || msg.includes("starting with") || msg.includes("i'll try")) {
    category = "action";
  } else if (msg.includes("don't know") || msg.includes("stuck") || msg.includes("lost") || msg.includes("where to start") || msg.includes("paralyze")) {
    category = "stuck";
  } else if (msg.includes("confuse") || msg.includes("unsure") || msg.includes("what to do") || msg.includes("help me decide")) {
    category = "confusion";
  } else if (msg.includes("stress") || msg.includes("pressure") || msg.includes("overwhelm") || msg.includes("exhaust")) {
    category = "stress";
  } else if (msg.includes("anxious") || msg.includes("worried") || msg.includes("panic") || msg.includes("fear")) {
    category = "anxious";
  } else if (msg.includes("sad") || msg.includes("low") || msg.includes("depress") || msg.includes("down") || msg.includes("alone")) {
    category = "sad";
  } else if (msg.includes("happy") || msg.includes("good") || msg.includes("great") || msg.includes("joy") || msg.includes("excite")) {
    category = "happy";
  }

  const options = fallbacks[category];
  return options[Math.floor(Math.random() * options.length)];
}

export async function chatbotReply(message, retryCount = 0) {
  const token = process.env.REACT_APP_HF_TOKEN;

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const data = await res.json();
    console.log("[HF API] Response:", data);

    if (data && data.error && data.error.toLowerCase().includes("loading") && retryCount < 1) {
      const waitDelay = Math.min((data.estimated_time || 15) * 1000, 15000);
      await new Promise((resolve) => setTimeout(resolve, waitDelay));
      return await chatbotReply(message, retryCount + 1);
    }

    if (data && data.error) {
      console.error("[HF API] DialoGPT Error:", data.error);
      return getSmartFallback(message);
    }

    let reply = "";
    if (data && data.generated_text) {
      reply = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    }

    if (typeof reply === "string" && reply.trim().length > 0) {
      return reply;
    }

    return getSmartFallback(message);
  } catch (err) {
    console.error("[HF API] Fetch execution crash:", err);
    return getSmartFallback(message);
  }
}
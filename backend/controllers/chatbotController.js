// ============================================================
// CHATBOT CONTROLLER
// Proxies chatbot requests to Claude API server-side,
// keeping the API key safe on the backend.
// ============================================================
const https = require("https");

// ── POST /api/chatbot ─────────────────────────────────────────
exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "messages array required." });
    }

    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_KEY) {
      // No key configured — inform frontend to use direct mode
      return res.status(503).json({
        success: false,
        message: "ANTHROPIC_API_KEY not set on backend. Frontend will use direct mode.",
      });
    }

    const systemPrompt = `You are Mira, a compassionate AI mental health companion for college students.
Guidelines:
- Always be warm, non-judgmental, and supportive
- Validate feelings before offering advice
- Suggest evidence-based coping strategies when appropriate
- If severe distress is detected, gently suggest professional help
- Keep responses under 150 words
- Use emojis sparingly but warmly
- At the END of your response, on a new line, add: [SENTIMENT:positive|neutral|negative|anxious]
- Never diagnose, always support`;

    const payload = JSON.stringify({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 800,
      system:     systemPrompt,
      messages,
    });

    const options = {
      hostname: "api.anthropic.com",
      path:     "/v1/messages",
      method:   "POST",
      headers:  {
        "Content-Type":      "application/json",
        "x-api-key":         ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length":    Buffer.byteLength(payload),
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        try {
          const parsed    = JSON.parse(data);
          const raw       = parsed.content?.map((b) => b.text || "").join("") || "";
          const match     = raw.match(/\[SENTIMENT:(\w+)\]/);
          const sentiment = match ? match[1] : "neutral";
          const content   = raw.replace(/\[SENTIMENT:\w+\]/, "").trim();
          res.json({ success: true, content, sentiment });
        } catch (e) {
          res.status(500).json({ success: false, message: "Failed to parse AI response." });
        }
      });
    });

    apiReq.on("error", (e) => {
      res.status(500).json({ success: false, message: e.message });
    });

    apiReq.write(payload);
    apiReq.end();
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

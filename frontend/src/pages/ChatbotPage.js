import React, { useState, useEffect, useRef } from "react";
import { getSentimentStyle, formatMarkdown } from "../utils/helpers";
import { chatbotReply } from "../utils/api";

const QUICK_REPLIES = [
  "I'm feeling stressed about exams",
  "I can't sleep well",
  "I feel overwhelmed",
  "I need some coping tips",
];

function ChatbotPage({ user }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 I'm **Mira**, your AI mental health companion. I'm here to listen, support, and help you navigate whatever you're feeling. How are you doing today?`,
      sentiment: "positive",
      time: new Date(),
    },
  ]);
  const [input,           setInput]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    const userMsg = { role: "user", content: userMessage, time: new Date() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      console.log("USING HUGGINGFACE");
      const reply = await chatbotReply(userMessage);
      setDetectedEmotion("neutral");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, sentiment: "neutral", time: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role:      "assistant",
          content:   "I'm here for you. Could you tell me more about what you're experiencing? I want to make sure I understand and can offer the best support. 💙",
          sentiment: "neutral",
          time:      new Date(),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "20px 32px",
          background: "white",
          borderBottom: "1px solid var(--gray-100)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 44, height: 44,
              background: "linear-gradient(135deg, var(--blue), var(--teal))",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}
          >
            🤖
          </div>
          <div
            style={{
              position: "absolute", bottom: 1, right: 1,
              width: 10, height: 10,
              background: "#22c55e",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--gray-900)" }}>
            Mira — AI Mental Health Companion
          </div>
          <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
            ● Online — Here for you 24/7
          </div>
        </div>
        {detectedEmotion && (() => {
          const s = getSentimentStyle(detectedEmotion);
          return (
            <div
              style={{
                marginLeft: "auto",
                background: s.bg,
                color: s.color,
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          );
        })()}
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 32px",
          background: "var(--snow)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 12,
              animation: "fadeUp 0.3s ease",
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: 32, height: 32,
                  background: "linear-gradient(135deg, var(--blue), var(--teal))",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0, marginTop: 4,
                }}
              >
                🤖
              </div>
            )}
            <div style={{ maxWidth: "70%" }}>
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius:
                    msg.role === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, var(--blue), var(--blue-dark))"
                      : "white",
                  color:      msg.role === "user" ? "white" : "var(--gray-700)",
                  boxShadow:  "var(--shadow-sm)",
                  fontSize:   14,
                  lineHeight: 1.7,
                }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "var(--gray-300)",
                  marginTop: 4,
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                {msg.time?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {msg.role === "assistant" && msg.sentiment && (() => {
                  const s = getSentimentStyle(msg.sentiment);
                  return (
                    <span style={{ marginLeft: 8, color: s.color }}>
                      {s.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 12, animation: "fadeIn 0.3s ease" }}>
            <div
              style={{
                width: 32, height: 32,
                background: "linear-gradient(135deg, var(--blue), var(--teal))",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14,
              }}
            >
              🤖
            </div>
            <div
              style={{
                background: "white",
                borderRadius: "18px 18px 18px 4px",
                padding: "14px 18px",
                boxShadow: "var(--shadow-sm)",
                display: "flex", gap: 6, alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="typing-dot" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick Replies ── */}
      <div
        style={{
          padding: "12px 32px 8px",
          background: "white",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {QUICK_REPLIES.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            style={{
              padding: "8px 14px",
              borderRadius: 20,
              border: "1.5px solid var(--sky-mid)",
              background: "var(--sky)",
              color: "var(--blue-dark)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sky-mid)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sky)")}
          >
            {q}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <div
        style={{
          padding: "12px 32px 24px",
          background: "white",
          borderTop: "1px solid var(--gray-100)",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Share what's on your mind..."
            style={{ flex: 1, borderRadius: 24, padding: "12px 20px", border: "1.5px solid var(--gray-100)" }}
          />
          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ borderRadius: 24, padding: "12px 20px" }}
          >
            {loading ? "..." : "Send →"}
          </button>
        </div>
        <p
          style={{
            fontSize: 11, color: "var(--gray-300)",
            marginTop: 8, textAlign: "center",
          }}
        >
          Mira is an AI — for urgent help, contact a professional or call iCall: 9152987821
        </p>
      </div>
    </div>
  );
}

export default ChatbotPage;

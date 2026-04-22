// ============================================================
// UTILITY HELPERS
// ============================================================

/**
 * Returns risk metadata for a given score (0–100).
 */
export const getRiskLevel = (score) => {
  if (score >= 80) return { label: "High Risk",  color: "#ef4444", bg: "#fef2f2", emoji: "⚠️" };
  if (score >= 50) return { label: "Moderate",   color: "#f59e0b", bg: "#fffbeb", emoji: "📊" };
  return               { label: "Normal",     color: "#22c55e", bg: "#f0fdf4", emoji: "✅" };
};

/**
 * Returns a CSS color string based on score severity.
 */
export const getScoreColor = (score) => {
  if (score >= 80) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  return "#22c55e";
};

/**
 * Calculates a 0–100 score from an array of answer indices.
 * @param {number[]} answers  - Array of selected option indices (0-based)
 * @param {number}   maxPerQ  - Maximum index value per question (options.length - 1)
 */
export const calculateScore = (answers, maxPerQ) => {
  const raw    = answers.reduce((sum, v) => sum + v, 0);
  const maxRaw = maxPerQ * answers.length;
  return Math.round((raw / maxRaw) * 100);
};

/**
 * Returns sentiment display metadata for journal / chatbot.
 */
export const getSentimentStyle = (sentiment) => {
  const map = {
    "Good":            { color: "#22c55e", bg: "#f0fdf4", icon: "😊", label: "Good"              },
    "Moderate":        { color: "#6b7280", bg: "#f9fafb", icon: "😐", label: "Moderate"          },
    "Needs Attention": { color: "#ef4444", bg: "#fef2f2", icon: "⚠️", label: "Needs Attention"   },
    // fallback keeping old keys just in case legacy records trigger
    "positive":        { color: "#22c55e", bg: "#f0fdf4", icon: "😊", label: "Good"              },
    "neutral":         { color: "#6b7280", bg: "#f9fafb", icon: "😐", label: "Moderate"          },
    "negative":        { color: "#ef4444", bg: "#fef2f2", icon: "⚠️", label: "Needs Attention"   },
  };
  return map[sentiment] || map["Moderate"];
};

/**
 * Converts raw HTML-unsafe text with **bold** markdown to safe HTML string.
 */
export const formatMarkdown = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");

/**
 * Returns true when any score exceeds the high-risk threshold.
 */
export const hasHighRisk = (scores, threshold = 80) =>
  scores.stress >= threshold ||
  scores.anxiety >= threshold ||
  scores.depression >= threshold;

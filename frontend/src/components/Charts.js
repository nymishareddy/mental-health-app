import React from "react";
// CHART COMPONENTS 
/**
 * Line chart with gradient fill.
 * @param {Array}  data   - [{value: number}]
 * @param {string} color  - CSS hex color
 * @param {number} height - px
 */
export function TrendChart({ data, color = "#4a9edd", height = 80 }) {
  const max = Math.max(...data.map((d) => d.value), 100);
  const W = 320, H = height;
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * (W - 20) + 10,
    y: H - (d.value / max) * (H - 10) - 5,
  }));
  const pathD  = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD  = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
  const gradId = `grad-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

/**
 * Vertical bar chart.
 * @param {Array} bars - [{label, value, color}]
 */
export function BarChart({ bars }) {
  const max = Math.max(...bars.map((b) => b.value), 100);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120, padding: "8px 0" }}>
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>
            {b.value}%
          </span>
          <div
            style={{
              width: "100%",
              height: (b.value / max) * 90,
              background: `linear-gradient(180deg, ${b.color}, ${b.color}88)`,
              borderRadius: "6px 6px 0 0",
              transition: "height 0.8s ease",
              minHeight: 4,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--gray-500)",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Circular progress / radial score gauge.
 * @param {number} score  - 0–100
 * @param {string} label
 * @param {string} color  - CSS hex color
 * @param {number} size   - px (default 120)
 */
export function RadialScore({ score, label, color, size = 120 }) {
  const r    = 45, cx = 60, cy = 60;
  const circ  = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--gray-100)"
          strokeWidth="8"
        />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text
          x={cx} y={cy - 4}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill={color}
          fontFamily="var(--font-body)"
        >
          {score}
        </text>
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          fontSize="10"
          fill="var(--gray-300)"
          fontFamily="var(--font-body)"
        >
          / 100
        </text>
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-500)" }}>
        {label}
      </span>
    </div>
  );
}

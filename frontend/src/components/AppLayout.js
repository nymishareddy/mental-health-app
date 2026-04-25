import React from "react";


function AppLayout({ children, title, subtitle }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "32px",
        maxWidth: 1000,
        overflowY: "auto",
      }}
    >
      {title && (
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "var(--gray-900)",
              marginBottom: 6,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: "var(--gray-500)", fontSize: 15 }}>{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default AppLayout;

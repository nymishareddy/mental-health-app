export default function GlobalStyles() {
  return (
    <style>{`
       @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --sky: #e8f4fd;
      --sky-mid: #c8e6f7;
      --blue: #4a9edd;
      --blue-dark: #2d7fc1;
      --teal: #38b2ac;
      --mint: #e6f7f5;
      --sage: #6dbb9e;
      --lavender: #ede9fe;
      --violet: #7c6fcd;
      --peach: #fef3e8;
      --coral: #f4845f;
      --gold: #f5c842;
      --white: #ffffff;
      --snow: #f8fbff;
      --gray-50: #f0f4f8;
      --gray-100: #dce6ef;
      --gray-300: #94a8be;
      --gray-500: #5a7490;
      --gray-700: #2d4a63;
      --gray-900: #0f2235;
      --shadow-sm: 0 2px 8px rgba(74,158,221,0.08);
      --shadow-md: 0 4px 20px rgba(74,158,221,0.12);
      --shadow-lg: 0 8px 40px rgba(74,158,221,0.16);
      --radius-sm: 10px;
      --radius-md: 16px;
      --radius-lg: 24px;
      --radius-xl: 32px;
      --font-display: 'DM Serif Display', Georgia, serif;
      --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--snow);
      color: var(--gray-700);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--gray-50); }
    ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 3px; }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes ripple {
      0% { transform: scale(0); opacity: 0.6; }
      100% { transform: scale(4); opacity: 0; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }

    .animate-fadeUp { animation: fadeUp 0.5s ease forwards; }
    .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
    .animate-slideIn { animation: slideIn 0.4s ease forwards; }

    /* Utility */
    .card {
      background: var(--white);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(74,158,221,0.1);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .card:hover { box-shadow: var(--shadow-md); }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--blue), var(--blue-dark));
      color: white;
      box-shadow: 0 4px 14px rgba(74,158,221,0.4);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(74,158,221,0.5); }
    .btn-secondary {
      background: var(--sky);
      color: var(--blue-dark);
      border: 1px solid var(--sky-mid);
    }
    .btn-secondary:hover { background: var(--sky-mid); }
    .btn-ghost {
      background: transparent;
      color: var(--gray-500);
      border: 1px solid var(--gray-100);
    }
    .btn-ghost:hover { background: var(--gray-50); color: var(--gray-700); }

    input, textarea, select {
      font-family: var(--font-body);
      font-size: 14px;
      padding: 12px 16px;
      border: 1.5px solid var(--gray-100);
      border-radius: var(--radius-sm);
      background: var(--white);
      color: var(--gray-700);
      width: 100%;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
    }
    input:focus, textarea:focus, select:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 3px rgba(74,158,221,0.12);
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--gray-500);
      margin-bottom: 6px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    /* Loading dots */
    .typing-dot {
      width: 7px; height: 7px;
      background: var(--blue);
      border-radius: 50%;
      display: inline-block;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .typing-dot:nth-child(3) { animation-delay: 0.3s; }
    `}</style>
  );
}
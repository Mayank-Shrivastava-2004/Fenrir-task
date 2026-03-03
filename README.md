# Fenrir Security — Frontend Design Challenge

A premium, production-grade security dashboard built for Fenrir Security's recruitment process. This application focuses on high-fidelity UI recreation, seamless theme switching, and responsive data visualization.

---

## 🚀 Live Demo

> **URL:** *(Deploy to Vercel/Netlify and paste your link here)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 (Vite) |
| **Styling** | Tailwind CSS v3 (Custom Configuration) |
| **Icons** | Lucide React |
| **Navigation** | React Router DOM v6 |
| **State Management** | React Context API (Global Theme) |
| **Animations** | Framer Motion + Tailwind keyframes |

---

## ✨ Key Features

- **Pixel-Perfect UI** — Recreated all three screens (Sign-up, Dashboard, Scan Detail) with precise spacing, typography (Inter + JetBrains Mono), and design tokens.
- **Dynamic Theming** — Native Dark (`#0F0F0F`) and Light (`#F5F5F5`) mode support with a global toggle that persists across page refreshes via `localStorage`.
- **Interactive Data** — Functional search, status filters (Completed / Scheduled / Failed), and row-level navigation from Dashboard to Scan Details.
- **Live Console Simulation** — Terminal-style activity logs with timestamped entries, color-coded syntax highlighting (Critical=Red, High=Orange, Medium=Yellow, Low=Green), and a pulsing cursor.
- **Fully Responsive** — Optimized for 1280px+ desktops and 375px mobile devices with a collapsible sidebar drawer.

---

## 📁 Project Structure

```
src/
├── components/
│   └── Sidebar.jsx          # Shared sidebar nav (Dashboard + ScanDetail)
├── context/
│   └── ThemeContext.jsx      # Global dark/light mode toggle + localStorage
├── data/
│   └── mockData.json         # 10 realistic cybersecurity scan entries
├── pages/
│   ├── Login.jsx             # Split layout: feature panel + sign-in card
│   ├── Signup.jsx            # Split layout: feature list + registration form
│   ├── Dashboard.jsx         # Sidebar + stat cards + scan table
│   └── ScanDetail.jsx        # Live console + findings + circular progress
└── App.jsx                   # React Router v6 routing + ThemeProvider
```

---

## 🧠 Engineering Decisions

### Modular Component Architecture
Broke down the UI into reusable components — `Sidebar`, `CircularProgress`, `StepTracker`, and severity/status chips — to ensure maintainability and avoid repetition across screens.

### Custom Tailwind Configuration
Extended the Tailwind theme with Fenrir's brand colors instead of using defaults:
- **Primary:** Teal `#0CC8A8` with hover, muted, and glow variants
- **Severity:** `critical` (#E53935), `high` (#FB8C00), `medium` (#FDD835), `low` (#43A047)
- **Surfaces:** Dark (`#0F0F0F`, `#1A1A1A`) and Light (`#F5F5F5`, `#FFFFFF`) backgrounds

### No-Flash Dark Mode
An inline `<script>` in `index.html` reads `localStorage` and applies the `.dark` class to `<html>` *before first paint*, preventing the white flash common in theme-toggle implementations.

### Mock Data Layer
All data served from `src/data/mockData.json` — structured to match a real REST API shape (`id`, `status`, `progress`, `vulnerabilities`, `findings`), making it a drop-in replacement for a live backend.

### Performance
- Vite for lightning-fast HMR during development
- SVG-based circular progress ring (no canvas, no library)
- `animationDelay` on table rows for a staggered entrance effect

---

## 🚦 Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Signup` | Default landing — registration |
| `/login` | `Login` | Sign-in with feature showcase |
| `/dashboard` | `Dashboard` | Scan list with sidebar and stats |
| `/scan/:id` | `ScanDetail` | Live console for a specific scan |

---

## 🏃 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

> **Login / Signup:** Any email + password (8+ chars) will work — auth is mocked.

---

## 📸 Screens

| Screen | Route | Features |
|---|---|---|
| Sign Up | `/` | Split layout, social logins, validation |
| Login | `/login` | Feature panel, password toggle |
| Dashboard | `/dashboard` | Sidebar, stat cards, filterable table |
| Scan Detail | `/scan/:id` | Terminal console, step tracker, findings |

---

*Built with ❤️ for the Fenrir Security Frontend Design Challenge.*

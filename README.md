# 🚀 ABTalks Neo — 60-Day Coding Challenge Platform

> **Redesigning ABTalks**: A mobile-first, high-trust learning platform for Indian college students to build consistency, post proof-of-work daily, and get discovered by top recruiters.

---

## 📌 Executive Overview

ABTalks runs an intense **60-day coding challenge** targeting Indian college students. Students select a track, complete daily hands-on coding challenges, and maintain a public learning streak by submitting:
1. **A GitHub commit** (cross-verified via GitHub API for `README.md` presence)
2. **A LinkedIn post** (verified URL structure with custom templates provided)

Most students access the platform late at night on mobile after college. **ABTalks Neo** is built from the ground up to be ultra-responsive, visually captivating, dark-mode native, and equipped with a full authentication & gamification engine.

---

## 🔥 Key Features

### 1. 🌐 Landing Page (`/`)
- **First Impression & Motivation**: Dynamic typewriter header, live participant counters, and batch enrollment status.
- **LeetCode-Style Track Cards**: Interactive selection for **Software Engineering (SE)**, **Data Science (DS)**, and **AI Engineering (AI)**.
- **Masonry Testimonials Grid**: Real success stories from students placed at top companies (Swiggy, Amazon, Adobe).
- **Interactive Route Guarding**: Unauthenticated users trying to preview Day 1 are gracefully prompted to enroll or sign in first.
- **Official Social Integration**: Direct links to ABTalks Instagram, LinkedIn, YouTube, X/Twitter, Discord, and WhatsApp communities.

### 2. 🔑 Security & Passphrase Authentication (`/signup` & `/login`)
- **3-Step Onboarding**:
  1. Personal info (Name, Email, College/University).
  2. Track selection + GitHub handle & LinkedIn URL integration.
  3. **Unique Passphrase Generation**: Generates a unique `@username` and a 5-word secret passphrase (e.g., `amber-blaze-cedar-drift-ember`).
- **Persistent Local Session**: User session and state persist across reloads and navigation.
- **Clean Logout Support**: One-click logout from dashboard navbar or mobile bottom navigation.

### 3. 📊 Mobile-First Student Dashboard (`/dashboard`)
- **Streak Hero & Progress Ring**: Live visual representation of current streak, longest streak, completed days, and total percentage completed.
- **60-Day Interactive Progress Map**: Color-coded tile grid tracking daily status (Completed, Late, Missed, Today, Future).
- **Streak Shield Mechanics 🛡️**: Earn shields at key milestones (Week 1, Week 2). Use a shield to recover missed days and preserve streak count.
- **Interactive Spotlight Tour**: Guided onboarding spotlight explaining key dashboard sections (with instant skip option).
- **Leaderboard & Referral Engine**: Rank against batchmates and copy your unique referral code to earn bonus shields.

### 4. ⚡ Interactive Challenge Day Page (`/day/[day]`)
- **LeetCode-Style Problem View**: Detailed problem descriptions, constraints, input/output examples, and tag badges.
- **Built-in Python Playground**: Code editor with syntax highlighting, automatic indentation handling, and test-case execution.
- **Dual-Proof Verification Engine**:
  - **GitHub API Verification**: Validates repository existence and verifies that a `README.md` file exists.
  - **LinkedIn Post Verification**: Validates post URL structure and provides a pre-formatted, one-click copyable post template.
- **Celebration Confetti 🎊**: Triggered upon successful dual-proof submission.

### 5. 🌓 Global Design System & Theme Engine
- **Dark/Light Mode Sync**: Persistent global theme state toggled seamlessly across all routes.
- **Glassmorphism & Micro-animations**: Premium dark-mode aesthetics using space grotesk typography, HSL gradient text, floating glass cards, and background blur orbs.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Styling**: Vanilla CSS3 Custom Properties (Design System tokens, glassmorphism, responsive grid & flex layout)
- **State Management**: React Context (`ThemeContext`, `AuthContext`) + LocalStorage Persistence
- **API Integrations**: GitHub REST API v3 for repository & README validation
- **Fonts**: Space Grotesk, Inter, JetBrains Mono (via Google Fonts)

---

## 🚀 Quickstart & How to Run

### Prerequisites
Make sure you have **Node.js** (v18.x or later) installed on your system.

### Steps to Run

1. **Navigate to the Project Directory**:
   ```bash
   cd "c:\Users\Karunuesh\OneDrive - Amrita vishwa vidyapeetham\Semester 5\ABTalks_Neo"
   ```

2. **Install Dependencies** (if running for the first time):
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open your browser and navigate to:
   - 🏠 **Landing Page**: `http://localhost:3000/`
   - 📝 **Signup**: `http://localhost:3000/signup`
   - 🔑 **Login**: `http://localhost:3000/login`
   - 📊 **Student Dashboard**: `http://localhost:3000/dashboard`
   - ⚡ **Challenge Day 12**: `http://localhost:3000/day/12`

---

## 💡 How to Walkthrough / Test the Application

1. **Explore Landing Page (`/`)**:
   - Scroll down to view the animated stats, track cards, testimonials grid, and social media footer links.
   - Click the theme toggle icon (☀️/🌙) in the top navbar to switch between Light and Dark mode globally.

2. **Enroll & Get Passphrase (`/signup`)**:
   - Click **Enroll Free**.
   - Fill in your details, select a track (e.g. *Software Engineering*), and enter sample GitHub/LinkedIn details.
   - On Step 3, **copy your generated username and 5-word secret passphrase**.

3. **Explore Dashboard (`/dashboard`)**:
   - Click **Start Day 1 Challenge**.
   - Take or skip the interactive spotlight tour.
   - View your current streak, badges, progress map grid, leaderboard rank, and referral code.

4. **Solve & Verify Challenge (`/day/12`)**:
   - Click **▶ Run & Test** in the code editor to evaluate test cases.
   - Switch to the **✅ Submit** tab:
     - Enter a public GitHub repository URL (e.g., `https://github.com/torvalds/linux`) and click **Verify** to check for README presence via API.
     - Paste a valid LinkedIn post link (e.g., `https://linkedin.com/posts/username_abtalks-challenge-12345`) and click **Verify**.
   - Click **🚀 Submit Day 12** to celebrate with confetti and update your streak!

---

## 📁 Directory Structure

```
ABTalks_Neo/
├── app/
│   ├── dashboard/       # Student Dashboard page
│   ├── day/[day]/       # Dynamic Challenge Day & Verification page
│   ├── login/           # Passphrase Login page
│   ├── signup/          # Track enrollment & Passphrase generation
│   ├── globals.css      # Design system CSS (tokens, modes, glass cards)
│   ├── layout.tsx       # Root layout with ThemeProvider & AuthProvider
│   └── page.tsx         # Landing Page
├── context/
│   ├── AuthContext.tsx  # User state, passphrase auth, streak & shield logic
│   └── ThemeContext.tsx # Global dark/light theme state
├── data/
│   └── mock.json        # Testimonials, tracks, stats & leaderboard data
├── package.json
└── README.md
```

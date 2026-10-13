# DOPAMINE ZERO — OPERATION FEBRUARY 6

> *"Zero feeds. Pure execution. Earn your focus."*

A tactical mission-control web application designed for competitive exam candidates to break impulsive digital distractions (YouTube Shorts, Instagram Reels, desk phone checking, eating while watching videos) and forge consistent 45-minute deep-work habits leading to the **February 6, 2027** exam date.

---

## ⚡ Tactical Highlights & Features

### 1. Daily Challenge Progression (7-Day Combat Cycle)
The campaign operates on a 7-day tactical progression loop:
* **Day 1: COLD START** — 2 verified 45m study blocks. Start Block 1 within 15 minutes of the target time without checking entertainment apps.
* **Day 2: THE SILENT TABLE** — 3 verified study blocks. All meals eaten strictly screen-free with zero video streaming.
* **Day 3: PHANTOM PHONE** — 3 verified study blocks. Air-gap phone away from the study area; record parking coordinates.
* **Day 4: MEMORY RAID** — 4 verified study blocks. 1 closed-book recall drill (gap analysis) + at least 15 practice questions.
* **Day 5: HARDEST FIRST** — 4 verified study blocks. Dedicated frontal assault on the day's most avoided academic topic in Block 1.
* **Day 6: DISTRACTION AMBUSH** — 4 verified study blocks. Blocks 1–3 finished before any entertainment. 1 timed quiz with mistake analysis.
* **Day 7: THE BOSS BATTLE** — 5 verified study blocks. Sectional test simulation + mistake post-mortem + Weekly Operational Review. Conquering Day 7 awards a promotion badge and victory celebration.

### 2. Focus Timer Mission Engine
* High-tech circular HUD timer.
* Strict task mandate: Cannot launch a session without entering a specific academic task (e.g. *"Revise Process Synchronization"*).
* Verified timer integrity: Aborting or ending a timer early **never** credits incomplete minutes.
* Break timer mode with relaxation prompts.
* Offline Web Audio API synthesized sound cues.

### 3. "I WANT TO SCROLL" — Urge Intercept Protocol
* Prominent one-click tactical grounding tool.
* 60-second countdown with visual box-breathing guidance (Inhale 4s, Hold 4s, Exhale 4s, Rest 4s).
* Grounding axiom: *"An urge is not an instruction."*
* Post-timer reflection: +10 XP awarded if the operator returned to focus (capped at 3/day to prevent XP gaming).

### 4. Authorised Online Class Mode
* Dedicated toggle for online students requiring phone microphones, attendance, or live doubt clearing.
* Disables false phone-parking violations during class hours.
* Configurable default schedule (7:00 AM – 9:15 AM IST) with extension buttons (+15m, +30m) when lectures run late.

### 5. Variable Schedule & Timetable Editor
* Day-specific class overrides (start/end times, cancellations).
* Circadian conflict detector: Displays warnings if planned study encroaches on the configured sleep window.

### 6. Accidental Near-Miss & Emergency Stand-Down
* **Near-Miss Logger**: Accidentally opening an app and closing it within 3 seconds can be logged without resetting the run streak.
* **Emergency / Health Pause**: Genuine medical or family emergencies freeze the protocol without penalizing the operator or faking XP.

### 7. Mystery Side Quests
* 12 randomized micro-objectives (e.g., *"Single-Tab Discipline"*, *"Feynman Broadcast"*, *"Blind Recall Drill"*) awarding +25 XP.

### 8. Persistence & Privacy
* 100% offline-first. Uses browser `localStorage`.
* No external API keys or cloud databases required.
* One-click JSON backup export and restore.

---

## 🛠️ Technology Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite 8
* **Styling:** Tailwind CSS with custom tactical HUD palette (Dark Navy, Electric Cyan, Violet, Emerald, Amber, Red)
* **Audio:** Web Audio API synthesizer (zero external audio file dependencies)
* **Icons:** Lucide React
* **Effects:** canvas-confetti

---

## 🚀 Running Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* npm or pnpm

### Setup Instructions

1. **Clone or navigate to the project directory:**
   ```bash
   cd i:/Project/To_Do_List
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready artifacts will be generated in `dist/`.

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## ⚙️ Timezone & Date Configuration

* **Default Timezone:** `Asia/Kolkata` (IST, UTC+05:30)
* **Default Exam Target Date:** February 6, 2027
* **Campaign Start Date:** Defaults to the next calendar day in IST, configurable in Onboarding and Settings.

---

## 📜 Standing Rules of Engagement

1. **No short-video feeds:** Deliberate consumption of YouTube Shorts, Reels, or TikTok feeds is strictly prohibited.
2. **Screen-free meals:** Food is biological fuel; meals are eaten without screens.
3. **Physical phone parking:** Phone parked outside the study area during independent blocks.
4. **Class mode exception:** Phone permitted for online class microphone, speaking, and attendance.
5. **Sleep & health first:** No night-cramming encouraged. Emergency pause available for illness.
6. **7-Day Run Reset:** A failed primary challenge resets the current 7-day streak to 0, but historical logs, study minutes, and XP remain permanently preserved.

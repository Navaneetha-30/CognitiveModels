# 🧠 CogniPath AI: Adaptive Cognitive Learning Platform

![CogniPath Header](https://raw.githubusercontent.com/shreys-repo/learning/main/public/header-preview.png)

CogniPath AI is an advanced, student-centric adaptive learning ecosystem that utilizes **Real-Time Psychometric Modeling** (IRT/BKT) and **Generative AI** to scale educational content dynamically to a student's unique cognitive ability ($\theta$).

---

## 🚀 Key Features

### 🤖 Ask CogniPath (Neural AI Assistant)
A sophisticated chat interface integrated with **Gemini 1.5 Flash**. Unlike standard chatbots, CogniPath AI is injected with your real-time performance telemetry, allowing it to provide hyper-personalized guidance based on your actual mastery levels.

### 🧪 What-If Simulator
A predictive dashboard that allows students to simulate cognitive scenarios. Test how your retention and mastery indices would react under different learning intensities and timeframes.

### 📊 Advanced Neural Analytics
Beautiful, data-driven visualizations of your learning journey. Track your **Global Ability (θ)** drift and concept-specific mastery through high-fidelity charts.

### 🎮 RL Playground
Experience Reinforcement Learning (Q-Learning) in action. See how the adaptive engine makes decisions to optimize your learning path based on positive and negative feedback loops.

---

## 🧩 Technical Foundation

The platform is built on a "Decoupled Neural Architecture" that separates UI from mathematical inference.

- **IRT Engine (2-Parameter Logistic Model):** Dynamically estimates student ability ($\theta$) after every interaction.
- **Bayesian Knowledge Tracing (BKT):** Probabilistic mastery tracking across multiple concepts (Logic, Memory, Spatial, etc.).
- **Reinforcement Learning (Q-Learning):** Autonomous policy engine that adjusts curriculum difficulty.

For a deep dive into the math and architecture, see [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shreys-repo/learning.git
   cd learning
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Dev Server:**
   ```bash
   npm run dev
   ```

---

## 🛠️ Tech Stack
- **Frontend:** React + Vite + Tailwind CSS v4
- **State Management:** React Context API (Custom Hooks)
- **AI Engine:** Google Generative AI (@google/generative-ai)
- **Icons:** Lucide React
- **Animations:** Tailwind Extended + Framer Motion (Simulation Hooks)

---

## 📄 License
MIT License - Copyright (c) 2026 CogniPath AI

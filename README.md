# 🚀 ASTRAFORGE — Junior Astronaut Mission Trainer

> **"Think Like an Engineer. Train Like an Astronaut. Build Beyond Earth."**

ASTRAFORGE is an interactive educational space mission simulator designed for students, educators, and space enthusiasts. Step into the boots of an outpost commander to design, build, and sustain a human habitat on the **Moon** or **Mars** while balancing critical life-support systems, power budgets, and unexpected space emergencies.

## 🌟 Highlights & Overview

Young learners often imagine space exploration as simply flying rockets. In reality, keeping humans alive beyond low Earth orbit requires intricate systems engineering: closed-loop oxygen generation, water purification and recovery, hydroponic crop cultivation, power storage during extreme lunar nights or Martian dust storms, and shielding against cosmic radiation.

**ASTRAFORGE bridges this gap with:**
- ⚙️ **Deterministic Systems-Engineering Simulation Engine:** Realistic life-support equations modeled after aerospace principles.
- 🧪 **What-If Experimentation Lab:** Compare baseline habitats with modified designs side-by-side to understand engineering trade-offs.
- 🛰️ **Official NASA Integration:** Direct integration with the NASA Image and Video Library (`images-api.nasa.gov`) and authoritative planetary datasets.
- 🤖 **AI Mission Mentor:** Real-time mission debriefing and guidance powered by Google Gemini (with an automated rule-based fallback).
- 🏆 **Gamified Education & Persistence:** Seeded dynamic crisis events, scoring systems, achievements, and SQLite mission persistence.

## ✨ Key Features

- **🪐 Mission Setup & Planetary Comparison**
  - Choose between **Moon** and **Mars** with sourced NASA planetary science (gravity, day/night cycles, atmosphere, solar irradiance).
  - Configure crew sizes (2, 4, 6), mission duration (10, 30, 60 days), difficulty modes, and custom scenario seeds.
- **🏗️ Interactive Outpost Builder**
  - Construct and level up 10 vital outpost modules:
    - *Habitat Core, Solar Array, Battery Bank, Hydroponic Bay, Water Recycler, Oxygen Generator, Radiation Shielding, Thermal Control System, Emergency Shelter, and Deep Space Comms.*
- **📊 Real-Time Mission Control Dashboard**
  - Monitor 6 interconnected survival systems: **Oxygen**, **Water**, **Food**, **Energy**, **Radiation Protection**, and **Temperature**.
  - Interactive Recharts trend charts and intuitive time-controls (Step Day, Fast Forward, Pause).
- **🚨 Dynamic Crisis Scenarios & Decision Center**
  - Handle 10 scientific anomaly events (solar flares, Martian dust storms, electrolyzer malfunctions, coolant leaks, etc.) with multiple choice crisis responses.
- **🔬 What-If Engineering Lab**
  - Benchmark module configurations against modified setups to identify bottlenecks and resource vulnerabilities before they occur.
- **📚 Space Science Library & NASA Media Explorer**
  - 8 interactive educational modules covering ECLSS, in-situ resource utilization (ISRU), planetary geology, and rocketry with interactive knowledge quizzes.
  - Live search and high-resolution asset explorer via NASA's API.
- **📑 Mission Debriefing & SQLite Storage**
  - Comprehensive end-of-mission performance report, achievements, and complete mission logs saved to local SQLite (`astraforge.db`).

## 🔬 How the Simulation Engine Works

The core simulation lives in `src/shared/simulation.ts` and uses deterministic aerospace-inspired math:

| System | Scientific Basis & Simulation Mechanics |
| :--- | :--- |
| **Oxygen & Water Coupling** | Baseline crew consumption: `0.84 kg O₂/person/day` and `3.6 L H₂O/person/day`. Water recyclers reclaim up to 95% of wastewater. Oxygen generation via electrolysis consumes `~1.12 L H₂O per kg O₂`. |
| **Solar & Power Balance** | Lunar arrays yield `46 kWh/day/tier` (with 14-day lunar night cycles). Martian arrays yield `26 kWh/day/tier` (~43% solar irradiance at ~1.52 AU, further diminished during dust storms). |
| **Food & Hydroponics** | Hydroponic modules provide `1.85 rations/day` and `0.35 kg O₂/day/tier` while consuming water (`1.4 L/day`) and electricity (`11 kWh/day`). |
| **Thermal & Radiation** | Habitat temperatures drift toward harsh planetary extremes without sufficient electrical power or thermal loops. Radiation shielding attenuates cosmic rays and solar particle events (SPE). |

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide React, Motion (`motion/react`)
- **Backend:** Node.js, Express (`server.ts`), SQLite (`better-sqlite3`), Google GenAI SDK (`@google/genai`)
- **Testing:** Vitest (`src/shared/simulation.test.ts`)

### API Architecture

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check & system status |
| `/api/mission/create` | `POST` | Initialize a new mission profile |
| `/api/mission/:mission_id` | `GET` | Fetch current mission state & telemetry |
| `/api/mission/:mission_id/advance` | `POST` | Advance mission time (step 1 or 3 days) |
| `/api/mission/:mission_id/build` | `POST` | Build or upgrade habitat modules |
| `/api/mission/:mission_id/respond` | `POST` | Submit response to active crisis events |
| `/api/mission/:mission_id/report` | `GET` | Retrieve final mission summary & score |
| `/api/simulation/what-if` | `POST` | Run comparative sandbox simulations |
| `/api/mentor/explain` | `POST` | Query AI Mission Mentor for telemetry analysis |
| `/api/nasa/search` | `GET` | Query NASA Image & Video Library |
| `/api/nasa/asset/:nasa_id` | `GET` | Inspect NASA media assets & captions |
| `/api/learning/resources` | `GET` | Fetch educational science topics & quizzes |
| `/api/learning/progress` | `POST` | Persist learning module progress |

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20+ recommended)
- **npm**, **bun**, or **pnpm**
- *(Optional)* A [Google Gemini API Key](https://aistudio.google.com/) for AI mentor features.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanya-garg10/ASTRAFORGE-Junior-Astronaut-Mission-Trainer.git
   cd ASTRAFORGE-Junior-Astronaut-Mission-Trainer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (optional — app will gracefully use deterministic rule-based mentor advice if left blank):
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Run Tests:**
   ```bash
   npm test
   ```

6. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## 📚 NASA Sources & Attribution

- **NASA Image and Video Library:** [images-api.nasa.gov](https://images-api.nasa.gov/)
- **NASA Moon Exploration & Facts:** [science.nasa.gov/moon](https://science.nasa.gov/moon/)
- **NASA Mars Exploration & Facts:** [science.nasa.gov/mars](https://science.nasa.gov/mars/)
- **NASA Solar System Treks:** [trek.nasa.gov](https://trek.nasa.gov/)
- **NASA Space Place:** [spaceplace.nasa.gov](https://spaceplace.nasa.gov/)
- **NASA Media Usage Guidelines:** [nasa.gov/nasa-brand-center/images-and-media](https://www.nasa.gov/nasa-brand-center/images-and-media/)

## 🤖 AI Acknowledgement & Ethics

The educational Mission Mentor utilizes Google Gemini (`@google/genai`) to provide contextual science explanations based on active simulation telemetry.
- Simulation physics and life-support calculations are strictly deterministic and never hallucinated by AI.
- If no Gemini API key is provided, the application automatically activates a comprehensive, deterministic rule-based mentor system ensuring full functionality offline.

## 📜 License & Disclaimer

This project is open-source and created for educational purposes. 

> **Disclaimer:** ASTRAFORGE is an independent educational tool. It is not an official NASA product and is not directly affiliated with or endorsed by NASA. All NASA images, videos, and scientific data are attributed to NASA according to official media usage guidelines.

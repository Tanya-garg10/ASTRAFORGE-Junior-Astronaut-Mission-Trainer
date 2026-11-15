# ASTRAFORGE — Junior Astronaut Mission Trainer

**"Think Like an Engineer. Train Like an Astronaut. Build Beyond Earth."**

Built for the **NASA Space Apps Challenge 2026**, ASTRAFORGE is an interactive educational space mission simulator where students act as outpost commanders establishing and sustaining a human habitat on the **Moon** or **Mars**.

---

## 1. Project Overview & Problem Statement

Young learners often view space exploration as purely piloting rockets rather than solving interconnected life-support and systems-engineering challenges. Keeping astronauts alive beyond Earth requires balancing closed-loop oxygen generation, water recovery, food cultivation, solar power, thermal regulation, and radiation shielding under strict mass and power budgets.

**ASTRAFORGE's Solution:** A playable, deterministic Lunar and Martian outpost trainer combining real resource-management equations, seeded crisis scenarios, a side-by-side What-If engineering lab, official NASA multimedia & science resources, and an educational AI Mission Mentor.

---

## 2. Key Features

- **Mission Briefing & Planetary Comparison:** Configure Destination (Moon / Mars), Crew Size (2 / 4 / 6), Duration (10 / 30 / 60 days), Difficulty, Initial Budget, and reproducible Scenario Seed alongside sourced NASA Moon vs. Mars comparisons.
- **Interactive Outpost Builder:** Construct and upgrade 10 outpost modules (Habitat, Solar Array, Battery Storage, Hydroponic Greenhouse, Water Recycler, Oxygen Generator, Radiation Shielding, Thermal Control, Emergency Storm Shelter, Deep Space Comms Antenna) with live resource-budget deductions.
- **Mission Control Dashboard:** Real-time tracking of 6 coupled survival systems (Oxygen, Water, Food, Energy, Radiation Protection, Temperature), Recharts history graphs, time-advance controls (Pause, Resume, +1 Day, +3 Days), and transparent causal explanations.
- **Dynamic Mission Events & Emergency Room:** 10 seeded anomaly scenarios (Solar Storm, Martian Dust Storm, Water Distillation Fault, Electrolyzer Malfunction, Hydroponic Imbalance, Thermal Coolant Drop, etc.) with multi-choice scientific responses.
- **What-If Experiment Lab:** Side-by-side comparison of Baseline vs. Modified outpost configurations showing bottleneck shifts and coupled trade-offs.
- **AI Mission Mentor:** Server-side Google Gemini integration (`@google/genai` `gemini-4-hydrogen`) with telemetry context and a deterministic rule-based educational fallback if `GEMINI_API_KEY` is unavailable.
- **Space Science Library & NASA Media Explorer:** 8 interactive learning modules with persisted knowledge-check quizzes plus live search and manifest inspection against the NASA Image and Video Library API (`images-api.nasa.gov`).
- **Mission Report & SQLite Persistence:** End-of-mission scoring, achievements, recommendations, decision logs, and local SQLite persistence (`astraforge.db`).

---

## 3. How the Simulation Engine Works

All calculations live in `src/shared/simulation.ts` using deterministic, documented illustrative coefficients (clearly distinguished from certified aerospace engineering constants):

- **Water & Oxygen Coupling:** Crew consume water (`3.6 L/person/day`) and oxygen (`0.84 kg/person/day`). The Water Recycling Unit recovers 72%–95% of wastewater depending on upgrade level, while the Oxygen Generation System consumes both electricity and water (`~1.12 L H₂O per kg O₂`) via electrolysis.
- **Solar & Energy Balance:** Moon Solar Arrays generate `46 kWh/day` per level (with periodic 14-day crater-rim shadow dips), whereas Mars arrays generate `26 kWh/day` per level (~43% solar irradiance at ~1.52 AU, attenuated further by dust storms).
- **Greenhouse Trade-Off:** Hydroponic bays produce `1.85 rations/day` and `0.35 kg O₂/day` per level while drawing `11 kWh/day` and `1.4 L/day` water.
- **Thermal & Radiation:** Habitat temperatures drift toward planetary extremes if electrical power or Thermal Control authority drops; Radiation Shielding and Emergency Storm Shelters attenuate modeled cosmic and solar-storm doses.

---

## 4. NASA Resources & Attribution

- **NASA Image and Video Library API:** `https://images-api.nasa.gov/search`, `/asset/{nasa_id}`, `/metadata/{nasa_id}`, `/captions/{nasa_id}`
- **NASA Moon Facts & Exploration:** `https://science.nasa.gov/moon/facts/`, `https://science.nasa.gov/moon/exploration/`
- **NASA Mars Facts & Exploration:** `https://science.nasa.gov/mars/facts/`, `https://science.nasa.gov/planetary-science/programs/mars-exploration/`
- **NASA Moon Trek & Mars Trek:** `https://trek.nasa.gov/moon/`, `https://trek.nasa.gov/mars/`
- **NASA Space Place:** `https://spaceplace.nasa.gov/`
- **NASA Media Usage Guidelines:** `https://www.nasa.gov/nasa-brand-center/images-and-media/`

---

## 5. Technology Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide React, Motion (`framer-motion` successor package `motion/react`)
- **Backend:** Node.js, Express (`server.ts`), SQLite (`better-sqlite3`), Google GenAI SDK (`@google/genai`)
- **Testing:** Vitest (`src/shared/simulation.test.ts`)

### REST API Endpoints
- `GET /api/health`
- `POST /api/mission/create`
- `GET /api/mission/:mission_id`
- `POST /api/mission/:mission_id/advance`
- `POST /api/mission/:mission_id/build`
- `POST /api/mission/:mission_id/respond`
- `GET /api/mission/:mission_id/report`
- `POST /api/simulation/what-if`
- `POST /api/mentor/explain`
- `GET /api/nasa/search`
- `GET /api/nasa/asset/:nasa_id`
- `GET /api/learning/resources` & `POST /api/learning/progress`

---

## 6. Installation, Running & Testing

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (copy .env.example -> .env and set GEMINI_API_KEY)
cp .env.example .env

# 3. Run unit tests
npm test

# 4. Run full-stack development server (Express + Vite on port 3000)
npm run dev

# 5. Build for production & run production server
npm run build
npm start
```

---

## 7. Deployment (Render)

Use the included `render.yaml` to deploy as a Node.js Web Service (`npm install && npm run build`, start command `npm start`) with `GEMINI_API_KEY` set in Render environment variables.

---

## 8. AI Usage Acknowledgement & Disclaimer

Google Gemini (`gemini-4-hydrogen`) is used strictly as a server-side educational Mission Mentor (`POST /api/mentor/explain`) to explain live simulation telemetry and verified planetary science. AI never modifies simulation calculations or fabricates NASA measurements.

> **Disclaimer:** ASTRAFORGE is an independent educational project created for the NASA Space Apps Challenge. It is not an official NASA product and is not endorsed by NASA. NASA resources are credited to their respective sources.

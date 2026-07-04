# RuralAI Predict — AI Solutions for Rural Development Planning

Empowering Smart Villages through Artificial Intelligence and Predictive Analytics.

RuralAI Predict is an operations center and decision support platform for rural development planners, local administration, and farmers in India. It integrates multi-source IoT telemetry, satellite indices, and weather feeds with state-of-the-art AI inference pipelines to optimize resources, predict hazards, and drive sustainable growth.

---

## 🚀 Key Modules & Features

1. **Operations Dashboard**: Real-time visualization of live village parameters (Farms, Water, Rainfall, Health) using custom charts and live district telemetry.
2. **Village Digital Twin (2.5D)**: Interactive isometric asset map with real-time telemetry overlays and diagnostic HUD alerts for healthcare, schools, and reservoirs.
3. **Smart Agriculture Lab**: Crop yield predictions, optimal harvesting schedules, and a leaf mycology disease scanner (mock).
4. **Water & Hydrology Manager**: Monitor reservoir drawdowns, aquifer recharge rates, and irrigation efficiency metrics.
5. **Weather & Monsoon Forecasts**: Precipitation probability tracking, wind vectors, and AI-driven agricultural planning alerts.
6. **Infrastructure & Disaster Prediction**: Real-time risk heatmaps for Floods, Cyclones, and Droughts, alongside localized mitigation plans.
7. **Government & Budget Console**: Demographics analysis, literacy tracking, and budget allocation visualization.
8. **AI Assistant Chatbot**: Natural language interface powered by a 3-tier fallback chain (**Groq LLaMA-3.3-70B** ➔ **Google Gemini 2.0** ➔ offline rules).
9. **Automated PDF Reports**: Client-side PDF generator with jsPDF to compile insights, telemetry logs, and priority projects.

---

## 🛠️ Technology Stack

### Frontend (React + Vite)
- **Framework**: React 18 + Vite 8 + TypeScript
- **Styling**: Tailwind CSS v4 (Glassmorphic theme)
- **Maps**: Leaflet.js (Dark CartoDB tiles)
- **Charts**: Chart.js (via react-chartjs-2)
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF + jspdf-autotable

### Backend (Node.js + Express)
- **Server**: Express.js + TypeScript + Node.js
- **Database**: SQLite3 (persistent tables) with JSON file fallback
- **Inference Engines**: 
  - Groq SDK (`llama-3.3-70b-versatile` model)
  - Google Generative AI SDK (`gemini-2.0-flash` model)

---

## ⚙️ Quick Start

### 1. Configure API Credentials
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Run the Backend
```bash
cd backend
npm install
npm run dev
```
The server will boot on `http://localhost:5000` and automatically initialize the SQLite tables and seed data.

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Vite will host the site on `http://localhost:5173`. Open this URL in your web browser.

---

## 👥 Seed Village Profiles
The system seeds 5 sample Indian villages into the database:
- **Ramapuram (Southern)**: Rice focus, high monsoons.
- **Pipili (Eastern)**: Cotton focus, medium water level.
- **Kanthalloor (Highlands)**: Tea & Spices focus, low temperatures.
- **Morachi Chincholi (Semi-Arid)**: Bajra & Jowar focus, high drought risk.
- **Hiware Bazar (Central Model)**: Maize & Vegetables focus, watershed conservation success.

---

*Developed under RuralAI Predict Systems. Powered by LLaMA-3 and Gemini.*

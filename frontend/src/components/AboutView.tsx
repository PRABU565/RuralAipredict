import React from 'react';
import { Cpu, Info, Layers, Sparkles } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative glass-panel rounded-2xl p-8 border border-slate-800 overflow-hidden glow-green">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shrink-0">
            <Cpu className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-white">RuralAI Predict</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Artificial Intelligence & Predictive Analytics Platform for Rural Development, Resource Optimization, and Smart Village Governance.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-emerald-400 font-mono">Version 1.0.0 (Production Live)</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-blue-400 font-mono">React v18 + Vite</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-purple-400 font-mono">SQLite Database Backend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Concept */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            The Vision
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Rural communities often suffer from a lack of data-driven resource allocation. Important planning around water storage, healthcare access, crop rotations, and disaster prevention is executed without localized predictive modeling.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mt-3">
            <strong>RuralAI Predict</strong> bridges this digital divide. By aggregating IoT ground-sensor metrics, historical meteorological charts, and satellite NDVI index images, the platform equips village administrators and policy planners with instant forecasting capabilities.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-blue-400" />
            Core Analytics Architecture
          </h3>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Agriculture Analytics:</strong> Generates multi-factor yields and recommends fertilizers based on Soil Moisture, Rainfall, and Temp.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Digital Twin Mapping:</strong> Renders village blueprints dynamically to prioritize structural development projects.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Disaster Prevention:</strong> Utilizes probability models to analyze immediate floods, droughts, and cyclones.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Smart Governance:</strong> Displays consolidated regional KPIs and budgets to promote auditing transparency.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Tech Stack Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-purple-400" />
          Technical Stack & Libraries
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 pb-3">Layer</th>
                <th className="py-2.5 pb-3">Technologies Used</th>
                <th className="py-2.5 pb-3">Functional Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              <tr>
                <td className="py-3 font-semibold text-white">Frontend UI</td>
                <td className="py-3 text-emerald-400">React v18 + Vite + TypeScript</td>
                <td className="py-3">Fast loading, strict type-checking, responsive layout.</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Styling System</td>
                <td className="py-3 text-blue-400">Tailwind CSS v4 + Framer Motion</td>
                <td className="py-3">Native utility-based compilation with fluid dashboard animations.</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Interactive Maps</td>
                <td className="py-3 text-amber-400">Leaflet.js Maps (React-Leaflet wrapper)</td>
                <td className="py-3">Geospatial overlays showing real-time metrics for district locations.</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Visual Analytics</td>
                <td className="py-3 text-pink-400">Chart.js + React-Chartjs-2</td>
                <td className="py-3">Demographic, budget distribution, and crop trend charts.</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Backend Server</td>
                <td className="py-3 text-cyan-400">Node.js Express + TypeScript</td>
                <td className="py-3">Rest APIs routing database updates, analytics and mock ML models.</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Database Core</td>
                <td className="py-3 text-indigo-400">SQLite Database (with file-based JSON backup)</td>
                <td className="py-3">SQL structured table schemas for villages, logs, and analytics.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

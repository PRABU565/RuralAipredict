import React from 'react';
import { Droplet, HelpCircle, ShieldAlert, Waves } from 'lucide-react';
import { Village } from '../types';

interface WaterViewProps {
  selectedVillage: Village;
}

export const WaterView: React.FC<WaterViewProps> = ({ selectedVillage }) => {
  // Base water values from selected village
  const groundWater = selectedVillage.water_level - 13;
  const reservoir = Math.min(100, selectedVillage.water_level + 10);
  const tankStorage = selectedVillage.water_level;
  const damLevel = Math.max(25, selectedVillage.water_level - 5);

  const isLow = selectedVillage.water_level < 50;

  const targetSaving = isLow ? 15 : 8;
  const advice = isLow 
    ? `Water level is critical (${selectedVillage.water_level}%). Restrict micro-channel flooding. Allocate borewell quotas and schedule community drip schedules.` 
    : "Water levels are healthy. Maintain current replenishment filters and continue rainwater recharge cycles.";

  const gauges = [
    { title: "Water Tank Storage", value: tankStorage, color: "stroke-blue-500", text: "Community Supply" },
    { title: "Groundwater Table", value: groundWater, color: "stroke-emerald-500", text: "Aquifer Recharge" },
    { title: "Local Reservoir", value: reservoir, color: "stroke-cyan-500", text: "Irrigation Feeder" },
    { title: "Dam Level Capacity", value: damLevel, color: "stroke-teal-500", text: "Macro Storage" }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Water Resource Management</h2>
          <p className="text-slate-400 text-xs mt-0.5">Hydrological monitoring system for {selectedVillage.name} Village.</p>
        </div>
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] rounded-full flex items-center gap-1.5">
          <Droplet className="w-3.5 h-3.5 animate-bounce" /> AQUIFER DEPTH ACTIVE
        </span>
      </div>

      {/* Main progress rings */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {gauges.map((g, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 text-center tracking-wide">{g.title}</h3>
            
            <div className="relative w-28 h-28 my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" className="stroke-slate-800/80" strokeWidth="6" fill="none" />
                <circle 
                  cx="56" 
                  cy="56" 
                  r="46" 
                  className={`${g.color} transition-all duration-700`} 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray={289.02}
                  strokeDashoffset={289.02 - (289.02 * g.value) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-white">{g.value}%</span>
                <p className="text-[8px] text-slate-500 font-semibold uppercase">{g.text}</p>
              </div>
            </div>

            <div className="w-full bg-slate-900/60 rounded px-2 py-1 flex items-center justify-between text-[10px] text-slate-400 border border-slate-800/50">
              <span>Status</span>
              <span className={`font-semibold ${g.value < 40 ? 'text-red-400' : g.value < 65 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {g.value < 40 ? 'Critical' : g.value < 65 ? 'Moderate' : 'Optimal'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation alerts */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`glass-panel p-6 rounded-xl border ${isLow ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'} md:col-span-2 flex flex-col justify-between`}>
          <div>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase mb-3 ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              AI Hydrological Insight
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">
              {isLow ? "⚠️ Aquifer Water Levels Depleting" : "✅ Recharge Basins Performing Stable"}
            </h4>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Calculated dynamically using localized soil moisture sensors, weather indicators, and dam inflows.
            </p>
            <div className="mt-4 p-3 bg-slate-900/70 rounded-lg border border-slate-850">
              <div className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Community Resource Guideline:</div>
              <p className={`font-medium text-xs md:text-sm ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                {advice}
              </p>
            </div>
          </div>
        </div>

        {/* Conservation Target */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 flex flex-col justify-between text-center">
          <div>
            <h3 className="text-sm font-bold text-slate-300 flex items-center justify-center gap-1.5">
              <Waves className="w-4 h-4 text-blue-400" />
              AI Water Saving Goal
            </h3>
            <p className="text-slate-500 text-[10px] mt-1 font-medium">ESTIMATED TARGET SAVINGS NEEDED</p>
          </div>

          <div className="my-6">
            <span className="text-5xl font-extrabold text-blue-400 block">{targetSaving}%</span>
            <span className="text-slate-400 text-xs font-semibold mt-1 block">Consumption Reduction Target</span>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            CALCULATED VS. SEASONAL AVERAGE
          </div>
        </div>
      </div>
    </div>
  );
};

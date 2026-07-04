import React from 'react';
import { Route, Zap, Wifi, Home, Hospital, Landmark, Sparkles } from 'lucide-react';
import { Village } from '../types';

interface InfrastructureViewProps {
  selectedVillage: Village;
}

export const InfrastructureView: React.FC<InfrastructureViewProps> = ({ selectedVillage }) => {
  // Determine priorities based on infrastructure metrics
  const priorities: string[] = [];
  
  if (selectedVillage.road_quality === "Poor") {
    priorities.push("🛣️ Asphalting Rural Connective Corridor (Poor Road Rating)");
  }
  if (selectedVillage.electricity_access < 90) {
    priorities.push("⚡ Decentralized solar grids & microgrids installation");
  }
  if (selectedVillage.internet_coverage < 60) {
    priorities.push("📡 Fiber-optic rural internet extension & community Wi-Fi hubs");
  }
  if (selectedVillage.hospitals === 0) {
    priorities.push("🏥 Setting up a primary healthcare sub-center (0 hospitals active)");
  }
  if (selectedVillage.schools < 2) {
    priorities.push("🏫 Upgrading primary educational schools to middle secondary levels");
  }
  
  // Default fallback if everything is perfect
  if (priorities.length === 0) {
    priorities.push("🟢 Expand Smart Governance Digital Twin capabilities");
    priorities.push("🌱 Green energy public transport connections");
  }

  const infraItems = [
    { title: "Road Quality Network", value: selectedVillage.road_quality, desc: "Regional corridor health", icon: <Route className="w-5 h-5" />, color: selectedVillage.road_quality === 'Good' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : selectedVillage.road_quality === 'Fair' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5' },
    { title: "Electricity Connectivity", value: `${selectedVillage.electricity_access}%`, desc: "Households grid connected", icon: <Zap className="w-5 h-5 text-amber-400" />, color: selectedVillage.electricity_access >= 90 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
    { title: "Internet Coverage", value: `${selectedVillage.internet_coverage}%`, desc: "BWA / 4G coverage", icon: <Wifi className="w-5 h-5 text-blue-400" />, color: selectedVillage.internet_coverage >= 80 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
    { title: "Hospitals & clinics", value: `${selectedVillage.hospitals} PHC`, desc: "Healthcare access centers", icon: <Hospital className="w-5 h-5 text-rose-400" />, color: selectedVillage.hospitals > 0 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5' },
    { title: "School infrastructure", value: `${selectedVillage.schools} Active`, desc: "K-12 Educational spaces", icon: <Home className="w-5 h-5 text-purple-400" />, color: selectedVillage.schools >= 2 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5' }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Infrastructure & Services</h2>
          <p className="text-slate-400 text-xs mt-0.5">Asset metrics and connectivity assessments for {selectedVillage.name} Village.</p>
        </div>
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] rounded-full flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5" /> PLANNER SYNCED
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {infraItems.map((item, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">{item.title.split(' ')[0]}</span>
              <span className={`p-1.5 rounded-lg border bg-slate-900 ${item.color.split(' ')[0]}`}>
                {item.icon}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xl font-extrabold text-white">{item.value}</div>
              <div className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Suggested priorities list */}
      <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/40 via-slate-950 to-slate-900/20">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          AI Development Priorities Recommendations
        </h3>
        <p className="text-slate-400 text-xs md:text-sm mb-4 leading-relaxed">
          The models audit community parameters in real-time, matching resources with spatial planning requirements to identify gaps.
        </p>
        
        <div className="space-y-3">
          {priorities.map((p, idx) => (
            <div key={idx} className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg flex items-center gap-3 text-xs md:text-sm text-slate-200">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">{idx + 1}</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

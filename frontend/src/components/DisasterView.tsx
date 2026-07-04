import React, { useState } from 'react';
import { AlertOctagon, HelpCircle, ShieldAlert, Sparkles, Wind, Zap } from 'lucide-react';
import { Village } from '../types';

interface DisasterViewProps {
  selectedVillage: Village;
  allVillages: Village[];
}

type DisasterType = 'flood' | 'cyclone' | 'drought';

export const DisasterView: React.FC<DisasterViewProps> = ({ selectedVillage, allVillages }) => {
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterType>('flood');

  // Determine risk and probability based on select disaster and village rainfall/water stats
  const getDisasterStats = (disaster: DisasterType, v: Village) => {
    let risk = "Low";
    let prob = 12;
    let mitigation = "";

    if (disaster === 'flood') {
      if (v.rainfall > 1000) {
        risk = "High";
        prob = 92;
        mitigation = "Clear river channels, deploy water-retaining barriers, and activate school shelter evacuation networks.";
      } else if (v.rainfall > 700) {
        risk = "Medium";
        prob = 68;
        mitigation = "Clear drainage catchments. Keep sandbag barriers on standby near low-lying farmlands.";
      } else {
        risk = "Low";
        prob = 18;
        mitigation = "Standard drainage clearing. Flood risk remains low for this sector.";
      }
    } else if (disaster === 'drought') {
      if (v.rainfall < 500) {
        risk = "High";
        prob = 85;
        mitigation = "Mandate water conservation. Open community groundwater reserves, and distribute drought-resistant seeds (Bajra/Jowar).";
      } else if (v.rainfall < 700) {
        risk = "Medium";
        prob = 54;
        mitigation = "Incentivize micro-drip irrigation. Restrict surface flooding methods and prioritize domestic water use.";
      } else {
        risk = "Low";
        prob = 15;
        mitigation = "Recharge tables are normal. Drought risk is negligible.";
      }
    } else if (disaster === 'cyclone') {
      // High for coastal regions or high rainfall
      if (v.region.toLowerCase().includes('eastern') || v.region.toLowerCase().includes('highlands')) {
        risk = "Medium";
        prob = 48;
        mitigation = "Reinforce roof brackets on public structures, audit emergency energy grids, and alert harbor signals.";
      } else {
        risk = "Low";
        prob = 10;
        mitigation = "Wind velocities are normal. Standard weather alerts are sufficient.";
      }
    }

    return { risk, prob, mitigation };
  };

  const { risk, prob, mitigation } = getDisasterStats(selectedDisaster, selectedVillage);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            Disaster Prediction Lab
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Model regional hazards and generate structural protection guidelines for {selectedVillage.name}.
          </p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(['flood', 'cyclone', 'drought'] as DisasterType[]).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDisaster(d)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all capitalize ${selectedDisaster === d ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Disaster metrics details */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 md:col-span-2 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Risk Evaluation Summary
            </h3>
            
            <div className="space-y-5">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estimated Risk Tier</span>
                <span className={`text-3xl font-extrabold tracking-tight block mt-1 ${risk === 'High' ? 'text-red-500 animate-pulse' : risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {risk} Risk
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Calculated Probability</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${risk === 'High' ? 'bg-red-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${prob}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-extrabold font-mono text-white">{prob}%</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Active AI Mitigation Rule</span>
                <p className="text-slate-200 text-xs leading-relaxed">{mitigation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono pt-4 border-t border-slate-800/50">
            <Sparkles className="w-3.5 h-3.5" />
            MODEL: HAZARD-ANALYTICS-GRID // ACCURACY: 96%
          </div>
        </div>

        {/* Heatmap Visualizer */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 md:col-span-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1.5">District Hazard Heatmap</h3>
            <p className="text-slate-400 text-xs mb-4">
              Geographic sector color grades showing risk thresholds for the selected disaster type: <strong className="text-white capitalize">{selectedDisaster}</strong>.
            </p>
          </div>

          {/* SVG representation of 2D Grid Heatmap */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 flex items-center justify-center min-h-[220px]">
            <svg viewBox="0 0 400 200" className="w-full h-auto max-w-[340px]">
              {/* Draw 2D Grid blocks represent village blocks */}
              {allVillages.map((v, idx) => {
                const stats = getDisasterStats(selectedDisaster, v);
                const color = stats.risk === 'High' ? 'fill-red-500/30 stroke-red-500' : stats.risk === 'Medium' ? 'fill-amber-500/30 stroke-amber-500' : 'fill-emerald-500/30 stroke-emerald-500';
                const pulseClass = stats.risk === 'High' ? 'animate-pulse' : '';
                
                // Layout coordinates
                const x = 50 + (idx % 3) * 110 + (idx > 2 ? 55 : 0);
                const y = idx > 2 ? 110 : 30;

                const isTarget = v.id === selectedVillage.id;

                return (
                  <g key={v.id} className={pulseClass}>
                    {/* Sector Block */}
                    <rect 
                      x={x} 
                      y={y} 
                      width="80" 
                      height="50" 
                      rx="6" 
                      className={`${color} stroke-2 transition-all duration-300`} 
                    />
                    
                    {/* Target highlighter indicator */}
                    {isTarget && (
                      <rect
                        x={x - 4}
                        y={y - 4}
                        width="88"
                        height="58"
                        rx="10"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                      />
                    )}

                    {/* Sector Text Name */}
                    <text 
                      x={x + 40} 
                      y={y + 25} 
                      textAnchor="middle" 
                      className="fill-white font-sans text-[10px] font-bold"
                    >
                      {v.name}
                    </text>

                    {/* Sector Risk level text */}
                    <text 
                      x={x + 40} 
                      y={y + 40} 
                      textAnchor="middle" 
                      className={`font-sans text-[9px] font-bold ${stats.risk === 'High' ? 'fill-red-400' : stats.risk === 'Medium' ? 'fill-amber-400' : 'fill-emerald-400'}`}
                    >
                      {stats.risk} ({stats.prob}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-4">
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> GRID SCALE RATIO: 1:2500m</span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/40 border border-emerald-500"></span> Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500/40 border border-amber-500"></span> Med</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/40 border border-red-500"></span> High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Home, School, Hospital, Droplet, Route, Sparkles, Cpu, Layers } from 'lucide-react';
import { Village } from '../types';

interface DigitalTwinViewProps {
  selectedVillage: Village;
}

type BuildingType = 'school' | 'hospital' | 'farm' | 'watertank' | 'road';

interface BuildingDetails {
  name: string;
  type: BuildingType;
  status: string;
  kpi: string;
  recommendation: string;
  details: string;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({ selectedVillage }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType>('farm');

  const getBuildingDetails = (type: BuildingType): BuildingDetails => {
    switch (type) {
      case 'school':
        return {
          name: "Rural Academy Primary School",
          type: 'school',
          status: selectedVillage.school_attendance > 90 ? "Operating Optimal" : "Requires Intervention",
          kpi: `Attendance: ${selectedVillage.school_attendance}% // Dropout Predictor: ${selectedVillage.dropout_prediction}%`,
          details: `Consists of ${selectedVillage.schools} educational blocks, serving student cohorts. Active enrollment is steady, but connectivity constraints are limiting access to modern digital study courses.`,
          recommendation: selectedVillage.dropout_prediction > 8 
            ? "Implement vocational training certifications, install digital classroom monitors, and configure student bus routes to reverse the dropout trend."
            : "Expand digital computer labs. Install solar panel arrays to provide uninterruptible energy for internet equipment."
        };
      case 'hospital':
        return {
          name: "Primary Health Center (PHC)",
          type: 'hospital',
          status: selectedVillage.hospitals > 0 ? "Operating Stable" : "CRITICAL DEFICIT",
          kpi: `Regional Health Index: ${selectedVillage.health_index}% // Healthcare Facility: ${selectedVillage.hospitals} PHC`,
          details: selectedVillage.hospitals > 0 
            ? "Fully operational local clinic offering checkups, maternal care, and immunizations." 
            : "No active healthcare facility inside village limits. Citizens currently travel to adjacent regional blocks for treatment.",
          recommendation: selectedVillage.hospitals === 0 
            ? "Urgent: Construct a modular telemedicine kiosk and place an ambulance vehicle on site. Establish a bi-weekly mobile doctor clinic schedule."
            : "Deploy a digital patient database connected to regional hubs, and install solar vaccine refrigerators."
        };
      case 'watertank':
        return {
          name: "Integrated Water Supply Tower",
          type: 'watertank',
          status: selectedVillage.water_level > 60 ? "Operating Optimal" : "LOW RESERVES",
          kpi: `Storage Level: ${selectedVillage.water_level}% // Aquifer Replenishment Rate: Stable`,
          details: `Supplies clean filtered water to houses and local farmland. Gravity-fed pipelines extend across the village grid.`,
          recommendation: selectedVillage.water_level < 50
            ? "Critical: Restrict crop flooding. Apply solar-powered automation valves to manage supply hours, and incentivize rainwater harvesting channels."
            : "Install ultrasonic flow meters to track leakage. Maintain bio-filtration recharge chambers."
        };
      case 'road':
        return {
          name: "Regional Connective Corridor",
          type: 'road',
          status: selectedVillage.road_quality === "Good" ? "Optimal" : selectedVillage.road_quality === "Fair" ? "Stable" : "Requires Repair",
          kpi: `Quality Index: ${selectedVillage.road_quality} // Electrified Corridor: ${selectedVillage.electricity_access}%`,
          details: `Connecting local farms to regional trade markets. Structural deterioration is observed in low-lying sections during wet seasons.`,
          recommendation: selectedVillage.road_quality === "Poor"
            ? "High Priority: Lay all-weather bituminous road paving, install concrete stormwater side-channels, and add LED street lights."
            : "Schedule biannual gravel fill audits and verify drainage culverts are cleared before monsoons."
        };
      case 'farm':
      default:
        return {
          name: "AI Crop Analytics Farm Grid",
          type: 'farm',
          status: selectedVillage.soil_moisture > 50 ? "Optimal Moisture" : "Dry Soil Alarm",
          kpi: `Soil Moisture: ${selectedVillage.soil_moisture}% // Crop Cultivated: ${selectedVillage.crop}`,
          details: `Covers agricultural lands using IoT telemetry. Monitors crop canopy health, soil nitrogen levels, and moisture ranges.`,
          recommendation: selectedVillage.soil_moisture < 45
            ? "Action: Activate drip irrigation lines immediately. Shift crop schedules to moisture-preserving cycles (mulch cover recommended)."
            : "Soil conditions are healthy. Current crop yield targets are on pace for a strong harvest."
        };
    }
  };

  const activeDetails = getBuildingDetails(selectedBuilding);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Digital Twin Village Model
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Interactive 2.5D schematic of {selectedVillage.name}. Click buildings to analyze assets and inspect AI operational insights.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] rounded-full flex items-center gap-1.5 animate-pulse">
          <Cpu className="w-3.5 h-3.5" /> DIGITAL TWIN SYNCHRONIZED
        </span>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left Side: Isometric SVG Map */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 md:col-span-3 flex flex-col justify-between items-center min-h-[350px]">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider self-start">Interactive Blueprint HUD</span>
          
          {/* Isometric styled SVG */}
          <div className="w-full flex items-center justify-center p-2 relative">
            <svg viewBox="0 0 500 320" className="w-full h-auto max-w-[420px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              {/* Ground Grid lines (isometric perspective) */}
              <g stroke="rgba(51, 65, 85, 0.2)" strokeWidth="1">
                <path d="M 250,20 L 480,140" />
                <path d="M 250,20 L 20,140" />
                <path d="M 20,140 L 250,260" />
                <path d="M 480,140 L 250,260" />
                
                {/* Internal grid tiles */}
                <path d="M 135,80 L 365,200" />
                <path d="M 365,80 L 135,200" />
                <path d="M 250,140 L 480,260" fill="none" />
                <path d="M 250,140 L 20,260" fill="none" />
              </g>

              {/* Road Network Paths */}
              <path 
                d="M 250,20 L 250,260 M 20,140 L 480,140" 
                fill="none" 
                stroke={selectedBuilding === 'road' ? '#38bdf8' : '#334155'} 
                strokeWidth={selectedBuilding === 'road' ? '12' : '8'} 
                className="cursor-pointer transition-all duration-200"
                onClick={() => setSelectedBuilding('road')}
              />
              
              {/* Water Tank Building (Left quadrant) */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedBuilding('watertank')}
              >
                <ellipse 
                  cx="120" 
                  cy="90" 
                  rx="24" 
                  ry="12" 
                  fill={selectedBuilding === 'watertank' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(30, 41, 59, 0.6)'} 
                  stroke={selectedBuilding === 'watertank' ? '#0ea5e9' : '#475569'} 
                  strokeWidth="2" 
                />
                <line x1="120" y1="90" x2="120" y2="125" stroke={selectedBuilding === 'watertank' ? '#0ea5e9' : '#475569'} strokeWidth="3" />
                <line x1="110" y1="93" x2="110" y2="125" stroke={selectedBuilding === 'watertank' ? '#0ea5e9' : '#475569'} strokeWidth="1.5" />
                <line x1="130" y1="93" x2="130" y2="125" stroke={selectedBuilding === 'watertank' ? '#0ea5e9' : '#475569'} strokeWidth="1.5" />
                {/* Cylinder water top */}
                <path 
                  d="M 100,75 C 100,81 140,81 140,75 L 140,60 C 140,54 100,54 100,60 Z" 
                  fill={selectedBuilding === 'watertank' ? '#0ea5e9' : '#1e293b'} 
                  stroke={selectedBuilding === 'watertank' ? '#38bdf8' : '#64748b'} 
                  strokeWidth="1.5"
                />
                <text x="120" y="70" textAnchor="middle" className="fill-white text-[8px] font-bold font-sans">H2O</text>
              </g>

              {/* School Building (Back quadrant) */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedBuilding('school')}
              >
                <polygon 
                  points="210,90 250,70 290,90 290,120 210,120" 
                  fill={selectedBuilding === 'school' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(30, 41, 59, 0.6)'} 
                  stroke={selectedBuilding === 'school' ? '#a855f7' : '#475569'} 
                  strokeWidth="2" 
                />
                {/* Roof */}
                <polygon 
                  points="200,90 250,55 300,90" 
                  fill={selectedBuilding === 'school' ? '#a855f7' : '#334155'} 
                  stroke={selectedBuilding === 'school' ? '#c084fc' : '#64748b'} 
                  strokeWidth="1.5" 
                />
                {/* Entrance door */}
                <rect x="240" y="102" width="20" height="18" fill="#0f172a" stroke={selectedBuilding === 'school' ? '#a855f7' : '#475569'} />
                <text x="250" y="85" textAnchor="middle" className="fill-white text-[9px] font-extrabold">SCHOOL</text>
              </g>

              {/* Hospital Building (Right quadrant) */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedBuilding('hospital')}
              >
                <polygon 
                  points="350,110 395,85 440,110 440,140 350,140" 
                  fill={selectedBuilding === 'hospital' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(30, 41, 59, 0.6)'} 
                  stroke={selectedBuilding === 'hospital' ? '#f43f5e' : '#475569'} 
                  strokeWidth="2" 
                />
                <rect x="385" y="118" width="20" height="22" fill="#0f172a" stroke={selectedBuilding === 'hospital' ? '#f43f5e' : '#475569'} />
                {/* Red cross symbol */}
                <path d="M 390,95 L 400,95 M 395,90 L 395,100" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                <text x="395" y="112" textAnchor="middle" className="fill-white text-[8px] font-bold font-sans">PHC</text>
              </g>

              {/* Farm Field Grid (Front quadrant) */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedBuilding('farm')}
              >
                {/* Isometric diamond field */}
                <polygon 
                  points="250,165 340,210 250,255 160,210" 
                  fill={selectedBuilding === 'farm' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.4)'} 
                  stroke={selectedBuilding === 'farm' ? '#10b981' : '#475569'} 
                  strokeWidth="2" 
                />
                {/* Cultivated rows inside diamond */}
                <line x1="220" y1="180" x2="310" y2="225" stroke={selectedBuilding === 'farm' ? 'rgba(16, 185, 129, 0.5)' : '#334155'} strokeWidth="2" />
                <line x1="200" y1="190" x2="290" y2="235" stroke={selectedBuilding === 'farm' ? 'rgba(16, 185, 129, 0.5)' : '#334155'} strokeWidth="2" />
                <line x1="180" y1="200" x2="270" y2="245" stroke={selectedBuilding === 'farm' ? 'rgba(16, 185, 129, 0.5)' : '#334155'} strokeWidth="2" />
                
                {/* Green farm plant icons mock */}
                <circle cx="250" cy="190" r="3" fill="#10b981" />
                <circle cx="270" cy="200" r="3" fill="#10b981" />
                <circle cx="230" cy="200" r="3" fill="#10b981" />
                <circle cx="250" cy="210" r="3" fill="#10b981" />
                <circle cx="210" cy="210" r="3" fill="#10b981" />
                <circle cx="230" cy="220" r="3" fill="#10b981" />

                <text x="250" y="243" textAnchor="middle" className="fill-white text-[9px] font-extrabold uppercase tracking-wide">FARM FIELDS</text>
              </g>
            </svg>
          </div>

          <div className="flex justify-between w-full text-[9px] font-mono text-slate-500 mt-2">
            <span>GRID MAP VIEW: ISOMETRIC-2.5D</span>
            <span>CLICK TO QUERY DATA FEED</span>
          </div>
        </div>

        {/* Right Side: Building telemetry HUD panel */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div className="glass-panel p-6 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Asset Telemetry HUD
                </h3>
                <span className="p-1 bg-slate-900 border border-slate-800 rounded">
                  {selectedBuilding === 'farm' && <Home className="w-4 h-4 text-emerald-400" />}
                  {selectedBuilding === 'school' && <School className="w-4 h-4 text-purple-400" />}
                  {selectedBuilding === 'hospital' && <Hospital className="w-4 h-4 text-rose-400" />}
                  {selectedBuilding === 'watertank' && <Droplet className="w-4 h-4 text-blue-400" />}
                  {selectedBuilding === 'road' && <Route className="w-4 h-4 text-cyan-400" />}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-white">{activeDetails.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeDetails.status.toLowerCase().includes('optimal') || activeDetails.status.toLowerCase().includes('stable') ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{activeDetails.status}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded font-mono text-[10px] text-slate-300">
                  <div className="text-slate-500 font-semibold mb-0.5">METRIC LOG:</div>
                  {activeDetails.kpi}
                </div>

                <div className="text-xs text-slate-400 leading-relaxed">
                  {activeDetails.details}
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                    AI Optimization Recommendation
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {activeDetails.recommendation}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-mono text-right mt-6 pt-4 border-t border-slate-800/50">
              AUDIT FEED: SEC-ID_TWD_{selectedBuilding.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

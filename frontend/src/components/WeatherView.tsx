import React from 'react';
import { CloudRain, Compass, Droplet, Sun, Thermometer, Wind } from 'lucide-react';
import { Village } from '../types';

interface WeatherViewProps {
  selectedVillage: Village;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ selectedVillage }) => {
  // Add some slight mock variability based on village temperature/rainfall properties
  const isHighRain = selectedVillage.rainfall > 800;
  const isHot = selectedVillage.temperature > 32;

  const rainProb = isHighRain ? 88 : 45;
  const rainForecast = isHighRain ? "Heavy Rain Expected Tomorrow" : "Clear Skies with Occasional Clouds";
  const advice = isHighRain 
    ? "Delay irrigation. Prepare soil drainage paths to avoid waterlogging." 
    : (selectedVillage.soil_moisture < 45 ? "Schedule standard drip irrigation in the morning hours." : "Soil moisture is healthy. Irrigation can be postponed by 24 hours.");

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Weather Analytics Lab</h2>
          <p className="text-slate-400 text-xs mt-0.5">Real-time localized meteorological tracking for {selectedVillage.name} Village.</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] rounded-full flex items-center gap-1.5 animate-pulse">
          <Sun className="w-3.5 h-3.5" /> LIVE RADAR SYNCED
        </span>
      </div>

      {/* Main Meteorological Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Temperature</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{selectedVillage.temperature}°C</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{isHot ? "Abnormal Heat" : "Normal Season"}</div>
          </div>
        </div>

        {/* Humidity */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Humidity</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{selectedVillage.humidity}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Evapotranspiration</div>
          </div>
        </div>

        {/* Rainfall */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Annual Rainfall</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{selectedVillage.rainfall} mm</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Monsoon Accumulation</div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Wind Speed</div>
            <div className="text-xl font-extrabold text-white mt-0.5">14.8 km/h</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Direction: NNE</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Rainfall Probability */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 md:col-span-1 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-300">Rainfall Probability</h3>
          
          <div className="relative w-32 h-32 mx-auto my-4 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-800" strokeWidth="8" fill="none" />
              <circle 
                cx="64" 
                cy="64" 
                r="54" 
                className="stroke-blue-500 transition-all duration-500" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={339.29}
                strokeDashoffset={339.29 - (339.29 * rainProb) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-white">{rainProb}%</span>
              <p className="text-[9px] text-slate-500 font-semibold uppercase">Precipitation</p>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs font-semibold text-slate-200">{rainForecast}</span>
          </div>
        </div>

        {/* AI Recommendation Alert */}
        <div className="glass-panel p-6 rounded-xl border border-blue-500/20 bg-blue-500/5 md:col-span-2 flex flex-col justify-between glow-blue">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wider uppercase mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
              AI Meteorological Recommendation
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{isHighRain ? "🚨 High Rainfall Advisory" : "✅ Moderate Weather Condition"}</h4>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Based on satellite NDVI analysis and localized barometric sensors, the model has updated agricultural recommendation matrices for this quadrant.
            </p>
            <div className="mt-4 p-3.5 bg-slate-900/60 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Recommended Farmer Action:</div>
              <p className="text-emerald-400 font-medium text-xs md:text-sm">{advice}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-4">
            <Compass className="w-3.5 h-3.5" />
            GEOLOCATION GRID: GRID-402A // WEATHER CONFIDENCE: 98%
          </div>
        </div>
      </div>
    </div>
  );
};

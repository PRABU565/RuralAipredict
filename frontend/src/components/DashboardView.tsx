import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Tractor, Users, Droplets, CloudRain, ShieldCheck, AlertOctagon, TrendingUp } from 'lucide-react';
import { Village } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardViewProps {
  selectedVillage: Village;
  allVillages: Village[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ selectedVillage, allVillages }) => {
  // Aggregate stats across all villages
  const totalFarms = allVillages.length * 250; // mock farms representation
  const totalFarmers = allVillages.reduce((acc, v) => acc + v.farmers, 0);

  // Cards representation
  const metrics = [
    { title: "Farms Monitored", value: totalFarms.toString(), desc: "IoT linked crop fields", icon: <Tractor className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/20 text-emerald-400" },
    { title: "Active Farmers", value: totalFarmers.toLocaleString(), desc: "Workforce in dashboard", icon: <Users className="w-5 h-5 text-blue-400" />, color: "border-blue-500/20 text-blue-400" },
    { title: "Water Level", value: `${selectedVillage.water_level}%`, desc: "Hydrological reservoir", icon: <Droplets className="w-5 h-5 text-cyan-400" />, color: "border-cyan-500/20 text-cyan-400" },
    { title: "Annual Rainfall", value: `${selectedVillage.rainfall} mm`, desc: "Monsoon tracking index", icon: <CloudRain className="w-5 h-5 text-amber-400" />, color: "border-amber-500/20 text-amber-400" },
    { title: "Health Index", value: `${selectedVillage.health_index}%`, desc: "Wellness rating PHC", icon: <TrendingUp className="w-5 h-5 text-rose-400" />, color: "border-rose-500/20 text-rose-450" },
    { title: "Priority Alerts", value: selectedVillage.disease_risk === 'High' ? "3 Active" : "1 Active", desc: "AI anomaly warnings", icon: <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />, color: selectedVillage.disease_risk === 'High' ? "border-red-500/30 text-red-400 bg-red-500/5 animate-pulse" : "border-slate-800 text-slate-400" },
    { title: "AI Accuracy", value: "96.4%", desc: "Validation confidence", icon: <ShieldCheck className="w-5 h-5 text-teal-400" />, color: "border-teal-500/20 text-teal-400" }
  ];

  // --- Chart 1: Crop Yield Trends (Line) ---
  const yieldTrendData = {
    labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
    datasets: [{
      label: `${selectedVillage.crop} Yield (Tons/Ha)`,
      data: selectedVillage.crop === 'Rice' ? [3.8, 4.0, 4.5, 4.9, 5.1, 5.28] : selectedVillage.crop === 'Cotton' ? [2.1, 2.3, 2.5, 2.9, 3.2, 3.8] : [1.5, 1.8, 2.2, 2.4, 2.8, 3.1],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
    }]
  };

  // --- Chart 2: Rainfall Trends (Bar) ---
  const rainfallTrendData = {
    labels: ['Jan-Feb', 'Mar-Apr', 'May-Jun', 'Jul-Aug', 'Sep-Oct', 'Nov-Dec'],
    datasets: [{
      label: 'Rainfall Distribution (mm)',
      data: selectedVillage.rainfall > 800 ? [50, 110, 320, 450, 240, 60] : [20, 60, 150, 280, 110, 30],
      backgroundColor: 'rgba(59, 130, 246, 0.65)',
      borderColor: '#3b82f6',
      borderWidth: 1.5,
    }]
  };

  // --- Chart 3: Water Consumption (Line) ---
  const waterUsageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Water Drawdown (KL)',
      data: selectedVillage.water_level < 50 ? [80, 75, 70, 65, 62, 58, 55] : [110, 105, 112, 108, 115, 120, 118],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.05)',
      borderWidth: 2,
      tension: 0.2,
    }]
  };

  // --- Chart 4: Farmer Income Across Villages (Bar) ---
  const incomeData = {
    labels: allVillages.map(v => v.name),
    datasets: [{
      label: 'Average Annual Farmer Income (INR)',
      data: [78000, 62000, 94000, 58000, 85000],
      backgroundColor: 'rgba(16, 185, 129, 0.55)',
      borderColor: '#10b981',
      borderWidth: 1.5,
    }]
  };

  // --- Chart 5: Disease Trend Occurrence (Line) ---
  const diseaseTrendData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [{
      label: 'Foliar Blight Incidents (Grid Blocks)',
      data: selectedVillage.disease_risk === 'High' ? [5, 12, 28, 35, 15, 8] : [1, 3, 8, 12, 4, 1],
      borderColor: '#f43f5e',
      backgroundColor: 'rgba(244, 63, 94, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.15)' },
        ticks: { color: '#94a3b8', font: { size: 9 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 9 } }
      }
    },
    plugins: {
      legend: { labels: { color: '#e2e8f0', font: { size: 9 } } }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Live Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className={`glass-panel p-4 rounded-xl border flex flex-col justify-between h-28 ${m.color.split(' ')[0]}`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{m.title.split(' ')[0]}</span>
              <span className="p-1 bg-slate-900 border border-slate-850 rounded">
                {m.icon}
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-extrabold text-white">{m.value}</div>
              <div className="text-[8px] text-slate-550 font-semibold mt-0.5 tracking-wide leading-tight">{m.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Crop Yield */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 h-64">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-850 pb-2 mb-3">
            Crop Yield Growth Trends
          </h3>
          <div className="h-44 relative">
            <Line data={yieldTrendData} options={commonOptions} />
          </div>
        </div>

        {/* Chart 2: Rainfall */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 h-64">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-850 pb-2 mb-3">
            Rainfall Seasonal Distribution
          </h3>
          <div className="h-44 relative">
            <Bar data={rainfallTrendData} options={commonOptions} />
          </div>
        </div>

        {/* Chart 3: Water Drawdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 h-64">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-850 pb-2 mb-3">
            Weekly Water Drawdown Rates
          </h3>
          <div className="h-44 relative">
            <Line data={waterUsageData} options={commonOptions} />
          </div>
        </div>

        {/* Chart 4: Farmer Income */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 h-64 lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-850 pb-2 mb-3">
            Regional Annual Farmer Income Comparison
          </h3>
          <div className="h-44 relative">
            <Bar data={incomeData} options={commonOptions} />
          </div>
        </div>

        {/* Chart 5: Disease Outbreaks */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 h-64">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-850 pb-2 mb-3">
            Crop Foliage Blight Incidents
          </h3>
          <div className="h-44 relative">
            <Line data={diseaseTrendData} options={commonOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};

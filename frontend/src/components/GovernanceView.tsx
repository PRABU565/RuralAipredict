import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Landmark, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Village, BudgetAllocation } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GovernanceViewProps {
  allVillages: Village[];
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({ allVillages }) => {
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch budgets from API
  useEffect(() => {
    fetch('/api/budgets')
      .then(res => res.json())
      .then(data => {
        setBudgets(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed fetching budgets, seeding mock data:", err);
        // Fallback seed
        setBudgets([
          { category: "Agriculture Support", allocated: 4500000, spent: 3800000 },
          { category: "Water Management", allocated: 3200000, spent: 2900000 },
          { category: "Healthcare & PHCs", allocated: 2500000, spent: 1800000 },
          { category: "Rural Roads & Power", allocated: 5000000, spent: 4200000 },
          { category: "Education & Literacy", allocated: 1800000, spent: 1550000 },
          { category: "Disaster Preparedness", allocated: 1200000, spent: 400000 }
        ]);
        setLoading(false);
      });
  }, []);

  // Aggregated indicators
  const totalPopulation = allVillages.reduce((acc, v) => acc + v.population, 0);
  const totalFarmers = allVillages.reduce((acc, v) => acc + v.farmers, 0);
  const avgHealthIndex = Math.round(allVillages.reduce((acc, v) => acc + v.health_index, 0) / allVillages.length);
  const totalAllocatedBudget = budgets.reduce((acc, b) => acc + b.allocated, 0);

  // --- Chart 1: Budget Allocation (Doughnut) ---
  const budgetChartData = {
    labels: budgets.map(b => b.category),
    datasets: [{
      data: budgets.map(b => b.allocated),
      backgroundColor: [
        'rgba(16, 185, 129, 0.75)', // emerald
        'rgba(59, 130, 246, 0.75)',  // blue
        'rgba(244, 63, 94, 0.75)',   // rose
        'rgba(245, 158, 11, 0.75)',  // amber
        'rgba(168, 85, 247, 0.75)',  // purple
        'rgba(6, 182, 212, 0.75)'    // cyan
      ],
      borderColor: 'rgba(15, 23, 42, 0.9)',
      borderWidth: 2,
    }]
  };

  // --- Chart 2: Village Yield vs. Water Level (Double Bar) ---
  const villageData = {
    labels: allVillages.map(v => v.name),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Water Reservoir (%)',
        data: allVillages.map(v => v.water_level),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 1.5,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'Soil Moisture (%)',
        data: allVillages.map(v => v.soil_moisture),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: 1.5,
        yAxisID: 'y1',
      }
    ]
  };

  const villageOptions = {
    responsive: true,
    scales: {
      y1: {
        type: 'linear' as const,
        position: 'left' as const,
        max: 100,
        grid: { color: 'rgba(51, 65, 85, 0.15)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { labels: { color: '#e2e8f0' } }
    }
  };

  // --- Chart 3: Demographic Breakdown (Bar) ---
  const demoChartData = {
    labels: allVillages.map(v => v.name),
    datasets: [
      {
        label: 'Total Population',
        data: allVillages.map(v => v.population),
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgba(168, 85, 247, 0.9)',
        borderWidth: 1,
      },
      {
        label: 'Active Farmers',
        data: allVillages.map(v => v.farmers),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 0.9)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Smart Governance Center</h2>
          <p className="text-slate-400 text-xs mt-0.5">District demographic indexes, financial transparency auditing, and analytics reports.</p>
        </div>
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[11px] rounded-full flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5" /> TREASURY MONITOR ACTIVE
        </span>
      </div>

      {/* Governance KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Total District Population</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{totalPopulation.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across 5 mapped sectors</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Farmers Engaged</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{totalFarmers.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Agriculture workforce</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Allocated Budget</div>
            <div className="text-xl font-extrabold text-white mt-0.5">₹{(totalAllocatedBudget / 10000000).toFixed(2)} Cr</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active Fiscal Term</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 rounded-lg border border-rose-500/20 text-rose-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Avg Health Index</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{avgHealthIndex}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Primary wellness score</div>
          </div>
        </div>
      </div>

      {/* Charts Panel */}
      {loading ? (
        <div className="text-center py-10">
          <span className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin inline-block"></span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Doughnut Budget Allocation */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-2 mb-4">
                District Budget Allocation
              </h3>
              <div className="max-w-[280px] mx-auto my-2">
                <Doughnut data={budgetChartData} options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, color: '#e2e8f0', font: { size: 10 } } } } }} />
              </div>
            </div>
          </div>

          {/* Double Bar Water & Moisture */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-2 mb-4">
              Village Hydrology Indices
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Bar data={villageData} options={villageOptions} />
            </div>
          </div>

          {/* Demographics bar chart */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-2 mb-4">
              Regional Demographics Distribution
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Bar 
                data={demoChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { grid: { color: 'rgba(51, 65, 85, 0.15)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                  },
                  plugins: { legend: { labels: { color: '#e2e8f0' } } }
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

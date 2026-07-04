import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Eye, CloudSun, Database, Cpu, TrendingUp, Landmark, Home } from 'lucide-react';

interface WorkflowNode {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

export const WorkflowView: React.FC = () => {
  const steps: WorkflowNode[] = [
    { title: "IoT Sensors", desc: "Soil moisture, ground humidity & temperature sensors streaming real-time metrics.", icon: <Radio className="w-6 h-6 text-emerald-400" />, color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/70" },
    { title: "Satellite Images", desc: "Multi-spectral Sentinel and Landsat imagery capturing crop health NDVI index.", icon: <Eye className="w-6 h-6 text-blue-400" />, color: "border-blue-500/30 text-blue-400 bg-blue-500/5 hover:border-blue-500/70" },
    { title: "Weather Data", desc: "Live weather radar networks streaming wind, humidity, and rainfall probability.", icon: <CloudSun className="w-6 h-6 text-amber-400" />, color: "border-amber-500/30 text-amber-400 bg-amber-500/5 hover:border-amber-500/70" },
    { title: "Cloud Database", desc: "Secure SQLite/MongoDB warehouse storing seed variables and historic trends.", icon: <Database className="w-6 h-6 text-cyan-400" />, color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5 hover:border-cyan-500/70" },
    { title: "Machine Learning", desc: "Random Forest & Neural Networks trained to infer crop yield and predict disease risk.", icon: <Cpu className="w-6 h-6 text-indigo-400" />, color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:border-indigo-500/70" },
    { title: "Predictive Analytics", desc: "Real-time crop forecasting, disaster risk grading, and drop-out warnings.", icon: <TrendingUp className="w-6 h-6 text-pink-400" />, color: "border-pink-500/30 text-pink-400 bg-pink-500/5 hover:border-pink-500/70" },
    { title: "Decision Support", desc: "Empowering rural administrators with spatial priorities, budgets & chatbot queries.", icon: <Landmark className="w-6 h-6 text-violet-400" />, color: "border-violet-500/30 text-violet-400 bg-violet-500/5 hover:border-violet-500/70" },
    { title: "Smart Village", desc: "Actionable local farming, sustainable water distribution, and optimized services.", icon: <Home className="w-6 h-6 text-emerald-500" />, color: "border-emerald-500/40 text-emerald-500 bg-emerald-500/10 hover:border-emerald-500/80" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          AI & IoT Operational Data Pipeline
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Trace how telemetry from IoT nodes and satellite imagery undergoes ML transformation into smart governance insights.
        </p>
      </div>

      {/* Desktop horizontal path */}
      <div className="hidden xl:block relative py-8 px-4">
        {/* SVG connection lines */}
        <svg className="absolute inset-x-0 top-1/2 -translate-y-12 h-20 w-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M 60,30 L 1100,30"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            className="flow-line"
          />
        </svg>

        <div className="grid grid-cols-8 gap-4 relative z-10">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={`flex flex-col items-center text-center p-4 rounded-xl border ${step.color} transition-all duration-300 backdrop-blur-sm`}
            >
              <div className="p-3 bg-slate-900 rounded-xl mb-3 shadow-inner border border-slate-800">
                {step.icon}
              </div>
              <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">Step 0{idx + 1}</div>
              <h3 className="text-sm font-bold text-slate-100 mt-1">{step.title}</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-2 hidden lg:block">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet vertical grid path */}
      <div className="xl:hidden space-y-6 relative py-4">
        {/* Center vertical indicator line */}
        <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-indigo-500 pointer-events-none"></div>

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 items-start relative z-10"
          >
            {/* Left Circle Icon */}
            <div className="flex items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-700 shadow-lg shrink-0">
              {step.icon}
            </div>
            
            {/* Card Content */}
            <div className={`flex-1 p-4 rounded-xl border ${step.color} transition-all duration-300`}>
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Step 0{idx + 1}</div>
              <h3 className="text-base font-bold text-slate-100">{step.title}</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Satellite, CloudSun, Radio, ShieldCheck, Check, Server } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

interface LogStep {
  text: string;
  icon: React.ReactNode;
  duration: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [percent, setPercent] = useState<number>(0);

  const steps: LogStep[] = [
    { text: "🤖 AI Brain Initialized...", icon: <Cpu className="w-5 h-5 text-emerald-400" />, duration: 1000 },
    { text: "🛰️ Fetching Live Satellite Imaging...", icon: <Satellite className="w-5 h-5 text-blue-400" />, duration: 1200 },
    { text: "🌦️ Synchronizing Meteorological Feeds...", icon: <CloudSun className="w-5 h-5 text-amber-400" />, duration: 1000 },
    { text: "📡 Reading IoT Ground Sensor Array...", icon: <Radio className="w-5 h-5 text-purple-400" />, duration: 1400 },
    { text: "🖥️ Launching SQLite Core & Data Sync...", icon: <Server className="w-5 h-5 text-cyan-400" />, duration: 1000 },
    { text: "🧠 Crunching Predictive Analytics Models...", icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, duration: 1200 },
  ];

  useEffect(() => {
    let stepTimer: any;
    
    const runStep = (index: number) => {
      if (index >= steps.length) {
        // All steps done, wait 1s then exit
        setTimeout(() => {
          onComplete();
        }, 1000);
        return;
      }

      stepTimer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        setCurrentStep(index + 1);
        runStep(index + 1);
      }, steps[index].duration);
    };

    runStep(0);

    return () => clearTimeout(stepTimer);
  }, [onComplete]);

  // Overall percentage progress bar
  useEffect(() => {
    const totalDuration = steps.reduce((acc, s) => acc + s.duration, 0);
    const intervalTime = 50;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden font-sans">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
      
      {/* Radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative max-w-xl w-full px-6 flex flex-col items-center z-10">
        {/* Glowing Logo Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl glow-green"
        >
          <Cpu className="w-16 h-16 text-emerald-400 animate-pulse" />
        </motion.div>

        {/* Brand Name */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent text-center"
        >
          RuralAI Predict
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-sm mt-2 text-center max-w-md"
        >
          Empowering Smart Villages through Artificial Intelligence & Predictive Analytics
        </motion.p>

        {/* Terminal logs panel */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-10 glass-panel rounded-xl p-5 border border-slate-800 text-left font-mono text-xs text-slate-300 min-h-[220px]"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-slate-500 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
            </span>
            <span>SYSTEM MONITOR // CONNECTED</span>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {steps.map((step, idx) => {
                const isCompleted = completedSteps.includes(idx);
                const isCurrent = idx === currentStep;
                const isHidden = idx > currentStep;

                if (isHidden) return null;

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-0.5"
                  >
                    <span className="flex items-center gap-3">
                      {step.icon}
                      <span className={isCompleted ? "text-slate-200" : "text-emerald-400 font-semibold"}>
                        {step.text}
                      </span>
                    </span>
                    <span>
                      {isCompleted ? (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></span>
                      )}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Loading Progress Bar */}
        <div className="w-full mt-8 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
            style={{ width: `${percent}%` }}
          ></motion.div>
        </div>
        <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-slate-500">
          <span>PROGRESS</span>
          <span>{Math.round(percent)}%</span>
        </div>
      </div>
    </div>
  );
};

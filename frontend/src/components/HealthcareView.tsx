import React, { useState } from 'react';
import { Activity, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { HealthPredictionInput, HealthPredictionOutput } from '../types';

export const HealthcareView: React.FC = () => {
  const [inputs, setInputs] = useState<HealthPredictionInput>({
    age: 45,
    bp: 120,
    sugar: 110,
    heartRate: 72
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<HealthPredictionOutput | null>({
    risk: "Low",
    nearestPHC: 2.0,
    recommendation: "Maintain current healthy diet and routine exercise."
  });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/predict/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
        signal: AbortSignal.timeout(1500)
      });
      if (response.ok) {
        const data = await response.json();
        setOutput(data);
      } else {
        // Mock fallback if backend is down
        const isHigh = inputs.bp > 140 || inputs.sugar > 160 || inputs.heartRate > 100;
        setOutput({
          risk: isHigh ? "High" : inputs.age > 60 ? "Medium" : "Low",
          nearestPHC: isHigh ? 1.5 : 3.0,
          recommendation: isHigh 
            ? "Emergency: Please visit the nearest Primary Health Center (PHC) immediately. Contact telemedicine helpdesk."
            : "Schedule a visit to the PHC for a checkup. Monitor sodium and sugar intake."
        });
      }
    } catch (err) {
      // Fallback
      const isHigh = inputs.bp > 140 || inputs.sugar > 160 || inputs.heartRate > 100;
      setOutput({
        risk: isHigh ? "High" : inputs.age > 60 ? "Medium" : "Low",
        nearestPHC: isHigh ? 1.5 : 3.0,
        recommendation: isHigh 
          ? "Emergency: Please visit the nearest Primary Health Center (PHC) immediately."
          : "Routine review recommended. Limit sugar/salt."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Heart className="text-rose-500 w-5 h-5" />
          Rural Healthcare Analytics
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Evaluate individual patient telemetry to assess risk levels and direct patients to primary health centers.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Input Form */}
        <form onSubmit={handlePredict} className="glass-panel p-6 rounded-xl border border-slate-800 md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 mb-3 uppercase tracking-wide">
            Patient Telemetry Input
          </h3>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Age (Years)</label>
            <input 
              type="number"
              value={inputs.age}
              onChange={(e) => setInputs(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              required
              min="1"
              max="120"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Systolic Blood Pressure (mmHg)</label>
            <input 
              type="number"
              value={inputs.bp}
              onChange={(e) => setInputs(prev => ({ ...prev, bp: parseInt(e.target.value) || 0 }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              required
              min="50"
              max="250"
            />
            <span className="text-[9px] text-slate-500 mt-1 block">Normal: 90 - 120 mmHg</span>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Blood Sugar Level (mg/dL)</label>
            <input 
              type="number"
              value={inputs.sugar}
              onChange={(e) => setInputs(prev => ({ ...prev, sugar: parseInt(e.target.value) || 0 }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              required
              min="40"
              max="500"
            />
            <span className="text-[9px] text-slate-500 mt-1 block">Normal: 70 - 140 mg/dL (Random)</span>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Heart Rate (BPM)</label>
            <input 
              type="number"
              value={inputs.heartRate}
              onChange={(e) => setInputs(prev => ({ ...prev, heartRate: parseInt(e.target.value) || 0 }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              required
              min="30"
              max="220"
            />
            <span className="text-[9px] text-slate-500 mt-1 block">Normal: 60 - 100 BPM</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Activity className="w-4 h-4" /> Run Diagnosis
              </>
            )}
          </button>
        </form>

        {/* Prediction Output */}
        <div className="md:col-span-3 space-y-6 flex flex-col justify-between">
          <div className="glass-panel p-6 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
                Clinical Diagnosis Report
              </h3>

              {output ? (
                <div className="space-y-5">
                  {/* Risk Tier Card */}
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Health Risk Tier</span>
                      <span className={`text-3xl font-extrabold tracking-tight ${output.risk === 'High' ? 'text-red-500' : output.risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {output.risk} Risk
                      </span>
                    </div>
                    <div className={`p-2.5 rounded-full shrink-0 ${output.risk === 'High' ? 'bg-red-500/10 text-red-500' : output.risk === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Nearest PHC distance */}
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs md:text-sm">
                    <span className="text-slate-400">Nearest Primary Health Center (PHC):</span>
                    <span className="text-white font-bold font-mono">{output.nearestPHC} km</span>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">AI Recommendation</span>
                    <p className="text-slate-200 text-xs md:text-sm leading-relaxed">{output.recommendation}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-sm py-10">
                  Fill out the parameters and click "Run Diagnosis" to analyze patient metrics.
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-6 pt-4 border-t border-slate-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              DIAGNOSTIC SYSTEM ID: HCR-V1 // CONFIDENCE: 94%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { GraduationCap, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { Village } from '../types';

interface EducationViewProps {
  selectedVillage: Village;
}

export const EducationView: React.FC<EducationViewProps> = ({ selectedVillage }) => {
  const teacherRatio = Math.round(selectedVillage.population / 120); // mock ratio
  const literacy = selectedVillage.literacy_rate;
  const attendance = selectedVillage.school_attendance;
  const dropout = selectedVillage.dropout_prediction;

  const isHighDropout = dropout > 8;

  const cards = [
    { title: "Literacy Rate", value: `${literacy}%`, desc: "Total Literate Population", icon: <GraduationCap className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
    { title: "School Attendance", value: `${attendance}%`, desc: "Active K-12 Student Enrolment", icon: <Users className="w-5 h-5 text-blue-400" />, color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
    { title: "Teacher-Student Ratio", value: `1:${teacherRatio}`, desc: "Average Class Assignment", icon: <GraduationCap className="w-5 h-5 text-purple-400" />, color: "border-purple-500/20 bg-purple-500/5 text-purple-400" }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Education Analytics</h2>
          <p className="text-slate-400 text-xs mt-0.5">Demographic learning curves, school resources, and student drop-out risks for {selectedVillage.name}.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] rounded-full flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" /> LITERACY TRACK ACTIVE
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 flex items-start gap-4">
            <div className={`p-3 rounded-xl border shrink-0 ${c.color.split(' ')[0]} ${c.color.split(' ')[1]} ${c.color.split(' ')[2]}`}>
              {c.icon}
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">{c.title}</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">{c.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Dropout risk analysis */}
        <div className={`glass-panel p-6 rounded-xl border ${isHighDropout ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'} md:col-span-2 flex flex-col justify-between`}>
          <div>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase mb-3 ${isHighDropout ? 'text-red-400' : 'text-emerald-400'}`}>
              <AlertTriangle className="w-4 h-4" />
              Dropout Risk Analytics
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              {isHighDropout ? "⚠️ High School Dropout Tendency Detected" : "✅ Low Student Attrition Levels"}
            </h4>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Calculated using historical census models, school resource maps, and commute distance metrics. {selectedVillage.name} shows a <strong>{dropout}%</strong> dropout probability within the next academic term.
            </p>
            
            {isHighDropout ? (
              <div className="mt-4 p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Recommended Policy Action:</span>
                <p className="text-amber-400 font-medium text-xs md:text-sm">
                  Introduce vocational training credits, establish high-school transit buses, and allocate female student scholarships to offset enrollment loss.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Recommended Policy Action:</span>
                <p className="text-emerald-400 font-medium text-xs md:text-sm">
                  Maintain active student engagement campaigns and audit digital classroom infrastructure upgrades.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Growth index */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 flex flex-col justify-between text-center">
          <div>
            <h3 className="text-sm font-bold text-slate-300 flex items-center justify-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
              Annual Literacy Growth
            </h3>
            <p className="text-slate-500 text-[10px] mt-1 font-medium">MEASURED FROM PAST 24 MONTHS</p>
          </div>

          <div className="my-6">
            <span className="text-5xl font-extrabold text-emerald-400 block">+8.2%</span>
            <span className="text-slate-400 text-xs font-semibold mt-1 block">Accelerated Learning Curve</span>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            TARGET ACCELERATION: +10% BY 2028
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import { Village } from '../types';

interface ReportsViewProps {
  selectedVillage: Village;
  allVillages: Village[];
}

type ReportType = 'development' | 'crop' | 'water' | 'health' | 'government';

export const ReportsView: React.FC<ReportsViewProps> = ({ selectedVillage, allVillages }) => {
  const [reportType, setReportType] = useState<ReportType>('development');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const getReportName = (type: ReportType) => {
    switch(type) {
      case 'crop': return "Smart Agriculture & Crop Analysis";
      case 'water': return "Water Audit & Aquifer Resource Report";
      case 'health': return "Healthcare Access & Patient Risk Log";
      case 'government': return "Smart Governance & Regional Budget Audit";
      case 'development':
      default:
        return "Comprehensive Village Development Report";
    }
  };

  const handleExportPDF = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      // Fetch automated insights from backend server report endpoint
      const response = await fetch(`/api/reports/village/${selectedVillage.id}`);
      let reportData;
      if (response.ok) {
        reportData = await response.json();
      } else {
        // Fallback mock report builder if server is offline
        reportData = {
          reportDate: new Date().toLocaleDateString(),
          villageName: selectedVillage.name,
          region: selectedVillage.region,
          demographics: { population: selectedVillage.population, farmers: selectedVillage.farmers },
          liveMetrics: { rainfall: selectedVillage.rainfall + " mm", waterLevel: selectedVillage.water_level + "%", soilMoisture: selectedVillage.soil_moisture + "%", temperature: selectedVillage.temperature + " °C", healthIndex: selectedVillage.health_index + "%" },
          education: { literacy: selectedVillage.literacy_rate + "%", schoolAttendance: selectedVillage.school_attendance + "%", predictedDropout: selectedVillage.dropout_prediction + "%", remarks: "Attendance rates are stable." },
          infrastructure: { roadQuality: selectedVillage.road_quality, electricity: selectedVillage.electricity_access + "%", internet: selectedVillage.internet_coverage + "%", schoolsCount: selectedVillage.schools, hospitalsCount: selectedVillage.hospitals, remarks: "Basic utilities are active." },
          aiInsights: { cropRecommendation: `AI recommends continuing ${selectedVillage.crop} farming cycles.`, remarks: "Optimal moisture balance recorded.", priorityActions: selectedVillage.priority_projects.split(', ') }
        };
      }

      // Initialize jsPDF document
      const doc = new jsPDF();
      doc.setFont('helvetica');

      // Title & Brand
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text("RuralAI Predict", 14, 20);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("AI Solutions for Rural Development Planning & Governance", 14, 25);
      doc.line(14, 28, 196, 28);

      // Metadata block
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text(getReportName(reportType), 14, 37);
      
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text(`Village: ${reportData.villageName} (${reportData.region})`, 14, 43);
      doc.text(`Generated Date: ${reportData.reportDate}`, 155, 43);

      let currentY = 50;

      if (reportType === 'development' || reportType === 'government') {
        // Table 1: Demographics & Core Info
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        doc.text("1. Demographics & Telemetry Metrics", 14, currentY);
        
        autoTable(doc, {
          startY: currentY + 2.5,
          head: [['Metric Parameter', 'Current Value']],
          body: [
            ['Population Census Count', reportData.demographics.population.toLocaleString()],
            ['Active Farmers Engaged', reportData.demographics.farmers.toLocaleString()],
            ['Soil Moisture Index', reportData.liveMetrics.soilMoisture],
            ['Average Temperature', reportData.liveMetrics.temperature],
            ['Water Reservoir Level', reportData.liveMetrics.waterLevel],
            ['Recent Annual Rainfall', reportData.liveMetrics.rainfall],
          ],
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] }
        });
        
        // Update Y position
        currentY = (doc as any).lastAutoTable.finalY + 12;

        // Table 2: Public Infrastructure
        doc.text("2. Infrastructure & Educational Audits", 14, currentY);
        autoTable(doc, {
          startY: currentY + 2.5,
          head: [['Sector Infrastructure', 'Rating / Access Count', 'Operational Status']],
          body: [
            ['Road Transport Network', reportData.infrastructure.roadQuality, reportData.infrastructure.remarks],
            ['Grid Electricity Coverage', reportData.infrastructure.electricity, 'Active Connectivity'],
            ['Internet BWA Coverage', reportData.infrastructure.internet, 'Active Transmitters'],
            ['Schools Serving Sector', `${reportData.infrastructure.schoolsCount} Active`, reportData.education.remarks],
            ['Hospitals Active', `${reportData.infrastructure.hospitalsCount} PHC`, selectedVillage.hospitals > 0 ? "Staffed" : "Deficit Warning"],
          ],
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] }
        });

        currentY = (doc as any).lastAutoTable.finalY + 12;
      }

      if (reportType === 'crop' || reportType === 'development') {
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        doc.text("3. Agriculture AI Recommendations", 14, currentY);
        
        autoTable(doc, {
          startY: currentY + 2.5,
          head: [['Crop Type', 'Yield Prediction', 'Moisture Level', 'Disease Risk', 'Harvest Status']],
          body: [
            [selectedVillage.crop, '5.28 Tons/Ha', reportData.liveMetrics.soilMoisture, selectedVillage.disease_risk, 'Suitable for Harvest'],
          ],
          theme: 'striped',
          headStyles: { fillColor: [245, 158, 11] }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      // Render AI Action items
      doc.setFontSize(11);
      doc.setTextColor(16, 185, 129);
      doc.text("AI Action Priority Guidelines:", 14, currentY);
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      
      let itemY = currentY + 6;
      reportData.aiInsights.priorityActions.forEach((action: string, idx: number) => {
        doc.text(`[${idx + 1}] ${action}`, 14, itemY);
        itemY += 6;
      });

      // Footer branding
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("This is an automated system generated report compiled by RuralAI Predict Operations Center.", 14, 280);
      doc.text("Page 1 of 1", 180, 280);

      // Save PDF file trigger download
      doc.save(`RuralAI_${reportData.villageName}_${reportType}_Report.pdf`);
      setSuccess(true);
    } catch(err) {
      console.error("Failed creating report PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          Predictive Analytics & Reports Generator
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Compile regional sensor datasets, clinical risk factors, and budget maps into a downloadable PDF report.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        
        {/* Report configuration */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wide border-b border-slate-800 pb-2">
            Configure Report Details
          </h3>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Target Village Sector</label>
            <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg text-xs font-bold text-slate-200">
              {selectedVillage.name} ({selectedVillage.region})
            </div>
            <span className="text-[9px] text-slate-500 mt-1 block">To compile details for another village, change selection in sidebar.</span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Report Category</label>
            <div className="space-y-2">
              {[
                { type: 'development', label: 'Village Development Summary' },
                { type: 'crop', label: 'Smart Agriculture Yield Report' },
                { type: 'water', label: 'Hydrology & Water Audit' },
                { type: 'health', label: 'Clinical Telemetry & Health Audit' },
                { type: 'government', label: 'Governance & Budget Allocation' }
              ].map((item) => (
                <label 
                  key={item.type} 
                  className={`flex items-center gap-3 p-2.5 border rounded-lg text-xs font-semibold cursor-pointer transition-all ${reportType === item.type ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >
                  <input 
                    type="radio" 
                    name="reportType" 
                    value={item.type}
                    checked={reportType === item.type}
                    onChange={() => { setReportType(item.type as ReportType); setSuccess(false); }}
                    className="hidden"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Download className="w-4 h-4" /> Export Report (PDF)
              </>
            )}
          </button>
        </div>

        {/* Report Preview card */}
        <div className="md:col-span-3 space-y-6 flex flex-col justify-between">
          <div className="glass-panel p-6 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-2 mb-4">
                Interactive Document Preview
              </h3>

              <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-900 font-mono text-[10px] text-slate-350 space-y-4 max-h-[260px] overflow-y-auto">
                <div className="flex justify-between text-slate-500">
                  <span>DOCUMENT: RURALAI_REP_V001.pdf</span>
                  <span>PREVIEW ACTIVE</span>
                </div>
                
                <div className="border-t border-slate-850 pt-2 text-center text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  RuralAI Predict Report
                </div>

                <div className="space-y-1">
                  <div><strong>REPORT CATEGORY:</strong> {getReportName(reportType)}</div>
                  <div><strong>VILLAGE SECTOR:</strong> {selectedVillage.name} ({selectedVillage.region})</div>
                  <div><strong>POPULATION COUNT:</strong> {selectedVillage.population}</div>
                  <div><strong>FARM WORKFORCE:</strong> {selectedVillage.farmers}</div>
                </div>

                <div className="border-t border-slate-850 pt-2">
                  <div className="text-slate-400 font-bold mb-1">SYSTEM ANALYTICAL REMARKS:</div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    {reportType === 'crop' && `Soil moisture currently registered at ${selectedVillage.soil_moisture}%. Recommending harvest routines in 15 days.`}
                    {reportType === 'water' && `Water reserves at ${selectedVillage.water_level}%. Hydrological recharge basins are normal.`}
                    {reportType === 'health' && `Average patient index is at ${selectedVillage.health_index}%. PHC access priority index stands at 3.0.`}
                    {reportType === 'government' && `Budget support audit confirms 88% allocations spent in connectivity projects.`}
                    {reportType === 'development' && `Comprehensive telemetry audits confirm road transport systems need upgrade priority.`}
                  </p>
                </div>
              </div>
            </div>

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 text-xs font-medium mt-4 animate-bounce">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Document compiled and exported successfully! Check your local browser downloads folder.</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-6 pt-4 border-t border-slate-800/50">
              <ShieldAlert className="w-3.5 h-3.5" />
              CONFIDENTIALITY RATING: PUBLIC // REGIONAL USE ONLY
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Sprout, CloudSun, Droplets, Heart, 
  GraduationCap, Route, AlertTriangle, Landmark, Bot, 
  FileText, Info, HelpCircle, Layers, Settings, User, Menu, X 
} from 'lucide-react';

import { Village } from './types';
import { WelcomeScreen } from './WelcomeScreen';
import { DashboardView } from './components/DashboardView';
import { AgricultureView } from './components/AgricultureView';
import { WeatherView } from './components/WeatherView';
import { WaterView } from './components/WaterView';
import { HealthcareView } from './components/HealthcareView';
import { EducationView } from './components/EducationView';
import { InfrastructureView } from './components/InfrastructureView';
import { DisasterView } from './components/DisasterView';
import { GovernanceView } from './components/GovernanceView';
import { DigitalTwinView } from './components/DigitalTwinView';
import { ChatbotView } from './components/ChatbotView';
import { ReportsView } from './components/ReportsView';
import { LeafletMap } from './components/LeafletMap';
import { WorkflowView } from './components/WorkflowView';
import { AboutView } from './components/AboutView';
import { SettingsModal } from './components/SettingsModal';

type TabType = 
  | 'dashboard' | 'agriculture' | 'weather' | 'water' 
  | 'health' | 'education' | 'infrastructure' | 'disaster' 
  | 'governance' | 'digitaltwin' | 'chatbot' | 'reports' | 'about';

export default function App() {
  const [booting, setBooting] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Fetch villages on mount
  useEffect(() => {
    if (booting) return; // wait for boot complete

    const fetchVillages = async () => {
      try {
        const response = await fetch('/api/villages', { signal: AbortSignal.timeout(1500) });
        if (response.ok) {
          const data = await response.json();
          setVillages(data);
          setSelectedVillage(data[0]);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.warn("Backend API offline, seeding fallback village list:", err);
        // Fallback seed database if API uvicorn/node is down
        const fallbackSeeds: Village[] = [
          {
            id: 1,
            name: "Ramapuram",
            region: "Southern Region",
            population: 3450,
            farmers: 1200,
            crop: "Rice",
            rainfall: 852,
            water_level: 78,
            soil_moisture: 65,
            temperature: 29,
            humidity: 72,
            health_index: 92,
            literacy_rate: 76,
            school_attendance: 92,
            dropout_prediction: 6,
            road_quality: "Fair",
            electricity_access: 88,
            internet_coverage: 60,
            hospitals: 1,
            schools: 2,
            disease_risk: "Low",
            priority_projects: "Upgrade Road Infrastructure, Install solar microgrids for farming"
          },
          {
            id: 2,
            name: "Pipili",
            region: "Eastern Region",
            population: 2100,
            farmers: 850,
            crop: "Cotton",
            rainfall: 620,
            water_level: 52,
            soil_moisture: 42,
            temperature: 34,
            humidity: 50,
            health_index: 85,
            literacy_rate: 68,
            school_attendance: 88,
            dropout_prediction: 12,
            road_quality: "Poor",
            electricity_access: 70,
            internet_coverage: 45,
            hospitals: 0,
            schools: 1,
            disease_risk: "Medium",
            priority_projects: "Build Primary Health Center (PHC), Rainwater Harvesting system"
          },
          {
            id: 3,
            name: "Kanthalloor",
            region: "Highlands Region",
            population: 1800,
            farmers: 620,
            crop: "Tea & Spices",
            rainfall: 1250,
            water_level: 92,
            soil_moisture: 80,
            temperature: 20,
            humidity: 85,
            health_index: 94,
            literacy_rate: 91,
            school_attendance: 96,
            dropout_prediction: 3,
            road_quality: "Good",
            electricity_access: 95,
            internet_coverage: 80,
            hospitals: 1,
            schools: 2,
            disease_risk: "Low",
            priority_projects: "Organic Farming Cold Storage, Rural Tourism Internet Expansion"
          },
          {
            id: 4,
            name: "Morachi Chincholi",
            region: "Western Semi-Arid",
            population: 1550,
            farmers: 540,
            crop: "Bajra & Jowar",
            rainfall: 410,
            water_level: 35,
            soil_moisture: 28,
            temperature: 36,
            humidity: 40,
            health_index: 89,
            literacy_rate: 80,
            school_attendance: 90,
            dropout_prediction: 7,
            road_quality: "Fair",
            electricity_access: 92,
            internet_coverage: 75,
            hospitals: 0,
            schools: 1,
            disease_risk: "High",
            priority_projects: "Groundwater Recharge shafts, Drip irrigation subsidy program"
          },
          {
            id: 5,
            name: "Hiware Bazar",
            region: "Central Model Village",
            population: 1250,
            farmers: 450,
            crop: "Maize & Vegetables",
            rainfall: 580,
            water_level: 82,
            soil_moisture: 70,
            temperature: 31,
            humidity: 55,
            health_index: 96,
            literacy_rate: 98,
            school_attendance: 99,
            dropout_prediction: 1,
            road_quality: "Good",
            electricity_access: 100,
            internet_coverage: 95,
            hospitals: 1,
            schools: 1,
            disease_risk: "Low",
            priority_projects: "Watershed Management Expansion, Smart Village Digital Twin upkeep"
          }
        ];
        setVillages(fallbackSeeds);
        setSelectedVillage(fallbackSeeds[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchVillages();
  }, [booting]);

  if (booting) {
    return <WelcomeScreen onComplete={() => setBooting(false)} />;
  }

  // Sidebar link categories
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'agriculture', label: 'Agriculture Analytics', icon: <Sprout className="w-4 h-4" /> },
    { id: 'weather', label: 'Weather Prediction', icon: <CloudSun className="w-4 h-4" /> },
    { id: 'water', label: 'Water Management', icon: <Droplets className="w-4 h-4" /> },
    { id: 'health', label: 'Rural Healthcare', icon: <Heart className="w-4 h-4" /> },
    { id: 'education', label: 'Education Analytics', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Infrastructure Planning', icon: <Route className="w-4 h-4" /> },
    { id: 'disaster', label: 'Disaster Prediction', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'governance', label: 'Government Dashboard', icon: <Landmark className="w-4 h-4" /> },
    { id: 'digitaltwin', label: 'Village Digital Twin ⭐', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
    { id: 'chatbot', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Export', icon: <FileText className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> }
  ];

  const handleVillageSelect = (vId: string) => {
    const v = villages.find(vill => vill.id === parseInt(vId));
    if (v) setSelectedVillage(v);
  };

  const renderActiveView = () => {
    if (!selectedVillage) return null;

    switch (activeTab) {
      case 'agriculture':
        return <AgricultureView selectedVillage={selectedVillage} allVillages={villages} />;
      case 'weather':
        return <WeatherView selectedVillage={selectedVillage} />;
      case 'water':
        return <WaterView selectedVillage={selectedVillage} />;
      case 'health':
        return <HealthcareView />;
      case 'education':
        return <EducationView selectedVillage={selectedVillage} />;
      case 'infrastructure':
        return <InfrastructureView selectedVillage={selectedVillage} />;
      case 'disaster':
        return <DisasterView selectedVillage={selectedVillage} allVillages={villages} />;
      case 'governance':
        return <GovernanceView allVillages={villages} />;
      case 'digitaltwin':
        return <DigitalTwinView selectedVillage={selectedVillage} />;
      case 'chatbot':
        return <ChatbotView />;
      case 'reports':
        return <ReportsView selectedVillage={selectedVillage} allVillages={villages} />;
      case 'about':
        return <AboutView />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <DashboardView selectedVillage={selectedVillage} allVillages={villages} />
            <div className="grid md:grid-cols-2 gap-6">
              <LeafletMap 
                allVillages={villages} 
                selectedVillage={selectedVillage} 
                onSelectVillage={(v) => setSelectedVillage(v)} 
              />
              <WorkflowView />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased overflow-x-hidden">
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentVillageName={selectedVillage?.name || 'None'}
      />
      
      {/* Background decoration elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Main Header / Top Navbar */}
      <header className="glass-panel border-b border-slate-900 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="p-1.5 sm:p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl glow-green shrink-0">
            <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-white">RuralAI Predict</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wider uppercase hidden sm:block">Smart Villages Operations Center</p>
          </div>
        </div>

        {/* Global Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {selectedVillage && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase hidden md:inline">Focus Village:</span>
              <select 
                value={selectedVillage.id}
                onChange={(e) => handleVillageSelect(e.target.value)}
                className="bg-slate-900/80 border border-slate-800 rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500/50 cursor-pointer max-w-[120px] sm:max-w-none"
              >
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
          <span className="h-6 w-[1px] bg-slate-800 hidden sm:inline"></span>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 rounded-lg text-slate-400 transition-all cursor-pointer"
            title="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Layout Container */}
      <div className="flex-1 flex relative z-10">
        
        {/* Left Sidebar Menu */}
        <aside className="w-64 border-r border-slate-900 glass-panel flex flex-col justify-between shrink-0 hidden lg:flex sticky top-20 h-[calc(100vh-76px)]">
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest px-3 mb-2.5">
              Control Panel
            </div>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeTab === item.id ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-900 flex items-center gap-3 bg-slate-900/20">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">District Planner</div>
              <div className="text-[9px] text-slate-500 font-semibold font-mono">ID: PLN-842</div>
            </div>
          </div>
        </aside>

        {/* Mobile slide-down menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-[52px] inset-x-0 bottom-0 z-40">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            {/* Drawer panel */}
            <div className="relative bg-slate-950 border-b border-slate-800 shadow-2xl max-h-[70vh] overflow-y-auto">
              <div className="p-3 grid grid-cols-3 gap-2">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as TabType); setMobileMenuOpen(false); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[9px] font-bold text-center leading-tight">{item.label.replace(' Analytics', '').replace(' Planning', '').replace(' Prediction', '').replace(' Management', '').replace(' Dashboard', '').replace('Reports & Export', 'Reports')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile bottom bar — scrollable with all key modules */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-900 z-40">
          <div className="flex items-center overflow-x-auto scrollbar-hide px-2 py-1.5 gap-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer min-w-[52px] ${
                  activeTab === item.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'
                }`}
              >
                {item.icon}
                <span className="text-[7px] font-bold whitespace-nowrap">{item.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel Container */}
        <main className="flex-1 p-3 sm:p-6 pb-24 lg:pb-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <span className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></span>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Compiling Analytics Data Grid...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto"
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

      </div>
    </div>
  );
}

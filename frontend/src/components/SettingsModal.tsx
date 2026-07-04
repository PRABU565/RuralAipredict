import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Settings, Cpu, Wifi, WifiOff, RefreshCw, Moon, Sun,
  Bell, BellOff, Globe, Database, Palette, RotateCcw,
  CheckCircle, AlertCircle, Monitor, Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVillageName: string;
}

interface ApiStatus {
  villages: 'checking' | 'online' | 'offline';
  predict: 'checking' | 'online' | 'offline';
  chat: 'checking' | 'online' | 'offline';
  budgets: 'checking' | 'online' | 'offline';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentVillageName }) => {
  const [activeSection, setActiveSection] = useState<string>('general');
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    villages: 'checking',
    predict: 'checking',
    chat: 'checking',
    budgets: 'checking',
  });
  const [checking, setChecking] = useState(false);

  // Preferences from localStorage
  const [animationsEnabled, setAnimationsEnabled] = useState(() =>
    localStorage.getItem('ruralai_animations') !== 'false'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(() =>
    localStorage.getItem('ruralai_notifications') !== 'false'
  );
  const [accentColor, setAccentColor] = useState(() =>
    localStorage.getItem('ruralai_accent') || 'emerald'
  );
  const [densityMode, setDensityMode] = useState(() =>
    localStorage.getItem('ruralai_density') || 'comfortable'
  );
  const [mapStyle, setMapStyle] = useState(() =>
    localStorage.getItem('ruralai_mapstyle') || 'dark'
  );

  // Check all API endpoints
  const checkApiStatus = async () => {
    setChecking(true);
    setApiStatus({ villages: 'checking', predict: 'checking', chat: 'checking', budgets: 'checking' });

    const checks: { key: keyof ApiStatus; url: string; method?: string; body?: object }[] = [
      { key: 'villages', url: '/api/villages' },
      { key: 'predict', url: '/api/predict/crop', method: 'POST', body: { crop: 'Rice', rainfall: 800, temperature: 28, humidity: 70, soilMoisture: 60 } },
      { key: 'chat', url: '/api/chat', method: 'POST', body: { message: 'test' } },
      { key: 'budgets', url: '/api/budgets' },
    ];

    for (const check of checks) {
      try {
        const options: RequestInit = check.method === 'POST'
          ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(check.body), signal: AbortSignal.timeout(1500) }
          : { signal: AbortSignal.timeout(1500) };

        const res = await fetch(check.url, options);
        setApiStatus(prev => ({ ...prev, [check.key]: res.ok ? 'online' : 'offline' }));
      } catch {
        setApiStatus(prev => ({ ...prev, [check.key]: 'offline' }));
      }
    }
    setChecking(false);
  };

  // Run check when modal opens on connection tab
  useEffect(() => {
    if (isOpen && activeSection === 'connection') {
      checkApiStatus();
    }
  }, [isOpen, activeSection]);

  const savePreference = (key: string, value: string | boolean) => {
    localStorage.setItem(`ruralai_${key}`, String(value));
  };

  const resetAllSettings = () => {
    const keys = ['animations', 'notifications', 'accent', 'density', 'mapstyle'];
    keys.forEach(k => localStorage.removeItem(`ruralai_${k}`));
    setAnimationsEnabled(true);
    setNotificationsEnabled(true);
    setAccentColor('emerald');
    setDensityMode('comfortable');
    setMapStyle('dark');
  };

  const StatusDot = ({ status }: { status: ApiStatus[keyof ApiStatus] }) => {
    if (status === 'checking') return <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse inline-block" />;
    if (status === 'online') return <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />;
    return <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />;
  };

  const sections = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'connection', label: 'Connection', icon: <Wifi className="w-4 h-4" /> },
    { id: 'about', label: 'About System', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[85vh] flex flex-col"
          >
            <div className="glass-panel rounded-2xl border border-slate-800 shadow-2xl shadow-black/50 flex flex-col overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                    <Settings className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">System Settings</h2>
                    <p className="text-[10px] text-slate-500 font-mono">Active Village: {currentVillageName}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/40 hover:text-red-400 text-slate-400 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Left nav */}
                <div className="w-44 border-r border-slate-800 p-3 space-y-1 shrink-0">
                  {sections.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSection(s.id);
                        if (s.id === 'connection') checkApiStatus();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
                        activeSection === s.id
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  ))}

                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <button
                      onClick={resetAllSettings}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset All
                    </button>
                  </div>
                </div>

                {/* Right content panel */}
                <div className="flex-1 p-5 overflow-y-auto space-y-5">

                  {/* GENERAL */}
                  {activeSection === 'general' && (
                    <div className="space-y-5">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Preferences</h3>

                      {/* Animations toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-800 rounded-lg text-blue-400"><Monitor className="w-4 h-4" /></div>
                          <div>
                            <div className="text-sm font-bold text-slate-200">UI Animations</div>
                            <div className="text-[10px] text-slate-500">Framer Motion transitions & hover effects</div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setAnimationsEnabled(v => { savePreference('animations', !v); return !v; }); }}
                          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${animationsEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${animationsEnabled ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>

                      {/* Notifications toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-800 rounded-lg text-amber-400">
                            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-200">Alert Notifications</div>
                            <div className="text-[10px] text-slate-500">Show high-risk AI anomaly warnings in dashboard</div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setNotificationsEnabled(v => { savePreference('notifications', !v); return !v; }); }}
                          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notificationsEnabled ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>

                      {/* Density mode */}
                      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-slate-800 rounded-lg text-purple-400"><Globe className="w-4 h-4" /></div>
                          <div>
                            <div className="text-sm font-bold text-slate-200">Display Density</div>
                            <div className="text-[10px] text-slate-500">Controls card padding and spacing</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {['compact', 'comfortable', 'spacious'].map(d => (
                            <button
                              key={d}
                              onClick={() => { setDensityMode(d); savePreference('density', d); }}
                              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer capitalize ${densityMode === d ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APPEARANCE */}
                  {activeSection === 'appearance' && (
                    <div className="space-y-5">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Appearance & Theme</h3>

                      {/* Accent color */}
                      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                        <div className="text-sm font-bold text-slate-200">Accent Color</div>
                        <div className="text-[10px] text-slate-500 mb-3">Applied to highlights, active states, and KPI cards</div>
                        <div className="flex gap-3 flex-wrap">
                          {[
                            { name: 'emerald', bg: 'bg-emerald-500', label: 'Emerald (Default)' },
                            { name: 'blue', bg: 'bg-blue-500', label: 'Blue' },
                            { name: 'violet', bg: 'bg-violet-500', label: 'Violet' },
                            { name: 'amber', bg: 'bg-amber-500', label: 'Amber' },
                            { name: 'rose', bg: 'bg-rose-500', label: 'Rose' },
                            { name: 'cyan', bg: 'bg-cyan-500', label: 'Cyan' },
                          ].map(color => (
                            <button
                              key={color.name}
                              onClick={() => { setAccentColor(color.name); savePreference('accent', color.name); }}
                              title={color.label}
                              className={`w-9 h-9 rounded-full ${color.bg} transition-all cursor-pointer ${accentColor === color.name ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-600 mt-2 font-mono">SELECTED: {accentColor.toUpperCase()}</div>
                      </div>

                      {/* Map style */}
                      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                        <div className="text-sm font-bold text-slate-200">Leaflet Map Style</div>
                        <div className="text-[10px] text-slate-500 mb-3">Changes the tile layer used for the interactive village map</div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: 'dark', label: 'Dark Mode (CartoDB)', desc: 'Premium dark satellite base' },
                            { name: 'satellite', label: 'Satellite View', desc: 'Esri World Imagery tiles' },
                            { name: 'street', label: 'Street Map', desc: 'OpenStreetMap standard' },
                            { name: 'terrain', label: 'Terrain / Relief', desc: 'Topographic contour map' },
                          ].map(style => (
                            <button
                              key={style.name}
                              onClick={() => { setMapStyle(style.name); savePreference('mapstyle', style.name); }}
                              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${mapStyle === style.name ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                              <div className="text-xs font-bold">{style.label}</div>
                              <div className="text-[9px] mt-0.5 opacity-70">{style.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CONNECTION */}
                  {activeSection === 'connection' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Backend API Connection</h3>
                        <button
                          onClick={checkApiStatus}
                          disabled={checking}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-xs font-bold text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                          {checking ? 'Checking...' : 'Re-test'}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: 'villages' as const, label: 'Villages Database', url: '/api/villages', desc: 'SQLite village data & telemetry' },
                          { key: 'predict' as const, label: 'Crop Prediction Engine', url: '/api/predict/crop', desc: 'ML crop yield & disease model' },
                          { key: 'chat' as const, label: 'AI Chatbot Engine', url: '/api/chat', desc: 'NLP rural advisory assistant' },
                          { key: 'budgets' as const, label: 'Budget & Finance API', url: '/api/budgets', desc: 'Governance budget allocation data' },
                        ].map(endpoint => (
                          <div key={endpoint.key} className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                            <div className="flex items-center gap-3">
                              <StatusDot status={apiStatus[endpoint.key]} />
                              <div>
                                <div className="text-sm font-bold text-slate-200">{endpoint.label}</div>
                                <div className="text-[10px] font-mono text-slate-500">{endpoint.url}</div>
                                <div className="text-[10px] text-slate-600">{endpoint.desc}</div>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                              apiStatus[endpoint.key] === 'online' ? 'bg-emerald-500/10 text-emerald-400' :
                              apiStatus[endpoint.key] === 'offline' ? 'bg-red-500/10 text-red-400' :
                              'bg-amber-500/10 text-amber-400'
                            }`}>
                              {apiStatus[endpoint.key].toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1.5">Backend Server</div>
                        <div className="text-xs text-slate-300">
                          <span className="text-slate-500">Address:</span> <span className="font-mono text-emerald-400">http://localhost:5000</span>
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          <span className="text-slate-500">Proxy:</span> <span className="font-mono text-blue-400">Vite → /api/* → :5000</span>
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          <span className="text-slate-500">Database:</span> <span className="font-mono text-purple-400">SQLite (rural_ai.db) + JSON fallback</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ABOUT */}
                  {activeSection === 'about' && (
                    <div className="space-y-5">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Information</h3>

                      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl text-center space-y-3">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl inline-block mx-auto">
                          <Cpu className="w-10 h-10 text-emerald-400 mx-auto" />
                        </div>
                        <div>
                          <h4 className="text-xl font-extrabold text-white">RuralAI Predict</h4>
                          <p className="text-[10px] text-slate-500 font-mono">v1.0.0 · Production Build</p>
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          AI Solutions for Rural Development Planning & Smart Governance
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {[
                          { label: 'Frontend', value: 'React 18 + Vite 8' },
                          { label: 'Styling', value: 'Tailwind CSS v4' },
                          { label: 'Charts', value: 'Chart.js 4' },
                          { label: 'Maps', value: 'Leaflet.js 1.9' },
                          { label: 'Animations', value: 'Framer Motion' },
                          { label: 'Backend', value: 'Express + TypeScript' },
                          { label: 'Database', value: 'SQLite3' },
                          { label: 'Icons', value: 'Lucide React' },
                        ].map(item => (
                          <div key={item.label} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</div>
                            <div className="text-slate-200 font-semibold mt-0.5">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-800 px-5 py-3 flex items-center justify-between bg-slate-900/30">
                <span className="text-[10px] text-slate-600 font-mono">SETTINGS AUTO-SAVED TO LOCAL STORAGE</span>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

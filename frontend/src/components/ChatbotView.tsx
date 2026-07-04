import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { ChatLog } from '../types';

type ChatMessage = ChatLog & { source?: 'groq' | 'gemini' | 'fallback' };

export const ChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      message: "Hello! I am your RuralAI Smart Assistant powered by Groq LLaMA-3 and Gemini AI. Ask me anything about agriculture, weather, water resources, healthcare, or government schemes!",
      timestamp: new Date().toLocaleTimeString(),
      source: undefined
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeEngine, setActiveEngine] = useState<string>('Groq LLaMA-3.3 70B');
  const scrollRef = useRef<HTMLDivElement>(null);

  const preSeeds = [
    "Which crop is suitable for this rainfall?",
    "Will rainfall increase?",
    "How to improve crop yield?",
    "Government schemes?",
    "Crop disease treatment?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      message: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
        signal: AbortSignal.timeout(1500)
      });

      if (response.ok) {
        const data = await response.json();
        const src = data.source as 'groq' | 'gemini' | 'fallback';
        if (src === 'groq') setActiveEngine('Groq LLaMA-3.3 70B');
        else if (src === 'gemini') setActiveEngine('Google Gemini 2.0');
        else setActiveEngine('Offline Keywords');

        setMessages(prev => [...prev, {
          sender: 'bot',
          message: data.reply,
          timestamp: new Date().toLocaleTimeString(),
          source: src
        }]);
      } else {
        throw new Error('Server error');
      }
    } catch {
      setActiveEngine('Offline Keywords');
      const msg = textToSend.toLowerCase();
      let reply = '';

      if (msg.includes('crop') && (msg.includes('rainfall') || msg.includes('suit'))) {
        reply = 'For high rainfall areas (>800mm), Rice and Sugarcane are highly recommended. For drier regions (<600mm), drought-resistant crops like Cotton, Bajra (Pearl Millet), Jowar (Sorghum), or Maize are best. Use the Smart Agriculture tab to run exact yield predictions.';
      } else if (msg.includes('crop') && msg.includes('best')) {
        reply = 'The best crop depends on the region. Southern regions (like Ramapuram) do best with Rice. Semi-arid areas (like Morachi Chincholi) do best with Bajra & Jowar. Highlands (like Kanthalloor) yield high returns on Tea & cold-climate Spices.';
      } else if (msg.includes('rainfall') || msg.includes('weather')) {
        reply = 'Our IoT ground sensors predict light to moderate rainfall. Farmers should consider delaying chemical spraying and open-field watering for 24-48 hours to conserve resources.';
      } else if (msg.includes('fertilizer') || msg.includes('recommendation')) {
        reply = 'For Rice, a standard NPK ratio of 4:2:1 is optimal, along with organic compost. For Cotton, apply nitrogen-rich fertilizers in stages. Refer to the Digital Twin kiosk for soil moisture telemetry.';
      } else if (msg.includes('yield') && (msg.includes('improve') || msg.includes('increase'))) {
        reply = 'Improve crop yields by: (1) Transitioning to micro-drip irrigation, (2) Practicing mulching, (3) Tuning sowing cycles to weather forecasts, and (4) Scanning leaves in the Agriculture module for disease diagnosis.';
      } else if (msg.includes('scheme') || msg.includes('government')) {
        reply = 'Key active schemes: PM-KISAN (direct cash support of ₹6,000/year), PM Fasal Bima Yojana (crop insurance), PM Krishi Sinchayee Yojana (micro-irrigation equipment subsidy), and local borewell recharge grants.';
      } else if (msg.includes('disease') || msg.includes('blight') || msg.includes('leaf')) {
        reply = 'High humidity combined with 28-32°C temps increases the risk of Leaf Blight. If observed, apply organic neem-oil extract. You can upload a leaf photo to the Agriculture Analytics module for diagnostic assistance.';
      } else if (msg.includes('water') || msg.includes('irrigat')) {
        reply = 'Semi-arid zones are experiencing low groundwater levels (35%). Drip irrigation can reduce water usage by up to 20%. Schedule watering during early mornings/evenings to reduce evaporation.';
      } else {
        reply = "I can help you with crop selection, fertilizer recommendations, weather forecasts, water saving methods, healthcare facilities, and government schemes. Try asking: 'Which crop is suitable for this rainfall?' or 'Tell me about government farming schemes.'";
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        message: reply,
        timestamp: new Date().toLocaleTimeString(),
        source: 'fallback'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-400 animate-bounce" />
          RuralAI Assistant
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Ask questions regarding farming procedures, agricultural parameters, diseases, and local government budgets.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Chat log body */}
        <div className="lg:col-span-3 glass-panel rounded-xl border border-slate-800 flex flex-col h-[480px] overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse border border-slate-950"></span>
              <span className="text-xs font-bold text-slate-200">RuralAI Core Agent v2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-mono font-bold">{activeEngine}</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Icon wrapper */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${m.sender === 'user' ? 'bg-slate-900 border-slate-850 text-slate-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                  {m.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
                </div>

                {/* Message body */}
                <div className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-950/20' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                  <p>{m.message}</p>
                  <div className="flex items-center justify-between mt-1.5 gap-2">
                    <span className="text-[9px] text-slate-500 font-mono">{m.timestamp}</span>
                    {m.sender === 'bot' && (m as ChatMessage).source && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        (m as ChatMessage).source === 'groq' ? 'bg-amber-500/10 text-amber-400' :
                        (m as ChatMessage).source === 'gemini' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {(m as ChatMessage).source === 'groq' ? '⚡ Groq' :
                         (m as ChatMessage).source === 'gemini' ? '✦ Gemini' : '◈ Offline'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4.5 h-4.5 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="p-4 border-t border-slate-800 bg-slate-900/40 flex gap-3"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops, rain, water usage, or healthcare..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Quick seeds and instructions panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Suggested Queries
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {preSeeds.map((seed, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(seed)}
                  disabled={loading}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 rounded-lg text-left text-xs text-slate-300 transition-colors flex items-start gap-2 hover:bg-slate-900/60 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{seed}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-850 flex gap-3 text-xs text-slate-400 bg-slate-900/20">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="leading-relaxed">
              <strong>Query Tip:</strong> The AI chatbot is connected to regional analytics tables. You can ask for recommendations for specific villages.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

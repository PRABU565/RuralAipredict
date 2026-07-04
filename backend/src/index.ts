import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import {
  initDB,
  getVillages,
  getVillageById,
  updateVillage,
  addPrediction,
  addChatLog,
  getChatHistory,
  getBudgets
} from './db';

dotenv.config();

// ── Shared System Prompt ───────────────────────────────────────────────────────
const RURAL_AI_SYSTEM_PROMPT = `You are RuralAI Assistant — an expert AI advisor for rural development planning in India.
You help farmers, village administrators, and government officials with:
- Crop selection, yield prediction, and fertilizer recommendations
- Weather forecasting and irrigation scheduling
- Water resource management and conservation
- Healthcare guidance and PHC (Primary Health Center) access
- Government agricultural schemes (PM-KISAN, Fasal Bima Yojana, PM Krishi Sinchayee Yojana, MGNREGS)
- Disaster preparedness (flood, drought, cyclone)
- Infrastructure planning (roads, electricity, internet)
- Education and literacy programs for rural communities
- Digital Twin village analytics and IoT sensor data interpretation

Villages in this system: Ramapuram (Rice, 852mm rainfall, Southern Region), Pipili (Cotton, 620mm, Eastern Region),
Kanthalloor (Tea & Spices, 1250mm, Highlands Region), Morachi Chincholi (Bajra & Jowar, 410mm, Semi-Arid Western),
Hiware Bazar (Maize & Vegetables, 580mm, Central Model Village).

Always respond in clear, helpful English that farmers can understand.
Keep answers concise (3-5 sentences) unless detail is explicitly requested.
Recommend the Agriculture Analytics, Digital Twin, or Disaster Prediction modules when relevant.`;

// ── Groq Client (Primary — fastest inference) ─────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const groqClient = new Groq({ apiKey: GROQ_API_KEY });

async function askGroq(message: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('Groq API Key not configured');
  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: RURAL_AI_SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    max_tokens: 512,
    temperature: 0.7,
  });
  const reply = completion.choices[0]?.message?.content?.trim();
  if (!reply) throw new Error('Empty Groq response');
  return reply;
}

// ── Google Gemini Client (Secondary fallback) ─────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'dummy_key');
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: RURAL_AI_SYSTEM_PROMPT,
});

async function askGemini(message: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Gemini API Key not configured');
  const result = await geminiModel.generateContent(message);
  const reply = result.response.text().trim();
  if (!reply) throw new Error('Empty Gemini response');
  return reply;
}

// ── Keyword Fallback (Offline last resort) ─────────────────────────────────────
function keywordFallback(msg: string): string {
  if (msg.includes('crop') && (msg.includes('rainfall') || msg.includes('suit')))
    return 'For high rainfall (>800mm), Rice and Sugarcane are highly suitable. For drier areas (<600mm), opt for Bajra, Jowar, or Cotton. Use the Agriculture Lab to run exact yield predictions.';
  if (msg.includes('crop') && msg.includes('best'))
    return 'The best crop depends on the region. Rice for Ramapuram, Bajra/Jowar for Morachi Chincholi, Tea & Spices for Kanthalloor highlands.';
  if (msg.includes('rainfall') || msg.includes('weather'))
    return 'Our sensors predict light to moderate rainfall in the southern sector. Delay chemical spraying for 24-48 hours to conserve water and prevent runoff.';
  if (msg.includes('fertilizer') || msg.includes('recommendation'))
    return 'For Rice, use NPK 4:2:1 with zinc sulfate. For Cotton, apply nitrogen-rich fertilizers in stages. Check the soil analysis in the Digital Twin kiosk.';
  if (msg.includes('yield') && (msg.includes('improve') || msg.includes('increase')))
    return 'Improve yield by 15-20% with drip irrigation, organic mulching, AI weather-aligned sowing, and early disease detection via leaf scans.';
  if (msg.includes('scheme') || msg.includes('government'))
    return 'Active schemes: PM-KISAN (₹6,000/year), PM Fasal Bima Yojana (crop insurance), PM Krishi Sinchayee Yojana (irrigation subsidies), MGNREGS (employment guarantee).';
  if (msg.includes('disease') || msg.includes('blight') || msg.includes('leaf'))
    return 'High humidity + 28–32°C = Leaf Blight risk. Apply neem-based fungicide and upload a leaf scan in the Agriculture Analytics module for instant AI diagnosis.';
  if (msg.includes('water') || msg.includes('irrigat'))
    return 'Semi-arid groundwater is at 35%. Shift to drip irrigation and schedule watering during mornings/evenings to reduce evaporation by up to 40%.';
  return 'I can help with crops, weather, water, healthcare, government schemes, and disaster preparedness. Try: "Which crop suits high rainfall?" or "Tell me about PM-KISAN."';
}

// ── 3-Tier AI Chain ────────────────────────────────────────────────────────────
async function getAIReply(message: string): Promise<{ reply: string; source: string }> {
  // Tier 1: Groq (fastest)
  try {
    const reply = await askGroq(message);
    console.log('[AI] Groq responded successfully.');
    return { reply, source: 'groq' };
  } catch (e: any) {
    console.warn('[AI] Groq failed:', e.message);
  }

  // Tier 2: Gemini (backup)
  try {
    const reply = await askGemini(message);
    console.log('[AI] Gemini responded successfully.');
    return { reply, source: 'gemini' };
  } catch (e: any) {
    console.warn('[AI] Gemini failed:', e.message);
  }

  // Tier 3: Keyword rules (offline)
  console.warn('[AI] Both AI providers failed — using keyword fallback.');
  return { reply: keywordFallback(message.toLowerCase()), source: 'fallback' };
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database before starting server
initDB().then(() => {
  console.log("Database initialized successfully.");
}).catch(err => {
  console.error("Failed to initialize database:", err);
});

// GET: All villages
app.get('/api/villages', async (req, res) => {
  try {
    const villages = await getVillages();
    res.json(villages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Single village
app.get('/api/villages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const village = await getVillageById(id);
    if (!village) {
      return res.status(404).json({ error: "Village not found" });
    }
    res.json(village);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update village stats
app.put('/api/villages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await updateVillage(id, req.body);
    if (!success) {
      return res.status(404).json({ error: "Village not found or no changes made" });
    }
    const updated = await getVillageById(id);
    res.json({ message: "Village updated successfully", village: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Crop Prediction Lab
app.post('/api/predict/crop', async (req, res) => {
  try {
    const { crop, rainfall, temperature, humidity, soilMoisture } = req.body;

    if (!crop || rainfall === undefined || temperature === undefined || humidity === undefined || soilMoisture === undefined) {
      return res.status(400).json({ error: "Missing required agricultural parameters" });
    }

    // Predictive rules representing AI calculations
    let yieldEstimate = 0.0;
    let diseaseRisk = "Low";
    let waterRequirement = 20; // Litres per sq meter
    let profitEstimation = 50000; // in INR (₹)
    let harvestDays = 15;
    let confidence = 96;

    // Crop-specific calculations
    const rain = parseFloat(rainfall);
    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const moisture = parseFloat(soilMoisture);

    if (crop.toLowerCase() === 'rice') {
      yieldEstimate = 3.8 + (rain * 0.0015) + (moisture * 0.02) - Math.pow(temp - 28, 2) * 0.025;
      yieldEstimate = Math.max(3.2, Math.min(6.2, yieldEstimate));
      waterRequirement = Math.max(15, Math.round(35 - (moisture * 0.15) - (rain * 0.01)));
      profitEstimation = Math.round(yieldEstimate * 17000 - 15000);
      harvestDays = Math.round(20 - (temp * 0.1) - (moisture * 0.05));
    } else if (crop.toLowerCase() === 'cotton') {
      yieldEstimate = 2.2 + (rain * 0.001) + (moisture * 0.015) - Math.pow(temp - 32, 2) * 0.015;
      yieldEstimate = Math.max(1.8, Math.min(4.2, yieldEstimate));
      waterRequirement = Math.max(10, Math.round(22 - (moisture * 0.1) - (rain * 0.005)));
      profitEstimation = Math.round(yieldEstimate * 24000 - 18000);
      harvestDays = Math.round(25 - (temp * 0.12));
    } else if (crop.toLowerCase() === 'tea & spices' || crop.toLowerCase() === 'tea') {
      yieldEstimate = 1.8 + (rain * 0.002) + (moisture * 0.01) - Math.pow(temp - 20, 2) * 0.03;
      yieldEstimate = Math.max(1.2, Math.min(3.5, yieldEstimate));
      waterRequirement = Math.max(25, Math.round(45 - (moisture * 0.2) - (rain * 0.02)));
      profitEstimation = Math.round(yieldEstimate * 45000 - 25000);
      harvestDays = Math.round(18 - (temp * 0.08));
    } else { // general crop
      yieldEstimate = 2.5 + (rain * 0.001) + (moisture * 0.01) - Math.pow(temp - 27, 2) * 0.02;
      yieldEstimate = Math.max(1.5, Math.min(5.0, yieldEstimate));
      waterRequirement = Math.max(12, Math.round(25 - (moisture * 0.1)));
      profitEstimation = Math.round(yieldEstimate * 15000 - 10000);
      harvestDays = Math.round(15 - (temp * 0.05));
    }

    // Disease risk heuristics
    if (hum > 80 && temp > 30) {
      diseaseRisk = "High";
      confidence = 92;
    } else if (hum > 70 || temp > 28) {
      diseaseRisk = "Medium";
      confidence = 95;
    } else {
      diseaseRisk = "Low";
      confidence = 97;
    }

    const predictionOutputs = {
      yield: parseFloat(yieldEstimate.toFixed(2)),
      diseaseRisk,
      waterRequirement,
      profitEstimation,
      harvestDays: Math.max(5, harvestDays),
      confidence
    };

    // Log to DB
    await addPrediction({
      type: 'crop',
      inputs: JSON.stringify(req.body),
      outputs: JSON.stringify(predictionOutputs),
      timestamp: new Date().toISOString()
    });

    res.json(predictionOutputs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Healthcare risk evaluator
app.post('/api/predict/health', async (req, res) => {
  try {
    const { age, bp, sugar, heartRate } = req.body;

    if (age === undefined || bp === undefined || sugar === undefined || heartRate === undefined) {
      return res.status(400).json({ error: "Missing required patient parameters" });
    }

    const patientAge = parseInt(age);
    const patientBp = parseInt(bp);
    const patientSugar = parseInt(sugar);
    const patientHeartRate = parseInt(heartRate);

    let risk = "Low";
    let recommendation = "Maintain current healthy diet and routine exercise.";
    let nearestPHC = 2; // km

    // Heuristics
    const bpHigh = patientBp > 140 || patientBp < 90;
    const sugarHigh = patientSugar > 160;
    const hrAbnormal = patientHeartRate > 100 || patientHeartRate < 60;

    if ((bpHigh && sugarHigh) || (sugarHigh && hrAbnormal) || (bpHigh && hrAbnormal)) {
      risk = "High";
      recommendation = "Emergency: Please visit the nearest Primary Health Center (PHC) immediately. Contact telemedicine helpdesk.";
      nearestPHC = 1.5;
    } else if (bpHigh || sugarHigh || hrAbnormal || patientAge > 65) {
      risk = "Medium";
      recommendation = "Schedule a visit to the PHC for a diagnostic checkup within 48 hours. Limit sodium and sugar intake.";
      nearestPHC = 3.0;
    }

    const healthOutput = {
      risk,
      nearestPHC,
      recommendation
    };

    // Log to DB
    await addPrediction({
      type: 'health',
      inputs: JSON.stringify(req.body),
      outputs: JSON.stringify(healthOutput),
      timestamp: new Date().toISOString()
    });

    res.json(healthOutput);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Budgets list
app.get('/api/budgets', async (req, res) => {
  try {
    const budgets = await getBudgets();
    res.json(budgets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Chat History
app.get('/api/chat/history', async (req, res) => {
  try {
    const history = await getChatHistory();
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST: AI Chatbot — Groq → Gemini → Keyword fallback
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Empty message' });
    }

    const { reply, source } = await getAIReply(message);

    // Save to SQLite
    const saved = await addChatLog({
      sender: 'user',
      message,
      reply,
      timestamp: new Date().toISOString(),
    });

    res.json({ reply, source, saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// GET: Summary Report JSON endpoint
app.get('/api/reports/village/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const village = await getVillageById(id);
    if (!village) {
      return res.status(404).json({ error: "Village not found" });
    }

    // Build automated analytical remarks
    let agricultureStatus = "Stable production. Sowing timelines are well-synchronized.";
    if (village.water_level < 40) {
      agricultureStatus = "Critically low water reserves. Suggest immediate transition to drought-resistant crops (Jowar/Bajra) and drip irrigation.";
    } else if (village.disease_risk === "High") {
      agricultureStatus = "High outbreak risk detected. Active monitoring for Leaf Blight recommended.";
    }

    let infrastructureStatus = "Basic infrastructure is functional.";
    if (village.road_quality === "Poor") {
      infrastructureStatus = "Poor road conditions are restricting access to local markets. Road repaving is high priority.";
    }
    if (village.hospitals === 0) {
      infrastructureStatus += " Lack of active Healthcare facility. Primary Health Center (PHC) construction is critical.";
    }

    let educationStatus = "School attendance is steady.";
    if (village.dropout_prediction > 8) {
      educationStatus = "High dropout risk estimated. Recommend implementing vocational training programs and scholarship schemes.";
    }

    const report = {
      reportDate: new Date().toLocaleDateString(),
      villageName: village.name,
      region: village.region,
      demographics: {
        population: village.population,
        farmers: village.farmers
      },
      liveMetrics: {
        rainfall: village.rainfall + " mm",
        waterLevel: village.water_level + "%",
        soilMoisture: village.soil_moisture + "%",
        temperature: village.temperature + " °C",
        healthIndex: village.health_index + "%"
      },
      education: {
        literacy: village.literacy_rate + "%",
        schoolAttendance: village.school_attendance + "%",
        predictedDropout: village.dropout_prediction + "%",
        remarks: educationStatus
      },
      infrastructure: {
        roadQuality: village.road_quality,
        electricity: village.electricity_access + "%",
        internet: village.internet_coverage + "%",
        schoolsCount: village.schools,
        hospitalsCount: village.hospitals,
        remarks: infrastructureStatus
      },
      aiInsights: {
        cropRecommendation: `AI recommends continuing ${village.crop} cultivation with soil-moisture thresholds maintained around ${village.soil_moisture}%.`,
        remarks: agricultureStatus,
        priorityActions: village.priority_projects.split(', ')
      }
    };

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`RuralAI Predict Server running on port ${PORT}`);
});

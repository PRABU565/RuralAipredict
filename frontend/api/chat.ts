import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const RURAL_AI_SYSTEM_PROMPT = `You are the RuralAI Core Agent, an expert assistant for rural development planning and agriculture in India.
Your goal is to answer queries accurately, professionally, and concisely (2-4 sentences max). 
You have knowledge of farming practices, soil health, crop yields, rural healthcare, weather effects, and government subsidies (e.g. PM-KISAN, PMFBY).
Always respond in clear, helpful English. If the user asks short queries like "wheat is crop" or "tea", provide a brief helpful fact or context about that crop.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    // Note: To use this in production on Vercel, GEMINI_API_KEY must be set in the Vercel project's Environment Variables!
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: RURAL_AI_SYSTEM_PROMPT
    });
    
    const result = await model.generateContent(message);
    const reply = result.response.text();
    
    return res.status(200).json({ reply, source: 'gemini' });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}

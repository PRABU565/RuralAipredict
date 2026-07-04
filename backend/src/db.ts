import fs from 'fs';
import path from 'path';

// Define Interface for Village data
export interface Village {
  id: number;
  name: string;
  region: string;
  population: number;
  farmers: number;
  crop: string;
  rainfall: number; // in mm
  water_level: number; // in %
  soil_moisture: number; // in %
  temperature: number; // in °C
  humidity: number; // in %
  health_index: number; // in %
  literacy_rate: number; // in %
  school_attendance: number; // in %
  dropout_prediction: number; // in %
  road_quality: string; // Good, Fair, Poor
  electricity_access: number; // in %
  internet_coverage: number; // in %
  hospitals: number;
  schools: number;
  disease_risk: string; // Low, Medium, High
  priority_projects: string; // comma-separated list of recommendations
}

export interface PredictionLog {
  id?: number;
  type: string; // 'crop', 'health', 'disaster'
  inputs: string; // JSON string
  outputs: string; // JSON string
  timestamp: string;
}

export interface ChatLog {
  id?: number;
  sender: string;
  message: string;
  reply: string;
  timestamp: string;
}

export interface BudgetAllocation {
  id?: number;
  category: string;
  allocated: number;
  spent: number;
}

// Fallback JSON database implementation in case SQLite3 fails to install/compile on Windows
class JSONDatabase {
  private filePath: string;
  private data: {
    villages: Village[];
    predictions: PredictionLog[];
    chat_logs: ChatLog[];
    budgets: BudgetAllocation[];
  };

  constructor() {
    this.filePath = path.join(__dirname, '..', 'rural_ai_db.json');
    this.data = { villages: [], predictions: [], chat_logs: [], budgets: [] };
    this.load();
  }

  private load() {
    if (fs.existsSync(this.filePath)) {
      try {
        this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
      } catch (err) {
        console.error("Error reading JSON database, resetting:", err);
        this.seed();
      }
    } else {
      this.seed();
    }
  }

  private save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  private seed() {
    this.data.villages = [
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

    this.data.budgets = [
      { category: "Agriculture Support", allocated: 4500000, spent: 3800000 },
      { category: "Water Management", allocated: 3200000, spent: 2900000 },
      { category: "Healthcare & PHCs", allocated: 2500000, spent: 1800000 },
      { category: "Rural Roads & Power", allocated: 5000000, spent: 4200000 },
      { category: "Education & Literacy", allocated: 1800000, spent: 1550000 },
      { category: "Disaster Preparedness", allocated: 1200000, spent: 400000 }
    ];

    this.save();
  }

  getVillages(): Village[] {
    this.load();
    return this.data.villages;
  }

  getVillageById(id: number): Village | undefined {
    this.load();
    return this.data.villages.find(v => v.id === id);
  }

  updateVillage(id: number, updatedData: Partial<Village>): boolean {
    this.load();
    const idx = this.data.villages.findIndex(v => v.id === id);
    if (idx !== -1) {
      this.data.villages[idx] = { ...this.data.villages[idx], ...updatedData };
      this.save();
      return true;
    }
    return false;
  }

  addPrediction(pred: Omit<PredictionLog, 'id'>) {
    this.load();
    const newPred = { ...pred, id: this.data.predictions.length + 1 };
    this.data.predictions.push(newPred);
    this.save();
    return newPred;
  }

  addChatLog(chat: Omit<ChatLog, 'id'>) {
    this.load();
    const newChat = { ...chat, id: this.data.chat_logs.length + 1 };
    this.data.chat_logs.push(newChat);
    this.save();
    return newChat;
  }

  getChatHistory(): ChatLog[] {
    this.load();
    return this.data.chat_logs.slice(-20); // last 20
  }

  getBudgets(): BudgetAllocation[] {
    this.load();
    return this.data.budgets;
  }
}

// Database instance
let dbInstance: any;

// Try to use SQLite, fallback to JSONDatabase
let isUsingSQLite = false;
let sqliteDb: any = null;

export async function initDB() {
  try {
    // Dynamically try to import sqlite and sqlite3 to protect against compilation failures
    const sqlite = require('sqlite');
    const sqlite3 = require('sqlite3').verbose();

    const dbPath = path.join(__dirname, '..', 'rural_ai.db');
    const dbExists = fs.existsSync(dbPath);

    sqliteDb = await sqlite.open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log("Connected to SQLite Database.");
    isUsingSQLite = true;

    // Create Tables
    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS villages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        region TEXT,
        population INTEGER,
        farmers INTEGER,
        crop TEXT,
        rainfall INTEGER,
        water_level INTEGER,
        soil_moisture INTEGER,
        temperature INTEGER,
        humidity INTEGER,
        health_index INTEGER,
        literacy_rate INTEGER,
        school_attendance INTEGER,
        dropout_prediction INTEGER,
        road_quality TEXT,
        electricity_access INTEGER,
        internet_coverage INTEGER,
        hospitals INTEGER,
        schools INTEGER,
        disease_risk TEXT,
        priority_projects TEXT
      )
    `);

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        inputs TEXT,
        outputs TEXT,
        timestamp TEXT
      )
    `);

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS chat_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT,
        message TEXT,
        reply TEXT,
        timestamp TEXT
      )
    `);

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT UNIQUE,
        allocated INTEGER,
        spent INTEGER
      )
    `);

    // Seed data if empty
    const villageCount = await sqliteDb.get("SELECT COUNT(*) as count FROM villages");
    if (villageCount.count === 0) {
      console.log("Seeding SQLite database with default data...");
      const jsonDb = new JSONDatabase(); // Obtain seed array
      const seedVillages = jsonDb.getVillages();

      for (const v of seedVillages) {
        await sqliteDb.run(`
          INSERT INTO villages (
            name, region, population, farmers, crop, rainfall, water_level, 
            soil_moisture, temperature, humidity, health_index, literacy_rate, 
            school_attendance, dropout_prediction, road_quality, electricity_access, 
            internet_coverage, hospitals, schools, disease_risk, priority_projects
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          v.name, v.region, v.population, v.farmers, v.crop, v.rainfall, v.water_level,
          v.soil_moisture, v.temperature, v.humidity, v.health_index, v.literacy_rate,
          v.school_attendance, v.dropout_prediction, v.road_quality, v.electricity_access,
          v.internet_coverage, v.hospitals, v.schools, v.disease_risk, v.priority_projects
        ]);
      }

      const seedBudgets = jsonDb.getBudgets();
      for (const b of seedBudgets) {
        await sqliteDb.run(`
          INSERT INTO budgets (category, allocated, spent) VALUES (?, ?, ?)
        `, [b.category, b.allocated, b.spent]);
      }
    }
  } catch (err) {
    console.warn("SQLite3 initialization failed, falling back to JSON File Database. Error details:", err);
    dbInstance = new JSONDatabase();
    isUsingSQLite = false;
  }
}

// Data Access API
export async function getVillages(): Promise<Village[]> {
  if (isUsingSQLite && sqliteDb) {
    return sqliteDb.all("SELECT * FROM villages");
  }
  return dbInstance.getVillages();
}

export async function getVillageById(id: number): Promise<Village | undefined> {
  if (isUsingSQLite && sqliteDb) {
    return sqliteDb.get("SELECT * FROM villages WHERE id = ?", [id]);
  }
  return dbInstance.getVillageById(id);
}

export async function updateVillage(id: number, updatedData: Partial<Village>): Promise<boolean> {
  if (isUsingSQLite && sqliteDb) {
    const keys = Object.keys(updatedData);
    if (keys.length === 0) return true;
    
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = Object.values(updatedData);
    values.push(id);

    const result = await sqliteDb.run(`UPDATE villages SET ${setClause} WHERE id = ?`, values);
    return (result.changes && result.changes > 0) || false;
  }
  return dbInstance.updateVillage(id, updatedData);
}

export async function addPrediction(pred: Omit<PredictionLog, 'id'>): Promise<PredictionLog> {
  if (isUsingSQLite && sqliteDb) {
    const result = await sqliteDb.run(`
      INSERT INTO predictions (type, inputs, outputs, timestamp) VALUES (?, ?, ?, ?)
    `, [pred.type, pred.inputs, pred.outputs, pred.timestamp]);
    return { ...pred, id: result.lastID };
  }
  return dbInstance.addPrediction(pred);
}

export async function addChatLog(chat: Omit<ChatLog, 'id'>): Promise<ChatLog> {
  if (isUsingSQLite && sqliteDb) {
    const result = await sqliteDb.run(`
      INSERT INTO chat_logs (sender, message, reply, timestamp) VALUES (?, ?, ?, ?)
    `, [chat.sender, chat.message, chat.reply, chat.timestamp]);
    return { ...chat, id: result.lastID };
  }
  return dbInstance.addChatLog(chat);
}

export async function getChatHistory(): Promise<ChatLog[]> {
  if (isUsingSQLite && sqliteDb) {
    return sqliteDb.all("SELECT * FROM chat_logs ORDER BY id DESC LIMIT 20");
  }
  return dbInstance.getChatHistory();
}

export async function getBudgets(): Promise<BudgetAllocation[]> {
  if (isUsingSQLite && sqliteDb) {
    return sqliteDb.all("SELECT * FROM budgets");
  }
  return dbInstance.getBudgets();
}

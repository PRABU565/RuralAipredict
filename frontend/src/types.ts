export interface Village {
  id: number;
  name: string;
  region: string;
  population: number;
  farmers: number;
  crop: string;
  rainfall: number;
  water_level: number;
  soil_moisture: number;
  temperature: number;
  humidity: number;
  health_index: number;
  literacy_rate: number;
  school_attendance: number;
  dropout_prediction: number;
  road_quality: string;
  electricity_access: number;
  internet_coverage: number;
  hospitals: number;
  schools: number;
  disease_risk: string;
  priority_projects: string;
}

export interface BudgetAllocation {
  id?: number;
  category: string;
  allocated: number;
  spent: number;
}

export interface ChatLog {
  id?: number;
  sender: 'user' | 'bot';
  message: string;
  reply?: string;
  timestamp: string;
}

export interface CropPredictionInput {
  villageId?: string;
  crop: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
}

export interface CropPredictionOutput {
  yield: number;
  diseaseRisk: string;
  waterRequirement: number;
  profitEstimation: number;
  harvestDays: number;
  confidence: number;
}

export interface HealthPredictionInput {
  age: number;
  bp: number;
  sugar: number;
  heartRate: number;
}

export interface HealthPredictionOutput {
  risk: string;
  nearestPHC: number;
  recommendation: string;
}

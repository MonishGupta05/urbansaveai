// Mock API service for simulated backend responses
// Structured for easy migration to real API endpoints

import type { AdminData, UserPreferences, FeedbackData } from "./storage";
import { calculations } from "./calculations";
import { backend } from "./backend";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock state data for India heatmap
export interface StateData {
  code: string;
  name: string;
  consumption: number;
  savings: number;
  intensity: "low" | "medium" | "high" | "very-high";
}

// Mock aggregated insights
export interface AggregatedInsight {
  adminType: "campus" | "society" | "building";
  averageSavings: number;
  averageConsumption: number;
  topWastageCause: string;
  userCount: number;
}

export const mockApi = {
  // Submit admin setup data
  submitAdminData: async (data: AdminData): Promise<{ success: boolean; id: string }> => {
    await delay(800);
    // Also save to backend service
    await backend.saveAdminData(data);
    return {
      success: true,
      id: `admin_${Date.now()}`,
    };
  },

  // Get dashboard data
  getDashboardData: async (adminData: AdminData, preferences: UserPreferences) => {
    await delay(500);
    return calculations.predictConsumption(adminData, preferences);
  },

  // Get recommendations with feedback-based adaptation
  getRecommendations: async (
    adminData: AdminData,
    preferences: UserPreferences,
    feedbackData?: { appliedIds: string[]; skippedIds: string[] }
  ) => {
    await delay(600);
    return calculations.generateRecommendations(adminData, preferences, feedbackData);
  },

  // Submit feedback
  submitFeedback: async (feedback: FeedbackData): Promise<{ success: boolean }> => {
    await delay(400);
    // Also save to backend service
    await backend.saveFeedback(feedback);
    return { success: true };
  },

  // Get state-level data for India heatmap
  getStateData: async (): Promise<StateData[]> => {
    await delay(700);
    return [
      { code: "MH", name: "Maharashtra", consumption: 28500, savings: 4275, intensity: "very-high" },
      { code: "DL", name: "Delhi", consumption: 18200, savings: 2730, intensity: "very-high" },
      { code: "KA", name: "Karnataka", consumption: 21300, savings: 3195, intensity: "high" },
      { code: "TN", name: "Tamil Nadu", consumption: 19800, savings: 2970, intensity: "high" },
      { code: "GJ", name: "Gujarat", consumption: 17500, savings: 2625, intensity: "high" },
      { code: "UP", name: "Uttar Pradesh", consumption: 15200, savings: 2280, intensity: "medium" },
      { code: "RJ", name: "Rajasthan", consumption: 14100, savings: 2115, intensity: "medium" },
      { code: "WB", name: "West Bengal", consumption: 13500, savings: 2025, intensity: "medium" },
      { code: "AP", name: "Andhra Pradesh", consumption: 12800, savings: 1920, intensity: "medium" },
      { code: "TS", name: "Telangana", consumption: 16400, savings: 2460, intensity: "high" },
      { code: "MP", name: "Madhya Pradesh", consumption: 11200, savings: 1680, intensity: "medium" },
      { code: "KL", name: "Kerala", consumption: 9800, savings: 1470, intensity: "low" },
      { code: "PB", name: "Punjab", consumption: 10500, savings: 1575, intensity: "medium" },
      { code: "HR", name: "Haryana", consumption: 11800, savings: 1770, intensity: "medium" },
      { code: "BR", name: "Bihar", consumption: 8500, savings: 1275, intensity: "low" },
      { code: "OR", name: "Odisha", consumption: 9200, savings: 1380, intensity: "low" },
      { code: "JH", name: "Jharkhand", consumption: 8800, savings: 1320, intensity: "low" },
      { code: "CT", name: "Chhattisgarh", consumption: 7500, savings: 1125, intensity: "low" },
      { code: "AS", name: "Assam", consumption: 6200, savings: 930, intensity: "low" },
      { code: "UK", name: "Uttarakhand", consumption: 5800, savings: 870, intensity: "low" },
      { code: "HP", name: "Himachal Pradesh", consumption: 4500, savings: 675, intensity: "low" },
      { code: "JK", name: "Jammu & Kashmir", consumption: 5200, savings: 780, intensity: "low" },
      { code: "GA", name: "Goa", consumption: 3200, savings: 480, intensity: "low" },
      { code: "TR", name: "Tripura", consumption: 2100, savings: 315, intensity: "low" },
      { code: "MN", name: "Manipur", consumption: 1800, savings: 270, intensity: "low" },
      { code: "ML", name: "Meghalaya", consumption: 1900, savings: 285, intensity: "low" },
      { code: "NL", name: "Nagaland", consumption: 1500, savings: 225, intensity: "low" },
      { code: "AR", name: "Arunachal Pradesh", consumption: 1200, savings: 180, intensity: "low" },
      { code: "MZ", name: "Mizoram", consumption: 1100, savings: 165, intensity: "low" },
      { code: "SK", name: "Sikkim", consumption: 800, savings: 120, intensity: "low" },
    ];
  },

  // Get aggregated insights
  getAggregatedInsights: async (): Promise<AggregatedInsight[]> => {
    await delay(600);
    return [
      {
        adminType: "campus",
        averageSavings: 45200,
        averageConsumption: 185000,
        topWastageCause: "Air Conditioning",
        userCount: 312,
      },
      {
        adminType: "society",
        averageSavings: 18500,
        averageConsumption: 72000,
        topWastageCause: "Common Area Lighting",
        userCount: 567,
      },
      {
        adminType: "building",
        averageSavings: 12800,
        averageConsumption: 45000,
        topWastageCause: "Elevator Operations",
        userCount: 368,
      },
    ];
  },

  // Get wastage causes breakdown
  getWastageCauses: async (): Promise<{ cause: string; percentage: number }[]> => {
    await delay(500);
    return [
      { cause: "HVAC Inefficiency", percentage: 32 },
      { cause: "Lighting Waste", percentage: 24 },
      { cause: "Standby Power", percentage: 18 },
      { cause: "Peak Hour Usage", percentage: 14 },
      { cause: "Equipment Age", percentage: 12 },
    ];
  },

  // Get community live counter (simulates real-time updates)
  getCommunityCounter: async (): Promise<{ saved: number; kwhReduced: number }> => {
    await delay(200);
    const stats = calculations.getCommunityStats();
    // Add small random increment to simulate live updates
    return {
      saved: stats.totalSaved + Math.floor(Math.random() * 100),
      kwhReduced: stats.totalKwhReduced + Math.floor(Math.random() * 15),
    };
  },
};

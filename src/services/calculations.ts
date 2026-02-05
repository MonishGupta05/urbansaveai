// Calculation service for energy predictions and savings estimates
import type { AdminData, UserPreferences } from "./storage";

// Cost per kWh in INR (average Indian rate)
const COST_PER_KWH = 7.5;

// Appliance consumption patterns (kWh per month per unit)
const APPLIANCE_CONSUMPTION: Record<string, number> = {
  ac: 180,
  lighting: 30,
  elevators: 500,
  pumps: 150,
  computers: 45,
  refrigeration: 80,
  heating: 120,
  ventilation: 60,
};

// Mode multipliers for savings calculations
const MODE_MULTIPLIERS = {
  eco: { savings: 0.25, comfort: 0.7, sustainability: 1.0 },
  balanced: { savings: 0.15, comfort: 0.9, sustainability: 0.7 },
  budget: { savings: 0.3, comfort: 0.6, sustainability: 0.5 },
};

// Type-based base consumption (kWh per room/block)
const TYPE_BASE_CONSUMPTION = {
  campus: 450,
  society: 280,
  building: 200,
};

export interface PredictionResult {
  predictedBill: number;
  predictedConsumption: number;
  wastageZones: WastageZone[];
  savingsEstimate: number;
  savingsPercentage: number;
  co2Reduction: number;
}

export interface WastageZone {
  name: string;
  percentage: number;
  kWh: number;
  potentialSavings: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedSavings: number;
  estimatedKwhSaved: number;
  category: "behavioral" | "equipment" | "scheduling";
}

export const calculations = {
  // Calculate predicted consumption based on admin data
  predictConsumption: (
    adminData: AdminData,
    preferences: UserPreferences
  ): PredictionResult => {
    const baseConsumption = adminData.monthlyConsumption;
    const modeMultiplier = MODE_MULTIPLIERS[preferences.mode];

    // Calculate wastage zones
    const wastageZones = calculations.calculateWastageZones(
      adminData,
      baseConsumption
    );

    // Calculate potential savings based on mode and settings
    const autoOffSavings = (preferences.autoOffMinutes / 60) * 0.02 * baseConsumption;
    const acSavings =
      (preferences.acReductionPercent / 100) *
      (adminData.appliances.includes("ac") ? baseConsumption * 0.4 : 0);

    const totalSavings =
      baseConsumption * modeMultiplier.savings + autoOffSavings + acSavings;
    const predictedConsumption = baseConsumption - totalSavings;

    return {
      predictedBill: predictedConsumption * COST_PER_KWH,
      predictedConsumption,
      wastageZones,
      savingsEstimate: totalSavings * COST_PER_KWH,
      savingsPercentage: (totalSavings / baseConsumption) * 100,
      co2Reduction: totalSavings * 0.82, // kg CO2 per kWh
    };
  },

  // Calculate wastage zones
  calculateWastageZones: (
    adminData: AdminData,
    totalConsumption: number
  ): WastageZone[] => {
    const zones: WastageZone[] = [];

    // Lighting wastage (typically 15-25% of total)
    if (adminData.appliances.includes("lighting")) {
      const lightingWaste = totalConsumption * 0.18;
      zones.push({
        name: "Lighting",
        percentage: 18,
        kWh: lightingWaste,
        potentialSavings: lightingWaste * 0.4 * COST_PER_KWH,
      });
    }

    // AC wastage (typically 35-45% of total)
    if (adminData.appliances.includes("ac")) {
      const acWaste = totalConsumption * 0.38;
      zones.push({
        name: "Air Conditioning",
        percentage: 38,
        kWh: acWaste,
        potentialSavings: acWaste * 0.25 * COST_PER_KWH,
      });
    }

    // Idle equipment wastage
    const idleWaste = totalConsumption * 0.12;
    zones.push({
      name: "Idle Equipment",
      percentage: 12,
      kWh: idleWaste,
      potentialSavings: idleWaste * 0.8 * COST_PER_KWH,
    });

    // Peak hour wastage
    const peakWaste = totalConsumption * 0.15;
    zones.push({
      name: "Peak Hour Usage",
      percentage: 15,
      kWh: peakWaste,
      potentialSavings: peakWaste * 0.3 * COST_PER_KWH,
    });

    return zones.sort((a, b) => b.percentage - a.percentage);
  },

  // Generate AI recommendations based on data
  generateRecommendations: (
    adminData: AdminData,
    preferences: UserPreferences
  ): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // AC-related recommendations
    if (adminData.appliances.includes("ac")) {
      recommendations.push({
        id: "ac-temp",
        title: "Optimize AC Temperature",
        description:
          "Increase AC temperature by 2°C during peak hours. Each degree increase saves approximately 6% on cooling costs.",
        priority: "high",
        estimatedSavings: adminData.monthlyConsumption * 0.08 * COST_PER_KWH,
        estimatedKwhSaved: adminData.monthlyConsumption * 0.08,
        category: "behavioral",
      });

      recommendations.push({
        id: "ac-schedule",
        title: "Smart AC Scheduling",
        description:
          "Pre-cool spaces 30 minutes before occupancy and turn off 15 minutes before people leave.",
        priority: "medium",
        estimatedSavings: adminData.monthlyConsumption * 0.05 * COST_PER_KWH,
        estimatedKwhSaved: adminData.monthlyConsumption * 0.05,
        category: "scheduling",
      });
    }

    // Lighting recommendations
    if (adminData.appliances.includes("lighting")) {
      recommendations.push({
        id: "light-sensors",
        title: "Install Motion Sensors",
        description:
          "Add occupancy sensors in common areas to automatically turn off lights when not in use.",
        priority: "high",
        estimatedSavings: adminData.monthlyConsumption * 0.06 * COST_PER_KWH,
        estimatedKwhSaved: adminData.monthlyConsumption * 0.06,
        category: "equipment",
      });

      recommendations.push({
        id: "daylight",
        title: "Maximize Natural Light",
        description:
          "Keep blinds open during day hours to reduce artificial lighting needs.",
        priority: "low",
        estimatedSavings: adminData.monthlyConsumption * 0.03 * COST_PER_KWH,
        estimatedKwhSaved: adminData.monthlyConsumption * 0.03,
        category: "behavioral",
      });
    }

    // General recommendations
    recommendations.push({
      id: "auto-off",
      title: `Enable Auto-Off After ${preferences.autoOffMinutes} Minutes`,
      description:
        "Automatically power off idle equipment to eliminate standby power consumption.",
      priority: "medium",
      estimatedSavings: adminData.monthlyConsumption * 0.04 * COST_PER_KWH,
      estimatedKwhSaved: adminData.monthlyConsumption * 0.04,
      category: "scheduling",
    });

    recommendations.push({
      id: "peak-shift",
      title: "Shift High-Power Tasks to Off-Peak",
      description:
        "Schedule elevators, pumps, and heavy equipment during off-peak hours for lower rates.",
      priority: "medium",
      estimatedSavings: adminData.monthlyConsumption * 0.07 * COST_PER_KWH,
      estimatedKwhSaved: adminData.monthlyConsumption * 0.07,
      category: "scheduling",
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  },

  // Calculate what-if scenario
  calculateWhatIf: (
    adminData: AdminData,
    autoOffMinutes: number,
    acReduction: number
  ): { billReduction: number; kwhSaved: number; percentageSaved: number } => {
    const baseConsumption = adminData.monthlyConsumption;

    const autoOffSavings = (autoOffMinutes / 60) * 0.02 * baseConsumption;
    const acSavings =
      (acReduction / 100) *
      (adminData.appliances.includes("ac") ? baseConsumption * 0.4 : 0);

    const totalKwhSaved = autoOffSavings + acSavings;
    const billReduction = totalKwhSaved * COST_PER_KWH;
    const percentageSaved = (totalKwhSaved / baseConsumption) * 100;

    return {
      billReduction,
      kwhSaved: totalKwhSaved,
      percentageSaved,
    };
  },

  // Get community statistics
  getCommunityStats: (): {
    totalSaved: number;
    totalKwhReduced: number;
    usersCount: number;
  } => {
    // Mock community data - in production this would come from backend
    return {
      totalSaved: 2847650,
      totalKwhReduced: 379687,
      usersCount: 1247,
    };
  },
};

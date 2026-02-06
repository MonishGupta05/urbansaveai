// Admin type configurations for context-aware dashboards
// Provides terminology, KPIs, and visual settings per admin type

import {
  GraduationCap,
  Home,
  Building2,
  Users,
  Bed,
  FlaskConical,
  BookOpen,
  ParkingSquare,
  Waves,
  TreePine,
  Briefcase,
  Coffee,
  Server,
  Layers,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";

export interface AdminTypeConfig {
  type: "campus" | "society" | "building";
  label: string;
  icon: LucideIcon;
  
  // Terminology
  unitLabel: string; // "blocks", "wings", "floors"
  unitLabelPlural: string;
  subUnits: { id: string; label: string; icon: LucideIcon }[];
  
  // Dashboard customization
  primaryColor: string;
  accentHue: number;
  description: string;
  
  // KPI labels
  kpis: {
    primaryStat: string;
    secondaryStat: string;
    wasteIndicator: string;
  };
  
  // Wastage zone labels
  wastageZones: {
    id: string;
    label: string;
    defaultPercentage: number;
  }[];
  
  // Recommendation categories
  recommendationFocus: string[];
}

export const adminTypeConfigs: Record<string, AdminTypeConfig> = {
  campus: {
    type: "campus",
    label: "Campus",
    icon: GraduationCap,
    
    unitLabel: "block",
    unitLabelPlural: "blocks",
    subUnits: [
      { id: "hostels", label: "Hostels", icon: Bed },
      { id: "departments", label: "Departments", icon: BookOpen },
      { id: "labs", label: "Labs", icon: FlaskConical },
      { id: "library", label: "Library", icon: BookOpen },
      { id: "admin", label: "Admin Block", icon: Briefcase },
    ],
    
    primaryColor: "hsl(201, 96%, 47%)",
    accentHue: 201,
    description: "Educational institution energy management",
    
    kpis: {
      primaryStat: "Hostel AC Usage",
      secondaryStat: "Lab Equipment Load",
      wasteIndicator: "After-Hours Waste",
    },
    
    wastageZones: [
      { id: "hostel_ac", label: "Hostel Air Conditioning", defaultPercentage: 35 },
      { id: "lab_equipment", label: "Lab Equipment", defaultPercentage: 22 },
      { id: "lecture_halls", label: "Lecture Hall Lighting", defaultPercentage: 18 },
      { id: "common_areas", label: "Common Area Waste", defaultPercentage: 15 },
      { id: "after_hours", label: "After-Hours Usage", defaultPercentage: 10 },
    ],
    
    recommendationFocus: ["hostel scheduling", "lab equipment timers", "lecture hall automation"],
  },
  
  society: {
    type: "society",
    label: "Society",
    icon: Home,
    
    unitLabel: "wing",
    unitLabelPlural: "wings",
    subUnits: [
      { id: "towers", label: "Towers", icon: Layers },
      { id: "common", label: "Common Areas", icon: Users },
      { id: "parking", label: "Parking", icon: ParkingSquare },
      { id: "clubhouse", label: "Clubhouse", icon: Coffee },
      { id: "garden", label: "Gardens", icon: TreePine },
    ],
    
    primaryColor: "hsl(160, 84%, 39%)",
    accentHue: 160,
    description: "Residential complex energy optimization",
    
    kpis: {
      primaryStat: "Common Area Load",
      secondaryStat: "Elevator Usage",
      wasteIndicator: "Night Lighting Waste",
    },
    
    wastageZones: [
      { id: "common_lighting", label: "Common Area Lighting", defaultPercentage: 28 },
      { id: "water_pumps", label: "Water Pump Operations", defaultPercentage: 25 },
      { id: "elevators", label: "Elevator Energy", defaultPercentage: 20 },
      { id: "parking_lights", label: "Parking Lighting", defaultPercentage: 15 },
      { id: "clubhouse", label: "Clubhouse HVAC", defaultPercentage: 12 },
    ],
    
    recommendationFocus: ["motion-sensor lighting", "pump scheduling", "elevator optimization"],
  },
  
  building: {
    type: "building",
    label: "Building",
    icon: Building2,
    
    unitLabel: "floor",
    unitLabelPlural: "floors",
    subUnits: [
      { id: "offices", label: "Offices", icon: Briefcase },
      { id: "conference", label: "Conference Rooms", icon: Users },
      { id: "lobby", label: "Lobby", icon: DoorOpen },
      { id: "server", label: "Server Room", icon: Server },
      { id: "cafeteria", label: "Cafeteria", icon: Coffee },
    ],
    
    primaryColor: "hsl(45, 93%, 47%)",
    accentHue: 45,
    description: "Commercial building energy efficiency",
    
    kpis: {
      primaryStat: "Office HVAC Load",
      secondaryStat: "Server Room Cooling",
      wasteIndicator: "Weekend Waste",
    },
    
    wastageZones: [
      { id: "office_hvac", label: "Office HVAC", defaultPercentage: 38 },
      { id: "server_cooling", label: "Server Room Cooling", defaultPercentage: 22 },
      { id: "elevator_ops", label: "Elevator Operations", defaultPercentage: 18 },
      { id: "lobby_lighting", label: "Lobby & Common Lighting", defaultPercentage: 12 },
      { id: "after_hours", label: "After-Hours Equipment", defaultPercentage: 10 },
    ],
    
    recommendationFocus: ["HVAC zoning", "server room efficiency", "smart elevator scheduling"],
  },
};

export const getAdminConfig = (type: "campus" | "society" | "building"): AdminTypeConfig => {
  return adminTypeConfigs[type] || adminTypeConfigs.building;
};

// Get context-aware labels for dashboard
export const getContextLabels = (type: "campus" | "society" | "building") => {
  const config = getAdminConfig(type);
  return {
    unitLabel: config.unitLabel,
    unitLabelPlural: config.unitLabelPlural,
    unitCount: (count: number) => `${count} ${count === 1 ? config.unitLabel : config.unitLabelPlural}`,
    typeLabel: config.label,
    description: config.description,
  };
};

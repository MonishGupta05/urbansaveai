// Storage service for localStorage operations
// Structured for easy future migration to Supabase

export interface AdminData {
  type: "campus" | "society" | "building";
  monthlyConsumption: number;
  lastBillAmount: number;
  roomsBlocks: number;
  appliances: string[];
  customAppliances: string[];
  occupancyPattern: Record<string, boolean[]>;
  createdAt: string;
  billUploaded?: boolean;
}

export interface UserPreferences {
  mode: "eco" | "balanced" | "budget";
  autoOffMinutes: number;
  acReductionPercent: number;
}

export interface FeedbackData {
  recommendationId: string;
  applied: boolean;
  timestamp: string;
}

const KEYS = {
  ADMIN_DATA: "urbansave_admin_data",
  PREFERENCES: "urbansave_preferences",
  FEEDBACK: "urbansave_feedback",
  ONBOARDING_COMPLETE: "urbansave_onboarding_complete",
};

export const storage = {
  // Admin data operations
  getAdminData: (): AdminData | null => {
    const data = localStorage.getItem(KEYS.ADMIN_DATA);
    return data ? JSON.parse(data) : null;
  },

  setAdminData: (data: AdminData): void => {
    localStorage.setItem(KEYS.ADMIN_DATA, JSON.stringify(data));
  },

  clearAdminData: (): void => {
    localStorage.removeItem(KEYS.ADMIN_DATA);
  },

  // User preferences operations
  getPreferences: (): UserPreferences => {
    const data = localStorage.getItem(KEYS.PREFERENCES);
    return data
      ? JSON.parse(data)
      : { mode: "balanced", autoOffMinutes: 15, acReductionPercent: 10 };
  },

  setPreferences: (prefs: UserPreferences): void => {
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  // Feedback operations
  getFeedback: (): FeedbackData[] => {
    const data = localStorage.getItem(KEYS.FEEDBACK);
    return data ? JSON.parse(data) : [];
  },

  addFeedback: (feedback: FeedbackData): void => {
    const existing = storage.getFeedback();
    existing.push(feedback);
    localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(existing));
  },

  // Get feedback statistics for adaptive learning
  getFeedbackStats: (): { total: number; applied: number; skipped: number; appliedIds: string[]; skippedIds: string[] } => {
    const feedback = storage.getFeedback();
    const applied = feedback.filter((f) => f.applied);
    const skipped = feedback.filter((f) => !f.applied);
    return {
      total: feedback.length,
      applied: applied.length,
      skipped: skipped.length,
      appliedIds: applied.map((f) => f.recommendationId),
      skippedIds: skipped.map((f) => f.recommendationId),
    };
  },

  // Onboarding status
  isOnboardingComplete: (): boolean => {
    return localStorage.getItem(KEYS.ONBOARDING_COMPLETE) === "true";
  },

  setOnboardingComplete: (complete: boolean): void => {
    localStorage.setItem(KEYS.ONBOARDING_COMPLETE, String(complete));
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  },
};

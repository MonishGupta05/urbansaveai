// Backend abstraction layer for UrbanSave AI
// Provides structured data persistence with logging for demo visibility
// Designed for easy migration to Supabase or other backends

import type { AdminData, UserPreferences, FeedbackData } from "./storage";

// Schema version for data migrations
const SCHEMA_VERSION = "1.0.0";

// Database collections
const COLLECTIONS = {
  ADMINS: "urbansave_admins",
  PREFERENCES: "urbansave_preferences",
  FEEDBACK: "urbansave_feedback",
  PREDICTIONS: "urbansave_predictions",
  CUSTOM_APPLIANCES: "urbansave_custom_appliances",
  BILL_UPLOADS: "urbansave_bill_uploads",
  ONBOARDING: "urbansave_onboarding",
  SCHEMA: "urbansave_schema_version",
} as const;

// Operation log for debug panel
export interface OperationLog {
  id: string;
  timestamp: string;
  operation: "CREATE" | "READ" | "UPDATE" | "DELETE";
  collection: string;
  data?: unknown;
}

// In-memory operation log (last 50 operations)
let operationLogs: OperationLog[] = [];

// Utility to log operations
const logOperation = (
  operation: OperationLog["operation"],
  collection: string,
  data?: unknown
) => {
  const log: OperationLog = {
    id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    operation,
    collection,
    data: data ? JSON.parse(JSON.stringify(data)) : undefined,
  };

  operationLogs = [log, ...operationLogs].slice(0, 50);

  // Console log for demo visibility
  const emoji = {
    CREATE: "📝",
    READ: "📖",
    UPDATE: "✏️",
    DELETE: "🗑️",
  }[operation];

  console.log(
    `%c[UrbanSave DB] ${emoji} ${operation} ${collection}`,
    "color: #10b981; font-weight: bold;",
    data ? data : ""
  );

  return log;
};

// Simulated network delay for realism
const networkDelay = () => new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));

// Backend service
export const backend = {
  // Schema management
  getSchemaVersion: (): string => {
    const version = localStorage.getItem(COLLECTIONS.SCHEMA);
    return version || SCHEMA_VERSION;
  },

  initializeSchema: (): void => {
    const currentVersion = localStorage.getItem(COLLECTIONS.SCHEMA);
    if (!currentVersion) {
      localStorage.setItem(COLLECTIONS.SCHEMA, SCHEMA_VERSION);
      logOperation("CREATE", "schema", { version: SCHEMA_VERSION });
    }
  },

  // Admin data operations
  saveAdminData: async (data: AdminData): Promise<{ success: boolean; id: string }> => {
    await networkDelay();
    const adminRecord = {
      ...data,
      id: `admin_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(COLLECTIONS.ADMINS, JSON.stringify(adminRecord));
    logOperation("CREATE", COLLECTIONS.ADMINS, adminRecord);
    return { success: true, id: adminRecord.id };
  },

  getAdminData: async (): Promise<AdminData | null> => {
    await networkDelay();
    const data = localStorage.getItem(COLLECTIONS.ADMINS);
    const result = data ? JSON.parse(data) : null;
    logOperation("READ", COLLECTIONS.ADMINS, result ? { found: true } : { found: false });
    return result;
  },

  updateAdminData: async (updates: Partial<AdminData>): Promise<{ success: boolean }> => {
    await networkDelay();
    const existing = localStorage.getItem(COLLECTIONS.ADMINS);
    if (!existing) return { success: false };
    
    const updated = {
      ...JSON.parse(existing),
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(COLLECTIONS.ADMINS, JSON.stringify(updated));
    logOperation("UPDATE", COLLECTIONS.ADMINS, updates);
    return { success: true };
  },

  // Preferences operations
  savePreferences: async (prefs: UserPreferences): Promise<{ success: boolean }> => {
    await networkDelay();
    const record = {
      ...prefs,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(COLLECTIONS.PREFERENCES, JSON.stringify(record));
    logOperation("UPDATE", COLLECTIONS.PREFERENCES, record);
    return { success: true };
  },

  getPreferences: async (): Promise<UserPreferences> => {
    await networkDelay();
    const data = localStorage.getItem(COLLECTIONS.PREFERENCES);
    const defaultPrefs = { mode: "balanced" as const, autoOffMinutes: 15, acReductionPercent: 10 };
    const result = data ? JSON.parse(data) : defaultPrefs;
    logOperation("READ", COLLECTIONS.PREFERENCES, { found: !!data });
    return result;
  },

  // Feedback operations
  saveFeedback: async (feedback: FeedbackData): Promise<{ success: boolean; id: string }> => {
    await networkDelay();
    const existing = localStorage.getItem(COLLECTIONS.FEEDBACK);
    const feedbackList: FeedbackData[] = existing ? JSON.parse(existing) : [];
    
    const record = {
      ...feedback,
      id: `fb_${Date.now()}`,
    };
    feedbackList.push(record);
    localStorage.setItem(COLLECTIONS.FEEDBACK, JSON.stringify(feedbackList));
    logOperation("CREATE", COLLECTIONS.FEEDBACK, record);
    return { success: true, id: record.id };
  },

  getFeedback: async (): Promise<FeedbackData[]> => {
    await networkDelay();
    const data = localStorage.getItem(COLLECTIONS.FEEDBACK);
    const result = data ? JSON.parse(data) : [];
    logOperation("READ", COLLECTIONS.FEEDBACK, { count: result.length });
    return result;
  },

  getFeedbackStats: async (): Promise<{
    total: number;
    applied: number;
    skipped: number;
    appliedPercentage: number;
  }> => {
    const feedback = await backend.getFeedback();
    const applied = feedback.filter((f) => f.applied).length;
    const skipped = feedback.filter((f) => !f.applied).length;
    return {
      total: feedback.length,
      applied,
      skipped,
      appliedPercentage: feedback.length > 0 ? Math.round((applied / feedback.length) * 100) : 0,
    };
  },

  // Custom appliances operations
  saveCustomAppliances: async (appliances: string[]): Promise<{ success: boolean }> => {
    await networkDelay();
    const record = {
      items: appliances,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(COLLECTIONS.CUSTOM_APPLIANCES, JSON.stringify(record));
    logOperation("UPDATE", COLLECTIONS.CUSTOM_APPLIANCES, record);
    return { success: true };
  },

  getCustomAppliances: async (): Promise<string[]> => {
    await networkDelay();
    const data = localStorage.getItem(COLLECTIONS.CUSTOM_APPLIANCES);
    const result = data ? JSON.parse(data).items : [];
    logOperation("READ", COLLECTIONS.CUSTOM_APPLIANCES, { count: result.length });
    return result;
  },

  // Bill upload operations
  saveBillUpload: async (
    fileName: string,
    fileType: string,
    extractedData?: { consumption?: number; billAmount?: number }
  ): Promise<{ success: boolean }> => {
    await networkDelay();
    const record = {
      fileName,
      fileType,
      extractedData,
      uploadedAt: new Date().toISOString(),
    };
    localStorage.setItem(COLLECTIONS.BILL_UPLOADS, JSON.stringify(record));
    logOperation("CREATE", COLLECTIONS.BILL_UPLOADS, record);
    return { success: true };
  },

  getBillUpload: async (): Promise<{
    fileName: string;
    fileType: string;
    extractedData?: { consumption?: number; billAmount?: number };
    uploadedAt: string;
  } | null> => {
    await networkDelay();
    const data = localStorage.getItem(COLLECTIONS.BILL_UPLOADS);
    const result = data ? JSON.parse(data) : null;
    logOperation("READ", COLLECTIONS.BILL_UPLOADS, result ? { found: true } : { found: false });
    return result;
  },

  // Onboarding status
  setOnboardingComplete: async (complete: boolean): Promise<{ success: boolean }> => {
    await networkDelay();
    const record = {
      complete,
      completedAt: complete ? new Date().toISOString() : null,
    };
    localStorage.setItem(COLLECTIONS.ONBOARDING, JSON.stringify(record));
    logOperation("UPDATE", COLLECTIONS.ONBOARDING, record);
    return { success: true };
  },

  isOnboardingComplete: async (): Promise<boolean> => {
    await networkDelay();
    const data = localStorage.getItem(COLLECTIONS.ONBOARDING);
    const result = data ? JSON.parse(data).complete : false;
    logOperation("READ", COLLECTIONS.ONBOARDING, { complete: result });
    return result;
  },

  // Clear all data
  clearAllData: async (): Promise<{ success: boolean }> => {
    await networkDelay();
    Object.values(COLLECTIONS).forEach((key) => localStorage.removeItem(key));
    logOperation("DELETE", "all_collections", { cleared: true });
    return { success: true };
  },

  // Get all stored data for debug panel
  getAllData: (): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    Object.entries(COLLECTIONS).forEach(([name, key]) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          data[name] = JSON.parse(stored);
        } catch {
          data[name] = stored;
        }
      }
    });
    return data;
  },

  // Get operation logs for debug panel
  getOperationLogs: (): OperationLog[] => {
    return operationLogs;
  },

  // Get storage size in bytes
  getStorageSize: (): number => {
    let size = 0;
    Object.values(COLLECTIONS).forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        size += data.length * 2; // UTF-16 encoding
      }
    });
    return size;
  },

  // Format storage size for display
  getFormattedStorageSize: (): string => {
    const bytes = backend.getStorageSize();
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  },
};

// Initialize schema on load
backend.initializeSchema();

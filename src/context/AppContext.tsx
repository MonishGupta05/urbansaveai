import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storage, AdminData, UserPreferences, FeedbackData } from "@/services/storage";

interface AppState {
  adminData: AdminData | null;
  preferences: UserPreferences;
  feedback: FeedbackData[];
  isOnboardingComplete: boolean;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  setAdminData: (data: AdminData) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addFeedback: (feedback: FeedbackData) => void;
  completeOnboarding: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    adminData: null,
    preferences: { mode: "balanced", autoOffMinutes: 15, acReductionPercent: 10 },
    feedback: [],
    isOnboardingComplete: false,
    isLoading: true,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const adminData = storage.getAdminData();
    const preferences = storage.getPreferences();
    const feedback = storage.getFeedback();
    const isOnboardingComplete = storage.isOnboardingComplete();

    setState({
      adminData,
      preferences,
      feedback,
      isOnboardingComplete,
      isLoading: false,
    });
  }, []);

  const setAdminData = (data: AdminData) => {
    storage.setAdminData(data);
    setState((prev) => ({ ...prev, adminData: data }));
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const newPreferences = { ...state.preferences, ...prefs };
    storage.setPreferences(newPreferences);
    setState((prev) => ({ ...prev, preferences: newPreferences }));
  };

  const addFeedback = (feedback: FeedbackData) => {
    storage.addFeedback(feedback);
    setState((prev) => ({ ...prev, feedback: [...prev.feedback, feedback] }));
  };

  const completeOnboarding = () => {
    storage.setOnboardingComplete(true);
    setState((prev) => ({ ...prev, isOnboardingComplete: true }));
  };

  const resetApp = () => {
    storage.clearAll();
    setState({
      adminData: null,
      preferences: { mode: "balanced", autoOffMinutes: 15, acReductionPercent: 10 },
      feedback: [],
      isOnboardingComplete: false,
      isLoading: false,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setAdminData,
        updatePreferences,
        addFeedback,
        completeOnboarding,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

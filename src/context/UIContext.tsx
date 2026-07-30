import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { initialUISettings } from "../data/defaultData";
import type { UISettings } from "../types";

const UI_STORAGE_KEY = "expense-tracker-pro-ui-v1";
const LEGACY_KEYS = ["expense-tracker-pro-state-v2", "expense-tracker-pro-state"];

interface UIContextValue {
  settings: UISettings;
  updateSettings: (payload: Partial<UISettings>) => void;
  resetUISettings: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

const loadUISettings = (): UISettings => {
  try {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    if (saved) return { ...initialUISettings, ...JSON.parse(saved) } as UISettings;

    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      const settings = JSON.parse(legacy)?.settings;
      if (settings) return { ...initialUISettings, ...settings } as UISettings;
    }
  } catch (error) {
    console.error("Failed to load UI settings", error);
  }

  return initialUISettings;
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UISettings>(loadUISettings);

  useEffect(() => {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.lang = settings.language || "en";
    document.documentElement.dir = settings.language === "fa" ? "rtl" : "ltr";
  }, [settings]);

  const value = useMemo<UIContextValue>(
    () => ({
      settings,
      updateSettings: (payload) => setSettings((current) => ({ ...current, ...payload })),
      resetUISettings: () => setSettings(initialUISettings),
    }),
    [settings]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = (): UIContextValue => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used inside UIProvider");
  return context;
};

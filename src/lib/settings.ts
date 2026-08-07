import { useCallback, useEffect, useState } from "react";

export type Settings = {
  defaultTone: "Formal" | "Friendly" | "Persuasive";
  defaultRange: "Daily" | "Weekly";
  darkMode: boolean;
};

const KEY = "aiwpa-settings";

const defaults: Settings = {
  defaultTone: "Formal",
  defaultRange: "Daily",
  darkMode: false,
};

export function readSettings(): Settings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) } : defaults;
  } catch {
    return defaults;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { settings, update };
}

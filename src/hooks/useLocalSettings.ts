import { useCallback, useEffect, useMemo, useState } from "react";
import { loadSettings, saveSettings } from "../services/storageService";
import type { DashboardSettings } from "../types/settings";

export function useLocalSettings() {
  const [settings, setSettingsState] = useState<DashboardSettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const setSettings = useCallback((next: DashboardSettings | ((current: DashboardSettings) => DashboardSettings)) => {
    setSettingsState((current) => (typeof next === "function" ? next(current) : next));
  }, []);

  const updateSettings = useCallback((partial: Partial<DashboardSettings>) => {
    setSettingsState((current) => ({ ...current, ...partial }));
  }, []);

  return useMemo(
    () => ({
      settings,
      setSettings,
      updateSettings
    }),
    [settings, setSettings, updateSettings]
  );
}

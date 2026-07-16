import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { useLocalSettings } from "./hooks/useLocalSettings";
import type { DashboardSettings } from "./types/settings";
import type { CSSProperties } from "react";

export function App() {
  const { settings, setSettings } = useLocalSettings();

  const completeOnboarding = (nextSettings: DashboardSettings) => {
    setSettings(nextSettings);
  };

  return (
    <div
      className={`app-shell background-${settings.design.background} cards-${settings.design.cardStyle}`}
      style={{ "--accent": settings.design.accentColor } as CSSProperties}
    >
      {settings.setupComplete ? (
        <DashboardPage settings={settings} setSettings={setSettings} />
      ) : (
        <OnboardingPage onComplete={completeOnboarding} />
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { LayoutRouter } from "../components/dashboard/LayoutRouter";
import { RestView } from "../components/dashboard/RestView";
import { OfflineNotice } from "../components/tiles/OfflineNotice";
import { useContentData } from "../hooks/useContentData";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useRotation } from "../hooks/useRotation";
import { useSwipe } from "../hooks/useSwipe";
import { isWithinWorkingHours } from "../utils/date";
import type { DashboardSettings } from "../types/settings";
import { SettingsPanel } from "../components/settings/SettingsPanel";

interface DashboardPageProps {
  settings: DashboardSettings;
  setSettings: (settings: DashboardSettings | ((current: DashboardSettings) => DashboardSettings)) => void;
}

export function DashboardPage({ settings, setSettings }: DashboardPageProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const online = useOnlineStatus();
  const data = useContentData(settings, online);
  const totalViews = useMemo(() => {
    if (settings.layout === "hybrid") return Math.max(2, settings.viewOrder.length * 2);
    if (settings.layout === "fullscreen-rotation") return Math.max(1, settings.viewOrder.length);
    return Math.max(1, settings.viewOrder.length);
  }, [settings.layout, settings.viewOrder.length]);
  const rotation = useRotation(totalViews, settings.rotationSeconds, true, settings.cache.lastActiveView ?? 0);
  const swipeRef = useSwipe<HTMLDivElement>({ onLeft: rotation.next, onRight: rotation.previous });
  const active = isWithinWorkingHours(settings.workingHours);

  return (
    <main className="dashboard-page" ref={swipeRef}>
      <button className="settings-trigger" type="button" aria-label="Einstellungen öffnen" onClick={() => setSettingsOpen(true)}>
        <span aria-hidden="true">⚙</span>
      </button>
      {!online && <OfflineNotice />}
      {active ? <LayoutRouter settings={settings} data={data} rotationIndex={rotation.index} /> : <RestView data={data} />}
      <div className="rotation-dots" aria-hidden="true">
        {Array.from({ length: totalViews }).map((_, index) => (
          <span className={index === rotation.index ? "active" : ""} key={index} />
        ))}
      </div>
      {settingsOpen && <SettingsPanel settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} />}
    </main>
  );
}

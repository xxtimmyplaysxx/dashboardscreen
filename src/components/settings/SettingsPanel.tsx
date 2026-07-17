import { useRef, useState } from "react";
import { CONTENT_OPTIONS, IMAGE_CATEGORIES, NEWS_CATEGORIES, NEWS_SOURCES, ROTATION_OPTIONS } from "../../config/catalog";
import { DEFAULT_SETTINGS } from "../../config/defaultSettings";
import { clearSettings, exportSettings, importSettingsFile } from "../../services/storageService";
import type { ContentType } from "../../types/content";
import type { DashboardSettings } from "../../types/settings";
import { TileConfigurator } from "./TileConfigurator";

const tabs = ["Allgemein", "Layout", "Inhalte", "News", "Bilder", "Design", "Daten"] as const;
type SettingsTab = (typeof tabs)[number];

interface SettingsPanelProps {
  settings: DashboardSettings;
  setSettings: (settings: DashboardSettings | ((current: DashboardSettings) => DashboardSettings)) => void;
  onClose: () => void;
}

function toggleItem<T extends string>(items: T[], item: T): T[] {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}

export function SettingsPanel({ settings, setSettings, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Allgemein");
  const [message, setMessage] = useState("");
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const update = (partial: Partial<DashboardSettings>) => {
    setSettings((current) => ({ ...current, ...partial }));
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const imported = await importSettingsFile(file);
      const overwrite = window.confirm("Bestehende Einstellungen auf diesem Gerät überschreiben?");
      if (!overwrite) return;
      setSettings({ ...imported, setupComplete: true });
      setMessage("Einstellungen wurden importiert.");
    } catch {
      setMessage("Die Datei konnte nicht als Dashboard-Konfiguration importiert werden.");
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  const reset = () => {
    const confirmed = window.confirm("Einstellungen auf diesem Gerät zurücksetzen?");
    if (!confirmed) return;
    clearSettings();
    setSettings({ ...DEFAULT_SETTINGS, setupComplete: true });
    setMessage("Einstellungen wurden zurückgesetzt.");
  };

  const applyFullscreenPreset = () => {
    setSettings((current) => ({
      ...current,
      layout: DEFAULT_SETTINGS.layout,
      tiles: DEFAULT_SETTINGS.tiles,
      viewOrder: DEFAULT_SETTINGS.viewOrder,
      activeContent: DEFAULT_SETTINGS.activeContent,
      setupComplete: true
    }));
    setMessage("Fullscreen-Slideshow wurde angewendet.");
  };

  return (
    <div className="settings-backdrop" role="dialog" aria-modal="true" aria-label="Einstellungen">
      <div className="settings-panel">
        <header className="settings-header">
          <div>
            <p className="eyebrow">Nur auf diesem Gerät</p>
            <h1>Einstellungen</h1>
          </div>
          <button className="icon-button" type="button" aria-label="Einstellungen schliessen" onClick={onClose}>
            ×
          </button>
        </header>

        <nav className="settings-tabs" aria-label="Einstellungsbereiche">
          {tabs.map((tab) => (
            <button className={activeTab === tab ? "active" : ""} type="button" key={tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        <section className="settings-content">
          {activeTab === "Allgemein" && (
            <div className="settings-grid">
              <label>
                Name
                <input value={settings.userName} onChange={(event) => update({ userName: event.target.value })} />
              </label>
              <label>
                Wetterort
                <input value={settings.location} onChange={(event) => update({ location: event.target.value })} />
              </label>
              <label>
                Wechselintervall
                <select
                  value={settings.rotationSeconds}
                  onChange={(event) => update({ rotationSeconds: Number(event.target.value) as DashboardSettings["rotationSeconds"] })}
                >
                  {ROTATION_OPTIONS.map((seconds) => (
                    <option value={seconds} key={seconds}>
                      {seconds} Sekunden
                    </option>
                  ))}
                </select>
              </label>
              <div className="settings-card">
                <p>Deine Einstellungen werden nur auf diesem Gerät gespeichert.</p>
              </div>
              <div className="working-hours-list">
                {Object.entries(settings.workingHours).map(([key, day]) => (
                  <div className="working-row" key={key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={() =>
                          update({
                            workingHours: {
                              ...settings.workingHours,
                              [key]: { ...day, enabled: !day.enabled }
                            }
                          })
                        }
                      />
                      {dayLabel(key)}
                    </label>
                    <input
                      type="time"
                      value={day.start}
                      onChange={(event) =>
                        update({ workingHours: { ...settings.workingHours, [key]: { ...day, start: event.target.value } } })
                      }
                    />
                    <input
                      type="time"
                      value={day.end}
                      onChange={(event) =>
                        update({ workingHours: { ...settings.workingHours, [key]: { ...day, end: event.target.value } } })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Layout" && <TileConfigurator settings={settings} onChange={(next) => setSettings(next)} />}

          {activeTab === "Inhalte" && (
            <div className="choice-list">
              {CONTENT_OPTIONS.map((option) => (
                <label className="toggle-row" key={option.type}>
                  <input
                    type="checkbox"
                    checked={settings.activeContent.includes(option.type)}
                    onChange={() => update({ activeContent: toggleItem(settings.activeContent, option.type) })}
                  />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </label>
              ))}
              <div className="settings-card">
                <h2>Reihenfolge der Ansichten</h2>
                <div className="chip-list">
                  {CONTENT_OPTIONS.filter((option) => settings.activeContent.includes(option.type)).map((option) => (
                    <button
                      type="button"
                      className={settings.viewOrder.includes(option.type) ? "chip active" : "chip"}
                      key={option.type}
                      onClick={() => update({ viewOrder: toggleItem(settings.viewOrder, option.type) as ContentType[] })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "News" && (
            <div className="settings-columns">
              <CheckGroup
                title="Quellen"
                items={NEWS_SOURCES}
                selected={settings.newsSources}
                onToggle={(id) => update({ newsSources: toggleItem(settings.newsSources, id) })}
              />
              <CheckGroup
                title="Kategorien"
                items={NEWS_CATEGORIES}
                selected={settings.newsCategories}
                onToggle={(id) => update({ newsCategories: toggleItem(settings.newsCategories, id) })}
              />
            </div>
          )}

          {activeTab === "Bilder" && (
            <div className="chip-list large">
              {IMAGE_CATEGORIES.map((category) => (
                <button
                  type="button"
                  className={settings.imageCategories.includes(category) ? "chip active" : "chip"}
                  key={category}
                  onClick={() => update({ imageCategories: toggleItem(settings.imageCategories, category) })}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {activeTab === "Design" && (
            <div className="settings-grid">
              <label>
                Akzentfarbe
                <input
                  type="color"
                  value={settings.design.accentColor}
                  onChange={(event) => update({ design: { ...settings.design, accentColor: event.target.value } })}
                />
              </label>
              <label>
                Hintergrund
                <select
                  value={settings.design.background}
                  onChange={(event) =>
                    update({ design: { ...settings.design, background: event.target.value as DashboardSettings["design"]["background"] } })
                  }
                >
                  <option value="clean">Sehr hell</option>
                  <option value="soft">Weiche Flächen</option>
                  <option value="image">Bildbetont</option>
                </select>
              </label>
              <label>
                Kartenstil
                <select
                  value={settings.design.cardStyle}
                  onChange={(event) =>
                    update({ design: { ...settings.design, cardStyle: event.target.value as DashboardSettings["design"]["cardStyle"] } })
                  }
                >
                  <option value="soft">Sanfter Schatten</option>
                  <option value="flat">Flach</option>
                </select>
              </label>
            </div>
          )}

          {activeTab === "Daten" && (
            <div className="data-actions">
              <button className="primary-button" type="button" onClick={() => exportSettings(settings)}>
                Einstellungen exportieren
              </button>
              <button className="secondary-button" type="button" onClick={() => importInputRef.current?.click()}>
                Einstellungen importieren
              </button>
              <button className="secondary-button" type="button" onClick={applyFullscreenPreset}>
                Fullscreen-Slideshow anwenden
              </button>
              <button className="secondary-button danger" type="button" onClick={reset}>
                Zurücksetzen
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json"
                hidden
                onChange={(event) => handleImport(event.target.files?.[0])}
              />
              {message && <p className="settings-message">{message}</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CheckGroup({
  title,
  items,
  selected,
  onToggle
}: {
  title: string;
  items: Array<{ id: string; label: string }>;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="settings-card">
      <h2>{title}</h2>
      {items.map((item) => (
        <label className="toggle-row compact" key={item.id}>
          <input type="checkbox" checked={selected.includes(item.id)} onChange={() => onToggle(item.id)} />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}

function dayLabel(key: string): string {
  return {
    mon: "Montag",
    tue: "Dienstag",
    wed: "Mittwoch",
    thu: "Donnerstag",
    fri: "Freitag",
    sat: "Samstag",
    sun: "Sonntag"
  }[key] ?? key;
}

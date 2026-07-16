import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CONTENT_OPTIONS, IMAGE_CATEGORIES, NEWS_CATEGORIES, NEWS_SOURCES, ROTATION_OPTIONS } from "../../config/catalog";
import { DEFAULT_SETTINGS } from "../../config/defaultSettings";
import { layoutOptions } from "../../layouts/layoutDefinitions";
import { clearOnboardingDraft, loadOnboardingDraft, saveOnboardingDraft } from "../../services/storageService";
import type { ContentType } from "../../types/content";
import type { DashboardSettings } from "../../types/settings";
import { migrateSettings } from "../../utils/migration";
import { TileConfigurator } from "../settings/TileConfigurator";

interface OnboardingFlowProps {
  onComplete: (settings: DashboardSettings) => void;
}

const totalSteps = 10;

function toggle<T extends string>(items: T[], item: T): T[] {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DashboardSettings>(() =>
    migrateSettings({ ...DEFAULT_SETTINGS, ...loadOnboardingDraft(), setupComplete: false })
  );

  useEffect(() => {
    saveOnboardingDraft(draft);
  }, [draft]);

  const canGoNext = useMemo(() => {
    if (step === 1) return draft.userName.trim().length > 0;
    if (step === 2) return draft.location.trim().length > 1;
    if (step === 3) return draft.activeContent.length > 0;
    if (step === 4) return draft.imageCategories.length > 0;
    if (step === 7) return draft.viewOrder.length > 0;
    return true;
  }, [draft.activeContent.length, draft.imageCategories.length, draft.location, draft.userName, draft.viewOrder.length, step]);

  const finish = (settings = draft) => {
    clearOnboardingDraft();
    onComplete({ ...settings, setupComplete: true });
  };

  const update = (partial: Partial<DashboardSettings>) => setDraft((current) => ({ ...current, ...partial }));

  return (
    <main className="onboarding-page">
      <section className="onboarding-panel">
        <div className="onboarding-progress" aria-hidden="true">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span className={index <= step ? "active" : ""} key={index} />
          ))}
        </div>

        {step === 0 && (
          <StepFrame eyebrow="Willkommen" title="Gestalte dein persönliches Dashboard.">
            <p className="onboarding-copy">Hell, ruhig und lokal auf diesem Gerät gespeichert.</p>
            <button className="secondary-button" type="button" onClick={() => finish({ ...DEFAULT_SETTINGS, setupComplete: true })}>
              Einrichtung überspringen
            </button>
          </StepFrame>
        )}

        {step === 1 && (
          <StepFrame eyebrow="Begrüssung" title="Wie dürfen wir dich begrüssen?">
            <input autoFocus value={draft.userName} onChange={(event) => update({ userName: event.target.value })} placeholder="Tim" />
          </StepFrame>
        )}

        {step === 2 && (
          <StepFrame eyebrow="Wetter" title="Für welchen Ort soll das Wetter angezeigt werden?">
            <input value={draft.location} onChange={(event) => update({ location: event.target.value })} placeholder="Hedingen" />
          </StepFrame>
        )}

        {step === 3 && (
          <StepFrame eyebrow="Inhalte" title="Was interessiert dich?">
            <div className="chip-list large">
              {CONTENT_OPTIONS.map((option) => (
                <button
                  className={draft.activeContent.includes(option.type) ? "chip active" : "chip"}
                  type="button"
                  key={option.type}
                  onClick={() => update({ activeContent: toggle(draft.activeContent, option.type) })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </StepFrame>
        )}

        {step === 4 && (
          <StepFrame eyebrow="Bilder" title="Welche Bilder möchtest du sehen?">
            <div className="chip-list large">
              {IMAGE_CATEGORIES.map((category) => (
                <button
                  className={draft.imageCategories.includes(category) ? "chip active" : "chip"}
                  type="button"
                  key={category}
                  onClick={() => update({ imageCategories: toggle(draft.imageCategories, category) })}
                >
                  {category}
                </button>
              ))}
            </div>
          </StepFrame>
        )}

        {step === 5 && (
          <StepFrame eyebrow="Layout" title="Wähle dein Layout">
            <div className="layout-choice-grid">
              {layoutOptions.map((layout) => (
                <button
                  className={draft.layout === layout.id ? "choice-card selected" : "choice-card"}
                  type="button"
                  key={layout.id}
                  onClick={() => setDraft((current) => migrateSettings({ ...current, layout: layout.id }))}
                >
                  <span>{layout.name}</span>
                  <small>{layout.description}</small>
                </button>
              ))}
            </div>
          </StepFrame>
        )}

        {step === 6 && (
          <StepFrame eyebrow="Kacheln" title="Belege deine Kacheln">
            <TileConfigurator settings={draft} onChange={setDraft} showLayoutPicker={false} />
          </StepFrame>
        )}

        {step === 7 && (
          <StepFrame eyebrow="Rotation" title="Wie schnell sollen die Inhalte wechseln?">
            <div className="segmented-options">
              {ROTATION_OPTIONS.map((seconds) => (
                <button
                  className={draft.rotationSeconds === seconds ? "active" : ""}
                  type="button"
                  key={seconds}
                  onClick={() => update({ rotationSeconds: seconds })}
                >
                  {seconds}s
                </button>
              ))}
            </div>
            <div className="chip-list">
              {CONTENT_OPTIONS.filter((option) => draft.activeContent.includes(option.type)).map((option) => (
                <button
                  className={draft.viewOrder.includes(option.type) ? "chip active" : "chip"}
                  type="button"
                  key={option.type}
                  onClick={() => update({ viewOrder: toggle(draft.viewOrder, option.type) as ContentType[] })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </StepFrame>
        )}

        {step === 8 && (
          <StepFrame eyebrow="Arbeitszeit" title="Wann soll dein Dashboard aktiv sein?">
            <div className="working-hours-list onboarding-hours">
              {Object.entries(draft.workingHours).map(([key, day]) => (
                <div className="working-row" key={key}>
                  <label>
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={() =>
                        update({
                          workingHours: { ...draft.workingHours, [key]: { ...day, enabled: !day.enabled } }
                        })
                      }
                    />
                    {dayLabel(key)}
                  </label>
                  <input
                    type="time"
                    value={day.start}
                    onChange={(event) => update({ workingHours: { ...draft.workingHours, [key]: { ...day, start: event.target.value } } })}
                  />
                  <input
                    type="time"
                    value={day.end}
                    onChange={(event) => update({ workingHours: { ...draft.workingHours, [key]: { ...day, end: event.target.value } } })}
                  />
                </div>
              ))}
            </div>
          </StepFrame>
        )}

        {step === 9 && (
          <StepFrame eyebrow="Bereit" title="Dein Dashboard ist bereit.">
            <p className="onboarding-copy">Die Konfiguration bleibt lokal auf diesem Gerät.</p>
            <button className="primary-button" type="button" onClick={() => finish()}>
              Dashboard starten
            </button>
          </StepFrame>
        )}

        <footer className="onboarding-actions">
          <button className="secondary-button" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
            Zurück
          </button>
          {step < totalSteps - 1 && (
            <button
              className="primary-button"
              type="button"
              disabled={!canGoNext}
              onClick={() => setStep((current) => Math.min(totalSteps - 1, current + 1))}
            >
              Weiter
            </button>
          )}
        </footer>
      </section>
    </main>
  );
}

function StepFrame({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="onboarding-step">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
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

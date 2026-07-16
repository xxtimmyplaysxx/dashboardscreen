import type { LayoutDefinition, LayoutTemplate } from "../types/dashboard";

export const LAYOUT_DEFINITIONS: Record<LayoutTemplate, LayoutDefinition> = {
  "apple-minimal": {
    id: "apple-minimal",
    name: "Apple Minimal",
    description: "Eine grosse Bühne mit zwei ruhigen Zusatzflächen.",
    slots: [
      { id: "hero", label: "Hauptfläche", size: "large", className: "slot-hero" },
      { id: "side-a", label: "Oben rechts", size: "small", className: "slot-side-a" },
      { id: "side-b", label: "Unten rechts", size: "small", className: "slot-side-b" }
    ]
  },
  "balanced-grid": {
    id: "balanced-grid",
    name: "Balanced Grid",
    description: "Vier gleichwertige Kacheln für den Arbeitsalltag.",
    slots: [
      { id: "grid-a", label: "Links oben", size: "medium", className: "slot-grid-a" },
      { id: "grid-b", label: "Rechts oben", size: "medium", className: "slot-grid-b" },
      { id: "grid-c", label: "Links unten", size: "medium", className: "slot-grid-c" },
      { id: "grid-d", label: "Rechts unten", size: "medium", className: "slot-grid-d" }
    ]
  },
  focus: {
    id: "focus",
    name: "Focus",
    description: "Eine grosse Fläche links, zwei kompakte Begleiter rechts.",
    slots: [
      { id: "focus-main", label: "Fokus", size: "large", className: "slot-focus-main" },
      { id: "focus-top", label: "Rechts oben", size: "small", className: "slot-focus-top" },
      { id: "focus-bottom", label: "Rechts unten", size: "small", className: "slot-focus-bottom" }
    ]
  },
  information: {
    id: "information",
    name: "Information",
    description: "Mehr kompakte Flächen für News, Wetter und Märkte.",
    slots: [
      { id: "info-a", label: "Gross", size: "medium", className: "slot-info-a" },
      { id: "info-b", label: "Oben Mitte", size: "small", className: "slot-info-b" },
      { id: "info-c", label: "Oben rechts", size: "small", className: "slot-info-c" },
      { id: "info-d", label: "Unten links", size: "small", className: "slot-info-d" },
      { id: "info-e", label: "Unten Mitte", size: "small", className: "slot-info-e" },
      { id: "info-f", label: "Unten rechts", size: "small", className: "slot-info-f" }
    ]
  },
  "fullscreen-rotation": {
    id: "fullscreen-rotation",
    name: "Fullscreen Rotation",
    description: "Ein Inhalt füllt immer den ganzen Bildschirm.",
    slots: [{ id: "fullscreen", label: "Vollbild", size: "fullscreen", className: "slot-fullscreen" }]
  },
  hybrid: {
    id: "hybrid",
    name: "Hybrid",
    description: "Dashboard-Übersicht im Wechsel mit grossen Fokusansichten.",
    slots: [
      { id: "hybrid-main", label: "Hauptfläche", size: "large", className: "slot-hybrid-main" },
      { id: "hybrid-a", label: "Kurzinfo 1", size: "small", className: "slot-hybrid-a" },
      { id: "hybrid-b", label: "Kurzinfo 2", size: "small", className: "slot-hybrid-b" },
      { id: "hybrid-c", label: "Kurzinfo 3", size: "small", className: "slot-hybrid-c" }
    ]
  }
};

export const layoutOptions = Object.values(LAYOUT_DEFINITIONS);

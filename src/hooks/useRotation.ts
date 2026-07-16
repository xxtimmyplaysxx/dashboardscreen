import { useCallback, useEffect, useRef, useState } from "react";

export function useRotation(total: number, seconds: number, enabled = true, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);
  const pausedUntil = useRef(0);

  useEffect(() => {
    setIndex((current) => (total > 0 ? current % total : 0));
  }, [total]);

  useEffect(() => {
    if (!enabled || total <= 1) return undefined;
    const timer = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setIndex((current) => (current + 1) % total);
    }, seconds * 1000);
    return () => window.clearInterval(timer);
  }, [enabled, seconds, total]);

  const pauseBriefly = useCallback(() => {
    pausedUntil.current = Date.now() + Math.max(5000, seconds * 500);
  }, [seconds]);

  const next = useCallback(() => {
    pauseBriefly();
    setIndex((current) => (total > 0 ? (current + 1) % total : 0));
  }, [pauseBriefly, total]);

  const previous = useCallback(() => {
    pauseBriefly();
    setIndex((current) => (total > 0 ? (current - 1 + total) % total : 0));
  }, [pauseBriefly, total]);

  return { index, next, previous, pauseBriefly, setIndex };
}

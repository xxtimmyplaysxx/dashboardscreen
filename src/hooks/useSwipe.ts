import { useEffect, useRef } from "react";

interface SwipeHandlers {
  onLeft: () => void;
  onRight: () => void;
}

export function useSwipe<T extends HTMLElement>(handlers: SwipeHandlers) {
  const ref = useRef<T | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let startX = 0;
    let startY = 0;
    let pointerId: number | null = null;

    const onPointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      pointerId = null;

      if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;
      if (deltaX < 0) handlersRef.current.onLeft();
      if (deltaX > 0) handlersRef.current.onRight();
    };

    element.addEventListener("pointerdown", onPointerDown, { passive: true });
    element.addEventListener("pointerup", onPointerUp, { passive: true });
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return ref;
}

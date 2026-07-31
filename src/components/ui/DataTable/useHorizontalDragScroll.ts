"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to enable horizontal drag scroll for a table.
 */
export function useHorizontalDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, select, label, [data-no-drag-scroll]")) {
        return;
      }
      isDragging = true;
      startX = e.clientX;
      scrollLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
      el.classList.remove("cursor-grab");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      el.scrollLeft = scrollLeft - dx;
    };

    const endDrag = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      el.classList.remove("cursor-grabbing");
      el.classList.add("cursor-grab");
    };

    const onWheel = (e: WheelEvent) => {
      const mostlyHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (mostlyHorizontal) {
        el.scrollLeft += e.deltaX;
        return;
      }
      if (e.shiftKey && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.classList.add("cursor-grab");
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.classList.remove("cursor-grab", "cursor-grabbing");
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return ref;
}

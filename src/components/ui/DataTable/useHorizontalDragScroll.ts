"use client";

import { useEffect, useRef } from "react";

const DRAG_THRESHOLD_PX = 6;

/**
 * Horizontal drag-to-scroll for overflow containers.
 * Uses a movement threshold so clicks (sort, select, actions) still work.
 */
export function useHorizontalDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId: number | null = null;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;
    let didDrag = false;

    const interactiveSelector =
      "a, button, input, select, textarea, label, [data-no-drag-scroll], [role='button'], [role='checkbox']";

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelector)) return;

      pointerId = e.pointerId;
      startX = e.clientX;
      scrollLeft = el.scrollLeft;
      isDragging = false;
      didDrag = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;

      const dx = e.clientX - startX;

      if (!isDragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        isDragging = true;
        didDrag = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add("cursor-grabbing");
        el.classList.remove("cursor-grab");
      }

      e.preventDefault();
      el.scrollLeft = scrollLeft - dx;
    };

    const endDrag = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;

      if (isDragging) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
        el.classList.remove("cursor-grabbing");
        el.classList.add("cursor-grab");
      }

      // Block the click that follows a real drag (sort / row click).
      if (didDrag) {
        const suppressClick = (clickEvent: MouseEvent) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          el.removeEventListener("click", suppressClick, true);
        };
        el.addEventListener("click", suppressClick, true);
        window.setTimeout(() => {
          el.removeEventListener("click", suppressClick, true);
        }, 0);
      }

      pointerId = null;
      isDragging = false;
      didDrag = false;
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
    el.addEventListener("lostpointercapture", endDrag);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.classList.remove("cursor-grab", "cursor-grabbing");
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("lostpointercapture", endDrag);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return ref;
}

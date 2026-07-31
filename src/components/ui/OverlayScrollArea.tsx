"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

type OverlayScrollAreaProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "main" | "section" | "aside";
};

/** Vertical scroll without gutter: custom scrollbar above the content. 
 * The internal divs are presentation (`aria-hidden` on the scrollbar). 
 **/
export default function OverlayScrollArea({
  children,
  className = "",
  as: Tag = "div",
}: OverlayScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ startY: number; startScroll: number } | null>(null);
  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false });

  const syncThumb = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const overflow = scrollHeight > clientHeight + 1;
    if (!overflow) {
      setThumb((t) => (t.visible ? { top: 0, height: 0, visible: false } : t));
      return;
    }

    const ratio = clientHeight / scrollHeight;
    const height = Math.max(32, clientHeight * ratio);
    const maxTop = clientHeight - height;
    const top = maxTop <= 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setThumb({ top, height, visible: true });
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    syncThumb();
    el.addEventListener("scroll", syncThumb, { passive: true });

    const ro = new ResizeObserver(syncThumb);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    window.addEventListener("resize", syncThumb);
    return () => {
      el.removeEventListener("scroll", syncThumb);
      ro.disconnect();
      window.removeEventListener("resize", syncThumb);
    };
  }, [syncThumb]);

  const onThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const el = viewportRef.current;
    if (!el) return;
    dragging.current = { startY: e.clientY, startScroll: el.scrollTop };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    const drag = dragging.current;
    if (!el || !drag) return;

    const { scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const maxTop = clientHeight - thumb.height;
    if (maxScroll <= 0 || maxTop <= 0) return;

    const deltaY = e.clientY - drag.startY;
    el.scrollTop = drag.startScroll + (deltaY / maxTop) * maxScroll;
  };

  const onThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    const el = viewportRef.current;
    if (!el || !thumb.visible) return;
    const rect = trackRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const { scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const maxTop = clientHeight - thumb.height;
    const nextTop = Math.min(maxTop, Math.max(0, y - thumb.height / 2));
    el.scrollTop = maxTop <= 0 ? 0 : (nextTop / maxTop) * maxScroll;
  };

  const thumbStyle: CSSProperties = {
    transform: `translateY(${thumb.top}px)`,
    height: thumb.height,
  };

  return (
    <Tag className={`relative min-h-0 min-w-0 ${className}`}>
      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none"
      >
        {children}
      </div>

      {thumb.visible && (
        <div
          ref={trackRef}
          className="pointer-events-auto absolute inset-y-1 right-0 z-20 w-3"
          onPointerDown={onTrackPointerDown}
          aria-hidden
        >
          <div
            role="presentation"
            className="absolute right-0.5 w-1.5 cursor-pointer rounded-full bg-brand-700/35 transition-colors hover:bg-brand-700/55 active:bg-brand-700/65"
            style={thumbStyle}
            onPointerDown={onThumbPointerDown}
            onPointerMove={onThumbPointerMove}
            onPointerUp={onThumbPointerUp}
            onPointerCancel={onThumbPointerUp}
          />
        </div>
      )}
    </Tag>
  );
}

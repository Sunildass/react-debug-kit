/**
 * Render Flash — Subscribes to component_rerender events and shows
 * a brief visual flash around re-rendered components via the Overlay Engine.
 */

import { eventBus, showRenderFlash } from "react-debug-kit";
import type { EventMap } from "react-debug-kit";

let unsubscribe: (() => void) | null = null;

function handleRerender(payload: EventMap["component_rerender"]): void {
  if (!payload || !payload.element) return;

  const rect = payload.element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;

  const label = `↻ ${payload.componentName} #${payload.count}`;
  showRenderFlash(rect, label);
}

export function startRenderFlash(): void {
  if (unsubscribe) return;

  const handler = handleRerender;
  eventBus.on("component_rerender", handler);
  unsubscribe = () => eventBus.off("component_rerender", handler);
}

export function stopRenderFlash(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}

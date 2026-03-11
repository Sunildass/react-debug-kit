/**
 * Highlight Overlay — Listens for component_hover events and renders a
 * highlight box around the hovered React component.
 */

import {
  eventBus,
  showHighlight,
  hideHighlight,
  getComponentInfo,
} from "react-debug-kit";
import type { EventMap } from "react-debug-kit";

let unsubscribe: (() => void) | null = null;

function handleComponentHover(payload: EventMap["component_hover"]): void {
  if (!payload) {
    hideHighlight();
    return;
  }

  const { element, fiber } = payload;
  const rect = element.getBoundingClientRect();

  let label: string | undefined;
  if (fiber) {
    const info = getComponentInfo(fiber);
    label = `<${info.name}>`;
  }

  showHighlight(rect, label);
}

export function startHighlightOverlay(): void {
  if (unsubscribe) return;

  const handler = handleComponentHover;
  eventBus.on("component_hover", handler);
  unsubscribe = () => eventBus.off("component_hover", handler);
}

export function stopHighlightOverlay(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  hideHighlight();
}

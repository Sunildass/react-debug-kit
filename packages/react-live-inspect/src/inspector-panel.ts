/**
 * Inspector Panel — On component selection, extracts runtime info via
 * the Fiber Inspector and renders a floating panel via the Overlay Engine.
 */

import {
  eventBus,
  getComponentInfo,
  showPanel,
  hidePanel,
} from "react-debug-kit";
import type { EventMap } from "react-debug-kit";

let unsubscribe: (() => void) | null = null;
let panelVisible = false;

function handleComponentSelected(payload: EventMap["component_selected"]): void {
  if (!payload || !payload.fiber) {
    hidePanel();
    panelVisible = false;
    return;
  }

  const { element, fiber } = payload;
  const info = getComponentInfo(fiber);
  const rect = element.getBoundingClientRect();

  showPanel(
    {
      componentName: info.name,
      props: info.props as Record<string, unknown>,
      state: info.state,
    },
    {
      x: rect.right,
      y: rect.top,
    }
  );
  panelVisible = true;
}

export function startInspectorPanel(): void {
  if (unsubscribe) return;

  const handler = handleComponentSelected;
  eventBus.on("component_selected", handler);
  unsubscribe = () => eventBus.off("component_selected", handler);
}

export function stopInspectorPanel(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  if (panelVisible) {
    hidePanel();
    panelVisible = false;
  }
}

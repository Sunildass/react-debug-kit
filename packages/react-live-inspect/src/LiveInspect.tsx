/**
 * LiveInspect — React component that enables the live inspect feature.
 *
 * Wrap your app with <LiveInspect> to enable hover-highlight and click-to-inspect.
 * Only activates in development mode. Activates via Ctrl+Shift+I hotkey.
 */

import { useEffect, useRef, type ReactNode } from "react";
import {
  eventBus,
  hotkeyManager,
  destroyOverlay,
  hideHighlight,
  hidePanel,
} from "react-debug-kit";
import { startMouseTracking, stopMouseTracking } from "./mouse-tracker";
import { startHighlightOverlay, stopHighlightOverlay } from "./highlight-overlay";
import { startInspectorPanel, stopInspectorPanel } from "./inspector-panel";

interface LiveInspectProps {
  children: ReactNode;
  /** Start with inspect mode enabled. Default: false */
  defaultEnabled?: boolean;
}

export function LiveInspect({ children, defaultEnabled = false }: LiveInspectProps): ReactNode {
  const inspectActiveRef = useRef(false);

  useEffect(() => {
    // Guard: only run in development
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    hotkeyManager.init();

    function enableInspect(): void {
      if (inspectActiveRef.current) return;
      inspectActiveRef.current = true;
      startMouseTracking();
      startHighlightOverlay();
      startInspectorPanel();
    }

    function disableInspect(): void {
      if (!inspectActiveRef.current) return;
      inspectActiveRef.current = false;
      stopMouseTracking();
      stopHighlightOverlay();
      stopInspectorPanel();
      hideHighlight();
      hidePanel();
    }

    function toggleInspect(): void {
      if (inspectActiveRef.current) {
        disableInspect();
      } else {
        enableInspect();
      }
    }

    // Listen for the hotkey toggle event
    eventBus.on("toggle_inspect_mode", toggleInspect);

    // Optionally start enabled
    if (defaultEnabled) {
      enableInspect();
    }

    return () => {
      disableInspect();
      eventBus.off("toggle_inspect_mode", toggleInspect);
      hotkeyManager.destroy();
      destroyOverlay();
    };
  }, [defaultEnabled]);

  return children;
}

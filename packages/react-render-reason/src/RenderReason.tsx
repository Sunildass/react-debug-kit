/**
 * RenderReason — React component that enables render reason tracking.
 *
 * Wrap your app with <RenderReason> to activate render flash overlays.
 * Only activates in development mode.
 */

import { useEffect, type ReactNode } from "react";
import { startRenderFlash, stopRenderFlash } from "./render-flash";

interface RenderReasonProps {
  children: ReactNode;
  /** Enable render flash overlays. Default: true */
  showFlash?: boolean;
}

export function RenderReason({ children, showFlash = true }: RenderReasonProps): ReactNode {
  useEffect(() => {
    // Guard: only run in development
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    if (showFlash) {
      startRenderFlash();
    }

    return () => {
      stopRenderFlash();
    };
  }, [showFlash]);

  return children;
}

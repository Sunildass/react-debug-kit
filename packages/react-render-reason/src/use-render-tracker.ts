/**
 * useRenderTracker — Hook that tracks why a component re-rendered.
 *
 * On each render, compares current props/state against the previous snapshot
 * stored in a ref. Emits a `component_rerender` event with the detected reason.
 */

import { useRef, useEffect } from "react";
import { eventBus } from "react-debug-kit";
import { getChangedKeys } from "./shallow-diff";

export interface RenderInfo {
  componentName: string;
  renderCount: number;
  changedProps: string[];
  changedState: boolean;
  reason: "props" | "state" | "context-or-parent" | "multiple";
}

/**
 * Track re-renders for a component.
 *
 * @param componentName - Display name of the component
 * @param props - Current props object
 * @param stateValues - Optional object of named state values to track (e.g. `{ count, name }`)
 * @param targetRef - Optional ref to the component's root DOM element (for flash overlay)
 */
export function useRenderTracker(
  componentName: string,
  props: Record<string, unknown>,
  stateValues?: Record<string, unknown>,
  targetRef?: React.RefObject<HTMLElement | null>
): RenderInfo | null {
  const prevPropsRef = useRef<Record<string, unknown> | null>(null);
  const prevStateRef = useRef<Record<string, unknown> | null>(null);
  const renderCountRef = useRef(0);
  const renderInfoRef = useRef<RenderInfo | null>(null);

  // Increment render count
  renderCountRef.current += 1;
  const isFirstRender = prevPropsRef.current === null;

  let info: RenderInfo | null = null;

  if (!isFirstRender) {
    // Diff props
    const changedProps = getChangedKeys(prevPropsRef.current, props);

    // Diff state
    const changedStateKeys = stateValues
      ? getChangedKeys(prevStateRef.current, stateValues)
      : [];
    const changedState = changedStateKeys.length > 0;

    // Determine reason
    let reason: RenderInfo["reason"];
    if (changedProps.length > 0 && changedState) {
      reason = "multiple";
    } else if (changedProps.length > 0) {
      reason = "props";
    } else if (changedState) {
      reason = "state";
    } else {
      reason = "context-or-parent";
    }

    info = {
      componentName,
      renderCount: renderCountRef.current,
      changedProps,
      changedState,
      reason,
    };
  }

  renderInfoRef.current = info;

  // Update refs to current values
  prevPropsRef.current = { ...props };
  prevStateRef.current = stateValues ? { ...stateValues } : null;

  // Emit event — useEffect is always called (no conditional hooks)
  useEffect(() => {
    const currentInfo = renderInfoRef.current;
    if (!currentInfo) return; // first render, nothing to report

    const element = targetRef?.current ?? undefined;

    eventBus.emit("component_rerender", {
      componentName: currentInfo.componentName,
      count: currentInfo.renderCount,
      changedProps: currentInfo.changedProps,
      changedState: currentInfo.changedState,
      reason: currentInfo.reason,
      element,
    });

    // Console output for debugging
    const reasonParts: string[] = [];
    if (currentInfo.changedProps.length > 0) {
      reasonParts.push(`props changed: [${currentInfo.changedProps.join(", ")}]`);
    }
    if (currentInfo.changedState) {
      reasonParts.push("state changed");
    }
    if (reasonParts.length === 0) {
      reasonParts.push("context or parent re-render");
    }

    console.log(
      `%c[RenderReason] %c<${currentInfo.componentName}>%c render #${currentInfo.renderCount}: ${reasonParts.join(", ")}`,
      "color: #f59e0b; font-weight: bold;",
      "color: #89b4fa; font-weight: bold;",
      "color: #cdd6f4;"
    );
  });

  return info;
}

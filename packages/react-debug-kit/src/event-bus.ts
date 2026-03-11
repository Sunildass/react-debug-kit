/**
 * Event Bus — Central pub/sub system for inter-module communication.
 *
 * All modules communicate through this event bus to stay decoupled.
 */

export type EventCallback<T = unknown> = (payload: T) => void;

export interface EventMap {
  component_hover: { element: HTMLElement; fiber: unknown | null };
  component_selected: { element: HTMLElement; fiber: unknown | null };
  component_rerender: {
    componentName: string;
    count: number;
    changedProps: string[];
    changedState: boolean;
    reason: "props" | "state" | "context-or-parent" | "multiple";
    element?: HTMLElement;
  };
  layout_issue_detected: {
    element: HTMLElement;
    issue: string;
    type: "overflow" | "clipped" | "spacing";
    direction?: "horizontal" | "vertical" | "both";
  };
  layout_scan_complete: {
    flexCount: number;
    gridCount: number;
    overflowCount: number;
    totalScanned: number;
  };
  suspense_fallback_started: {
    boundaryId: string;
    componentName: string;
    startTime: number;
  };
  suspense_resolved: {
    boundaryId: string;
    componentName: string;
    startTime: number;
    endTime: number;
    duration: number;
  };
  suspense_waterfall_detected: {
    boundaries: Array<{
      boundaryId: string;
      componentName: string;
      startTime: number;
      endTime: number;
      duration: number;
    }>;
  };
  toggle_debug_panel: void;
  toggle_inspect_mode: void;
  [key: string]: unknown;
}

class EventBus {
  private listeners: Map<string, Set<EventCallback<any>>> = new Map();

  on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set());
    }
    this.listeners.get(event as string)!.add(callback);
  }

  off<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    const set = this.listeners.get(event as string);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(event as string);
      }
    }
  }

  emit<K extends keyof EventMap>(event: K, payload?: EventMap[K]): void {
    const set = this.listeners.get(event as string);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[react-debug-kit] EventBus error in "${String(event)}" handler:`, err);
        }
      });
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

/** Singleton event bus instance shared across all modules. */
export const eventBus = new EventBus();

export { EventBus };

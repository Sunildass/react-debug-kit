/**
 * Fiber Inspector — Extract React component information from DOM elements.
 *
 * Uses React's internal fiber tree (via __REACT_DEVTOOLS_GLOBAL_HOOK__
 * and __reactFiber$ DOM properties) to resolve component names, props, and state.
 */

export interface ComponentInfo {
  name: string;
  props: Record<string, unknown>;
  state: unknown;
  hooks: unknown[] | null;
}

/**
 * Finds the React fiber node associated with a DOM element.
 * React attaches fiber references to DOM nodes via keys prefixed with `__reactFiber$`.
 */
export function getFiberFromElement(element: HTMLElement): any | null {
  // React 18+ attaches fibers via __reactFiber$<random> key
  const fiberKey = Object.keys(element).find((key) => key.startsWith("__reactFiber$"));
  if (fiberKey) {
    return (element as any)[fiberKey] ?? null;
  }

  // Fallback: older React internals key
  const internalKey = Object.keys(element).find((key) =>
    key.startsWith("__reactInternalInstance$")
  );
  if (internalKey) {
    return (element as any)[internalKey] ?? null;
  }

  return null;
}

/**
 * Walks up the fiber tree to find the nearest function/class component
 * (skips HostComponent fibers which represent DOM nodes).
 */
export function findNearestComponentFiber(fiber: any): any | null {
  let current = fiber;
  while (current) {
    // FunctionComponent = 0, ClassComponent = 1, ForwardRef = 11, MemoComponent = 14, SimpleMemoComponent = 15
    if (
      typeof current.type === "function" ||
      (typeof current.type === "object" && current.type !== null)
    ) {
      return current;
    }
    current = current.return;
  }
  return null;
}

/**
 * Extracts human-readable component information from a fiber node.
 */
export function getComponentInfo(fiber: any): ComponentInfo {
  const type = fiber.type;
  let name = "Unknown";

  if (typeof type === "string") {
    name = type; // HostComponent (e.g. "div")
  } else if (typeof type === "function") {
    name = type.displayName || type.name || "Anonymous";
  } else if (typeof type === "object" && type !== null) {
    // ForwardRef, Memo wrapper, etc.
    const innerType = type.render || type.type || type;
    name =
      type.displayName ||
      (typeof innerType === "function"
        ? innerType.displayName || innerType.name
        : null) ||
      "Anonymous";
  }

  const props = fiber.memoizedProps ?? {};
  const state = fiber.memoizedState ?? null;

  // Attempt to extract hooks (linked-list in memoizedState for function components)
  let hooks: unknown[] | null = null;
  if (typeof fiber.type === "function" && fiber.memoizedState) {
    hooks = [];
    let hookNode = fiber.memoizedState;
    while (hookNode) {
      hooks.push(hookNode.memoizedState);
      hookNode = hookNode.next;
    }
  }

  return { name, props, state, hooks };
}

/**
 * Convenience: given a DOM element, resolve the nearest React component info.
 */
export function inspectElement(element: HTMLElement): ComponentInfo | null {
  const fiber = getFiberFromElement(element);
  if (!fiber) return null;

  const componentFiber = findNearestComponentFiber(fiber);
  if (!componentFiber) return null;

  return getComponentInfo(componentFiber);
}

// ─── Suspense Boundary Detection ────────────────────────────

/** Tag value for SuspenseComponent in React's fiber internals. */
const SUSPENSE_COMPONENT_TAG = 13;

export interface SuspenseBoundaryInfo {
  fiber: any;
  isSuspended: boolean;
  componentName: string;
  /** The closest DOM element inside this boundary (for overlay positioning). */
  nearestElement: HTMLElement | null;
}

/**
 * Walk the fiber tree from a root DOM element and collect all Suspense boundaries.
 */
export function findSuspenseBoundaries(rootElement: HTMLElement): SuspenseBoundaryInfo[] {
  const rootFiber = getFiberFromElement(rootElement);
  if (!rootFiber) return [];

  const boundaries: SuspenseBoundaryInfo[] = [];
  const visited = new Set<any>();

  function walk(fiber: any): void {
    if (!fiber || visited.has(fiber)) return;
    visited.add(fiber);

    if (fiber.tag === SUSPENSE_COMPONENT_TAG) {
      // memoizedState !== null means the boundary is currently showing fallback
      const isSuspended = fiber.memoizedState !== null;

      // Find the nearest DOM element for positioning
      let nearestElement: HTMLElement | null = null;
      
      // When suspended, `fiber.memoizedState` represents the fallback state.
      // The actual rendered fallback fiber is typically `fiber.child.sibling` 
      // or `fiber.child` depending on React version, but we just need ANY DOM node
      // rendered by this boundary to attach our overlay to.
      
      const searchForDOM = (node: any, depth = 0): HTMLElement | null => {
        if (!node || depth > 20) return null;
        if (node.stateNode instanceof HTMLElement) return node.stateNode;
        
        let found = searchForDOM(node.child, depth + 1);
        if (found) return found;
        
        return searchForDOM(node.sibling, depth);
      };

      // In React 18, the child is often an Offscreen component.
      // The fallback is usually a sibling of that child.
      let searchRoot = fiber.child;
      if (isSuspended && fiber.child && fiber.child.sibling) {
        searchRoot = fiber.child.sibling;
      }
      
      nearestElement = searchForDOM(searchRoot);
      
      // If we still haven't found it, try searching the entire subtree of the Suspense fiber
      if (!nearestElement) {
        nearestElement = searchForDOM(fiber.child);
      }

      // Try to get a meaningful name from the parent component
      const parentComponent = findNearestComponentFiber(fiber.return);
      const componentName = parentComponent
        ? getComponentInfo(parentComponent).name
        : "Suspense";

      boundaries.push({
        fiber,
        isSuspended,
        componentName: `Suspense(${componentName})`,
        nearestElement,
      });
    }

    // Walk children and siblings
    walk(fiber.child);
    walk(fiber.sibling);
  }

  // Start from the fiber root
  let fiberRoot = rootFiber;
  while (fiberRoot.return) {
    fiberRoot = fiberRoot.return;
  }
  walk(fiberRoot);

  return boundaries;
}


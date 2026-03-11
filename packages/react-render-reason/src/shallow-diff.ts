/**
 * Shallow Diff — Compares two objects and returns the list of keys that changed.
 *
 * Uses strict equality (===) for comparison. This is intentionally shallow
 * to keep the performance overhead minimal during renders.
 */

export interface DiffResult {
  /** Keys whose values changed between prev and next. */
  changedKeys: string[];
  /** Keys present in next but not in prev. */
  addedKeys: string[];
  /** Keys present in prev but not in next. */
  removedKeys: string[];
}

/**
 * Performs a shallow diff between two objects.
 * Returns the list of changed, added, and removed keys.
 */
export function shallowDiff(
  prev: Record<string, unknown> | null | undefined,
  next: Record<string, unknown> | null | undefined
): DiffResult {
  const result: DiffResult = {
    changedKeys: [],
    addedKeys: [],
    removedKeys: [],
  };

  if (!prev && !next) return result;
  if (!prev) {
    result.addedKeys = Object.keys(next!);
    return result;
  }
  if (!next) {
    result.removedKeys = Object.keys(prev);
    return result;
  }

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  const allKeys = new Set([...prevKeys, ...nextKeys]);

  for (const key of allKeys) {
    // Skip children prop to reduce noise
    if (key === "children") continue;

    const inPrev = key in prev;
    const inNext = key in next;

    if (inPrev && inNext) {
      if (prev[key] !== next[key]) {
        result.changedKeys.push(key);
      }
    } else if (inNext && !inPrev) {
      result.addedKeys.push(key);
    } else if (inPrev && !inNext) {
      result.removedKeys.push(key);
    }
  }

  return result;
}

/**
 * Convenience: returns a flat list of all keys that are different.
 */
export function getChangedKeys(
  prev: Record<string, unknown> | null | undefined,
  next: Record<string, unknown> | null | undefined
): string[] {
  const diff = shallowDiff(prev, next);
  return [...diff.changedKeys, ...diff.addedKeys, ...diff.removedKeys];
}

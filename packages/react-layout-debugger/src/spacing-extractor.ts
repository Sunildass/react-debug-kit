/**
 * Spacing Extractor — Reads margin and padding values from computed styles.
 */

export interface ElementSpacing {
  padding: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
}

/**
 * Extract padding and margin values from an element's computed style.
 */
export function extractSpacing(element: HTMLElement): ElementSpacing {
  const style = getComputedStyle(element);

  return {
    padding: {
      top: parseFloat(style.paddingTop) || 0,
      right: parseFloat(style.paddingRight) || 0,
      bottom: parseFloat(style.paddingBottom) || 0,
      left: parseFloat(style.paddingLeft) || 0,
    },
    margin: {
      top: parseFloat(style.marginTop) || 0,
      right: parseFloat(style.marginRight) || 0,
      bottom: parseFloat(style.marginBottom) || 0,
      left: parseFloat(style.marginLeft) || 0,
    },
  };
}

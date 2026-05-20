/** SVG circle morph data (viewBox 1920×1080), matches original CodePen logic. */
const D = 80;
const CX = 960;
const CY = 540;

export type CircleTransitionConfig = {
  initial: { cx: number; cy: number; r: number };
  final: { cx: number; cy: number; r: number };
};

export const CIRCLE_TRANSITIONS: CircleTransitionConfig[] = [
  { initial: { cx: CX - 3 * D, cy: CY, r: D * 0.8 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX + 3 * D, cy: CY, r: D * 0.8 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX, cy: CY - 3 * D, r: D * 0.8 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX, cy: CY + 3 * D, r: D * 0.8 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX - 2 * D, cy: CY - 2 * D, r: D * 0.6 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX + 2 * D, cy: CY - 2 * D, r: D * 0.6 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX - 2 * D, cy: CY + 2 * D, r: D * 0.6 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX + 2 * D, cy: CY + 2 * D, r: D * 0.6 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX - 4 * D, cy: CY, r: D * 0.4 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX + 4 * D, cy: CY, r: D * 0.4 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX, cy: CY - 4 * D, r: D * 0.4 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX, cy: CY + 4 * D, r: D * 0.4 }, final: { cx: CX, cy: CY, r: 4 * D } },
  { initial: { cx: CX, cy: CY, r: D * 0.3 }, final: { cx: CX, cy: CY, r: 4 * D } },
];

export const GRID_INDICES_V = Array.from({ length: 41 }, (_, i) => i);
export const GRID_INDICES_H = Array.from({ length: 23 }, (_, i) => i);
export const GRID_SPACING = 48;

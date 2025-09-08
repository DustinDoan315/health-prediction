/**
 * Spacing system for consistent layout
 * Based on 4px grid system
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export type SpacingKey = keyof typeof Spacing;

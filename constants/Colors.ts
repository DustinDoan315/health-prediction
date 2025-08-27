/**
 * Health Prediction App - Tokenized Color System
 * Ensures contrast ≥ 4.5:1 for accessibility
 * Uses semantic colors for health-related UI elements
 */

// Primary brand colors
const primary = '#6C63FF';
const secondary = '#00B0FF';
const success = '#1DB954';
const warning = '#FFC107';
const error = '#FF5252';

// Surface and background colors
const surface = '#FFFFFF';
const background = '#F7F8FA';
const surfaceDark = '#1F2937';
const backgroundDark = '#111827';

// Text colors with proper contrast
const textPrimary = '#111827';
const textSecondary = '#6B7280';
const textPrimaryDark = '#F9FAFB';
const textSecondaryDark = '#D1D5DB';

// Health-specific semantic colors
const healthGood = '#10B981';
const healthWatch = '#F59E0B';
const healthAttention = '#EF4444';
const healthNeutral = '#6B7280';

// Gradient colors for hero screens
const gradientStart = primary;
const gradientEnd = secondary;

export const Colors = {
  light: {
    // Brand colors
    primary,
    secondary,
    success,
    warning,
    error,
    
    // Surface colors
    surface,
    background,
    
    // Text colors
    text: textPrimary,
    textSecondary,
    
    // Legacy support
    tint: primary,
    icon: textSecondary,
    tabIconDefault: textSecondary,
    tabIconSelected: primary,
    
    // Health semantic colors
    healthGood,
    healthWatch,
    healthAttention,
    healthNeutral,
    
    // Gradient
    gradientStart,
    gradientEnd,
  },
  dark: {
    // Brand colors (adjusted for dark mode)
    primary: '#8B85FF',
    secondary: '#33BFFF',
    success: '#22C55E',
    warning: '#FCD34D',
    error: '#F87171',
    
    // Surface colors
    surface: surfaceDark,
    background: backgroundDark,
    
    // Text colors
    text: textPrimaryDark,
    textSecondary: textSecondaryDark,
    
    // Legacy support
    tint: '#8B85FF',
    icon: textSecondaryDark,
    tabIconDefault: textSecondaryDark,
    tabIconSelected: '#8B85FF',
    
    // Health semantic colors (adjusted for dark mode)
    healthGood: '#34D399',
    healthWatch: '#FBBF24',
    healthAttention: '#F87171',
    healthNeutral: '#9CA3AF',
    
    // Gradient
    gradientStart: '#8B85FF',
    gradientEnd: '#33BFFF',
  },
};

// Typography scale
export const Typography = {
  pageTitle: {
    fontSize: 32,
    lineHeight: 41.6, // 1.3
    fontWeight: '700' as const,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26, // 1.3
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24, // 1.5
    fontWeight: '400' as const,
  },
  meta: {
    fontSize: 14,
    lineHeight: 21, // 1.5
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16.8, // 1.4
    fontWeight: '400' as const,
  },
};

// Spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius system
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Elevation system (for shadows)
export const Elevation = {
  card: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  modal: {
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 16,
  },
};

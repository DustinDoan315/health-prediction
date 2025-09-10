
export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 41.6, // 1.3
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 31.2, // 1.3
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 26, // 1.3
    fontWeight: '600' as const,
  },
  h4: {
    fontSize: 18,
    lineHeight: 23.4, // 1.3
    fontWeight: '600' as const,
  },
  h5: {
    fontSize: 16,
    lineHeight: 20.8, // 1.3
    fontWeight: '600' as const,
  },
  h6: {
    fontSize: 14,
    lineHeight: 18.2, // 1.3
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 18, // 1.25
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16.8, // 1.4
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    lineHeight: 20, // 1.25
    fontWeight: '600' as const,
  },
  // Medical-grade numeric display
  numeric: {
    fontSize: 28,
    lineHeight: 36.4, // 1.3
    fontWeight: '700' as const,
  },
  numericLarge: {
    fontSize: 36,
    lineHeight: 46.8, // 1.3
    fontWeight: '700' as const,
  },
  pageTitle: {
    fontSize: 28,
    lineHeight: 36.4, // 1.3
    fontWeight: '700' as const,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26, // 1.3
    fontWeight: '600' as const,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16.8, // 1.4
    fontWeight: '400' as const,
  },
} as const;

export type TypographyKey = keyof typeof Typography;

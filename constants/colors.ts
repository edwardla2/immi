export const Colors = {
  // Backgrounds
  bg: '#070B14', // Deep space navy — primary background
  bgCard: 'rgba(255, 255, 255, 0.05)', // Glass card surface
  bgCardHover: 'rgba(255, 255, 255, 0.08)',
  bgInput: 'rgba(255, 255, 255, 0.07)',
  bgSheet: '#0D1320', // Slightly lighter for bottom sheets

  // Accent — trust blue (not corporate, not cold)
  accent: '#4F8EF7', // Primary accent — warm blue
  accentMuted: 'rgba(79, 142, 247, 0.15)',
  accentGlow: 'rgba(79, 142, 247, 0.25)',

  // Status colors
  success: '#34D399', // Green
  successMuted: 'rgba(52, 211, 153, 0.15)',
  warning: '#FBBF24', // Amber
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  danger: '#F87171', // Red
  dangerMuted: 'rgba(248, 113, 113, 0.15)',

  // Text
  textPrimary: '#F0F4FF', // Near white with slight blue tint
  textSecondary: 'rgba(240, 244, 255, 0.55)',
  textMuted: 'rgba(240, 244, 255, 0.35)',
  textDisabled: 'rgba(240, 244, 255, 0.2)',

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  borderFocus: 'rgba(79, 142, 247, 0.5)',

  // Gradients (defined as arrays for LinearGradient)
  gradientAccent: ['#4F8EF7', '#7C3AED'] as const,
  gradientCard: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)'] as const,
} as const;

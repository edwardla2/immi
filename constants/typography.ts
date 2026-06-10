import { TextStyle } from 'react-native';

// All Space Grotesk. Font family names match @expo-google-fonts/space-grotesk keys.
export const Fonts = {
  light: 'SpaceGrotesk_300Light',
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semibold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
} as const;

export const Typography = {
  // Display
  displayXL: { fontFamily: Fonts.bold, fontSize: 40, lineHeight: 48, letterSpacing: -1.5 },
  displayL: { fontFamily: Fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -1 },
  displayM: { fontFamily: Fonts.semibold, fontSize: 26, lineHeight: 32, letterSpacing: -0.5 },

  // Headings
  h1: { fontFamily: Fonts.semibold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  h2: { fontFamily: Fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  h3: { fontFamily: Fonts.medium, fontSize: 16, lineHeight: 22 },

  // Body
  bodyL: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyM: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 21 },
  bodyS: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 19 },

  // UI
  labelL: { fontFamily: Fonts.medium, fontSize: 15, lineHeight: 20, letterSpacing: 0.1 },
  labelM: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18, letterSpacing: 0.1 },
  labelS: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Chat specific
  chatUser: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22 },
  chatAssistant: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 23 },
} satisfies Record<string, TextStyle>;

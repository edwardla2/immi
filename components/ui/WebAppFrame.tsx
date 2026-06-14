import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Colors } from '@/constants/colors';

/** Phone-like column width the web app is constrained to on large screens. */
export const WEB_MAX_WIDTH = 480;

/**
 * Soft brand backdrop behind the app column on desktop — a faint teal-navy at the
 * top easing into the deep background, so the centered column reads as a
 * deliberate "app surface" rather than an accident of max-width.
 */
const BACKDROP = ['#0D1A2B', '#070D18'] as const;

/**
 * On web, constrains the app to a centered phone-width column. On large screens
 * the column sits as an intentional surface on a subtle gradient backdrop with a
 * gentle border + shadow; on mobile-width viewports it's full-bleed with no
 * backdrop, identical to a phone. On native this is a pass-through.
 *
 * Purely visual and static — no animation is introduced, so there's nothing for
 * prefers-reduced-motion to suppress.
 */
export function WebAppFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return <>{children}</>;

  const framed = width > WEB_MAX_WIDTH;

  // Mobile-width web: full-bleed, no backdrop. Unchanged from a phone.
  if (!framed) {
    return (
      <View style={styles.outer}>
        <View style={styles.frame}>{children}</View>
      </View>
    );
  }

  // Desktop web: deliberate centered app surface on the brand backdrop.
  return (
    <LinearGradient colors={BACKDROP} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.outer}>
      <View style={[styles.frame, styles.framedSurface]}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: WEB_MAX_WIDTH,
  },
  framedSurface: {
    backgroundColor: Colors.bg,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.borderLight,
    // Lift the column off the backdrop. Top/bottom meet the viewport edges, so
    // in practice this reads as a soft glow down the left/right seams.
    ...Platform.select({
      web: { boxShadow: '0 0 80px rgba(2, 6, 16, 0.55)' },
    }),
  },
});

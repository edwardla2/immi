import { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Colors } from '@/constants/colors';

/** Phone-like column width the web app is constrained to on large screens. */
export const WEB_MAX_WIDTH = 480;

/**
 * On web, constrains the app to a centered phone-width column so desktop
 * browsers don't stretch phone-first layouts edge to edge. On native this is
 * a pass-through and renders nothing extra.
 */
export function WebAppFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return <>{children}</>;

  const framed = width > WEB_MAX_WIDTH;
  return (
    <View style={styles.outer}>
      <View style={[styles.frame, framed && styles.framedEdges]}>{children}</View>
    </View>
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
  framedEdges: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
});

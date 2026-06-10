import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';

interface ScreenProps {
  children: ReactNode;
  padded?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
}

/** Full-bleed dark screen with safe-area handling and optional horizontal padding. */
export function Screen({
  children,
  padded = true,
  edges = ['top', 'bottom'],
  style,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[styles.content, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: Spacing.xl,
  },
});

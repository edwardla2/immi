import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/layout';

interface GlassCardProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  padding?: number;
  borderRadius?: number;
  /** Style for the inner content wrapper — e.g. { flex: 1 } when the card must bound a ScrollView. */
  contentStyle?: ViewStyle;
}

/**
 * A blurred glass surface. BlurView (dark tint) + a faint white overlay, with a
 * top-left light edge for a subtle liquid-glass feel.
 */
export function GlassCard({
  children,
  style,
  intensity = 20,
  padding = 16,
  borderRadius = Radius.xl,
  contentStyle,
}: GlassCardProps) {
  return (
    <View style={[styles.wrapper, { borderRadius }, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.overlay, { borderRadius }]} />
      <View style={[styles.edge, { borderRadius }]} pointerEvents="none" />
      <View style={[{ padding }, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  overlay: {
    backgroundColor: Colors.bgCard,
  },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});

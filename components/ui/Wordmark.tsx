import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface WordmarkProps {
  size?: 'lg' | 'xl';
  withGlow?: boolean;
}

/** The Immi wordmark with an optional soft accent glow behind it. */
export function Wordmark({ size = 'xl', withGlow = true }: WordmarkProps) {
  return (
    <View style={styles.container}>
      {withGlow ? <View style={styles.glow} /> : null}
      <Text style={size === 'xl' ? styles.xl : styles.lg}>Immi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 120,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentGlow,
    opacity: 0.6,
  },
  xl: {
    ...Typography.displayXL,
    color: Colors.textPrimary,
  },
  lg: {
    ...Typography.displayL,
    color: Colors.textPrimary,
  },
});

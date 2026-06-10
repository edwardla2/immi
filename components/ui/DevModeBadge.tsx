import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { BYPASS_AUTH } from '@/lib/config';

/**
 * Subtle reminder that the auth bypass is active. Renders nothing unless
 * BYPASS_AUTH is true, so it self-removes the moment the flag is flipped off.
 */
export function DevModeBadge() {
  if (!BYPASS_AUTH) return null;

  return (
    <View style={styles.badge} pointerEvents="none">
      <Ionicons name="construct" size={11} color={Colors.warning} />
      <Text style={styles.text}>DEV MODE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.warningMuted,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 4,
  },
  text: {
    ...Typography.labelS,
    color: Colors.warning,
  },
});

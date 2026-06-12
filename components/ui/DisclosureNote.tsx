import { StyleSheet, Text, TextStyle } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

/**
 * The legal-scope disclosure. Shown on first load (sign-in) and in every
 * conversation so users always see it before acting on answers.
 */
export function DisclosureNote({ style }: { style?: TextStyle }) {
  return (
    <Text style={[styles.text, style]}>
      Immi provides general immigration information, not legal advice.
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...Typography.bodyS,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { getVisaShortLabel } from '@/constants/visaTypes';
import { Profile } from '@/lib/types';
import { greeting } from '@/lib/utils';

interface TimelineHeaderProps {
  profile: Profile | null;
}

export function TimelineHeader({ profile }: TimelineHeaderProps) {
  const name = profile?.name?.split(' ')[0] || 'there';
  const visa = getVisaShortLabel(profile?.visa_type);
  const stage = profile?.current_stage;
  const statusLine = stage ? `${visa} · ${stage}` : visa;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {greeting()}, {name}
      </Text>
      <Text style={styles.status}>{statusLine}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.displayM,
    color: Colors.textPrimary,
  },
  status: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});

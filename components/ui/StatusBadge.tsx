import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';

type BadgeStatus = 'pending' | 'completed' | 'overdue' | 'urgent' | 'needed' | 'in_progress' | 'complete' | 'low' | 'medium' | 'high';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
}

const CONFIG: Record<BadgeStatus, { color: string; bg: string; label: string }> = {
  pending: { color: Colors.warning, bg: Colors.warningMuted, label: 'Pending' },
  completed: { color: Colors.success, bg: Colors.successMuted, label: 'Completed' },
  overdue: { color: Colors.danger, bg: Colors.dangerMuted, label: 'Overdue' },
  urgent: { color: Colors.danger, bg: Colors.dangerMuted, label: 'Urgent' },
  needed: { color: Colors.warning, bg: Colors.warningMuted, label: 'Needed' },
  in_progress: { color: Colors.accent, bg: Colors.accentMuted, label: 'In progress' },
  complete: { color: Colors.success, bg: Colors.successMuted, label: 'Complete' },
  low: { color: Colors.textSecondary, bg: Colors.bgInput, label: 'Low' },
  medium: { color: Colors.accent, bg: Colors.accentMuted, label: 'Medium' },
  high: { color: Colors.warning, bg: Colors.warningMuted, label: 'High' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{label ?? config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    marginRight: Spacing.xs + 2,
  },
  label: {
    ...Typography.labelS,
  },
});

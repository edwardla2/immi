import { Ionicons } from '@expo/vector-icons';
import { impact, ImpactStyle } from '@/lib/haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { Deadline } from '@/lib/types';
import { deadlineUrgency, formatDueDate, Urgency } from '@/lib/utils';

interface DeadlineCardProps {
  deadline: Deadline;
  onPress: () => void;
  onToggleComplete: () => void;
}

const URGENCY_COLOR: Record<Urgency, string> = {
  overdue: Colors.danger,
  urgent: Colors.danger,
  soon: Colors.warning,
  normal: Colors.textSecondary,
  none: Colors.textMuted,
};

export function DeadlineCard({ deadline, onPress, onToggleComplete }: DeadlineCardProps) {
  const { label, urgency } = deadlineUrgency(deadline.due_date);
  const isComplete = deadline.status === 'completed';

  const handleToggle = () => {
    impact(ImpactStyle.Light);
    onToggleComplete();
  };

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <GlassCard padding={Spacing.lg} borderRadius={Radius.lg}>
        <View style={styles.row}>
          <Pressable onPress={handleToggle} hitSlop={8} style={styles.checkWrap}>
            <Ionicons
              name={isComplete ? 'checkmark-circle' : 'ellipse-outline'}
              size={26}
              color={isComplete ? Colors.success : Colors.textMuted}
            />
          </Pressable>
          <View style={styles.textCol}>
            <Text
              style={[styles.title, isComplete && styles.titleComplete]}
              numberOfLines={1}
            >
              {deadline.title}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.dueDate}>{formatDueDate(deadline.due_date)}</Text>
              {!isComplete ? (
                <Text style={[styles.urgency, { color: URGENCY_COLOR[urgency] }]}> · {label}</Text>
              ) : null}
            </View>
          </View>
          <StatusBadge status={deadline.priority} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkWrap: {
    marginRight: Spacing.md,
  },
  textCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.labelL,
    color: Colors.textPrimary,
  },
  titleComplete: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDate: {
    ...Typography.bodyS,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  urgency: {
    ...Typography.labelM,
  },
});

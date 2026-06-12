import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DeadlineCard } from '@/components/timeline/DeadlineCard';
import { DeadlineSheet } from '@/components/timeline/DeadlineSheet';
import { TimelineHeader } from '@/components/timeline/TimelineHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { showAlert } from '@/lib/alert';
import { Colors } from '@/constants/colors';
import { Radius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { useConversations } from '@/hooks/useConversations';
import { useDeadlines } from '@/hooks/useDeadlines';
import { useDocuments } from '@/hooks/useDocuments';
import { useProfile } from '@/hooks/useProfile';
import { Deadline } from '@/lib/types';
import { deadlineUrgency } from '@/lib/utils';

export default function Timeline() {
  const router = useRouter();
  const { profile } = useProfile();
  const { deadlines, create, update, remove, refresh } = useDeadlines();
  const { documents, refresh: refreshDocs } = useDocuments();
  const { create: createConversation } = useConversations();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editing, setEditing] = useState<Deadline | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshDocs();
    }, [refresh, refreshDocs])
  );

  const pending = deadlines.filter((d) => d.status !== 'completed');
  const docsNeeded = documents.filter((d) => d.status !== 'complete').length;

  const nextAction = useMemo(() => {
    const dated = pending
      .filter((d) => d.due_date)
      .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1));
    if (dated.length === 0) return null;
    return deadlineUrgency(dated[0].due_date);
  }, [pending]);

  const openNew = () => {
    setEditing(null);
    setSheetVisible(true);
  };

  const openEdit = (deadline: Deadline) => {
    setEditing(deadline);
    setSheetVisible(true);
  };

  const handleSave = async (data: {
    title: string;
    due_date: string | null;
    priority: Deadline['priority'];
  }) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
  };

  const toggleComplete = (deadline: Deadline) => {
    update(deadline.id, { status: deadline.status === 'completed' ? 'pending' : 'completed' });
  };

  const askQuestion = async () => {
    const { data, error } = await createConversation();
    if (data) {
      router.push(`/conversation/${data.id}`);
    } else {
      showAlert('Could not start a conversation', error ?? 'Please try again.');
    }
  };

  const findForm = async () => {
    const { data, error } = await createConversation();
    if (data) {
      router.push(`/conversation/${data.id}?prefill=form`);
    } else {
      showAlert('Could not start a conversation', error ?? 'Please try again.');
    }
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={styles.flex}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          <TimelineHeader profile={profile} />
        </Animated.View>

        <View style={styles.statsRow}>
          <StatCard
            icon="alert-circle-outline"
            value={String(pending.length)}
            label="Deadlines"
            tint={pending.length > 0 ? Colors.warning : Colors.textSecondary}
          />
          <StatCard
            icon="document-text-outline"
            value={String(docsNeeded)}
            label="Docs needed"
            tint={docsNeeded > 0 ? Colors.accent : Colors.textSecondary}
          />
          <StatCard
            icon="time-outline"
            value={nextAction ? nextAction.label.replace('in ', '') : '—'}
            label={nextAction ? 'Next action' : 'Nothing urgent'}
            tint={nextAction ? Colors.danger : Colors.success}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          <Pressable onPress={openNew} style={styles.addLink} hitSlop={8}>
            <Ionicons name="add" size={18} color={Colors.accent} />
            <Text style={styles.addLinkText}>Add</Text>
          </Pressable>
        </View>

        {deadlines.length === 0 ? (
          <GlassCard padding={Spacing.xxl} style={styles.emptyCard}>
            <View style={styles.emptyInner}>
              <Ionicons name="calendar-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No deadlines yet</Text>
              <Text style={styles.emptyBody}>
                As you navigate your process, add important dates here.
              </Text>
            </View>
          </GlassCard>
        ) : (
          deadlines.map((deadline, index) => (
            <Animated.View key={deadline.id} entering={FadeInDown.delay(index * 40).duration(300)}>
              <DeadlineCard
                deadline={deadline}
                onPress={() => openEdit(deadline)}
                onToggleComplete={() => toggleComplete(deadline)}
              />
            </Animated.View>
          ))
        )}

        <Text style={[styles.sectionTitle, styles.quickTitle]}>Quick Actions</Text>
        <View style={styles.quickRow}>
          <QuickAction icon="chatbubble-ellipses-outline" label="Ask a question" onPress={askQuestion} />
          <QuickAction
            icon="open-outline"
            label="Check USCIS status"
            onPress={() => Linking.openURL('https://egov.uscis.gov/casestatus')}
          />
          <QuickAction icon="search-outline" label="Find your form" onPress={findForm} />
        </View>
      </ScrollView>

      <DeadlineSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSave={handleSave}
        onDelete={editing ? () => remove(editing.id) : undefined}
        editing={editing}
      />
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  tint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  tint: string;
}) {
  return (
    <GlassCard padding={Spacing.md} borderRadius={Radius.lg} style={styles.statCard}>
      <Ionicons name={icon} size={20} color={tint} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </GlassCard>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.quickAction}>
      <GlassCard padding={Spacing.md} borderRadius={Radius.lg} style={styles.quickCard}>
        <View style={styles.quickIcon}>
          <Ionicons name={icon} size={20} color={Colors.accent} />
        </View>
        <Text style={styles.quickLabel}>{label}</Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  statCard: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statValue: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  statLabel: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addLinkText: {
    ...Typography.labelM,
    color: Colors.accent,
  },
  emptyCard: {
    marginBottom: Spacing.lg,
  },
  emptyInner: {
    alignItems: 'center',
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptyBody: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  quickTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickAction: {
    flex: 1,
  },
  quickCard: {
    minHeight: 110,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  quickLabel: {
    ...Typography.labelM,
    color: Colors.textPrimary,
  },
});

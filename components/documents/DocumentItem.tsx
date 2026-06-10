import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { Document, DocumentStatus } from '@/lib/types';

interface DocumentItemProps {
  document: Document;
  onCycleStatus: () => void;
  onPress: () => void;
  onDelete: () => void;
}

const STATUS_META: Record<DocumentStatus, { color: string; label: string }> = {
  needed: { color: Colors.warning, label: 'Needed' },
  in_progress: { color: Colors.accent, label: 'In progress' },
  complete: { color: Colors.success, label: 'Complete' },
};

export function DocumentItem({ document, onCycleStatus, onPress, onDelete }: DocumentItemProps) {
  const swipeRef = useRef<SwipeableMethods>(null);
  const meta = STATUS_META[document.status];

  const handleCycle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCycleStatus();
  };

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteAction}
      onPress={() => {
        swipeRef.current?.close();
        onDelete();
      }}
    >
      <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
    </Pressable>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
    >
      <Pressable onPress={onPress}>
        <GlassCard padding={Spacing.lg} borderRadius={Radius.lg}>
          <View style={styles.row}>
            <Pressable onPress={handleCycle} hitSlop={8} style={styles.statusDotWrap}>
              <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
            </Pressable>
            <View style={styles.textCol}>
              <Text style={styles.name} numberOfLines={1}>
                {document.name}
              </Text>
              <Text style={[styles.status, { color: meta.color }]}>{meta.label}</Text>
            </View>
            <Pressable onPress={handleCycle} hitSlop={8}>
              <Ionicons name="sync-outline" size={18} color={Colors.textMuted} />
            </Pressable>
          </View>
        </GlassCard>
      </Pressable>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDotWrap: {
    marginRight: Spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  textCol: {
    flex: 1,
  },
  name: {
    ...Typography.labelL,
    color: Colors.textPrimary,
  },
  status: {
    ...Typography.bodyS,
    marginTop: 2,
  },
  deleteAction: {
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    borderTopRightRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    marginLeft: Spacing.sm,
  },
});

import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '@/components/ui/ModalSheet';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { TextInputField } from '@/components/ui/TextInputField';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { Deadline, DeadlinePriority } from '@/lib/types';

interface DeadlineSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    due_date: string | null;
    priority: DeadlinePriority;
  }) => Promise<void>;
  onDelete?: () => void;
  editing?: Deadline | null;
}

const PRIORITIES: { id: DeadlinePriority; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: Colors.textSecondary },
  { id: 'medium', label: 'Medium', color: Colors.accent },
  { id: 'high', label: 'High', color: Colors.warning },
  { id: 'urgent', label: 'Urgent', color: Colors.danger },
];

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const DATE_PRESETS: { label: string; days: number }[] = [
  { label: 'In 1 week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
  { label: 'In 1 month', days: 30 },
  { label: 'In 3 months', days: 90 },
];

export function DeadlineSheet({
  visible,
  onClose,
  onSave,
  onDelete,
  editing,
}: DeadlineSheetProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<DeadlinePriority>('medium');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setTitle(editing?.title ?? '');
      setDueDate(editing?.due_date ?? '');
      setPriority(editing?.priority ?? 'medium');
      setError(null);
    }
  }, [visible, editing]);

  const setPreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDueDate(toISODate(d));
  };

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      setError('Date must be in YYYY-MM-DD format.');
      return;
    }
    setSaving(true);
    await onSave({ title: title.trim(), due_date: dueDate || null, priority });
    setSaving(false);
    onClose();
  };

  return (
    <ModalSheet visible={visible} onClose={onClose} title={editing ? 'Edit deadline' : 'New deadline'}>
      <View style={styles.field}>
        <TextInputField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. File I-765 for OPT"
          autoCapitalize="sentences"
        />
      </View>

      <View style={styles.field}>
        <TextInputField
          label="Due date (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="2026-09-01"
          keyboardType="numbers-and-punctuation"
        />
        <View style={styles.presets}>
          {DATE_PRESETS.map((preset) => (
            <Pressable
              key={preset.label}
              onPress={() => setPreset(preset.days)}
              style={styles.presetChip}
            >
              <Text style={styles.presetText}>{preset.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.fieldLabel}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => {
          const selected = priority === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setPriority(p.id)}
              style={[
                styles.priorityChip,
                selected && { backgroundColor: p.color, borderColor: p.color },
              ]}
            >
              <Text style={[styles.priorityText, selected && styles.priorityTextSelected]}>
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label={editing ? 'Save changes' : 'Add deadline'}
        onPress={handleSave}
        loading={saving}
        style={styles.save}
      />
      {editing && onDelete ? (
        <SecondaryButton
          label="Delete deadline"
          destructive
          onPress={() => {
            onDelete();
            onClose();
          }}
          style={styles.delete}
        />
      ) : null}
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  presetChip: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetText: {
    ...Typography.labelM,
    color: Colors.textSecondary,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  priorityChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priorityText: {
    ...Typography.labelM,
    color: Colors.textSecondary,
  },
  priorityTextSelected: {
    color: '#FFFFFF',
  },
  error: {
    ...Typography.bodyS,
    color: Colors.danger,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  save: {
    marginTop: Spacing.sm,
  },
  delete: {
    marginTop: Spacing.md,
  },
});

import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '@/components/ui/ModalSheet';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextInputField } from '@/components/ui/TextInputField';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { DocumentCategory } from '@/lib/types';

interface DocumentSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string | null;
    category: DocumentCategory;
  }) => Promise<void>;
}

const CATEGORIES: { id: DocumentCategory; label: string }[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'financial', label: 'Financial' },
  { id: 'employment', label: 'Employment' },
  { id: 'education', label: 'Education' },
  { id: 'legal', label: 'Legal' },
  { id: 'other', label: 'Other' },
];

export function DocumentSheet({ visible, onClose, onSave }: DocumentSheetProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('identity');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName('');
      setDescription('');
      setCategory('identity');
      setError(null);
    }
  }, [visible]);

  const handleSave = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Please enter a document name.');
      return;
    }
    setSaving(true);
    await onSave({ name: name.trim(), description: description.trim() || null, category });
    setSaving(false);
    onClose();
  };

  return (
    <ModalSheet visible={visible} onClose={onClose} title="New document">
      <View style={styles.field}>
        <TextInputField
          label="Document name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Passport, I-20, Bank statement"
          autoCapitalize="sentences"
        />
      </View>

      <Text style={styles.fieldLabel}>Category</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => {
          const selected = category === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[styles.categoryChip, selected && styles.categoryChipSelected]}
            >
              <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.field}>
        <TextInputField
          label="Notes (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Anything to remember about this document"
          autoCapitalize="sentences"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton label="Add document" onPress={handleSave} loading={saving} style={styles.save} />
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.borderFocus,
  },
  categoryText: {
    ...Typography.labelM,
    color: Colors.textSecondary,
  },
  categoryTextSelected: {
    color: Colors.accent,
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
});

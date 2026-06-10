import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '@/components/ui/ModalSheet';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextInputField } from '@/components/ui/TextInputField';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { VISA_TYPES } from '@/constants/visaTypes';
import { Profile, VisaType } from '@/lib/types';

interface ProfileEditSheetProps {
  visible: boolean;
  profile: Profile | null;
  onClose: () => void;
  onSave: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

export function ProfileEditSheet({ visible, profile, onClose, onSave }: ProfileEditSheetProps) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [stage, setStage] = useState('');
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && profile) {
      setName(profile.name ?? '');
      setCountry(profile.country_of_origin ?? '');
      setVisaType(profile.visa_type ?? null);
      setStage(profile.current_stage ?? '');
      setGoal(profile.primary_goal ?? '');
      setError(null);
    }
  }, [visible, profile]);

  const handleSave = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setSaving(true);
    const { error: saveError } = await onSave({
      name: name.trim(),
      country_of_origin: country.trim() || null,
      visa_type: visaType,
      current_stage: stage.trim() || null,
      primary_goal: goal.trim() || null,
    });
    setSaving(false);
    if (saveError) {
      setError(saveError);
      return;
    }
    onClose();
  };

  return (
    <ModalSheet visible={visible} onClose={onClose} title="Edit profile">
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.field}>
          <TextInputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoCapitalize="words"
          />
        </View>
        <View style={styles.field}>
          <TextInputField
            label="Country of origin"
            value={country}
            onChangeText={setCountry}
            placeholder="Your country"
            autoCapitalize="words"
          />
        </View>

        <Text style={styles.fieldLabel}>Visa type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.visaRow}
        >
          {VISA_TYPES.map((visa) => {
            const selected = visaType === visa.id;
            return (
              <Pressable
                key={visa.id}
                onPress={() => setVisaType(visa.id)}
                style={[styles.visaChip, selected && styles.visaChipSelected]}
              >
                <Text style={[styles.visaText, selected && styles.visaTextSelected]}>
                  {visa.shortLabel}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.field}>
          <TextInputField
            label="Current stage"
            value={stage}
            onChangeText={setStage}
            placeholder="Where you are in the process"
            autoCapitalize="sentences"
          />
        </View>
        <View style={styles.field}>
          <TextInputField
            label="Primary goal"
            value={goal}
            onChangeText={setGoal}
            placeholder="What matters most right now"
            autoCapitalize="sentences"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label="Save changes" onPress={handleSave} loading={saving} style={styles.save} />
      </ScrollView>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 460,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  visaRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  visaChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visaChipSelected: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.borderFocus,
  },
  visaText: {
    ...Typography.labelM,
    color: Colors.textSecondary,
  },
  visaTextSelected: {
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
    marginBottom: Spacing.lg,
  },
});

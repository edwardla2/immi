import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { GlassCard } from '@/components/ui/GlassCard';
import { TextInputField } from '@/components/ui/TextInputField';
import { Colors } from '@/constants/colors';
import { COUNTRIES } from '@/constants/countries';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { useOnboarding } from '@/app/(onboarding)/_layout';

export default function Step1() {
  const router = useRouter();
  const { draft, setDraft } = useOnboarding();
  const [name, setName] = useState(draft.name);
  const [country, setCountry] = useState(draft.country_of_origin);

  const canContinue = name.trim().length > 0 && country.length > 0;

  const handleContinue = () => {
    setDraft({ name: name.trim(), country_of_origin: country });
    router.push('/(onboarding)/step-2');
  };

  return (
    <OnboardingScaffold
      step={1}
      title="What should we call you?"
      subtitle="A few quick questions so Immi can tailor everything to you."
      canContinue={canContinue}
      onContinue={handleContinue}
      showBack={false}
    >
      <View style={styles.nameField}>
        <TextInputField
          label="First name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
        />
      </View>

      <Text style={styles.label}>Country of origin</Text>
      <GlassCard padding={0} style={styles.listCard}>
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          {COUNTRIES.map((c, idx) => {
            const selected = country === c.name;
            return (
              <Pressable
                key={c.name}
                onPress={() => setCountry(c.name)}
                style={[styles.row, idx === COUNTRIES.length - 1 && styles.rowLast]}
              >
                <Text style={styles.flag}>{c.flag}</Text>
                <Text style={[styles.country, selected && styles.countrySelected]}>{c.name}</Text>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </GlassCard>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  nameField: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  listCard: {
    flex: 1,
    overflow: 'hidden',
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  flag: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  country: {
    ...Typography.bodyL,
    color: Colors.textSecondary,
    flex: 1,
  },
  countrySelected: {
    color: Colors.textPrimary,
    fontFamily: Typography.labelL.fontFamily,
  },
});

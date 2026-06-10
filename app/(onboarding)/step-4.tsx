import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { SelectRow } from '@/components/ui/SelectRow';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';
import { MAX_GOALS, PRIMARY_GOALS, getGoalLabel } from '@/constants/primaryGoals';
import { Typography } from '@/constants/typography';
import { useProfile } from '@/hooks/useProfile';
import { useOnboarding } from '@/app/(onboarding)/_layout';

export default function Step4() {
  const router = useRouter();
  const { draft, setDraft } = useOnboarding();
  const { update } = useProfile();
  const [goals, setGoals] = useState<string[]>(draft.primary_goal);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setGoals((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= MAX_GOALS) return prev;
      return [...prev, id];
    });
  };

  const handleContinue = async () => {
    setError(null);
    setSaving(true);
    setDraft({ primary_goal: goals });

    const primaryGoalText = goals.map(getGoalLabel).join('; ');
    const { error: saveError } = await update({
      name: draft.name,
      country_of_origin: draft.country_of_origin,
      visa_type: draft.visa_type,
      current_stage: draft.current_stage,
      primary_goal: primaryGoalText,
      onboarding_completed: true,
    });
    setSaving(false);

    if (saveError) {
      setError(saveError);
      return;
    }
    router.push('/(onboarding)/complete');
  };

  return (
    <OnboardingScaffold
      step={4}
      title="What's the most important thing right now?"
      subtitle={`Pick up to ${MAX_GOALS}. You can always change this later.`}
      canContinue={goals.length > 0}
      onContinue={handleContinue}
      continueLabel="Finish setup"
      loading={saving}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {PRIMARY_GOALS.map((goal) => (
          <SelectRow
            key={goal.id}
            label={goal.label}
            emoji={goal.emoji}
            multiSelect
            selected={goals.includes(goal.id)}
            onPress={() => toggle(goal.id)}
          />
        ))}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.lg,
  },
  error: {
    ...Typography.bodyS,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});

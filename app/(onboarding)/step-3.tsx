import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { SelectRow } from '@/components/ui/SelectRow';
import { TextInputField } from '@/components/ui/TextInputField';
import { Spacing } from '@/constants/layout';
import { getStages } from '@/constants/onboardingStages';
import { useOnboarding } from '@/app/(onboarding)/_layout';

export default function Step3() {
  const router = useRouter();
  const { draft, setDraft } = useOnboarding();
  const [stage, setStage] = useState(draft.current_stage);

  const stages = getStages(draft.visa_type);
  const isFreeform = draft.visa_type === 'OTHER' || stages.length === 0;
  const canContinue = stage.trim().length > 0;

  const handleContinue = () => {
    setDraft({ current_stage: stage.trim() });
    router.push('/(onboarding)/step-4');
  };

  return (
    <OnboardingScaffold
      step={3}
      title="Where are you right now?"
      subtitle="Be as specific as you can — we'll tailor everything to your stage."
      canContinue={canContinue}
      onContinue={handleContinue}
    >
      {isFreeform ? (
        <TextInputField
          label="Describe your situation"
          value={stage}
          onChangeText={setStage}
          placeholder="Tell us where you are in the process"
          autoCapitalize="sentences"
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {stages.map((option) => (
            <SelectRow
              key={option.id}
              label={option.label}
              selected={stage === option.label}
              onPress={() => setStage(option.label)}
            />
          ))}
        </ScrollView>
      )}
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.lg,
  },
});

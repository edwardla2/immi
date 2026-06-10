import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { VisaTypePill } from '@/components/ui/VisaTypePill';
import { Spacing } from '@/constants/layout';
import { VISA_TYPES } from '@/constants/visaTypes';
import { VisaType } from '@/lib/types';
import { useOnboarding } from '@/app/(onboarding)/_layout';

export default function Step2() {
  const router = useRouter();
  const { draft, setDraft } = useOnboarding();
  const [visaType, setVisaType] = useState<VisaType | null>(draft.visa_type);

  const handleContinue = () => {
    if (!visaType) return;
    // Reset the stage if the visa type changed, since stages are per-visa.
    const stageReset = visaType !== draft.visa_type ? { current_stage: '' } : {};
    setDraft({ visa_type: visaType, ...stageReset });
    router.push('/(onboarding)/step-3');
  };

  return (
    <OnboardingScaffold
      step={2}
      title="What's your current immigration status?"
      subtitle="This helps us give you accurate, relevant information."
      canContinue={visaType !== null}
      onContinue={handleContinue}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {VISA_TYPES.map((visa) => (
          <VisaTypePill
            key={visa.id}
            label={visa.label}
            description={visa.description}
            emoji={visa.emoji}
            selected={visaType === visa.id}
            onPress={() => setVisaType(visa.id)}
          />
        ))}
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.lg,
  },
});

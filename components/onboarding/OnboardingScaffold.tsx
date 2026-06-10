import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { StepHeader } from '@/components/onboarding/StepHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';

interface OnboardingScaffoldProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
  loading?: boolean;
  showBack?: boolean;
  children: ReactNode;
  scrollContent?: boolean;
}

export function OnboardingScaffold({
  step,
  totalSteps = 4,
  title,
  subtitle,
  canContinue,
  onContinue,
  continueLabel = 'Continue',
  loading = false,
  showBack = true,
  children,
}: OnboardingScaffoldProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen edges={['top']}>
      <View style={styles.topBar}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <View style={styles.progressWrap}>
          <ProgressBar step={step} total={totalSteps} />
        </View>
      </View>

      <View style={styles.content}>
        <StepHeader title={title} subtitle={subtitle} />
        <View style={styles.body}>{children}</View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <PrimaryButton
          label={continueLabel}
          onPress={onContinue}
          disabled={!canContinue}
          loading={loading}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 32,
  },
  progressWrap: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  footer: {
    paddingTop: Spacing.md,
  },
});

import { Stack } from 'expo-router';
import { createContext, useContext, useMemo, useState } from 'react';

import { Colors } from '@/constants/colors';
import { VisaType } from '@/lib/types';

export interface OnboardingDraft {
  name: string;
  country_of_origin: string;
  visa_type: VisaType | null;
  current_stage: string;
  primary_goal: string[];
}

interface OnboardingContextValue {
  draft: OnboardingDraft;
  setDraft: (updates: Partial<OnboardingDraft>) => void;
}

const EMPTY: OnboardingDraft = {
  name: '',
  country_of_origin: '',
  visa_type: null,
  current_stage: '',
  primary_goal: [],
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within the onboarding layout');
  return ctx;
}

export default function OnboardingLayout() {
  const [draft, setDraftState] = useState<OnboardingDraft>(EMPTY);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      setDraft: (updates) => setDraftState((prev) => ({ ...prev, ...updates })),
    }),
    [draft]
  );

  return (
    <OnboardingContext.Provider value={value}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}
      />
    </OnboardingContext.Provider>
  );
}

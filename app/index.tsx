import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Wordmark } from '@/components/ui/Wordmark';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

/**
 * Entry router. Resolves auth + profile state and redirects:
 *   no session            -> sign in
 *   session, not onboarded -> onboarding
 *   session, onboarded     -> chat
 */
export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading) {
    return <Loading />;
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Wait for the profile to resolve before deciding onboarding vs app.
  if (profileLoading) {
    return <Loading />;
  }

  if (!profile?.onboarding_completed) {
    return <Redirect href="/(onboarding)/step-1" />;
  }

  return <Redirect href="/(app)/chat" />;
}

function Loading() {
  return (
    <View style={styles.container}>
      <Wordmark size="xl" />
      <ActivityIndicator color={Colors.accent} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  spinner: {
    marginTop: Spacing.xxl,
  },
});

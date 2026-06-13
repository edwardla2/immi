import { Redirect, Stack } from 'expo-router';

import { Colors } from '@/constants/colors';
import { BYPASS_AUTH } from '@/lib/config';
import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  // The moment a session exists — e.g. right after sign-up or sign-in establishes
  // one — leave the auth group. This layout re-renders when the auth context's
  // session changes, so it's the reactive counterpart to the (app) group guard.
  // Routing to the entry router (`/`) lets it resolve profile state and send the
  // user to onboarding or the app. Without this, a successful sign-up updates the
  // session but nothing navigates, stranding the user on the auth screen.
  if (!BYPASS_AUTH && !loading && session) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg },
      }}
    />
  );
}

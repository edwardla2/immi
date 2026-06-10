import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { KeyboardAvoidingWrapper } from '@/components/ui/KeyboardAvoidingWrapper';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextInputField } from '@/components/ui/TextInputField';
import { Wordmark } from '@/components/ui/Wordmark';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail } from '@/lib/utils';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    const { error: authError } = await signIn(email, password);
    setLoading(false);
    if (authError) {
      setError(authError);
    }
    // On success, the root layout redirects automatically.
  };

  return (
    <Screen>
      <KeyboardAvoidingWrapper>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Wordmark size="xl" />
            <Text style={styles.tagline}>Navigate your immigration journey.</Text>
          </View>

          <Animated.View entering={FadeInDown.duration(400)}>
            <GlassCard padding={Spacing.xl}>
              <View style={styles.field}>
                <TextInputField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                />
              </View>
              <View style={styles.field}>
                <TextInputField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  secureTextEntry
                  textContentType="password"
                  onSubmitEditing={handleSignIn}
                  returnKeyType="go"
                />
              </View>

              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity style={styles.forgot}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </Link>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PrimaryButton label="Sign In" onPress={handleSignIn} loading={loading} />
            </GlassCard>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.giant,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.giant,
  },
  tagline: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotText: {
    ...Typography.labelM,
    color: Colors.accent,
  },
  error: {
    ...Typography.bodyS,
    color: Colors.danger,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
  },
  footerText: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.labelL,
    color: Colors.accent,
  },
});

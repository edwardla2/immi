import { Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { KeyboardAvoidingWrapper } from '@/components/ui/KeyboardAvoidingWrapper';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextInputField } from '@/components/ui/TextInputField';
import { Wordmark } from '@/components/ui/Wordmark';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, passwordStrength, PasswordStrength } from '@/lib/utils';

const STRENGTH_META: Record<PasswordStrength, { color: string; width: string; label: string }> = {
  weak: { color: Colors.danger, width: '33%', label: 'Weak' },
  fair: { color: Colors.warning, width: '66%', label: 'Fair' },
  strong: { color: Colors.success, width: '100%', label: 'Strong' },
};

export default function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = password ? STRENGTH_META[passwordStrength(password)] : null;

  const handleSignUp = async () => {
    setError(null);
    if (!name.trim()) return setError('Please enter your name.');
    if (!isValidEmail(email)) return setError('Please enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setLoading(true);
    const { error: authError } = await signUp(email, password, name);
    setLoading(false);
    if (authError) setError(authError);
    // On success, the root layout redirects to onboarding.
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
            <Wordmark size="lg" />
            <Text style={styles.tagline}>Create your account.</Text>
          </View>

          <Animated.View entering={FadeInDown.duration(400)}>
            <GlassCard padding={Spacing.xl}>
              <View style={styles.field}>
                <TextInputField
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  autoCapitalize="words"
                  textContentType="name"
                  autoComplete="name"
                />
              </View>
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
                  placeholder="At least 8 characters"
                  secureTextEntry
                  textContentType="newPassword"
                />
                {strength ? (
                  <View style={styles.strengthRow}>
                    <View style={styles.strengthTrack}>
                      <View
                        style={[
                          styles.strengthFill,
                          { width: strength.width as `${number}%`, backgroundColor: strength.color },
                        ]}
                      />
                    </View>
                    <Text style={[styles.strengthLabel, { color: strength.color }]}>
                      {strength.label}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.field}>
                <TextInputField
                  label="Confirm password"
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="Re-enter your password"
                  secureTextEntry
                  textContentType="newPassword"
                  onSubmitEditing={handleSignUp}
                  returnKeyType="go"
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PrimaryButton label="Create Account" onPress={handleSignUp} loading={loading} />
            </GlassCard>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign in</Text>
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
    marginBottom: Spacing.xxxl,
  },
  tagline: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgInput,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  strengthFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  strengthLabel: {
    ...Typography.labelS,
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

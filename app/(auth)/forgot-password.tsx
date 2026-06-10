import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { KeyboardAvoidingWrapper } from '@/components/ui/KeyboardAvoidingWrapper';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextInputField } from '@/components/ui/TextInputField';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail } from '@/lib/utils';

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const { error: resetError } = await resetPassword(email);
    setLoading(false);
    if (resetError) {
      setError(resetError);
      return;
    }
    setSent(true);
  };

  return (
    <Screen>
      <TouchableOpacity style={styles.back} onPress={() => router.back()} hitSlop={10}>
        <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
      </TouchableOpacity>

      <KeyboardAvoidingWrapper>
        <View style={styles.center}>
          {sent ? (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.sentWrap}>
              <View style={styles.iconCircle}>
                <Ionicons name="mail-outline" size={36} color={Colors.accent} />
              </View>
              <Text style={styles.title}>Check your email</Text>
              <Text style={styles.body}>
                We sent a password reset link to {email}. Follow it to set a new password.
              </Text>
              <PrimaryButton
                label="Back to Sign In"
                onPress={() => router.replace('/(auth)/sign-in')}
                style={styles.button}
              />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.title}>Reset your password</Text>
              <Text style={styles.body}>
                Enter the email associated with your account and we&apos;ll send you a reset link.
              </Text>
              <GlassCard padding={Spacing.xl} style={styles.card}>
                <TextInputField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <PrimaryButton
                  label="Send reset link"
                  onPress={handleSend}
                  loading={loading}
                  style={styles.button}
                />
              </GlassCard>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingWrapper>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  sentWrap: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.displayM,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  body: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  card: {
    marginTop: Spacing.sm,
  },
  error: {
    ...Typography.bodyS,
    color: Colors.danger,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.lg,
    alignSelf: 'stretch',
  },
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { useProfile } from '@/hooks/useProfile';

export default function Complete() {
  const router = useRouter();
  const { profile } = useProfile();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 140 });
  }, [scale]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const firstName = profile?.name?.split(' ')[0] || 'friend';

  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View style={[styles.checkWrap, checkStyle]}>
          <View style={styles.glow} />
          <Ionicons name="checkmark-circle" size={96} color={Colors.accent} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.textWrap}>
          <Text style={styles.title}>You&apos;re all set, {firstName}.</Text>
          <Text style={styles.body}>
            Ask me anything about your immigration journey. I&apos;m here to help you understand
            every step.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Start Chatting"
          icon="chatbubble-ellipses"
          onPress={() => router.replace('/(app)/chat')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  glow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentGlow,
    opacity: 0.6,
  },
  textWrap: {
    alignItems: 'center',
  },
  title: {
    ...Typography.displayM,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  body: {
    ...Typography.bodyL,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingBottom: Spacing.lg,
  },
});

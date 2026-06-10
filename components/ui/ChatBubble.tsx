import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { Message } from '@/lib/types';
import { clockTime } from '@/lib/utils';

interface ChatBubbleProps {
  message: Message;
  onRetry?: () => void;
}

export function ChatBubble({ message, onRetry }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  // Loading placeholder bubble (assistant side).
  if (message.isLoading) {
    return (
      <Animated.View entering={FadeInUp.duration(200)} style={[styles.wrap, styles.assistantWrap]}>
        <GlassCard style={styles.assistantBubble} padding={Spacing.lg}>
          <LoadingDots />
        </GlassCard>
      </Animated.View>
    );
  }

  // Error bubble (assistant side, tappable to retry).
  if (message.isError) {
    return (
      <Animated.View entering={FadeInUp.duration(200)} style={[styles.wrap, styles.assistantWrap]}>
        <Pressable onPress={onRetry} style={styles.errorBubble}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.danger} />
          <Text style={styles.errorText}>{message.content || 'Something went wrong. Tap to retry.'}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  if (isUser) {
    return (
      <Animated.View entering={FadeInUp.duration(200)} style={[styles.wrap, styles.userWrap]}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
        <Text style={[styles.time, styles.timeRight]}>{clockTime(message.created_at)}</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(200)} style={[styles.wrap, styles.assistantWrap]}>
      <GlassCard style={styles.assistantBubble} padding={Spacing.lg}>
        <Text style={styles.assistantText}>{message.content}</Text>
      </GlassCard>
      <Text style={[styles.time, styles.timeLeft]}>{clockTime(message.created_at)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.lg,
  },
  userWrap: {
    alignItems: 'flex-end',
  },
  assistantWrap: {
    alignItems: 'flex-start',
  },
  userBubble: {
    maxWidth: '80%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.xl,
    borderBottomRightRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  userText: {
    ...Typography.chatUser,
    color: '#FFFFFF',
  },
  assistantBubble: {
    maxWidth: '92%',
    borderBottomLeftRadius: Radius.sm,
  },
  assistantText: {
    ...Typography.chatAssistant,
    color: Colors.textPrimary,
  },
  errorBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '92%',
    backgroundColor: Colors.dangerMuted,
    borderRadius: Radius.xl,
    borderBottomLeftRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.4)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  errorText: {
    ...Typography.bodyM,
    color: Colors.danger,
    marginLeft: Spacing.sm,
    flexShrink: 1,
  },
  time: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  timeRight: {
    marginRight: Spacing.xs,
  },
  timeLeft: {
    marginLeft: Spacing.xs,
  },
});

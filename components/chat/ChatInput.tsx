import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { impact, ImpactStyle } from '@/lib/haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  initialText?: string;
}

export function ChatInput({ onSend, disabled = false, initialText }: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(initialText ?? '');

  // Seed the input once when a prefill is provided (e.g. "Find your form").
  useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);
  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    impact(ImpactStyle.Medium);
    onSend(text.trim());
    setText('');
  };

  return (
    <BlurView intensity={30} tint="dark" style={[styles.container, { paddingBottom: insets.bottom + Spacing.sm }]}>
      <View style={styles.inner}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Ask about your visa, forms, deadlines..."
          placeholderTextColor={Colors.textMuted}
          multiline
          selectionColor={Colors.accent}
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={[styles.sendButton, !canSend && styles.sendDisabled]}
        >
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  input: {
    flex: 1,
    ...Typography.bodyM,
    color: Colors.textPrimary,
    maxHeight: 120,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    marginRight: Spacing.sm,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: Colors.bgCardHover,
    opacity: 0.6,
  },
});

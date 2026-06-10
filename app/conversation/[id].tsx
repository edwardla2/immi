import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatInput } from '@/components/chat/ChatInput';
import { MessageList } from '@/components/chat/MessageList';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { BYPASS_AUTH } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { useMessages } from '@/hooks/useMessages';
import { Conversation } from '@/lib/types';

export default function ConversationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, prefill } = useLocalSearchParams<{ id: string; prefill?: string }>();

  const initialText =
    prefill === 'form' ? 'I need help finding the right USCIS form for ' : undefined;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [convLoading, setConvLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { messages, loading, sendMessage, retry, actionNotice, clearActionNotice } =
    useMessages(id);

  // Auto-dismiss the "added to your timeline" toast.
  useEffect(() => {
    if (!actionNotice) return;
    const timer = setTimeout(clearActionNotice, 4000);
    return () => clearTimeout(timer);
  }, [actionNotice, clearActionNotice]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) {
        setNotFound(true);
        setConvLoading(false);
        return;
      }
      // Auth-bypass mode: use an in-memory conversation, skip the DB lookup.
      if (BYPASS_AUTH) {
        setConversation({
          id,
          user_id: 'mock-user',
          title: 'New Conversation',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setConvLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single();
      if (!active) return;
      if (error || !data) {
        setNotFound(true);
      } else {
        setConversation(data as Conversation);
      }
      setConvLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Conversation" onBack={() => router.back()} />
        <EmptyState
          icon="alert-circle-outline"
          title="Conversation not found"
          body="This conversation may have been deleted."
        >
          <SecondaryButton label="Go back" onPress={() => router.back()} style={styles.backBtn} />
        </EmptyState>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header
        title={convLoading ? 'Loading…' : conversation?.title ?? 'Conversation'}
        onBack={() => router.back()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 48}
      >
        {loading ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="navigate"
              title="Start the conversation"
              body="Ask about a form, a deadline, your visa status — anything on your mind."
            />
          </View>
        ) : (
          <MessageList messages={messages} onRetry={retry} />
        )}
        {actionNotice ? (
          <Animated.View entering={FadeInDown.duration(250)} style={styles.toast}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.toastText}>{actionNotice}</Text>
          </Animated.View>
        ) : null}
        <ChatInput onSend={sendMessage} initialText={initialText} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.headerBack}>
        <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
      </Pressable>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerBack} />
    </View>
  );
}

function ChatSkeleton() {
  return (
    <View style={styles.skeleton}>
      <ActivityIndicator color={Colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBack: {
    width: 32,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  emptyWrap: {
    flex: 1,
  },
  skeleton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    alignSelf: 'stretch',
    marginHorizontal: Spacing.xl,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: Colors.successMuted,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  toastText: {
    ...Typography.labelM,
    color: Colors.success,
  },
});

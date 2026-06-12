import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { impact, ImpactStyle } from '@/lib/haptics';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ConversationCard } from '@/components/chat/ConversationCard';
import { DevModeBadge } from '@/components/ui/DevModeBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { showAlert } from '@/lib/alert';
import { Colors } from '@/constants/colors';
import { Radius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { BYPASS_AUTH } from '@/lib/config';
import { useConversations } from '@/hooks/useConversations';

export default function ChatList() {
  const router = useRouter();
  const { conversations, loading, create, deleteConversation, refresh } = useConversations();
  const [creating, setCreating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleNew = async () => {
    setCreating(true);
    const { data, error } = await create();
    setCreating(false);
    if (data) {
      router.push(`/conversation/${data.id}`);
    } else {
      showAlert(
        'Could not start a conversation',
        error ?? 'Something went wrong. Please check your connection and try again.'
      );
    }
  };

  const handleDelete = (id: string) => {
    impact(ImpactStyle.Medium);
    deleteConversation(id);
  };

  return (
    <Screen edges={['top']}>
      {BYPASS_AUTH ? (
        <View style={styles.devBadgeRow}>
          <DevModeBadge />
        </View>
      ) : null}
      <View style={styles.header}>
        <Text style={styles.title}>Conversations</Text>
        <Pressable onPress={handleNew} style={styles.newButton} disabled={creating}>
          {creating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.newLabel}>New</Text>
            </>
          )}
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon="navigate"
          title="Ask anything."
          body="Immigration is complicated. I'm here to make it simple."
        >
          <PrimaryButton
            label="Start a conversation"
            onPress={handleNew}
            loading={creating}
            style={styles.emptyButton}
          />
        </EmptyState>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={loading}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
              <ConversationCard
                conversation={item}
                onPress={() => router.push(`/conversation/${item.id}`)}
                onLongPress={() => handleDelete(item.id)}
              />
            </Animated.View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  devBadgeRow: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 64,
    justifyContent: 'center',
  },
  newLabel: {
    ...Typography.labelM,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  emptyButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});

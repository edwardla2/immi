import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ChatBubble } from '@/components/ui/ChatBubble';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { Message } from '@/lib/types';
import { dayLabel } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  onRetry: () => void;
}

type Row =
  | { type: 'message'; message: Message }
  | { type: 'separator'; id: string; label: string };

function buildRows(messages: Message[]): Row[] {
  const rows: Row[] = [];
  let lastDay = '';
  for (const message of messages) {
    const label = dayLabel(message.created_at);
    if (label !== lastDay) {
      rows.push({ type: 'separator', id: `sep-${message.id}`, label });
      lastDay = label;
    }
    rows.push({ type: 'message', message });
  }
  return rows;
}

export function MessageList({ messages, onRetry }: MessageListProps) {
  // Inverted FlatList renders bottom-up, so reverse the chronological rows.
  const data = useMemo(() => buildRows(messages).reverse(), [messages]);

  return (
    <FlatList
      data={data}
      inverted
      keyExtractor={(row) => (row.type === 'message' ? row.message.id : row.id)}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        if (item.type === 'separator') {
          return (
            <View style={styles.separatorRow}>
              <View style={styles.separatorPill}>
                <Text style={styles.separatorText}>{item.label}</Text>
              </View>
            </View>
          );
        }
        return <ChatBubble message={item.message} onRetry={onRetry} />;
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  separatorRow: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  separatorPill: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
  },
  separatorText: {
    ...Typography.labelS,
    color: Colors.textMuted,
  },
});

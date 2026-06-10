import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { Conversation } from '@/lib/types';
import { relativeTime } from '@/lib/utils';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
  onLongPress?: () => void;
}

export function ConversationCard({ conversation, onPress, onLongPress }: ConversationCardProps) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.pressable}>
      <GlassCard padding={Spacing.lg} borderRadius={Radius.lg}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Ionicons name="chatbubble-ellipses" size={18} color={Colors.accent} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title} numberOfLines={1}>
              {conversation.title}
            </Text>
            <Text style={styles.time}>{relativeTime(conversation.updated_at)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    ...Typography.labelL,
    color: Colors.textPrimary,
  },
  time: {
    ...Typography.bodyS,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

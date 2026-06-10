import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface SelectRowProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
}

/** A tappable list row with a checkmark/checkbox, used in onboarding steps 3 & 4. */
export function SelectRow({ label, emoji, selected, onPress, multiSelect = false }: SelectRowProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const inner = (
    <View style={styles.row}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      {selected ? (
        <Ionicons name={multiSelect ? 'checkbox' : 'checkmark-circle'} size={22} color="#FFFFFF" />
      ) : (
        <View style={multiSelect ? styles.emptyBox : styles.emptyCheck} />
      )}
    </View>
  );

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      {selected ? (
        <LinearGradient
          colors={Colors.gradientAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectedCard}
        >
          {inner}
        </LinearGradient>
      ) : (
        <GlassCard padding={Spacing.lg} borderRadius={Radius.lg}>
          {inner}
        </GlassCard>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: Spacing.md,
  },
  selectedCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  label: {
    ...Typography.labelL,
    color: Colors.textPrimary,
    flex: 1,
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  emptyCheck: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  emptyBox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
});

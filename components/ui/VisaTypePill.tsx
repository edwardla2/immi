import { Ionicons } from '@expo/vector-icons';
import { impact, ImpactStyle } from '@/lib/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface VisaTypePillProps {
  label: string;
  description?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}

export function VisaTypePill({
  label,
  description,
  emoji,
  selected,
  onPress,
}: VisaTypePillProps) {
  const handlePress = () => {
    impact(ImpactStyle.Light);
    onPress();
  };

  const inner = (
    <View style={styles.row}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <View style={styles.textCol}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {description ? (
          <Text style={[styles.description, selected && styles.descriptionSelected]}>
            {description}
          </Text>
        ) : null}
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
      ) : (
        <View style={styles.emptyCheck} />
      )}
    </View>
  );

  if (selected) {
    return (
      <Pressable onPress={handlePress} style={styles.pressable}>
        <LinearGradient
          colors={Colors.gradientAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectedCard}
        >
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <GlassCard padding={Spacing.lg} borderRadius={Radius.lg}>
        {inner}
      </GlassCard>
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
    fontSize: 22,
    marginRight: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  label: {
    ...Typography.labelL,
    color: Colors.textPrimary,
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  description: {
    ...Typography.bodyS,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  descriptionSelected: {
    color: 'rgba(255,255,255,0.85)',
  },
  emptyCheck: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
});

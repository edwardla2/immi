import { Ionicons } from '@expo/vector-icons';
import { impact, ImpactStyle } from '@/lib/haptics';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  style?: ViewStyle;
}

const SPRING = { damping: 15, stiffness: 300 };

export function SecondaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
  destructive = false,
  style,
}: SecondaryButtonProps) {
  const scale = useSharedValue(1);
  const isInert = disabled || loading;
  const color = destructive ? Colors.danger : Colors.textPrimary;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        accessibilityRole="button"
        disabled={isInert}
        onPressIn={() => {
          scale.value = withSpring(0.97, SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, SPRING);
        }}
        onPress={() => {
          impact(ImpactStyle.Light);
          onPress();
        }}
        style={[styles.button, isInert && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={color} />
        ) : (
          <View style={styles.row}>
            {icon ? <Ionicons name={icon} size={18} color={color} style={styles.icon} /> : null}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    ...Typography.labelL,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { impact, ImpactStyle } from '@/lib/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

const SPRING = { damping: 15, stiffness: 300 };

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);
  const isInert = disabled || loading;

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
          impact(ImpactStyle.Medium);
          onPress();
        }}
      >
        <LinearGradient
          colors={Colors.gradientAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, isInert && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.row}>
              {icon ? <Ionicons name={icon} size={18} color="#FFFFFF" style={styles.icon} /> : null}
              <Text style={styles.label}>{label}</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
    color: '#FFFFFF',
  },
});

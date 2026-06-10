import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/layout';

interface ProgressBarProps {
  step: number; // 1-based
  total: number;
}

export function ProgressBar({ step, total }: ProgressBarProps) {
  const progress = useSharedValue(step / total);

  useEffect(() => {
    progress.value = withSpring(step / total, { damping: 18, stiffness: 160 });
  }, [step, total, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgInput,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
  },
});

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';

type IconName = keyof typeof Ionicons.glyphMap;

const ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  chat: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
  timeline: { active: 'calendar', inactive: 'calendar-outline' },
  documents: { active: 'documents', inactive: 'documents-outline' },
  profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

const TAB_ORDER = ['chat', 'timeline', 'documents', 'profile'];

/** Floating glass pill tab bar. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Order routes deterministically and ignore any that aren't real tabs.
  type TabRoute = (typeof state.routes)[number];
  const routes = TAB_ORDER.map((name) =>
    state.routes.find((r: TabRoute) => r.name === name)
  ).filter((r): r is TabRoute => Boolean(r));

  return (
    <View style={[styles.container, { bottom: insets.bottom + Spacing.lg }]} pointerEvents="box-none">
      <BlurView intensity={40} tint="dark" style={styles.pill}>
        {routes.map((route) => {
          const routeIndex = state.routes.findIndex((r: TabRoute) => r.key === route.key);
          const isFocused = state.index === routeIndex;
          const icons = ICONS[route.name];

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab} hitSlop={6}>
              <Ionicons
                name={isFocused ? icons.active : icons.inactive}
                size={24}
                color={isFocused ? Colors.accent : Colors.textMuted}
              />
              {isFocused ? <Animated.View entering={FadeIn.duration(200)} style={styles.dot} /> : (
                <View style={styles.dotPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 15, 30, 0.85)',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    marginTop: 4,
  },
  dotPlaceholder: {
    width: 4,
    height: 4,
    marginTop: 4,
  },
});

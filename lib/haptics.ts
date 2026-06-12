import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Web-safe haptics. expo-haptics has no web implementation — its promises
 * reject in the browser, which shows up as unhandled-rejection console noise.
 * Route every call through here so web is a clean no-op; native is unchanged.
 */
export const ImpactStyle = Haptics.ImpactFeedbackStyle;

export function impact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style);
}

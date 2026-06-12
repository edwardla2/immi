import { Alert, AlertButton, Platform } from 'react-native';

/**
 * Web-safe Alert. react-native-web's Alert is a no-op, so dialogs (and the
 * confirm/cancel flows built on them) silently do nothing in a browser.
 * On web this maps to window.alert / window.confirm; native is unchanged.
 */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;

  if (!buttons || buttons.length <= 1) {
    window.alert(text);
    buttons?.[0]?.onPress?.();
    return;
  }

  // Multi-button alerts are confirm/cancel flows: the non-cancel button is
  // the affirmative action.
  const confirmButton = buttons.find((b) => b.style !== 'cancel');
  const cancelButton = buttons.find((b) => b.style === 'cancel');
  if (window.confirm(text)) {
    confirmButton?.onPress?.();
  } else {
    cancelButton?.onPress?.();
  }
}

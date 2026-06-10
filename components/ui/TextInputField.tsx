import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  textContentType?: TextInput['props']['textContentType'];
  autoComplete?: TextInput['props']['autoComplete'];
  onSubmitEditing?: () => void;
  returnKeyType?: TextInput['props']['returnKeyType'];
}

export function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  textContentType,
  autoComplete,
  onSubmitEditing,
  returnKeyType,
}: TextInputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const focus = useSharedValue(0);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? Colors.danger
      : interpolateColor(focus.value, [0, 1], [Colors.border, Colors.borderFocus]),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.inputWrapper, borderStyle]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          autoComplete={autoComplete}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          onFocus={() => {
            setFocused(true);
            focus.value = withTiming(1, { duration: 200 });
          }}
          onBlur={() => {
            setFocused(false);
            focus.value = withTiming(0, { duration: 200 });
          }}
          selectionColor={Colors.accent}
        />
        {secureTextEntry ? (
          <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)} style={styles.eye}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textMuted}
            />
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: Radius.md,
    borderWidth: 1,
    backgroundColor: Colors.bgInput,
    paddingHorizontal: Spacing.lg,
  },
  input: {
    flex: 1,
    ...Typography.bodyM,
    color: Colors.textPrimary,
    height: '100%',
  },
  eye: {
    paddingLeft: Spacing.sm,
  },
  error: {
    ...Typography.bodyS,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
});

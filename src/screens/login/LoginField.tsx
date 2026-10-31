import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { CircleAlert } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';

type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

interface Props {
  label: string;
  icon: IconComponent;
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  onFocus?: () => void;
  placeholder: string;
  error?: string;
  inputRef?: React.Ref<TextInput>;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  maxLength?: number;
}

/**
 * Labelled input with a leading icon, focus ring and inline error message.
 * Kept local to the login screen so the add-expense form stays untouched.
 */
const LoginField = ({
  label,
  icon: Icon,
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,
  error,
  inputRef,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  maxLength,
}: Props) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [focused, setFocused] = useState(false);

  const iconColor = error
    ? '#ef4444'
    : focused
    ? '#539e98'
    : isDark
    ? '#8b8b8b'
    : '#9ca3af';

  const borderClass = error
    ? 'border-red-400'
    : focused
    ? 'border-primary'
    : 'border-gray-200 dark:border-BDPrimary-dark';

  return (
    <View>
      <CustomText
        variant="h6"
        className="mb-2 font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </CustomText>

      <View
        className={`h-14 flex-row items-center gap-2 rounded-2xl border bg-gray-50 px-4 dark:bg-dark-card ${borderClass}`}
      >
        <View
          className={`h-5 w-5 items-center justify-center ${
            textContentType === 'emailAddress' ? '-mb-2' : ''
          }`}
        >
          <Icon size={18} color={iconColor} strokeWidth={1.9} />
        </View>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#6b6b6b' : '#9ca3af'}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          autoCorrect={false}
          selectionColor="#539e98"
          style={styles.input}
          className="flex-1 text-base text-gray-900 dark:text-gray-50"
        />

        {error ? <CircleAlert size={16} color="#ef4444" /> : null}
      </View>

      {error ? (
        <CustomText variant="h7" className="mt-1.5 text-red-500">
          {error}
        </CustomText>
      ) : null}
    </View>
  );
};

export default LoginField;

const styles = StyleSheet.create({
  input: {
    // Fill the row so the whole input area is tappable, then center the text.
    // Android otherwise adds font padding that pushes the text downwards.
    alignSelf: 'stretch',
    includeFontPadding: false,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
});

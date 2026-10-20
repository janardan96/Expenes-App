import React, { forwardRef, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import CustomText from '@components/common/CustomText';
import FormError from './FormError';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  /** Rendered inside the field, before the input (e.g. the ₹ symbol) */
  prefix?: string;
  /** Tailwind classes for the prefix, so it can match the input font size */
  prefixClassName?: string;
  /** Small helper text rendered next to the label */
  hint?: string;
}

const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    {
      label,
      error,
      required,
      prefix,
      prefixClassName,
      hint,
      className,
      style,
      multiline,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    const borderClass = error
      ? 'border-red-500'
      : focused
      ? 'border-primary'
      : 'border-BDPrimary dark:border-BDPrimary-dark';

    return (
      <View className="w-full">
        <View className="flex-row items-center justify-between mb-1.5">
          <CustomText
            variant="h7"
            className="font-medium text-gray-600 dark:text-gray-300"
          >
            {label}
            {required ? (
              <CustomText className="text-red-500"> *</CustomText>
            ) : null}
          </CustomText>

          {hint ? (
            <CustomText variant="h8" className="text-gray-400">
              {hint}
            </CustomText>
          ) : null}
        </View>

        <View
          className={`flex-row items-center rounded-xl border bg-white dark:bg-dark-card px-3 ${borderClass}`}
        >
          {prefix ? (
            <Text
              className={`text-gray-500 dark:text-gray-400 mr-1 ${
                prefixClassName ?? 'text-base'
              }`}
            >
              {prefix}
            </Text>
          ) : null}

          <TextInput
            ref={ref}
            style={[
              {
                // Android adds extra font padding on top of the line box, which
                // shows up as a gap above the text on bigger font sizes.
                includeFontPadding: false,
                textAlignVertical: multiline ? 'top' : 'center',
              },
              style,
            ]}
            className={`flex-1 py-3 text-gray-800 dark:text-gray-100 ${
              className ?? ''
            }`}
            placeholderTextColor="#9ca3af"
            onFocus={event => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={event => {
              setFocused(false);
              onBlur?.(event);
            }}
            {...rest}
          />
        </View>

        <FormError message={error} />
      </View>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;

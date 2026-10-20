import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import CustomText from '@components/common/CustomText';

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Colour of the active label */
  accentColor?: string;
}

const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  accentColor = '#539e98',
}: SegmentedControlProps<T>) => {
  return (
    <View className="flex-row rounded-xl p-1 bg-gray-200/70 dark:bg-white/10">
      {options.map(option => {
        const selected = option.value === value;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
            className={`flex-1 py-2 rounded-lg items-center ${
              selected ? 'bg-white dark:bg-dark-card' : ''
            }`}
          >
            <CustomText
              variant="h7"
              style={selected ? { color: accentColor } : undefined}
              className={
                selected
                  ? 'font-semibold'
                  : 'font-medium text-gray-500 dark:text-gray-400'
              }
            >
              {option.label}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SegmentedControl;

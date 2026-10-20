import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import CustomText from '@components/common/CustomText';

interface OptionChipsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

const OptionChips = <T extends string>({
  options,
  value,
  onChange,
}: OptionChipsProps<T>) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="pr-2"
    >
      <View className="flex-row gap-2 pr-2">
        {options.map(option => {
          const selected = option === value;

          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              activeOpacity={0.7}
              className={`px-4 py-2 rounded-full border ${
                selected
                  ? 'bg-primary border-primary'
                  : 'bg-white dark:bg-dark-card border-BDPrimary dark:border-BDPrimary-dark'
              }`}
            >
              <CustomText
                variant="h7"
                className={
                  selected
                    ? 'text-white font-medium'
                    : 'text-gray-600 dark:text-gray-300 font-medium'
                }
              >
                {option}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default OptionChips;

import React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';

import BottomSheet from '@components/common/BottomSheet';
import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import type { SheetOption } from './types';

interface Props<T extends string> {
  visible: boolean;
  title: string;
  subtitle: string;
  options: SheetOption<T>[];
  value: T;
  cancelLabel: string;
  onSelect: (value: T) => void;
  onClose: () => void;
}

const ChoiceSheet = <T extends string>({
  visible,
  title,
  subtitle,
  options,
  value,
  cancelLabel,
  onSelect,
  onClose,
}: Props<T>) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const selectedBackground = isDark
    ? 'rgba(127, 200, 194, 0.14)'
    : 'rgba(78, 147, 142, 0.10)';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pb-3 pt-4">
        <CustomText
          variant="h4"
          className="font-semibold text-gray-900 dark:text-gray-50"
        >
          {title}
        </CustomText>

        <CustomText
          variant="h7"
          className="mt-1 text-gray-500 dark:text-gray-400"
        >
          {subtitle}
        </CustomText>
      </View>

      <View className="gap-1.5 px-3">
        {options.map(option => {
          const selected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={selected ? { backgroundColor: selectedBackground } : null}
              className="flex-row items-center gap-3 rounded-2xl px-3.5 py-3 active:opacity-70"
            >
              {option.icon ? (
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                  {option.icon}
                </View>
              ) : null}

              <View className="flex-1">
                <CustomText
                  variant="h5"
                  className="font-medium text-gray-800 dark:text-gray-100"
                >
                  {option.label}
                </CustomText>

                {option.description ? (
                  <CustomText
                    variant="h8"
                    className="mt-0.5 text-gray-500 dark:text-gray-400"
                  >
                    {option.description}
                  </CustomText>
                ) : null}
              </View>

              <View
                className={`h-6 w-6 items-center justify-center rounded-full ${
                  selected
                    ? 'bg-primary'
                    : 'border border-BDPrimary dark:border-BDPrimary-dark'
                }`}
              >
                {selected ? (
                  <Check size={14} strokeWidth={3} color="#ffffff" />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="px-3 pb-2 pt-1">
        <Pressable
          onPress={onClose}
          className="items-center rounded-2xl bg-black/5 py-3.5 active:opacity-70 dark:bg-white/10"
        >
          <CustomText
            variant="h5"
            className="font-medium text-gray-700 dark:text-gray-200"
          >
            {cancelLabel}
          </CustomText>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default ChoiceSheet;

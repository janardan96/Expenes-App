import React from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { getMonthLabel } from '@utils/date';
import { cardShadow } from '@utils/shadow';

interface Props {
  month: Date;
  /** Small line under the month, e.g. "12 transactions" */
  caption: string;
  canGoNext: boolean;
  onChangeMonth: (amount: number) => void;
  onOpenPicker: () => void;
}

const MonthSwitcher = ({
  month,
  caption,
  canGoNext,
  onChangeMonth,
  onOpenPicker,
}: Props) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const shadow = [
    cardShadow,
    { shadowColor: isDark ? '#000000' : '#438883' },
  ];

  return (
    <View className="mt-5 flex-row items-center justify-between">
      <Pressable
        onPress={() => onChangeMonth(-1)}
        hitSlop={8}
        className="h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-dark-card"
        style={shadow}
      >
        <ChevronLeft size={18} color="#539e98" />
      </Pressable>

      <Pressable
        onPress={onOpenPicker}
        hitSlop={8}
        className="flex-row items-center gap-1"
      >
        <View className="items-center">
          <CustomText
            variant="h5"
            className="font-semibold text-gray-800 dark:text-gray-100"
          >
            {getMonthLabel(month)}
          </CustomText>

          <CustomText
            variant="h8"
            className="text-gray-500 dark:text-gray-400"
          >
            {caption}
          </CustomText>
        </View>

        <ChevronDown size={14} color="#539e98" />
      </Pressable>

      <Pressable
        disabled={!canGoNext}
        onPress={() => onChangeMonth(1)}
        hitSlop={8}
        className={`h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-dark-card ${
          canGoNext ? '' : 'opacity-40'
        }`}
        style={shadow}
      >
        <ChevronRight size={18} color="#539e98" />
      </Pressable>
    </View>
  );
};

export default MonthSwitcher;

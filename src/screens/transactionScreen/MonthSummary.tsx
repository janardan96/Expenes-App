import React from 'react';
import { View } from 'react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { useCurrency } from '@context/CurrencyContext';
import { styles } from './styles';

interface Props {
  income: number;
  expense: number;
}

const MonthSummary = ({ income, expense }: Props) => {
  const { theme } = useTheme();
  const { format } = useCurrency();
  const isDark = theme === 'dark';

  return (
    <View
      className="mt-4 flex-row rounded-2xl bg-white px-2 py-3 dark:bg-dark-card"
      style={[
        styles.cardShadow,
        { shadowColor: isDark ? '#000000' : '#438883' },
      ]}
    >
      <View className="flex-1 items-center gap-y-0.5">
        <CustomText variant="h8" className="text-gray-500 dark:text-gray-400">
          Income
        </CustomText>

        <CustomText
          variant="h6"
          className="font-semibold text-emerald-600 dark:text-emerald-400"
        >
          {income ? `+${format(income)}` : format(0)}
        </CustomText>
      </View>

      <View className="w-px bg-BDPrimary dark:bg-BDPrimary-dark" />

      <View className="flex-1 items-center gap-y-0.5">
        <CustomText variant="h8" className="text-gray-500 dark:text-gray-400">
          Expense
        </CustomText>

        <CustomText
          variant="h6"
          className="font-semibold text-red-500 dark:text-red-400"
        >
          {expense ? `-${format(expense)}` : format(0)}
        </CustomText>
      </View>

      <View className="w-px bg-BDPrimary dark:bg-BDPrimary-dark" />

      <View className="flex-1 items-center gap-y-0.5">
        <CustomText variant="h8" className="text-gray-500 dark:text-gray-400">
          Net
        </CustomText>

        <CustomText
          variant="h6"
          className="font-semibold text-gray-700 dark:text-gray-200"
        >
          {format(income - expense)}
        </CustomText>
      </View>
    </View>
  );
};

export default MonthSummary;

import React from 'react';
import { View } from 'react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { useCurrency } from '@context/CurrencyContext';
import { cardShadow } from '@utils/shadow';

interface Props {
  income: number;
  expense: number;
  net: number;
  /** Percentages of the month's total money in + out */
  incomeShare: number;
  expenseShare: number;
  netShare: number;
}

const MonthOverview = ({
  income,
  expense,
  net,
  incomeShare,
  expenseShare,
  netShare,
}: Props) => {
  const { theme } = useTheme();
  const { format } = useCurrency();
  const isDark = theme === 'dark';
  const hasFlow = income + expense > 0;

  return (
    <View
      className="mt-4 rounded-2xl bg-white px-2 py-3 dark:bg-dark-card"
      style={[cardShadow, { shadowColor: isDark ? '#000000' : '#438883' }]}
    >
      <View className="flex-row">
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

          <CustomText variant="h8" className="text-gray-400 dark:text-gray-500">
            {incomeShare}%
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

          <CustomText variant="h8" className="text-gray-400 dark:text-gray-500">
            {expenseShare}%
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
            {format(net)}
          </CustomText>

          <CustomText variant="h8" className="text-gray-400 dark:text-gray-500">
            {netShare > 0 ? `+${netShare}%` : `${netShare}%`}
          </CustomText>
        </View>
      </View>

      {/* Income vs expense split of the month's flow */}
      <View className="mt-3 h-2 flex-row overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        {hasFlow ? (
          <>
            <View
              className="h-full bg-emerald-500"
              style={{ flex: income }}
            />
            <View className="h-full bg-red-500" style={{ flex: expense }} />
          </>
        ) : null}
      </View>

      <CustomText
        variant="h8"
        className="mt-2 text-center text-gray-400 dark:text-gray-500"
      >
        Percentages are of this month's money in and out
      </CustomText>
    </View>
  );
};

export default MonthOverview;

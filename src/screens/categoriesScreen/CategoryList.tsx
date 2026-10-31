import React from 'react';
import { View } from 'react-native';

import CustomText from '@components/common/CustomText';
import { TRANSACTION_CATEGORY_META } from '@utils/transactionCategoryIcons';
import { useCurrency } from '@context/CurrencyContext';
import { cardShadow } from '@utils/shadow';
import { useTheme } from '@context/ThemeContext';
import type { CategoryBreakdown } from './types';

interface Props {
  categories: CategoryBreakdown[];
  totalSpent: number;
}

const formatPercent = (value: number): string =>
  `${Number(value.toFixed(1))}%`;

const CategoryList = ({ categories, totalSpent }: Props) => {
  const { theme } = useTheme();
  const { format } = useCurrency();
  const isDark = theme === 'dark';

  return (
    <View>
      <View className="mb-1.5 mt-5 flex-row items-end justify-between px-1">
        <CustomText
          variant="h5"
          className="font-semibold text-gray-700 dark:text-gray-200"
        >
          Spending by category
        </CustomText>

        <CustomText variant="h8" className="text-gray-500 dark:text-gray-400">
          {format(totalSpent)} total
        </CustomText>
      </View>

      <View
        className="rounded-2xl bg-white px-3 dark:bg-dark-card"
        style={[cardShadow, { shadowColor: isDark ? '#000000' : '#438883' }]}
      >
        {categories.map((item, index) => {
          const meta = TRANSACTION_CATEGORY_META[item.category];
          const Icon = meta.icon;

          return (
            <View key={item.category}>
              <View className="flex-row items-center gap-3 py-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${meta.color}22` }}
                >
                  <Icon size={18} color={meta.color} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <CustomText
                      variant="h6"
                      className="flex-1 pr-2 font-medium text-gray-700 dark:text-gray-200"
                      numberOfLines={1}
                    >
                      {item.category}
                    </CustomText>

                    <CustomText
                      variant="h6"
                      className="font-semibold text-gray-700 dark:text-gray-200"
                    >
                      {format(item.amount)}
                    </CustomText>
                  </View>

                  <View className="mt-0.5 flex-row items-center justify-between">
                    <CustomText
                      variant="h8"
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {item.count}{' '}
                      {item.count === 1 ? 'transaction' : 'transactions'}
                    </CustomText>

                    <CustomText
                      variant="h8"
                      className="font-medium text-gray-500 dark:text-gray-400"
                    >
                      {formatPercent(item.percentage)}
                    </CustomText>
                  </View>

                  <View className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(item.percentage, 2)}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </View>
                </View>
              </View>

              {index !== categories.length - 1 && (
                <View className="h-px bg-BDPrimary dark:bg-BDPrimary-dark" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CategoryList;

import { Platform, Pressable, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { selectTransactions } from '@stores/reducers/transactionReducers';
import { TRANSACTION_CATEGORY_META } from '@utils/transactionCategoryIcons';
import { useCurrency } from '@context/CurrencyContext';
import { ScreensName } from '@utils/screen';
import type { TransactionCategory } from '@utils/transactionCategories';

const TOP_COUNT = 8;

const TopCategories = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { format } = useCurrency();
  const isDark = theme === 'dark';
  const transactions = useSelector(selectTransactions);

  const categories = useMemo(() => {
    const totals = new Map<TransactionCategory, number>();

    transactions.forEach(item => {
      if (item.type === 'expense') {
        totals.set(
          item.category,
          (totals.get(item.category) ?? 0) + item.amount,
        );
      }
    });

    return Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_COUNT);
  }, [transactions]);

  const largest = categories[0]?.[1] ?? 0;

  return (
    <View>
      <View className="flex-row justify-between items-end mb-1">
        <CustomText
          variant="h5"
          className="font-semibold text-gray-700 dark:text-gray-200"
        >
          Top Categories
        </CustomText>
        <Pressable
          onPress={() => navigation.navigate(ScreensName.Categories as never)}
          hitSlop={8}
          className="px-4 pb-1"
        >
          <CustomText
            variant="h6"
            className="font-medium text-primary dark:text-[#7fc8c2]"
          >
            See all
          </CustomText>
        </Pressable>
      </View>
      <View
        style={[
          styles.buttonShadow,
          { shadowColor: isDark ? '#000000' : '#438883' },
        ]}
        className="w-full flex bg-white rounded-md py-3 px-3 dark:bg-dark-card mt-2"
      >
        {categories.length === 0 ? (
          <CustomText
            variant="h6"
            className="py-2 text-center text-gray-500 dark:text-gray-400"
          >
            No expenses to summarise yet
          </CustomText>
        ) : (
          categories.map(([category, amount], index) => {
            const meta = TRANSACTION_CATEGORY_META[category];
            const Icon = meta.icon;
            // share of the biggest category, so the bars are comparable
            const width = largest ? (amount / largest) * 100 : 0;

            return (
              <View key={category} className={index > 0 ? 'mt-3' : ''}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${meta.color}22` }}
                  >
                    <Icon size={18} color={meta.color} />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <CustomText
                        variant="h6"
                        className="font-medium text-gray-700 dark:text-gray-200"
                      >
                        {category}
                      </CustomText>

                      <CustomText
                        variant="h6"
                        className="font-semibold text-gray-700 dark:text-gray-200"
                      >
                        {format(amount)}
                      </CustomText>
                    </View>

                    <View className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(width, 6)}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default TopCategories;

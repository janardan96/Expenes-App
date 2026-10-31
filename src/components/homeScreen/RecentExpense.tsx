import { Platform, Pressable, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Minus, Plus } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { selectTransactions } from '@stores/reducers/transactionReducers';
import { TRANSACTION_CATEGORY_META } from '@utils/transactionCategoryIcons';
import { formatDisplayDate } from '@utils/date';
import { useCurrency } from '@context/CurrencyContext';
import { ScreensName } from '@utils/screen';

const RECENT_COUNT = 10;

const RecentExpense = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { format } = useCurrency();
  const isDark = theme === 'dark';
  const transactions = useSelector(selectTransactions);

  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => {
          const byDate =
            new Date(b.date).getTime() - new Date(a.date).getTime();

          return byDate !== 0 ? byDate : b.createdAt.localeCompare(a.createdAt);
        })
        .slice(0, RECENT_COUNT),
    [transactions],
  );

  return (
    <View>
      <View className="flex-row justify-between items-end mb-1">
        <CustomText
          variant="h5"
          className="font-semibold text-gray-700 dark:text-gray-200"
        >
          Recent Transactions
        </CustomText>
        <Pressable
          onPress={() => navigation.navigate(ScreensName.Transactions as never)}
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
        {recent.map((item, index) => {
          const meta = TRANSACTION_CATEGORY_META[item.category];
          const Icon = meta.icon;
          const isIncome = item.type === 'income';

          return (
            <View key={item.id}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${meta.color}22` }}
                >
                  <Icon size={18} color={meta.color} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <CustomText
                        variant="h6"
                        className="font-medium text-gray-700 dark:text-gray-200"
                        numberOfLines={1}
                      >
                        {item.title || item.category}
                      </CustomText>

                      <CustomText
                        variant="h8"
                        className="text-gray-500 dark:text-gray-400"
                      >
                        {formatDisplayDate(new Date(item.date))} · {item.mode}
                      </CustomText>
                    </View>

                    <View className="flex-row items-center gap-x-1">
                      {isIncome ? (
                        <Plus size={16} strokeWidth={2.5} color="#2ac783" />
                      ) : (
                        <Minus size={16} strokeWidth={2.5} color="#ff6b6b" />
                      )}

                      <CustomText
                        variant="h6"
                        className={`font-semibold ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {format(item.amount)}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </View>

              {index !== recent.length - 1 && (
                <View className="border-b border-BDPrimary dark:border-BDPrimary-dark my-2" />
              )}
            </View>
          );
        })}
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

export default RecentExpense;

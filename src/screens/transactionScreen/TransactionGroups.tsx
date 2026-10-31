import React from 'react';
import { View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import type { Transaction } from '@stores/reducers/transactionReducers';
import { TRANSACTION_CATEGORY_META } from '@utils/transactionCategoryIcons';
import { formatDisplayDate } from '@utils/date';
import { useCurrency } from '@context/CurrencyContext';
import { styles } from './styles';
import type { DayGroup } from './types';

const TransactionRow = ({ item }: { item: Transaction }) => {
  const { format } = useCurrency();
  const meta = TRANSACTION_CATEGORY_META[item.category];
  const Icon = meta.icon;
  const isIncome = item.type === 'income';

  return (
    <View className="flex-row items-center gap-3 py-2.5">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${meta.color}22` }}
      >
        <Icon size={18} color={meta.color} />
      </View>

      <View className="flex-1">
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
          numberOfLines={1}
        >
          {item.category} · {item.mode}
        </CustomText>
      </View>

      <View className="flex-row items-center gap-x-1">
        {isIncome ? (
          <Plus size={14} strokeWidth={2.5} color="#2ac783" />
        ) : (
          <Minus size={14} strokeWidth={2.5} color="#ff6b6b" />
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
  );
};

const TransactionGroups = ({ groups }: { groups: DayGroup[] }) => {
  const { theme } = useTheme();
  const { format } = useCurrency();
  const isDark = theme === 'dark';

  return (
    <>
      {groups.map(group => (
        <View key={group.key} className="mt-4">
          <View className="mb-1.5 flex-row items-center justify-between px-1">
            <CustomText
              variant="h7"
              className="font-medium text-gray-500 dark:text-gray-400"
            >
              {formatDisplayDate(group.date)}
            </CustomText>

            <CustomText
              variant="h8"
              className="text-gray-500 dark:text-gray-400"
            >
              {group.expense > 0
                ? `Spent ${format(group.expense)}`
                : `Received ${format(group.income)}`}
            </CustomText>
          </View>

          <View
            className="rounded-2xl bg-white px-3 dark:bg-dark-card"
            style={[
              styles.cardShadow,
              { shadowColor: isDark ? '#000000' : '#438883' },
            ]}
          >
            {group.items.map((item, index) => (
              <View key={item.id}>
                <TransactionRow item={item} />

                {index !== group.items.length - 1 && (
                  <View className="h-px bg-BDPrimary dark:bg-BDPrimary-dark" />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
    </>
  );
};

export default TransactionGroups;

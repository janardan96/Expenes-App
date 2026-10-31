import React from 'react';
import { Pressable, View } from 'react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { useCurrency } from '@context/CurrencyContext';
import { isSameDay, isSameMonth } from '@utils/date';
import { currencyPrefix } from '@utils/format';
import { styles } from './styles';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Keeps calendar cells readable: ₹2,450 becomes ₹2.5k */
const compactAmount = (value: number): string => {
  if (value >= 100000) {
    return `${Math.round(value / 1000)}k`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `${Math.round(value)}`;
};

interface Props {
  month: Date;
  grid: Date[];
  dayTotals: Map<number, { expense: number; income: number }>;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

const TransactionCalendar = ({
  month,
  grid,
  dayTotals,
  selectedDay,
  onSelectDay,
}: Props) => {
  const { theme } = useTheme();
  const { option } = useCurrency();
  const isDark = theme === 'dark';
  const today = new Date();

  return (
    <View
      className="mt-4 rounded-2xl bg-white p-3 dark:bg-dark-card"
      style={[
        styles.cardShadow,
        { shadowColor: isDark ? '#000000' : '#438883' },
      ]}
    >
      {/* Legend for the day colours */}
      <View className="mb-2 flex-row items-center justify-end gap-3">
        <View className="flex-row items-center gap-1">
          <View className="h-2 w-2 rounded-full bg-red-500" />
          <CustomText variant="h8" className="text-gray-500 dark:text-gray-400">
            Spent
          </CustomText>
        </View>

        <View className="flex-row items-center gap-1">
          <View className="h-2 w-2 rounded-full bg-emerald-500" />
          <CustomText variant="h8" className="text-gray-500 dark:text-gray-400">
            Received
          </CustomText>
        </View>
      </View>

      <View className="flex-row">
        {WEEKDAYS.map((day, index) => (
          <View key={`${day}-${index}`} className="w-[14.28%] items-center pb-1">
            <CustomText
              variant="h8"
              className="font-medium text-gray-400 dark:text-gray-500"
            >
              {day}
            </CustomText>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {grid.map(cell => {
          const inMonth = isSameMonth(cell, month);
          const day = cell.getDate();
          const totals = inMonth ? dayTotals.get(day) : undefined;
          const spent = totals?.expense ?? 0;
          const earned = totals?.income ?? 0;
          // The bigger side decides the colour, so salary days show green
          const incomeDominant = earned > spent;
          const amount = incomeDominant ? earned : spent;
          const hasActivity = amount > 0;
          const selected = inMonth && selectedDay === day;
          const isToday = inMonth && isSameDay(cell, today);

          return (
            <View key={cell.toISOString()} className="w-[14.28%] p-[2px]">
              <Pressable
                disabled={!inMonth}
                onPress={() => onSelectDay(day)}
                className={`h-10 items-center justify-center rounded-xl ${
                  inMonth && hasActivity
                    ? incomeDominant
                      ? 'bg-emerald-500/10'
                      : 'bg-red-500/10'
                    : ''
                } ${
                  selected
                    ? 'border-2 border-[#296e69] dark:border-[#7fc8c2]'
                    : ''
                }`}
              >
                <CustomText
                  variant="h7"
                  className={`font-semibold ${
                    !inMonth
                      ? 'text-gray-300 dark:text-gray-600'
                      : isToday
                      ? 'text-[#296e69] dark:text-[#7fc8c2]'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {day}
                </CustomText>

                <CustomText
                  variant="h8"
                  className={
                    inMonth && hasActivity
                      ? incomeDominant
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
                      : 'text-transparent'
                  }
                >
                  {inMonth && hasActivity
                    ? `${currencyPrefix(option.symbol)}${compactAmount(amount)}`
                    : ' '}
                </CustomText>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TransactionCalendar;

import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import BottomSheet from '@components/common/BottomSheet';
import CustomText from '@components/common/CustomText';
import { startOfMonth } from '@utils/date';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface Props {
  visible: boolean;
  /** Currently selected month, used to preselect the year/month */
  month: Date;
  onClose: () => void;
  onSelect: (month: Date) => void;
}

const MonthYearPicker = ({ visible, month, onClose, onSelect }: Props) => {
  const currentMonth = startOfMonth(new Date());
  const [year, setYear] = useState(month.getFullYear());

  // Reopen on the month that is currently displayed on the screen
  useEffect(() => {
    if (visible) {
      setYear(month.getFullYear());
    }
  }, [visible, month]);

  const canGoNextYear = year < currentMonth.getFullYear();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pb-6 pt-2">
        <CustomText
          variant="h5"
          className="mb-4 text-center font-semibold text-gray-800 dark:text-gray-100"
        >
          Choose month
        </CustomText>

        {/* Year switcher */}
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => setYear(value => value - 1)}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10"
          >
            <ChevronLeft size={18} color="#539e98" />
          </Pressable>

          <CustomText
            variant="h4"
            className="font-semibold text-gray-800 dark:text-gray-100"
          >
            {year}
          </CustomText>

          <Pressable
            disabled={!canGoNextYear}
            onPress={() => setYear(value => value + 1)}
            hitSlop={8}
            className={`h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 ${
              canGoNextYear ? '' : 'opacity-40'
            }`}
          >
            <ChevronRight size={18} color="#539e98" />
          </Pressable>
        </View>

        {/* Month grid */}
        <View className="mt-4 flex-row flex-wrap">
          {MONTHS.map((label, index) => {
            const value = new Date(year, index, 1);
            const selected =
              month.getFullYear() === year && month.getMonth() === index;
            const disabled = value.getTime() > currentMonth.getTime();

            return (
              <View key={label} className="w-1/3 p-1">
                <Pressable
                  disabled={disabled}
                  onPress={() => onSelect(value)}
                  className={`items-center rounded-xl py-3 ${
                    selected
                      ? 'bg-[#296e69] dark:bg-primaryDark'
                      : 'bg-black/5 dark:bg-white/5'
                  } ${disabled ? 'opacity-30' : ''}`}
                >
                  <CustomText
                    variant="h6"
                    className={`font-medium ${
                      selected
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {label}
                  </CustomText>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </BottomSheet>
  );
};

export default MonthYearPicker;

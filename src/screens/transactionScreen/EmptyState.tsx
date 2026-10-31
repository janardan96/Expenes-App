import React from 'react';
import { View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { getMonthLabel } from '@utils/date';

interface Props {
  selectedDay: number | null;
  month: Date;
}

const EmptyState = ({ selectedDay, month }: Props) => (
  <View className="mt-6 items-center rounded-2xl border border-BDPrimary bg-white px-6 py-10 dark:border-BDPrimary-dark dark:bg-dark-card">
    <View className="h-14 w-14 items-center justify-center rounded-full bg-[#539e98]/10">
      <CalendarDays size={26} color="#539e98" />
    </View>

    <CustomText
      variant="h5"
      className="mt-4 font-semibold text-gray-700 dark:text-gray-200"
    >
      {selectedDay ? 'Nothing on this day' : 'No transactions'}
    </CustomText>

    <CustomText
      variant="h7"
      className="mt-1 text-center text-gray-500 dark:text-gray-400"
    >
      {selectedDay
        ? 'Tap the highlighted day again to see the whole month.'
        : `Nothing recorded for ${getMonthLabel(month)}.`}
    </CustomText>
  </View>
);

export default EmptyState;

import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { getMonthLabel } from '@utils/date';

const EmptyState = ({ month }: { month: Date }) => (
  <View className="mt-6 items-center rounded-2xl border border-BDPrimary bg-white px-6 py-10 dark:border-BDPrimary-dark dark:bg-dark-card">
    <View className="h-14 w-14 items-center justify-center rounded-full bg-[#539e98]/10">
      <PieChart size={26} color="#539e98" />
    </View>

    <CustomText
      variant="h5"
      className="mt-4 font-semibold text-gray-700 dark:text-gray-200"
    >
      No spending yet
    </CustomText>

    <CustomText
      variant="h7"
      className="mt-1 text-center text-gray-500 dark:text-gray-400"
    >
      Nothing recorded for {getMonthLabel(month)}.
    </CustomText>
  </View>
);

export default EmptyState;

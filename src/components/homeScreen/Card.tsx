import { View } from 'react-native';
import React from 'react';
import CustomText from '@components/common/CustomText';
import { useCurrency } from '@context/CurrencyContext';

interface Props {
  time: string;
  amount: number;
}

const Card = ({ time, amount }: Props) => {
  const { format } = useCurrency();

  return (
    <View className="border flex gap-y-2 border-BDPrimary dark:border-BDPrimary-dark bg-white dark:bg-dark-card rounded-lg px-6 py-3 flex-1">
      <CustomText variant="h6" className="text-gray-500 dark:text-gray-300">
        {time}
      </CustomText>
      <CustomText
        variant="h5"
        className="font-semibold text-gray-700 dark:text-gray-200"
      >
        {format(amount)}
      </CustomText>
    </View>
  );
};

export default Card;

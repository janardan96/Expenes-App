import { View, Platform, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '@context/ThemeContext';
import CustomText from '@components/common/CustomText';
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react-native';
import { useCurrency } from '@context/CurrencyContext';

type Props = {
  balance: number;
  income: number;
  expense: number;
};

const MainCard = ({ balance, income, expense }: Props) => {
  const { theme } = useTheme();
  const { format } = useCurrency();
  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.buttonShadow,
        { shadowColor: isDark ? '#000000' : '#438883' },
      ]}
      className="bg-[#296e69] dark:bg-primaryDark w-full h-52 rounded-xl mt-8 px-4 py-5"
    >
      <View>
        <View className="flex flex-col gap-y-1">
          <CustomText variant="h5" className="text-white mt-1 font-semibold">
            Total Balance
          </CustomText>
          <CustomText
            variant="h1"
            fontSize={24}
            className="text-white font-semibold"
          >
            {format(balance)}
          </CustomText>
        </View>

        <View className="flex flex-row justify-between mt-6">
          <View className="flex flex-col gap-y-1 justify-end items-start">
            <View className="flex flex-row gap-x-2 items-center ">
              <BanknoteArrowDown size={18} color={'#2ac783'} />
              <CustomText variant="h6" className="text-white mt-1 font-regular">
                Income
              </CustomText>
            </View>
            <CustomText variant="h4" className="text-white font-semibold">
              {format(income)}
            </CustomText>
          </View>

          <View className="flex flex-col gap-y-1 justify-end items-end">
            <View className="flex flex-row gap-x-2 items-center ">
              <BanknoteArrowUp size={18} color={'#ff6b6b'} />
              <CustomText variant="h6" className="text-white mt-1 font-regular">
                Expenses
              </CustomText>
            </View>

            <CustomText variant="h4" className="text-white font-semibold">
              {format(expense)}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default MainCard;

import { Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import { customData } from '@utils/dummyData';
import { Minus, Plus } from 'lucide-react-native';

const RecentExpense = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sortedData = customData
    .sort((a, b) => b.amount - a.amount)
    ?.slice(0, 6); // Sort and take top 3 categories
  return (
    <View>
      <View className="flex-row justify-between items-end">
        <CustomText
          variant="h5"
          className="font-semibold text-gray-700 dark:text-gray-200"
        >
          Recent Transactions
        </CustomText>
        <CustomText
          variant="h6"
          className="font-medium text-blue-500 dark:text-blue-400 "
        >
          See all
        </CustomText>
      </View>
      <View
        style={[
          styles.buttonShadow,
          { shadowColor: isDark ? '#000000' : '#438883' },
        ]}
        className="w-full flex bg-white rounded-md py-3 px-2 dark:bg-dark-card mt-2"
      >
        {sortedData?.map((item, index) => {
          return (
            <View key={index}>
              <View className="w-full flex flex-row gap-x-4 items-center ">
                <View className={`rounded-full ${item.bgColor} p-2 flex`}>
                  {item.icon}
                </View>
                <View className="flex-1 px-4">
                  <View className=" flex flex-row justify-between items-center">
                    <View className="flex flex-col gap-y-1.5">
                      <CustomText
                        variant="h6"
                        className="text-gray-700 dark:text-gray-200 font-medium "
                      >
                        {item.name}
                      </CustomText>
                      <CustomText
                        variant="h8"
                        className="text-gray-500 dark:text-gray-400 font-medium "
                      >
                        {item.date} | {item.mode}
                      </CustomText>
                    </View>
                    <View className="flex flex-row gap-x-1 items-center">
                      {item.type === 'income' ? (
                        <Plus size={16} strokeWidth={2.5} color="#2ac783" />
                      ) : (
                        <Minus size={16} strokeWidth={2.5} color="#ff6b6b" />
                      )}
                      <CustomText
                        variant="h6"
                        className="font-semibold text-gray-700 dark:text-gray-200"
                      >
                        ₹{Math.round(Number(item.amount)).toFixed(0)}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </View>
              {index !== sortedData.length - 1 && (
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

import { Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import CustomText from '@components/common/CustomText';
import {
  UtensilsCrossed,
  ShoppingBag,
  Bus,
  Tv,
  Shirt,
  Home,
  Car,
  HeartPulse,
  GraduationCap,
  Receipt,
  Smartphone,
  Dumbbell,
  Plane,
  Gift,
  WalletCards,
  Coffee,
  Fuel,
  BriefcaseBusiness,
  Baby,
  PawPrint,
  MoreHorizontal,
} from 'lucide-react-native';
import { useTheme } from '@context/ThemeContext';

const TopCategories = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const customData = [
    {
      name: 'Food & Dining',
      amount: 233,
      color: '#2ac783',
      bgColor: 'bg-[#2ac783]/20',
      icon: <UtensilsCrossed size={20} color="#2ac783" />,
    },
    {
      name: 'Groceries',
      amount: 500,
      color: '#27ae60',
      bgColor: 'bg-[#27ae60]/20',
      icon: <ShoppingBag size={20} color="#27ae60" />,
    },
    {
      name: 'Shopping',
      amount: 500,
      color: '#ff6b6b',
      bgColor: 'bg-[#ff6b6b]/20',
      icon: <ShoppingBag size={20} color="#ff6b6b" />,
    },
    {
      name: 'Travel',
      amount: 1000,
      color: '#f1c40f',
      bgColor: 'bg-[#f1c40f]/20',
      icon: <Bus size={20} color="#f1c40f" />,
    },
    {
      name: 'Entertainment',
      amount: 750,
      color: '#9b59b6',
      bgColor: 'bg-[#9b59b6]/20',
      icon: <Tv size={20} color="#9b59b6" />,
    },
    {
      name: 'Apparel',
      amount: 750,
      color: '#e67e22',
      bgColor: 'bg-[#e67e22]/20',
      icon: <Shirt size={20} color="#e67e22" />,
    },
    {
      name: 'Rent & Housing',
      amount: 12000,
      color: '#3498db',
      bgColor: 'bg-[#3498db]/20',
      icon: <Home size={20} color="#3498db" />,
    },
    {
      name: 'Transportation',
      amount: 1200,
      color: '#1abc9c',
      bgColor: 'bg-[#1abc9c]/20',
      icon: <Car size={20} color="#1abc9c" />,
    },
    {
      name: 'Fuel',
      amount: 1800,
      color: '#e74c3c',
      bgColor: 'bg-[#e74c3c]/20',
      icon: <Fuel size={20} color="#e74c3c" />,
    },
    {
      name: 'Bills & Utilities',
      amount: 2500,
      color: '#8e44ad',
      bgColor: 'bg-[#8e44ad]/20',
      icon: <Receipt size={20} color="#8e44ad" />,
    },
    {
      name: 'Mobile & Internet',
      amount: 999,
      color: '#2980b9',
      bgColor: 'bg-[#2980b9]/20',
      icon: <Smartphone size={20} color="#2980b9" />,
    },
    {
      name: 'Healthcare',
      amount: 1500,
      color: '#e84393',
      bgColor: 'bg-[#e84393]/20',
      icon: <HeartPulse size={20} color="#e84393" />,
    },
    {
      name: 'Education',
      amount: 2000,
      color: '#16a085',
      bgColor: 'bg-[#16a085]/20',
      icon: <GraduationCap size={20} color="#16a085" />,
    },
    {
      name: 'Fitness & Sports',
      amount: 800,
      color: '#d35400',
      bgColor: 'bg-[#d35400]/20',
      icon: <Dumbbell size={20} color="#d35400" />,
    },
    {
      name: 'Travel & Vacation',
      amount: 3000,
      color: '#00b894',
      bgColor: 'bg-[#00b894]/20',
      icon: <Plane size={20} color="#00b894" />,
    },
    {
      name: 'Coffee & Snacks',
      amount: 450,
      color: '#795548',
      bgColor: 'bg-[#795548]/20',
      icon: <Coffee size={20} color="#795548" />,
    },
    {
      name: 'Subscriptions',
      amount: 699,
      color: '#6c5ce7',
      bgColor: 'bg-[#6c5ce7]/20',
      icon: <WalletCards size={20} color="#6c5ce7" />,
    },
    {
      name: 'Gifts & Donations',
      amount: 1000,
      color: '#fd79a8',
      bgColor: 'bg-[#fd79a8]/20',
      icon: <Gift size={20} color="#fd79a8" />,
    },
    {
      name: 'Work',
      amount: 500,
      color: '#636e72',
      bgColor: 'bg-[#636e72]/20',
      icon: <BriefcaseBusiness size={20} color="#636e72" />,
    },
    {
      name: 'Family & Kids',
      amount: 1500,
      color: '#74b9ff',
      bgColor: 'bg-[#74b9ff]/20',
      icon: <Baby size={20} color="#74b9ff" />,
    },
    {
      name: 'Pets',
      amount: 800,
      color: '#a55eea',
      bgColor: 'bg-[#a55eea]/20',
      icon: <PawPrint size={20} color="#a55eea" />,
    },
    {
      name: 'Other',
      amount: 300,
      color: '#95a5a6',
      bgColor: 'bg-[#95a5a6]/20',
      icon: <MoreHorizontal size={20} color="#95a5a6" />,
    },
  ];
  return (
    <View>
      <View className="mt-6 flex-row justify-between items-end">
        <CustomText
          variant="h5"
          className="font-semibold text-gray-700 dark:text-gray-200"
        >
          Top Categories
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
        {customData?.map((item, index) => {
          return (
            <View key={index}>
              <View className="w-full flex flex-row gap-x-4 items-center ">
                <View className={`rounded-full ${item.bgColor} p-2 flex`}>
                  {item.icon}
                </View>
                <View className="flex-1 px-4">
                  <View className=" flex flex-row justify-between">
                    <CustomText
                      variant="h6"
                      className="text-gray-700 dark:text-gray-200 font-medium "
                    >
                      {item.name}
                    </CustomText>
                    <CustomText
                      variant="h6"
                      className="font-semibold text-gray-700 dark:text-gray-200"
                    >
                      ₹{Math.round(Number(item.amount)).toFixed(0)}
                    </CustomText>
                  </View>
                </View>
              </View>
              {index !== customData.length - 1 && (
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
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default TopCategories;

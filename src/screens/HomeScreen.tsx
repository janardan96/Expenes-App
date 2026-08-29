import { View, Image, ScrollView } from 'react-native';
import React from 'react';
// import { useSelector } from 'react-redux';
// import { profile } from '@stores/reducers/userReducers';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import MainCard from '@components/homeScreen/MainCard';
import Card from '@components/homeScreen/Card';
import TopCategories from '@components/homeScreen/TopCategories';

const HomeScreen = () => {
  // const UserProfile = useSelector(profile);
  const { theme } = useTheme();
  return (
    // <SafeAreaView>
    <View className="flex flex-1 bg-[#F0F6F5] dark:bg-dark-bg">
      <Image
        source={
          theme === 'dark'
            ? require('@assets/images/BackgroundCard-Dark.png')
            : require('@assets/images/BackgroundCard.png')
        }
        className="w-full max-h-80 absolute top-0"
        resizeMode="cover"
      />

      <SafeAreaView className="mx-6 mt-4">
        <ScrollView
          // className="flex-1"
          // contentContainerClassName="mx-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <CustomText variant="h4" className="font-regular text-white">
            Good morning,
          </CustomText>
          <CustomText variant="h6" className="text-white mt-1">
            Here's your overview
          </CustomText>
          <MainCard />
          <View className="flex flex-row w-full gap-5 justify-between mt-7">
            <Card amount={500} time="Today" />
            <Card amount={1500} time="This week" />
          </View>

          <TopCategories />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

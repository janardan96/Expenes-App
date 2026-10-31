import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ScreensName } from '../utils/screen';
import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

const styles = StyleSheet.create({
  buttonShadow: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowColor: 'rgb(67, 136, 131)',
  },
});

const StartUpScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleGetStarted = () => {
    navigation.navigate(ScreensName.LoginScreen as never);
  };

  return (
    <View className="flex-1 bg-white ">
      <Image
        source={require('@assets/images/Login.png')}
        className="w-full max-h-[610px]"
      />
      <View className="flex-1 justify-end pb-10  px-6 ">
        <View className="mb-4 h-1 w-10 rounded-full bg-primary dark:bg-[#7fc8c2]" />

        <CustomText
          variant="h1"
          className="font-bold text-primary dark:text-[#7fc8c2]"
        >
          Spend Smarter,
        </CustomText>

        <CustomText
          variant="h1"
          className="font-bold text-primary dark:text-[#7fc8c2]"
        >
          Save More
        </CustomText>

        <CustomText
          variant="h6"
          className="mt-3 max-w-[85%] leading-5 text-gray-500 dark:text-gray-400"
        >
          Track every expense and grow your savings, one day at a time.
        </CustomText>

        <Pressable
          onPress={handleGetStarted}
          className="mt-7 overflow-hidden rounded-full active:opacity-90"
          style={[
            styles.buttonShadow,
            { shadowColor: isDark ? '#000000' : '#438883' },
          ]}
        >
          <LinearGradient
            colors={
              isDark
                ? ['#4E938E', '#438883', '#2F6B66']
                : ['#63B5AF', '#539E98', '#438883']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View className="flex-row items-center justify-center gap-2 py-4">
              <CustomText variant="h5" className="font-semibold text-white">
                Get Started
              </CustomText>

              <ArrowRight size={18} color="#ffffff" strokeWidth={2.2} />
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      {/* <View className="flex-row justify-center mt-6">
        <Text className="text-gray-500 text-base">
          Already have an account?{' '}
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-primary text-base font-semibold">Login</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default StartUpScreen;

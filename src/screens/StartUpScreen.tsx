import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreensName } from '../utils/screen';

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

  const handleGetStarted = () => {
    navigation.navigate(ScreensName.LoginScreen as never);
  };

  return (
    <View className="flex-1 bg-white">
      <Image
        source={require('@assets/images/Login.png')}
        className="w-full max-h-[610px]"
      />
      <Text className="text-3xl text-primary font-bold text-center mt-6">
        Spend Smarter
      </Text>
      <Text className="text-3xl text-primary font-bold text-center">
        Save More
      </Text>

      <TouchableOpacity
        className={`bg-primary rounded-full py-5 px-8 mt-8 mx-8`}
        activeOpacity={0.7}
        style={styles.buttonShadow}
        onPress={handleGetStarted}
      >
        <Text className="text-white font-semibold text-xl text-center">
          Get Started
        </Text>
      </TouchableOpacity>

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

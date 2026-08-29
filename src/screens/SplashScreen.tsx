import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { ScreensName } from '../utils/screen';
import { useSelector } from 'react-redux';
import { profile } from '@stores/reducers/userReducers';
import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';

const SplashScreen = () => {
  const navigation = useNavigation();
  const UserProfile = useSelector(profile);
  const { theme } = useTheme();
  const gradientColors =
    theme === 'dark'
      ? ['#1A3D3A', '#12302D', '#0B2523']
      : ['#63B5AF', '#539E98', '#438883'];

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (UserProfile && UserProfile.name) {
      timeoutId = setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            // routes: [{ name: ScreensName.StartUpScreen }],
            routes: [{ name: ScreensName.UserBottomTab }],
          }),
        );
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }

    timeoutId = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensName.StartUpScreen }],
        }),
      );
      // resetAndNavigate('LoginScreen');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigation, UserProfile]);

  return (
    <LinearGradient
      colors={gradientColors}
      angle={135}
      style={styles.linearGradient}
      locations={[0.3, 0.5, 0.7]}
    >
      <View className="flex-1 items-center justify-center">
        <Animated.View
          className={'justify-center items-center px-10'}
          entering={FadeInDown.delay(400).duration(1400)}
        >
          <Image
            source={require('@assets/images/LogoWithoutText.png')}
            resizeMode="contain"
            alt="Logo"
            className="w-36 h-36 mb-4"
          />
        </Animated.View>
        <Animated.View
          className={'justify-center items-center px-10'}
          entering={FadeInDown.delay(600).duration(990)}
        >
          <CustomText variant="h2" className="font-bold text-white">
            MoneyBook
          </CustomText>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  animatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
});

export default SplashScreen;

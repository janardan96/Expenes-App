import React, { useEffect, useRef } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Lock, Mail, Phone, User } from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import { useTheme } from '@context/ThemeContext';
import {
  profile as profileSelector,
  setProfile,
} from '@stores/reducers/userReducers';
import type { AppDispatch } from '@stores/reducers/store';
import { ScreensName } from '@utils/screen';
import LoginField from './LoginField';
import { loginSchema, type LoginFormValues } from './loginSchema';

const SUBMIT_DELAY = 700;

const LoginScreen = () => {
  const user = useSelector(profileSelector);
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The keyboard covers the lower part of the form on smaller screens, so
  // nudge the scroll view down once the keyboard starts animating in.
  const revealMobileField = () => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 280);
  };

  useEffect(
    () => () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    },
    [],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
      mobile: user.mobile ?? '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    // Validation passed, so close the keyboard before continuing
    Keyboard.dismiss();

    // Small pause so the button state is visible, mirrors the old behaviour
    await new Promise<void>(resolve => setTimeout(resolve, SUBMIT_DELAY));

    dispatch(
      setProfile({
        name: values.name.trim(),
        email: values.email.trim(),
        mobile: values.mobile,
      }),
    );

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensName.UserBottomTab }],
      }),
    );
  };

  const gradientColors = isDark
    ? ['#173A36', '#12302D', '#0B2523']
    : ['#63B5AF', '#539E98', '#438883'];

  return (
    <View className="flex-1 bg-white dark:bg-dark-bg">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <KeyboardAvoidingView
        className="flex-1 bg-white dark:bg-dark-bg"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ==========================================
              BRAND HEADER
          ========================================== */}

          <View className="overflow-hidden bg-primary dark:bg-[#173A36]">
            <LinearGradient
              colors={gradientColors}
              locations={[0.1, 0.5, 0.9]}
              angle={135}
              style={StyleSheet.absoluteFill}
            />

            <SafeAreaView edges={['top', 'left', 'right']}>
              <View className="px-6 pb-12 pt-6">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require('@assets/images/LogoWithoutText.png')}
                    className="h-12 w-12"
                    resizeMode="contain"
                  />

                  <View>
                    <CustomText
                      variant="h2"
                      className="font-bold tracking-tight text-white"
                    >
                      MoneyBook
                    </CustomText>

                    <CustomText variant="h7" className="mt-0.5 text-white/80">
                      Spend smarter. Save more.
                    </CustomText>
                  </View>
                </View>

                <View className="mt-8">
                  <CustomText variant="h2" className="font-bold text-white">
                    Welcome aboard
                  </CustomText>

                  <CustomText
                    variant="h7"
                    className="mt-2 max-w-[85%] leading-5 text-white/85"
                  >
                    Tell us a little about yourself so we can personalise your
                    dashboard.
                  </CustomText>
                </View>
              </View>
            </SafeAreaView>
          </View>

          {/* ==========================================
              PROFILE FORM
          ========================================== */}

          <View className="-mt-6 rounded-t-[32px] bg-white px-6 pb-10 pt-7 dark:bg-dark-bg">
            <View className="mb-5 flex-row items-end justify-between">
              <CustomText
                variant="h4"
                className="font-semibold text-gray-900 dark:text-gray-50"
              >
                Personal details
              </CustomText>

              <CustomText
                variant="h8"
                className="mb-1 text-gray-400 dark:text-gray-500"
              >
                All fields required
              </CustomText>
            </View>

            <View className="gap-4">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <LoginField
                    label="Full name"
                    icon={User}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. Janardan Sharma"
                    error={errors.name?.message}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    returnKeyType="next"
                    maxLength={50}
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <LoginField
                    label="Email address"
                    icon={Mail}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    maxLength={120}
                    inputRef={emailRef}
                    onSubmitEditing={() => mobileRef.current?.focus()}
                  />
                )}
              />

              <Controller
                control={control}
                name="mobile"
                render={({ field: { onChange, onBlur, value } }) => (
                  <LoginField
                    label="Mobile number"
                    icon={Phone}
                    value={value}
                    onChangeText={text =>
                      onChange(text.replace(/\D/g, '').slice(0, 10))
                    }
                    onBlur={onBlur}
                    placeholder="9876543210"
                    error={errors.mobile?.message}
                    onFocus={revealMobileField}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    returnKeyType="done"
                    maxLength={10}
                    inputRef={mobileRef}
                    onSubmitEditing={handleSubmit(onSubmit, () =>
                      Keyboard.dismiss(),
                    )}
                  />
                )}
              />
            </View>

            {/* ==========================================
                SUBMIT
            ========================================== */}

            <Pressable
              onPress={handleSubmit(onSubmit, () => Keyboard.dismiss())}
              disabled={isSubmitting}
              className="mt-7 overflow-hidden rounded-2xl active:opacity-90"
            >
              <LinearGradient
                colors={['#63B5AF', '#539E98', '#438883']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View
                  className={`flex-row items-center justify-center gap-2 py-4 ${
                    isSubmitting ? 'opacity-80' : ''
                  }`}
                >
                  <CustomText variant="h5" className="font-semibold text-white">
                    {isSubmitting ? 'Setting things up…' : 'Continue'}
                  </CustomText>

                  {isSubmitting ? null : (
                    <ArrowRight size={18} color="#ffffff" strokeWidth={2.2} />
                  )}
                </View>
              </LinearGradient>
            </Pressable>

            <View className="mt-7 flex-row items-center justify-center gap-1.5">
              <Lock size={12} color={isDark ? '#8b8b8b' : '#9ca3af'} />

              <CustomText
                variant="h8"
                className="text-center text-gray-500 dark:text-gray-400"
              >
                Your details stay on this device.
              </CustomText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

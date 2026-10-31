import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Coins,
  Languages,
  LogOut,
  Monitor,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import Layout from '@components/common/Layout';
import {
  LANGUAGES,
  useLanguage,
  type Language,
} from '@context/LanguageContext';
import { useTheme, type ThemePreference } from '@context/ThemeContext';
import {
  CURRENCIES,
  useCurrency,
  type CurrencyCode,
} from '@context/CurrencyContext';
import {
  profile as profileSelector,
  setProfile,
} from '@stores/reducers/userReducers';
import { clearTransactions } from '@stores/reducers/transactionReducers';
import { token_storage } from '@stores/storage';
import { ScreensName } from '@utils/screen';
import ChoiceSheet from './ChoiceSheet';
import ConfirmSheet from './ConfirmSheet';
import ProfileHeader from './ProfileHeader';
import SettingsGroup from './SettingsGroup';
import SettingsRow from './SettingsRow';
import type { OpenSheet, SheetOption } from './types';

const ProfileScreen = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, themePreference, setTheme } = useTheme();
  const { currency, option: currencyOption, setCurrency } = useCurrency();
  const isDark = theme === 'dark';

  const user = useSelector(profileSelector);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);

  const accentColor = isDark ? '#7fc8c2' : '#4E938E';
  const dangerColor = isDark ? '#f87171' : '#ef4444';

  const name = user.name.trim();
  const contact =
    user.email.trim() || user.mobile.trim() || t('addYourDetails');

  const currentLanguage =
    LANGUAGES.find(item => item.code === language) ?? LANGUAGES[0];

  const appearance = {
    light: { label: t('light'), icon: <Sun size={18} color={accentColor} /> },
    dark: { label: t('dark'), icon: <Moon size={18} color={accentColor} /> },
    system: {
      label: t('system'),
      icon: <Monitor size={18} color={accentColor} />,
    },
  }[themePreference];

  const languageOptions: SheetOption<Language>[] = LANGUAGES.map(item => ({
    value: item.code,
    label: item.nativeLabel,
    description: item.label,
  }));

  const appearanceOptions: SheetOption<ThemePreference>[] = [
    {
      value: 'light',
      label: t('light'),
      icon: <Sun size={18} color={accentColor} />,
    },
    {
      value: 'dark',
      label: t('dark'),
      icon: <Moon size={18} color={accentColor} />,
    },
    {
      value: 'system',
      label: t('system'),
      icon: <Monitor size={18} color={accentColor} />,
    },
  ];

  const currencyOptions: SheetOption<CurrencyCode>[] = CURRENCIES.map(item => ({
    value: item.code,
    label: item.label,
    description: `${item.code} · ${item.symbol}`,
    icon: (
      <CustomText
        variant="h6"
        className="font-semibold text-primary dark:text-[#7fc8c2]"
      >
        {item.symbol}
      </CustomText>
    ),
  }));

  const handleClearData = () => {
    setOpenSheet(null);
    dispatch(clearTransactions());
  };

  const handleLogout = () => {
    setOpenSheet(null);
    token_storage.clearAll();
    dispatch(setProfile({ name: '', mobile: '', email: '' }));

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensName.StartUpScreen }],
      }),
    );
  };

  return (
    <Layout>
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <CustomText
            variant="h3"
            className="pt-4 font-semibold text-gray-900 dark:text-gray-50"
          >
            {t('profile')}
          </CustomText>

          <ProfileHeader
            name={name}
            contact={contact}
            guestLabel={t('guest')}
          />

          {/* Preferences */}
          <View className="mt-8">
            <CustomText
              variant="h7"
              className="ml-1 font-semibold uppercase text-gray-500 dark:text-gray-400"
            >
              {t('preferences')}
            </CustomText>

            <SettingsGroup>
              <SettingsRow
                icon={<Languages size={18} color={accentColor} />}
                title={t('language')}
                value={currentLanguage.nativeLabel}
                onPress={() => setOpenSheet('language')}
                showChevron
              />

              <SettingsRow
                icon={appearance.icon}
                title={t('appearance')}
                value={appearance.label}
                onPress={() => setOpenSheet('appearance')}
                showChevron
              />

              <SettingsRow
                icon={<Coins size={18} color={accentColor} />}
                title={t('currency')}
                value={`${currencyOption.symbol} ${currencyOption.code}`}
                onPress={() => setOpenSheet('currency')}
                showChevron
              />
            </SettingsGroup>
          </View>

          {/* Data */}
          <View className="mt-7">
            <CustomText
              variant="h7"
              className="ml-1 font-semibold uppercase text-gray-500 dark:text-gray-400"
            >
              {t('data')}
            </CustomText>

            <SettingsGroup>
              <SettingsRow
                destructive
                icon={<Trash2 size={18} color={dangerColor} />}
                title={t('clearData')}
                subtitle={t('clearDataHint')}
                onPress={() => setOpenSheet('clear')}
              />
            </SettingsGroup>
          </View>

          {/* Log out */}
          <Pressable
            onPress={() => setOpenSheet('logout')}
            className="mt-7 flex-row items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 py-3.5 active:opacity-70"
          >
            <LogOut size={18} color={dangerColor} />

            <CustomText variant="h5" className="font-semibold text-red-500">
              {t('logout')}
            </CustomText>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      <ChoiceSheet<Language>
        visible={openSheet === 'language'}
        title={t('chooseLanguage')}
        subtitle={t('chooseLanguageHint')}
        cancelLabel={t('cancel')}
        options={languageOptions}
        value={language}
        onSelect={value => {
          setLanguage(value);
          setOpenSheet(null);
        }}
        onClose={() => setOpenSheet(null)}
      />

      <ChoiceSheet<ThemePreference>
        visible={openSheet === 'appearance'}
        title={t('chooseAppearance')}
        subtitle={t('chooseAppearanceHint')}
        cancelLabel={t('cancel')}
        options={appearanceOptions}
        value={themePreference}
        onSelect={value => {
          setTheme(value);
          setOpenSheet(null);
        }}
        onClose={() => setOpenSheet(null)}
      />

      <ChoiceSheet<CurrencyCode>
        visible={openSheet === 'currency'}
        title={t('chooseCurrency')}
        subtitle={t('chooseCurrencyHint')}
        cancelLabel={t('cancel')}
        options={currencyOptions}
        value={currency}
        onSelect={value => {
          setCurrency(value);
          setOpenSheet(null);
        }}
        onClose={() => setOpenSheet(null)}
      />

      <ConfirmSheet
        visible={openSheet === 'clear'}
        title={t('clearTitle')}
        message={t('clearMessage')}
        confirmLabel={t('clear')}
        cancelLabel={t('cancel')}
        onConfirm={handleClearData}
        onClose={() => setOpenSheet(null)}
      />

      <ConfirmSheet
        visible={openSheet === 'logout'}
        title={t('logoutTitle')}
        message={t('logoutMessage')}
        confirmLabel={t('logout')}
        cancelLabel={t('cancel')}
        onConfirm={handleLogout}
        onClose={() => setOpenSheet(null)}
      />
    </Layout>
  );
};

export default ProfileScreen;

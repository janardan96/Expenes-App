import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Check,
  ChevronRight,
  Languages,
  LogOut,
  Monitor,
  Moon,
  Sun,
  Trash2,
  User,
} from 'lucide-react-native';

import CustomText from '@components/common/CustomText';
import Layout from '@components/common/Layout';
import BottomSheet from '@components/common/BottomSheet';
import { LANGUAGES, useLanguage, type Language } from '@context/LanguageContext';
import { useTheme, type ThemePreference } from '@context/ThemeContext';
import {
  profile as profileSelector,
  setProfile,
} from '@stores/reducers/userReducers';
import { clearTransactions } from '@stores/reducers/transactionReducers';
import { token_storage } from '@stores/storage';
import { ScreensName } from '@utils/screen';

type OpenSheet = 'language' | 'appearance' | 'clear' | 'logout' | null;

type SheetOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');

/* ------------------------------------------
   Settings rows
------------------------------------------ */

const Row = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  destructive = false,
  showChevron = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const titleColor = destructive
    ? 'text-red-500'
    : 'text-gray-800 dark:text-gray-100';

  const tileColor = destructive
    ? 'rgba(239, 68, 68, 0.12)'
    : isDark
    ? 'rgba(127, 200, 194, 0.14)'
    : 'rgba(78, 147, 142, 0.12)';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-60"
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: tileColor }}
      >
        {icon}
      </View>

      <View className="flex-1">
        <CustomText variant="h5" className={`font-medium ${titleColor}`}>
          {title}
        </CustomText>

        {subtitle ? (
          <CustomText variant="h8" className="mt-0.5 text-gray-500 dark:text-gray-400">
            {subtitle}
          </CustomText>
        ) : null}
      </View>

      {value ? (
        <CustomText variant="h6" className="text-gray-500 dark:text-gray-400" numberOfLines={1}>
          {value}
        </CustomText>
      ) : null}

      {showChevron ? (
        <ChevronRight size={18} color={isDark ? '#6f6f6f' : '#b3b3b3'} />
      ) : null}
    </Pressable>
  );
};

/** Card that groups rows and draws a hairline divider between them. */
const Group = ({ children }: { children: React.ReactNode }) => {
  const rows = React.Children.toArray(children);

  return (
    <View className="mt-2 overflow-hidden rounded-2xl border border-BDPrimary bg-white dark:border-BDPrimary-dark dark:bg-dark-card">
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          {row}

          {index < rows.length - 1 ? (
            <View className="ml-16 border-b border-BDPrimary dark:border-BDPrimary-dark" />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
};

/* ------------------------------------------
   Bottom sheets
------------------------------------------ */

const ChoiceSheet = <T extends string>({
  visible,
  title,
  subtitle,
  options,
  value,
  cancelLabel,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  options: SheetOption<T>[];
  value: T;
  cancelLabel: string;
  onSelect: (value: T) => void;
  onClose: () => void;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const selectedBackground = isDark
    ? 'rgba(127, 200, 194, 0.14)'
    : 'rgba(78, 147, 142, 0.10)';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pb-3 pt-4">
        <CustomText variant="h4" className="font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </CustomText>

        <CustomText variant="h7" className="mt-1 text-gray-500 dark:text-gray-400">
          {subtitle}
        </CustomText>
      </View>

      <View className="gap-1.5 px-3">
        {options.map(option => {
          const selected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={selected ? { backgroundColor: selectedBackground } : null}
              className="flex-row items-center gap-3 rounded-2xl px-3.5 py-3 active:opacity-70"
            >
              {option.icon ? (
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                  {option.icon}
                </View>
              ) : null}

              <View className="flex-1">
                <CustomText variant="h5" className="font-medium text-gray-800 dark:text-gray-100">
                  {option.label}
                </CustomText>

                {option.description ? (
                  <CustomText variant="h8" className="mt-0.5 text-gray-500 dark:text-gray-400">
                    {option.description}
                  </CustomText>
                ) : null}
              </View>

              <View
                className={`h-6 w-6 items-center justify-center rounded-full ${
                  selected
                    ? 'bg-primary'
                    : 'border border-BDPrimary dark:border-BDPrimary-dark'
                }`}
              >
                {selected ? (
                  <Check size={14} strokeWidth={3} color="#ffffff" />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="px-3 pb-2 pt-1">
        <Pressable
          onPress={onClose}
          className="items-center rounded-2xl bg-black/5 py-3.5 active:opacity-70 dark:bg-white/10"
        >
          <CustomText variant="h5" className="font-medium text-gray-700 dark:text-gray-200">
            {cancelLabel}
          </CustomText>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

const ConfirmSheet = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) => (
  <BottomSheet visible={visible} onClose={onClose}>
    <View className="px-5 pt-4">
      <CustomText variant="h4" className="font-semibold text-gray-900 dark:text-gray-50">
        {title}
      </CustomText>

      <CustomText variant="h6" className="mt-2 text-gray-500 dark:text-gray-400">
        {message}
      </CustomText>
    </View>

    <View className="gap-2 px-3 pb-2 pt-5">
      <Pressable
        onPress={onConfirm}
        className="items-center rounded-2xl bg-red-500 py-3.5 active:opacity-80"
      >
        <CustomText variant="h5" className="font-semibold text-white">
          {confirmLabel}
        </CustomText>
      </Pressable>

      <Pressable
        onPress={onClose}
        className="items-center rounded-2xl bg-black/5 py-3.5 active:opacity-70 dark:bg-white/10"
      >
        <CustomText variant="h5" className="font-medium text-gray-700 dark:text-gray-200">
          {cancelLabel}
        </CustomText>
      </Pressable>
    </View>
  </BottomSheet>
);

/* ------------------------------------------
   Screen
------------------------------------------ */

const ProfileScreen = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, themePreference, setTheme } = useTheme();
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

          {/* Identity */}
          <View className="items-center pt-5">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary dark:bg-primaryDark">
              {name ? (
                <CustomText fontSize={26} className="font-semibold text-white">
                  {getInitials(name)}
                </CustomText>
              ) : (
                <User size={34} color="#ffffff" strokeWidth={1.8} />
              )}
            </View>

            <CustomText variant="h3" className="mt-3 font-semibold text-gray-900 dark:text-gray-50">
              {name || t('guest')}
            </CustomText>

            <CustomText variant="h7" className="mt-1 px-8 text-center text-gray-500 dark:text-gray-400">
              {contact}
            </CustomText>
          </View>

          {/* Preferences */}
          <View className="mt-8">
            <CustomText variant="h7" className="ml-1 font-semibold uppercase text-gray-500 dark:text-gray-400">
              {t('preferences')}
            </CustomText>

            <Group>
              <Row
                icon={<Languages size={18} color={accentColor} />}
                title={t('language')}
                value={currentLanguage.nativeLabel}
                onPress={() => setOpenSheet('language')}
                showChevron
              />

              <Row
                icon={appearance.icon}
                title={t('appearance')}
                value={appearance.label}
                onPress={() => setOpenSheet('appearance')}
                showChevron
              />
            </Group>
          </View>

          {/* Data */}
          <View className="mt-7">
            <CustomText variant="h7" className="ml-1 font-semibold uppercase text-gray-500 dark:text-gray-400">
              {t('data')}
            </CustomText>

            <Group>
              <Row
                destructive
                icon={<Trash2 size={18} color={dangerColor} />}
                title={t('clearData')}
                subtitle={t('clearDataHint')}
                onPress={() => setOpenSheet('clear')}
              />
            </Group>
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

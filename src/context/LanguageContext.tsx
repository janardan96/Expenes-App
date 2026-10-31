// src/context/LanguageContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { storage } from '@stores/storage';

const LANGUAGE_KEY = 'app-language';

export type Language = 'en' | 'hi';

export type LanguageOption = {
  code: Language;
  /** English name, useful as a secondary label */
  label: string;
  /** Name written in the language itself */
  nativeLabel: string;
};

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

const en = {
  profile: 'Profile',
  guest: 'Guest user',
  addYourDetails: 'Add your details to personalise the app',
  preferences: 'Preferences',
  language: 'Language',
  appearance: 'Appearance',
  currency: 'Currency',
  data: 'Data',
  clearData: 'Clear all data',
  clearDataHint: 'Remove every saved transaction',
  logout: 'Log out',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  chooseLanguage: 'Choose your language',
  chooseLanguageHint: 'The app will use this language where available',
  chooseAppearance: 'Choose your appearance',
  chooseAppearanceHint: 'Pick a theme or follow your device',
  chooseCurrency: 'Choose your currency',
  chooseCurrencyHint: 'Amounts across the app will use this currency',
  cancel: 'Cancel',
  clear: 'Clear',
  clearTitle: 'Clear all data?',
  clearMessage:
    'Every transaction saved on this device will be deleted. This cannot be undone.',
  logoutTitle: 'Log out?',
  logoutMessage:
    'Your details will be removed from this device. You can sign in again anytime.',
} as const;

export type TranslationKey = keyof typeof en;

type Dictionary = Record<TranslationKey, string>;

const hi: Dictionary = {
  profile: 'प्रोफ़ाइल',
  guest: 'अतिथि उपयोगकर्ता',
  addYourDetails: 'ऐप को निजीकृत करने के लिए अपनी जानकारी जोड़ें',
  preferences: 'प्राथमिकताएँ',
  language: 'भाषा',
  appearance: 'दिखावट',
  currency: 'मुद्रा',
  data: 'डेटा',
  clearData: 'सारा डेटा हटाएँ',
  clearDataHint: 'सभी सहेजे गए लेन-देन हटाएँ',
  logout: 'लॉग आउट',
  light: 'हल्का',
  dark: 'गहरा',
  system: 'सिस्टम',
  chooseLanguage: 'अपनी भाषा चुनें',
  chooseLanguageHint: 'ऐप जहाँ उपलब्ध हो वहाँ यह भाषा उपयोग करेगा',
  chooseAppearance: 'अपनी दिखावट चुनें',
  chooseAppearanceHint: 'थीम चुनें या अपने डिवाइस का पालन करें',
  chooseCurrency: 'अपनी मुद्रा चुनें',
  chooseCurrencyHint: 'ऐप में राशियाँ इस मुद्रा में दिखेंगी',
  cancel: 'रद्द करें',
  clear: 'हटाएँ',
  clearTitle: 'सारा डेटा हटाएँ?',
  clearMessage:
    'इस डिवाइस पर सहेजा गया हर लेन-देन हटा दिया जाएगा। इसे पूर्ववत नहीं किया जा सकता।',
  logoutTitle: 'लॉग आउट करें?',
  logoutMessage:
    'आपका विवरण इस डिवाइस से हटा दिया जाएगा। आप कभी भी फिर से साइन इन कर सकते हैं।',
};

const dictionaries: Record<Language, Dictionary> = { en, hi };

const readLanguage = (): Language => {
  const stored = storage.getString(LANGUAGE_KEY);
  return stored === 'hi' || stored === 'en' ? stored : 'en';
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>(readLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    storage.set(LANGUAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[language][key] ?? dictionaries.en[key],
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { storage } from '@stores/storage';

const THEME_KEY = 'app-theme';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextType = {
  /** Resolved theme that is currently rendered */
  theme: 'light' | 'dark';
  /** What the user picked: light, dark, or follow the system */
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readPreference = (): ThemePreference => {
  const stored = storage.getString(THEME_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  const resolvedTheme: 'light' | 'dark' =
    colorScheme === 'light' || colorScheme === 'dark'
      ? colorScheme
      : systemScheme ?? 'light';

  // Synchronous read — no useEffect needed, avoids the flash-of-wrong-theme on mount
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const preference = readPreference();
    // 'system' lets nativewind follow the device from now on
    setColorScheme(preference);
    return preference;
  });

  const setTheme = (value: ThemePreference) => {
    setColorScheme(value);
    setThemePreference(value);
    if (value === 'system') {
      storage.remove(THEME_KEY); // follow system going forward
    } else {
      storage.set(THEME_KEY, value);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themePreference,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

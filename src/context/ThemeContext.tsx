// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
// import { MMKV } from 'react-native-mmkv';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { storage } from '@stores/storage';

// export const storage = new MMKV(); // or reuse your existing app-wide instance

const THEME_KEY = 'app-theme';

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  console.log({ systemScheme: useColorScheme() });
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  // Synchronous read — no useEffect needed, avoids the flash-of-wrong-theme on mount
  useState(() => {
    const stored = storage.getString(THEME_KEY);
    const resolved = (stored as 'light' | 'dark') ?? systemScheme ?? 'light';
    setColorScheme(resolved);
    return true;
  });

  const toggleTheme = () => {
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(next);
    storage.set(THEME_KEY, next);
  };

  const setTheme = (value: 'light' | 'dark' | 'system') => {
    const resolved = value === 'system' ? systemScheme ?? 'light' : value;
    setColorScheme(resolved);
    if (value === 'system') {
      storage.remove(THEME_KEY); // follow system going forward
    } else {
      storage.set(THEME_KEY, resolved);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme: colorScheme ?? 'light', toggleTheme, setTheme }}
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

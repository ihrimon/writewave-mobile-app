import * as SecureStore from 'expo-secure-store';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

const THEME_PREFERENCE_KEY = 'writewave_theme_preference';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemePreferenceContextValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | undefined>(undefined);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useNativewindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  // NativeWind নিজে থেকে ইউজারের পছন্দ persist করে না (রিস্টার্টে সিস্টেম ডিফল্টে ফিরে যায়) —
  // তাই আগের সেশনে বাছাই করা থিম SecureStore থেকে পড়ে অ্যাপ চালু হওয়ার সময় আবার সেট করা হয়।
  useEffect(() => {
    SecureStore.getItemAsync(THEME_PREFERENCE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
        setColorScheme(stored);
      }
    });
  }, [setColorScheme]);

  function setPreference(next: ThemePreference) {
    setPreferenceState(next);
    setColorScheme(next);
    SecureStore.setItemAsync(THEME_PREFERENCE_KEY, next).catch(() => {});
  }

  return (
    <ThemePreferenceContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return ctx;
}

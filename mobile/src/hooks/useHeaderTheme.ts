import { useColorScheme } from 'nativewind';

// রুট, Auth, Tabs — তিনটা আলাদা navigator-এ একই header রঙ বারবার লেখার বদলে একটা
// শেয়ার্ড হুক, যাতে dark mode-এর কালার টোকেন একবারই ডিফাইন করা থাকে।
export function useHeaderTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#111827' : '#ffffff';

  return {
    isDark,
    backgroundColor,
    headerScreenOptions: {
      headerShown: true,
      headerStyle: { backgroundColor },
      headerTintColor: isDark ? '#34d399' : '#059669',
      headerTitleStyle: { color: isDark ? '#f3f4f6' : '#111827' },
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal' as const,
    },
  };
}

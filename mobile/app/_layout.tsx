import '../global.css';
import '../src/config/reactQuerySetup';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OfflineBanner } from '../src/components/OfflineBanner';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemePreferenceProvider } from '../src/context/ThemePreferenceContext';
import { useHeaderTheme } from '../src/hooks/useHeaderTheme';

const queryClient = new QueryClient();

function RootStack() {
  const { backgroundColor, headerScreenOptions } = useHeaderTheme();

  return (
    <>
      <StatusBar style="auto" />
      <OfflineBanner />
      <Stack screenOptions={{ ...headerScreenOptions, contentStyle: { backgroundColor } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="article/[id]" options={{ title: '' }} />
        <Stack.Screen name="article/edit/[id]" options={{ title: 'Edit Article' }} />
        <Stack.Screen name="author/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemePreferenceProvider>
          <AuthProvider>
            <RootStack />
          </AuthProvider>
        </ThemePreferenceProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

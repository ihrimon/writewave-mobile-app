import '../global.css';
import '../src/config/reactQuerySetup';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OfflineBanner } from '../src/components/OfflineBanner';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemePreferenceProvider } from '../src/context/ThemePreferenceContext';

const queryClient = new QueryClient();

function RootStack() {
  const { colorScheme } = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#111827' : '#ffffff';

  return (
    <>
      <StatusBar style="auto" />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }} />
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

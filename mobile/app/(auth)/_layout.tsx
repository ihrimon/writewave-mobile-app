import { Stack } from 'expo-router';

import { useHeaderTheme } from '../../src/hooks/useHeaderTheme';

export default function AuthLayout() {
  const { headerScreenOptions } = useHeaderTheme();

  return (
    <Stack screenOptions={headerScreenOptions}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
  );
}

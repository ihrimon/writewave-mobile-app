import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../src/context/AuthContext';
import { ThemePreference, useThemePreference } from '../../src/context/ThemePreferenceContext';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { preference, setPreference } = useThemePreference();

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 items-center justify-center bg-white px-6 dark:bg-gray-900">
      <Text className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {user?.name}
      </Text>
      <Text className="mb-8 text-gray-500 dark:text-gray-400">{user?.email}</Text>

      <View className="mb-8 w-full">
        <Text className="mb-2 text-sm text-gray-600 dark:text-gray-400">Theme</Text>
        <View className="flex-row overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
          {THEME_OPTIONS.map((option) => {
            const isActive = preference === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                className={`flex-1 items-center py-2 ${isActive ? 'bg-blue-600' : 'bg-white dark:bg-gray-800'}`}
              >
                <Text
                  className={isActive ? 'font-medium text-white' : 'text-gray-700 dark:text-gray-300'}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {user ? (
        <Pressable
          onPress={() => router.push(`/author/${user.id}`)}
          className="mb-4 w-full items-center rounded-lg border border-gray-300 px-6 py-3 dark:border-gray-600"
        >
          <Text className="font-medium text-gray-700 dark:text-gray-300">
            View my public profile
          </Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={handleLogout}
        className="w-full items-center rounded-lg border border-red-300 px-6 py-3 dark:border-red-800"
      >
        <Text className="font-medium text-red-600 dark:text-red-400">Logout</Text>
      </Pressable>

      <Text className="mt-8 text-sm text-gray-400 dark:text-gray-500">
        Bio/avatar এডিট শীঘ্রই যোগ হবে
      </Text>
    </SafeAreaView>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { AuthorProfileView } from '../../src/components/AuthorProfileView';
import { useAuth } from '../../src/context/AuthContext';
import { ThemePreference, useThemePreference } from '../../src/context/ThemePreferenceContext';
import { useHeaderTheme } from '../../src/hooks/useHeaderTheme';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { preference, setPreference } = useThemePreference();
  const { isDark } = useHeaderTheme();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setMenuVisible(true)} className="p-2" hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color={isDark ? '#34d399' : '#059669'} />
        </Pressable>
      ),
    });
  }, [navigation, isDark]);

  async function handleLogout() {
    setMenuVisible(false);
    await logout();
    router.replace('/(auth)/login');
  }

  if (!user) {
    return null;
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <AuthorProfileView authorId={user.id} />

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setMenuVisible(false)}
        >
          <View className="absolute right-4 top-16 w-56 rounded-xl bg-white p-3 shadow-lg dark:bg-gray-800">
            <Text className="mb-2 px-1 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
              Theme
            </Text>
            <View className="mb-3 flex-row overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
              {THEME_OPTIONS.map((option) => {
                const isActive = preference === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setPreference(option.value)}
                    className={`flex-1 items-center py-2 ${
                      isActive ? 'bg-emerald-600' : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <Text
                      className={
                        isActive ? 'font-medium text-white' : 'text-gray-700 dark:text-gray-300'
                      }
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              onPress={handleLogout}
              className="items-center rounded-lg border border-red-300 px-4 py-2 dark:border-red-800"
            >
              <Text className="font-medium text-red-600 dark:text-red-400">Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-1 text-xl font-semibold text-gray-900">{user?.name}</Text>
      <Text className="mb-8 text-gray-500">{user?.email}</Text>

      {user ? (
        <Pressable
          onPress={() => router.push(`/author/${user.id}`)}
          className="mb-4 rounded-lg border border-gray-300 px-6 py-3"
        >
          <Text className="font-medium text-gray-700">View my public profile</Text>
        </Pressable>
      ) : null}

      <Pressable onPress={handleLogout} className="rounded-lg border border-red-300 px-6 py-3">
        <Text className="font-medium text-red-600">Logout</Text>
      </Pressable>

      <Text className="mt-8 text-sm text-gray-400">Bio/avatar এডিট Phase 7-এ যোগ হবে</Text>
    </View>
  );
}

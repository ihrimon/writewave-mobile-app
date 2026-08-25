import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../src/context/AuthContext';

export default function WelcomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600">
          <Ionicons name="newspaper" size={40} color="#ffffff" />
        </View>

        <Text className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome{user?.name ? `, ${user.name}` : ''}
        </Text>

        <Text className="mb-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
          WriteWave
        </Text>

        <Text className="text-center text-base leading-6 text-gray-500 dark:text-gray-400">
          A community space to read, write, and share news and articles from writers you follow.
        </Text>
      </View>

      <View className="px-8 pb-6">
        <Pressable
          onPress={() => router.replace('/(tabs)/home')}
          className="items-center rounded-lg bg-emerald-600 py-4"
        >
          <Text className="text-base font-semibold text-white">Explore Articles</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

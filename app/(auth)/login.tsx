import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-2 text-3xl font-bold text-gray-900">WriteWave</Text>
      <Text className="mb-8 text-center text-gray-500">
        Login screen — form ও Google Sign-In Phase 1-এ যোগ হবে
      </Text>
      <Link href="/(auth)/register" className="text-blue-600">
        অ্যাকাউন্ট নেই? Register করুন
      </Link>
    </View>
  );
}

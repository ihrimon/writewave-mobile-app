import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function RegisterScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-2 text-3xl font-bold text-gray-900">Register</Text>
      <Text className="mb-8 text-center text-gray-500">
        Register form Phase 1-এ যোগ হবে (name, email, password → POST /api/auth/register)
      </Text>
      <Link href="/(auth)/login" className="text-blue-600">
        আগে থেকে অ্যাকাউন্ট আছে? Login করুন
      </Link>
    </View>
  );
}

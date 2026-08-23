import axios from 'axios';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { GoogleSignInButton } from '../../src/components/GoogleSignInButton';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Login failed')
        : 'Login failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="mb-8 text-center text-3xl font-bold text-gray-900">WriteWave</Text>

      <Text className="mb-1 text-sm text-gray-600">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
      />

      <Text className="mb-1 text-sm text-gray-600">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        className="mb-2 rounded-lg border border-gray-300 px-4 py-3"
      />

      {error ? <Text className="mb-2 text-red-500">{error}</Text> : null}

      <Pressable
        onPress={handleLogin}
        disabled={isSubmitting || !email || !password}
        className="mt-2 items-center rounded-lg bg-blue-600 py-3 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-semibold text-white">Login</Text>
        )}
      </Pressable>

      <GoogleSignInButton />

      <Link href="/(auth)/register" className="mt-6 text-center text-blue-600">
        অ্যাকাউন্ট নেই? Register করুন
      </Link>
    </View>
  );
}

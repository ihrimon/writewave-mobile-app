import axios from 'axios';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedTextInput } from '../../src/components/ThemedTextInput';
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
      router.replace('/welcome');
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
    <SafeAreaView edges={['bottom']} className="flex-1 justify-center bg-white px-6 dark:bg-gray-900">
      <Text className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
        WriteWave
      </Text>

      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Email</Text>
      <ThemedTextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        className="mb-4"
      />

      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Password</Text>
      <ThemedTextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        className="mb-2"
      />

      {error ? <Text className="mb-2 text-red-500 dark:text-red-400">{error}</Text> : null}

      <Pressable
        onPress={handleLogin}
        disabled={isSubmitting || !email || !password}
        className="mt-2 items-center rounded-lg bg-emerald-600 py-3 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-semibold text-white">Login</Text>
        )}
      </Pressable>

      <Link
        href="/(auth)/register"
        className="mt-6 text-center text-emerald-600 dark:text-emerald-400"
      >
        Don&apos;t have an account? Register
      </Link>
    </SafeAreaView>
  );
}

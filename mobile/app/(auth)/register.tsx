import axios from 'axios';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedTextInput } from '../../src/components/ThemedTextInput';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.replace('/welcome');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Register failed')
        : 'Register failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 justify-center bg-white px-6 dark:bg-gray-900">
      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Name</Text>
      <ThemedTextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        className="mb-4"
      />

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
        placeholder="At least 6 characters"
        className="mb-2"
      />

      {error ? <Text className="mb-2 text-red-500 dark:text-red-400">{error}</Text> : null}

      <Pressable
        onPress={handleRegister}
        disabled={isSubmitting || !name || !email || !password}
        className="mt-2 items-center rounded-lg bg-emerald-600 py-3 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-semibold text-white">Register</Text>
        )}
      </Pressable>

      <Link
        href="/(auth)/login"
        className="mt-6 text-center text-emerald-600 dark:text-emerald-400"
      >
        Already have an account? Login
      </Link>
    </SafeAreaView>
  );
}

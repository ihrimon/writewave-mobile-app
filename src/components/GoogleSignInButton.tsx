import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const [isExchanging, setIsExchanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success' && response.params.id_token) {
      setError(null);
      setIsExchanging(true);
      loginWithGoogle(response.params.id_token)
        .catch(() => setError('Google login failed, আবার চেষ্টা করো'))
        .finally(() => setIsExchanging(false));
    } else if (response?.type === 'error') {
      setError('Google login বাতিল হয়েছে বা ব্যর্থ হয়েছে');
    }
  }, [response]);

  return (
    <>
      <Pressable
        disabled={!request || isExchanging}
        onPress={() => promptAsync()}
        className="mt-4 w-full items-center rounded-lg border border-gray-300 py-3 disabled:opacity-50"
      >
        {isExchanging ? (
          <ActivityIndicator />
        ) : (
          <Text className="font-medium text-gray-700">Continue with Google</Text>
        )}
      </Pressable>
      {error ? <Text className="mt-2 text-center text-red-500">{error}</Text> : null}
    </>
  );
}

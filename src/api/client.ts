import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const AUTH_TOKEN_KEY = 'writewave_auth_token';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

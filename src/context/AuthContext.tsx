import * as SecureStore from 'expo-secure-store';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { googleLoginRequest, loginRequest, meRequest, registerRequest } from '../api/auth';
import { AUTH_TOKEN_KEY } from '../api/client';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const currentUser = await meRequest();
      setUser(currentUser);
    } catch {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function persistSession(token: string, authedUser: User) {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    setUser(authedUser);
  }

  async function login(email: string, password: string) {
    const { token, user: authedUser } = await loginRequest(email, password);
    await persistSession(token, authedUser);
  }

  async function register(name: string, email: string, password: string) {
    const { token, user: authedUser } = await registerRequest(name, email, password);
    await persistSession(token, authedUser);
  }

  async function loginWithGoogle(idToken: string) {
    const { token, user: authedUser } = await googleLoginRequest(idToken);
    await persistSession(token, authedUser);
  }

  async function logout() {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

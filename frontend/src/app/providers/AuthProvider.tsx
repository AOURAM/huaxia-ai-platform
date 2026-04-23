import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { getCurrentUser, loginUser, registerUser } from '@/api/users';
import { clearStoredToken, getStoredToken, persistToken } from '@/lib/authStorage';
import { ApiError } from '@/lib/http';
import type { AuthState, LoginCredentials, RegisterPayload } from '@/types/auth';
import type { User } from '@/types/user';

interface RegisterOptions {
  remember?: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (payload: RegisterPayload, options?: RegisterOptions) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const completeAuthenticatedSession = useCallback(
    async (accessToken: string, remember: boolean) => {
      persistToken(accessToken, remember);

      try {
        const currentUser = await getCurrentUser(accessToken);
        setToken(accessToken);
        setUser(currentUser);
        return currentUser;
      } catch (error) {
        clearStoredToken();
        setToken(null);
        setUser(null);

        if (error instanceof ApiError) {
          throw error;
        }

        throw new ApiError('Authentication succeeded, but loading your profile failed.', 500);
      }
    },
    [],
  );

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(storedToken);
        setToken(storedToken);
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrapAuth();
  }, [logout]);

  const login = useCallback(
    async ({ email, password, remember }: LoginCredentials) => {
      const authToken = await loginUser(email, password);
      return completeAuthenticatedSession(authToken.access_token, remember);
    },
    [completeAuthenticatedSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload, options?: RegisterOptions) => {
      await registerUser(payload);

      try {
        const authToken = await loginUser(payload.email, payload.password);
        return await completeAuthenticatedSession(authToken.access_token, options?.remember ?? true);
      } catch (error) {
        clearStoredToken();
        setToken(null);
        setUser(null);

        if (error instanceof ApiError) {
          throw new ApiError(
            'Account created, but automatic sign in failed. Please sign in manually.',
            error.status,
          );
        }

        throw new ApiError(
          'Account created, but automatic sign in failed. Please sign in manually.',
          500,
        );
      }
    },
    [completeAuthenticatedSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isBootstrapping,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [isBootstrapping, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
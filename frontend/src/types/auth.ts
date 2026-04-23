import type { User } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
}
import { http } from '@/lib/http';
import type { RegisterPayload, TokenResponse } from '@/types/auth';
import type { User } from '@/types/user';

export function loginUser(email: string, password: string) {
  const body = new URLSearchParams();
  body.set('username', email);
  body.set('password', password);

  return http<TokenResponse>('/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
}

export function registerUser(payload: RegisterPayload) {
  return http<User>('/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(token: string) {
  return http<User>('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
import type { ApiErrorPayload } from '@/types/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    const frontendOrigin =
      typeof window !== 'undefined' ? window.location.origin : 'your frontend origin';

    throw new ApiError(
      `Cannot reach backend. Start FastAPI and enable CORS for ${frontendOrigin}.`,
      0,
    );
  }

  if (!response.ok) {
    let payload: ApiErrorPayload | null = null;

    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = null;
    }

    throw new ApiError(payload?.detail ?? `Request failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}
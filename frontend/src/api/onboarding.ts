import { http } from '@/lib/http';
import type { OnboardingPayload, OnboardingResponse } from '@/types/onboarding';

export function saveOnboarding(payload: OnboardingPayload) {
  return http<OnboardingResponse>('/users/me/onboarding/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function getOnboarding() {
  return http<OnboardingResponse>('/users/me/onboarding/');
}
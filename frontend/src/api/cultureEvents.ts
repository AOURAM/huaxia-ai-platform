import { http } from '@/lib/http';
import type { CreateCultureEventPayload, CultureEvent } from '@/types/cultureEvent';

export function getCultureEvents() {
  return http<CultureEvent[]>('/culture-events/');
}

export function createCultureEvent(payload: CreateCultureEventPayload) {
  return http<CultureEvent>('/culture-events/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
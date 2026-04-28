import { useQuery } from '@tanstack/react-query';

import { getCultureEvents } from '@/api/cultureEvents';

export function useCultureEvents() {
  return useQuery({
    queryKey: ['culture-events'],
    queryFn: getCultureEvents,
  });
}
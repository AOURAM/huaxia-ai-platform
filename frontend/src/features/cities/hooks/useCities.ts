import { useQuery } from '@tanstack/react-query';

import { getCities, getCityPosts } from '@/api/cities';

export function useCities(region: string, search: string) {
  return useQuery({
    queryKey: ['cities', region, search],
    queryFn: () => getCities({ region, search }),
  });
}

export function useCityPosts(slug: string | undefined) {
  return useQuery({
    queryKey: ['cities', slug, 'posts'],
    queryFn: () => getCityPosts(slug!),
    enabled: Boolean(slug),
  });
}
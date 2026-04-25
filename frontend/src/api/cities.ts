import { http } from '@/lib/http';
import type { City } from '@/types/city';
import type { Post } from '@/types/post';

export function getCities(params?: { region?: string; search?: string }) {
  const query = new URLSearchParams();

  if (params?.region && params.region !== 'all') {
    query.set('region', params.region);
  }

  if (params?.search?.trim()) {
    query.set('search', params.search.trim());
  }

  const queryString = query.toString();

  return http<City[]>(`/cities/${queryString ? `?${queryString}` : ''}`);
}

export function getCityPosts(slug: string) {
  return http<Post[]>(`/cities/${slug}/posts`);
}
import { buildApiUrl, http } from '@/lib/http';
import type {
  ContentType,
  PageName,
  Post,
  PostDetailResponse,
  SearchPostsResponse,
  TopPostsResponse,
} from '@/types/post';

export interface CreatePostPayload {
  title: string;
  content: string;
  page_name: PageName;
  content_type: ContentType;
  image?: File | null;
  city_id?: number | null;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  page_name?: PageName;
  content_type?: ContentType;
  image?: File | null;
  city_id?: number | null;
}

export interface SearchPostsPayload {
  query: string;
  page_name?: PageName;
  content_type?: ContentType;
  limit?: number;
}

export function getAllPosts() {
  return http<Post[]>('/posts/');
}

export function getPersonalizedFeed() {
  return http<Post[]>('/feed/');
}

export function getPost(postId: number) {
  return http<Post>(`/posts/${postId}`);
}

export function getPostDetail(postId: number) {
  return http<PostDetailResponse>(`/posts/${postId}/detail`);
}

export function getTopPosts(limit = 5, pageName?: PageName) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));

  if (pageName) {
    params.set('page_name', pageName);
  }

  return http<TopPostsResponse>(`/posts/top?${params.toString()}`);
}

export function searchPosts(payload: SearchPostsPayload) {
  return http<SearchPostsResponse>('/posts/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: payload.query,
      page_name: payload.page_name,
      content_type: payload.content_type,
      limit: payload.limit ?? 20,
    }),
  });
}

export function createPost(payload: CreatePostPayload) {
  const body = new FormData();

  body.set('title', payload.title);
  body.set('content', payload.content);
  body.set('page_name', payload.page_name);
  body.set('content_type', payload.content_type);

  if (payload.city_id) {
    body.set('city_id', String(payload.city_id));
  }

  if (payload.image) {
    body.set('image', payload.image);
  }

  return http<Post>('/posts/', {
    method: 'POST',
    body,
  });
}

export function updatePost(postId: number, payload: UpdatePostPayload) {
  const body = new FormData();

  if (payload.title !== undefined) {
    body.set('title', payload.title);
  }

  if (payload.content !== undefined) {
    body.set('content', payload.content);
  }

  if (payload.page_name !== undefined) {
    body.set('page_name', payload.page_name);
  }

  if (payload.content_type !== undefined) {
    body.set('content_type', payload.content_type);
  }

  if (payload.city_id !== undefined && payload.city_id !== null) {
    body.set('city_id', String(payload.city_id));
  }

  if (payload.image) {
    body.set('image', payload.image);
  }

  return http<Post>(`/posts/${postId}`, {
    method: 'PUT',
    body,
  });
}

export function deletePost(postId: number) {
  return http<{ message: string }>(`/posts/${postId}`, {
    method: 'DELETE',
  });
}

export function reactToPost(postId: number, reactionType: 'like' | 'dislike') {
  return http<{ message: string; likes_count: number; dislikes_count: number }>(
    `/posts/${postId}/react`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reaction_type: reactionType }),
    },
  );
}

export function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;

  return buildApiUrl(imageUrl);
}
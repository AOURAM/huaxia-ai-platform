import type { CommentDetail } from '@/types/comment';

export type PageName = 'cities' | 'universities' | 'culture' | 'daily_life';

export type ContentType = 'question' | 'guide' | 'experience' | 'news' | 'tip';

export interface Post {
  id: number;
  title: string;
  content: string;
  page_name: PageName;
  content_type: ContentType;
  category: string | null;
  ai_analysis: string | null;
  summary: string | null;
  tags: string[] | null;
  image_url: string | null;
  likes_count: number;
  dislikes_count: number;
  created_at: string;
  user_id: number;
}

export interface SearchPost extends Post {
  semantic_score?: number;
  keyword_score?: number;
  final_score?: number;
}

export interface SearchPostsResponse {
  results: SearchPost[];
}

export interface TopPost {
  id: number;
  title: string;
  page_name: PageName;
  content_type: ContentType;
  category: string | null;
  summary: string | null;
  image_url: string | null;
  likes_count: number;
  dislikes_count: number;
  top_score: number;
}

export interface TopPostsResponse {
  results: TopPost[];
}

export interface RecommendationPost {
  id: number;
  title: string;
  page_name: PageName;
  content_type: ContentType;
  category: string | null;
  summary: string | null;
  image_url: string | null;
  similarity: number;
  engagement_score: number;
  recommendation_score: number;
}

export interface PostDetailResponse {
  post: Post;
  comments: CommentDetail[];
  total_comments: number;
  recommendations: RecommendationPost[];
  user_reaction: 'like' | 'dislike' | null;
}
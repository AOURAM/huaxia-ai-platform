export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  post_id: number;
}

export interface CommentDetail extends Comment {
  username: string;
}

export interface CommentCreatePayload {
  content: string;
}

export interface CommentUpdatePayload {
  content: string;
}
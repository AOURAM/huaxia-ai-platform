import { http } from '@/lib/http';
import type { Comment, CommentCreatePayload, CommentUpdatePayload } from '@/types/comment';

export function createComment(postId: number, payload: CommentCreatePayload) {
  return http<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function getPostComments(postId: number) {
  return http<Comment[]>(`/posts/${postId}/comments`);
}

export function updateComment(commentId: number, payload: CommentUpdatePayload) {
  return http<Comment>(`/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function deleteComment(commentId: number) {
  return http<{ message: string }>(`/comments/${commentId}`, {
    method: 'DELETE',
  });
}
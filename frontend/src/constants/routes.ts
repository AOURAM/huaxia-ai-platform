export const ROUTES = {
  login: '/login',
  register: '/register',
  onboarding: '/onboarding',
  home: '/feed',
  postDetail: '/posts/:postId',
} as const;

export function buildPostDetailRoute(postId: number) {
  return `/posts/${postId}`;
}
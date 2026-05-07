export const ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  onboarding: '/onboarding',
  home: '/feed',
  cities: '/cities',
  universities: '/universities',
  culture: '/culture',
  dailyLife: '/daily-life',
  profile: '/profile',
  settings: '/settings',
  postDetail: '/posts/:postId',
  postEdit: '/posts/:postId/edit',
} as const;

export function buildPostDetailRoute(postId: number) {
  return `/posts/${postId}`;
}

export function buildPostEditRoute(postId: number) {
  return `/posts/${postId}/edit`;
}
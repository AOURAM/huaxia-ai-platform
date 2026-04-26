import { useQuery } from '@tanstack/react-query';

import { getAllPosts } from '@/api/posts';
import type { PageName, Post } from '@/types/post';

export function useSectionPosts(pageName: PageName) {
  return useQuery({
    queryKey: ['section-posts', pageName],
    queryFn: async () => {
      const posts = await getAllPosts();
      return posts.filter((post: Post) => post.page_name === pageName);
    },
  });
}
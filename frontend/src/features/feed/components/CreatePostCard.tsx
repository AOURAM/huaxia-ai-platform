import { Image, Loader2, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';
import type { ContentType, PageName } from '@/types/post';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { StatusBanner } from '@/shared/components/common/StatusBanner';

export function CreatePostCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pageName, setPageName] = useState<PageName>('daily_life');
  const [contentType, setContentType] = useState<ContentType>('question');
  const [image, setImage] = useState<File | null>(null);

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      setTitle('');
      setContent('');
      setImage(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.topPosts });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      page_name: pageName,
      content_type: contentType,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand-outline bg-white p-5 shadow-sm">
      {createMutation.isError ? (
        <div className="mb-4">
          <StatusBanner tone="error" message="Could not create post. Check backend and AI service." />
        </div>
      ) : null}

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
          {user?.username?.slice(0, 2).toUpperCase() || 'HX'}
        </div>

        <div>
          <p className="font-bold text-brand-on-surface">{user?.username || 'Huaxia user'}</p>
          <p className="text-xs text-brand-on-surface/50">Share practical student knowledge</p>
        </div>
      </div>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Post title"
        className="mb-3 w-full rounded-lg border border-brand-outline bg-brand-neutral-soft px-4 py-3 outline-none focus:border-brand-primary focus:bg-white"
      />

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Ask a question, share a guide, or describe your experience..."
        rows={4}
        className="mb-4 w-full resize-none rounded-lg border border-brand-outline bg-brand-neutral-soft px-4 py-3 outline-none focus:border-brand-primary focus:bg-white"
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          value={pageName}
          onChange={(event) => setPageName(event.target.value as PageName)}
          className="rounded-lg border border-brand-outline bg-white px-4 py-3"
        >
          <option value="cities">Cities</option>
          <option value="universities">Universities</option>
          <option value="culture">Culture</option>
          <option value="daily_life">Daily Life</option>
        </select>

        <select
          value={contentType}
          onChange={(event) => setContentType(event.target.value as ContentType)}
          className="rounded-lg border border-brand-outline bg-white px-4 py-3"
        >
          <option value="question">Question</option>
          <option value="guide">Guide</option>
          <option value="experience">Experience</option>
          <option value="news">News</option>
          <option value="tip">Tip</option>
        </select>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-brand-outline/40 pt-4 sm:flex-row sm:items-center">
        <label className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-brand-on-surface/60 transition hover:bg-brand-neutral-soft hover:text-brand-primary">
          <Image className="h-5 w-5" />
          {image ? image.name : 'Add image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          />
        </label>

        <button
          type="submit"
          disabled={createMutation.isPending || !title.trim() || !content.trim()}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-8 py-3 text-sm font-bold text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Publish
        </button>
      </div>
    </form>
  );
}
import { Image, Loader2, MapPin, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUser } from '@/features/profile/hooks/useCurrentUser';
import type { ContentType, PageName } from '@/types/post';
import { LocalUserAvatar } from '@/shared/components/user/LocalUserAvatar';

interface CreatePostCardProps {
  pageName?: PageName;
  cityId?: number | null;
  compact?: boolean;
}

export function CreatePostCard({
  pageName = 'daily_life',
  cityId = null,
}: CreatePostCardProps) {
  const { user } = useAuth();
  const { data: freshUser } = useCurrentUser();
  const displayUser = freshUser ?? user;

  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>('experience');
  const [selectedCityId, setSelectedCityId] = useState<number | null>(cityId);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    setSelectedCityId(cityId);
  }, [cityId]);

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      setTitle('');
      setContent('');
      setImage(null);

      if (!cityId) {
        setSelectedCityId(null);
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.personalizedFeed });
      await queryClient.invalidateQueries({ queryKey: queryKeys.topPosts });
      await queryClient.invalidateQueries({
        queryKey: ['cities', selectedCityId, 'posts'],
      });
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    if (pageName === 'cities' && !selectedCityId) {
      alert('Select a city first.');
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      page_name: pageName,
      content_type: contentType,
      city_id: pageName === 'cities' ? selectedCityId : null,
      image,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="create-post-card rounded-3xl border border-brand-outline/70 bg-brand-surface p-6 shadow-none"
    >
      <div className="flex gap-4">
        <LocalUserAvatar user={displayUser} size="sm" />

        <div className="min-w-0 flex-1">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Share an insight, question, or student experience..."
            className="mb-3 w-full border-0 bg-transparent text-sm shadow-none outline-none ring-0 placeholder:text-brand-on-surface/45 focus:shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write the details here..."
            rows={3}
            className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed shadow-none outline-none ring-0 placeholder:text-brand-on-surface/35 focus:shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          />

          <div className="mt-4 border-t border-brand-outline/50 pt-4">
            <div className="mb-3 flex flex-wrap gap-3">
              <select
                value={contentType}
                onChange={(event) => setContentType(event.target.value as ContentType)}
                className="rounded-xl border border-brand-outline bg-brand-neutral-soft px-4 py-2.5 text-xs font-bold text-brand-on-surface/70 shadow-none outline-none ring-0 focus:border-brand-primary focus:shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <option value="experience">Experience</option>
                <option value="question">Question</option>
                <option value="guide">Guide</option>
                <option value="news">News</option>
                <option value="tip">Tip</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-brand-on-surface/55 transition hover:text-brand-primary">
                  <Image className="h-4 w-4" />
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                  />
                </label>

                <span className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                  <Sparkles className="h-4 w-4" />
                  AI Assist
                </span>

                {pageName === 'cities' && selectedCityId ? (
                  <span className="flex items-center gap-1 rounded-full bg-brand-neutral-soft px-3 py-1 text-xs font-bold text-brand-primary">
                    <MapPin className="h-3 w-3" />
                    City linked
                  </span>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending || !title.trim() || !content.trim()}
                className="flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-2.5 text-xs font-bold text-white transition hover:bg-brand-primary-hover disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Publish
              </button>
            </div>

            {image ? (
              <div className="mt-3 flex w-fit items-center gap-2 rounded-full border border-brand-outline bg-brand-neutral-soft px-3 py-1.5 text-xs font-bold text-brand-on-surface/60">
                <Image className="h-3.5 w-3.5" />
                <span className="max-w-[240px] truncate">{image.name}</span>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="rounded-full p-0.5 text-brand-on-surface/45 transition hover:bg-brand-primary/10 hover:text-brand-primary"
                  aria-label="Remove selected image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}

            {createMutation.isError ? (
              <div className="mt-3 rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-3 text-xs font-bold text-brand-danger">
                Could not publish this post. Check the backend response.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
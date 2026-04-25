import { Image, Loader2, MapPin, Paperclip, Send, Sparkles } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCities } from '@/features/cities/hooks/useCities';
import type { ContentType, PageName } from '@/types/post';

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
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>('experience');
  const [selectedCityId, setSelectedCityId] = useState<number | null>(cityId);

useEffect(() => {
  setSelectedCityId(cityId);
}, [cityId]);
  const [image, setImage] = useState<File | null>(null);

  const { data: cities = [] } = useCities('all', '');

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      setTitle('');
      setContent('');
      setImage(null);
      if (!cityId) setSelectedCityId(null);

      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: ['cities', selectedCityId, 'posts'] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
      className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm"
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-outline bg-brand-neutral-soft text-sm font-bold text-brand-primary">
          {user?.username?.slice(0, 2).toUpperCase() || 'U'}
        </div>

        <div className="min-w-0 flex-1">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Share an insight, question, or student experience..."
            className="mb-3 w-full border-0 bg-transparent text-sm outline-none placeholder:text-brand-on-surface/45"
          />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write the details here..."
            rows={3}
            className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed outline-none placeholder:text-brand-on-surface/35"
          />

          <div className="mt-4 border-t border-brand-outline/50 pt-4">
          <div className="mb-3 flex flex-wrap gap-3">
  <select
    value={contentType}
    onChange={(event) => setContentType(event.target.value as ContentType)}
    className="rounded-xl border border-brand-outline bg-brand-neutral-soft px-4 py-2.5 text-xs font-bold text-brand-on-surface/70 outline-none focus:border-brand-primary"
  >
    <option value="experience">Experience</option>
    <option value="question">Question</option>
    <option value="guide">Guide</option>
    <option value="news">News</option>
    <option value="tip">Tip</option>
  </select>
</div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-brand-on-surface/55 transition hover:text-brand-primary">
                  <Image className="h-4 w-4" />
                  Media
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                  />
                </label>

                <span className="flex items-center gap-2 text-xs font-bold text-brand-on-surface/55">
                  <Paperclip className="h-4 w-4" />
                  File
                </span>

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
              <p className="mt-3 text-xs text-brand-on-surface/50">Attached: {image.name}</p>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
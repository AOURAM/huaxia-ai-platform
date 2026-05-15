import { Loader2, Save, UploadCloud } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getPost } from '@/api/posts';
import { ROUTES, buildPostDetailRoute } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUpdatePost } from '@/features/posts/hooks/useUpdatePost';
import type { ContentType, PageName } from '@/types/post';

const pageOptions: Array<{ value: PageName; label: string }> = [
  { value: 'cities', label: 'Cities' },
  { value: 'universities', label: 'Universities' },
  { value: 'culture', label: 'Culture' },
  { value: 'daily_life', label: 'Daily Life' },
];

const contentTypeOptions: Array<{ value: ContentType; label: string }> = [
  { value: 'question', label: 'Question' },
  { value: 'guide', label: 'Guide' },
  { value: 'experience', label: 'Experience' },
  { value: 'news', label: 'News' },
  { value: 'tip', label: 'Tip' },
];

export function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const numericPostId = Number(postId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pageName, setPageName] = useState<PageName>('daily_life');
  const [contentType, setContentType] = useState<ContentType>('experience');
  const [image, setImage] = useState<File | null>(null);

  const postQuery = useQuery({
    queryKey: ['post', numericPostId],
    queryFn: () => getPost(numericPostId),
    enabled: Number.isFinite(numericPostId) && numericPostId > 0,
  });

  const updateMutation = useUpdatePost({ postId: numericPostId });

  const post = postQuery.data;
  const isOwner = Boolean(user && post && user.id === post.user_id);

  useEffect(() => {
    if (!post) return;

    setTitle(post.title);
    setContent(post.content);
    setPageName(post.page_name);
    setContentType(post.content_type);
  }, [post]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!post || !isOwner || updateMutation.isPending) return;
    if (!title.trim() || !content.trim()) return;

    updateMutation.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        page_name: pageName,
        content_type: contentType,

        /*
          Do not expose city_id to the user.
          If this post already had a city_id, keep it.
          If not, let the backend keep/update the post without forcing the user to know database IDs.
        */
        city_id: pageName === 'cities' ? post.city_id ?? null : null,
        image,
      },
      {
        onSuccess: (updatedPost) => {
          navigate(buildPostDetailRoute(updatedPost.id));
        },
      },
    );
  };

  if (!Number.isFinite(numericPostId) || numericPostId <= 0) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="rounded-3xl border border-brand-outline bg-brand-surface p-8">
          <h1 className="text-3xl font-black tracking-[-0.04em] text-brand-on-surface">
            Invalid post
          </h1>

          <p className="mt-3 text-brand-on-surface/60">This edit link is not valid.</p>

          <Link
            to={ROUTES.home}
            className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-black text-[#EDF2F4] transition hover:bg-brand-primary-hover"
          >
            Back to feed
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          to={post ? buildPostDetailRoute(post.id) : ROUTES.home}
          className="rounded-xl border border-brand-outline px-5 py-3 text-xs font-black uppercase tracking-widest text-brand-on-surface/55 transition hover:text-brand-on-surface"
        >
          Back
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-brand-on-surface">
          Edit post
        </h1>

        <p className="mt-2 max-w-2xl text-base font-medium leading-7 text-brand-on-surface/60">
          Update your post. If you change the content, the backend will regenerate AI summary, tags,
          and category.
        </p>
      </div>

      {postQuery.isLoading ? (
        <div className="rounded-3xl border border-brand-outline bg-brand-surface p-8">
          <div className="flex items-center gap-3 text-sm font-bold text-brand-on-surface/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading post...
          </div>
        </div>
      ) : null}

      {postQuery.isError ? (
        <div className="rounded-3xl border border-brand-danger/20 bg-brand-danger/10 p-8 text-sm font-bold text-brand-danger">
          Could not load this post.
        </div>
      ) : null}

      {post && !isOwner ? (
        <div className="rounded-3xl border border-brand-outline bg-brand-surface p-8">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-brand-on-surface">
            You cannot edit this post
          </h2>

          <p className="mt-3 text-brand-on-surface/60">
            Only the author can edit or delete a post.
          </p>
        </div>
      ) : null}

      {post && isOwner ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-brand-outline bg-brand-surface p-8"
        >
          <div className="grid gap-6">
            <label>
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
                Title
              </span>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-brand-outline bg-brand-neutral-soft px-5 py-4 text-sm font-semibold text-brand-on-surface outline-none transition focus:border-brand-primary focus:bg-white"
                placeholder="Post title"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
                  Section
                </span>

                <select
                  value={pageName}
                  onChange={(event) => setPageName(event.target.value as PageName)}
                  className="w-full rounded-2xl border border-brand-outline bg-brand-neutral-soft px-5 py-4 text-sm font-bold text-brand-on-surface outline-none transition focus:border-brand-primary focus:bg-white"
                >
                  {pageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
                  Type
                </span>

                <select
                  value={contentType}
                  onChange={(event) => setContentType(event.target.value as ContentType)}
                  className="w-full rounded-2xl border border-brand-outline bg-brand-neutral-soft px-5 py-4 text-sm font-bold text-brand-on-surface outline-none transition focus:border-brand-primary focus:bg-white"
                >
                  {contentTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
                Content
              </span>

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={10}
                className="w-full resize-y rounded-2xl border border-brand-outline bg-brand-neutral-soft px-5 py-4 text-sm leading-relaxed text-brand-on-surface outline-none transition focus:border-brand-primary focus:bg-white"
                placeholder="Write the post content..."
              />
            </label>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
              Replace image
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-brand-outline bg-brand-neutral-soft px-5 py-4 text-sm font-bold text-brand-on-surface/55 transition hover:border-brand-primary hover:text-brand-primary">
              <span className="inline-flex items-center gap-2">
                <UploadCloud className="h-5 w-5" />
                {image ? image.name : 'Choose a new image'}
              </span>

              <span className="text-xs uppercase tracking-wider">Browse</span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {updateMutation.isError ? (
            <div className="mt-6 rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-4 text-sm font-bold text-brand-danger">
              Could not update this post. Check the backend response.
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-brand-outline pt-6">
            <Link
              to={buildPostDetailRoute(post.id)}
              className="rounded-xl border border-brand-outline px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-on-surface/55 transition hover:text-brand-on-surface"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updateMutation.isPending || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-7 py-3 text-xs font-black uppercase tracking-widest text-[#EDF2F4] transition hover:bg-brand-primary-hover disabled:opacity-60"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save changes
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}
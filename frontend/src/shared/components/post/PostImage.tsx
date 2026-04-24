import { resolveImageUrl } from '@/api/posts';

interface PostImageProps {
  imageUrl: string | null;
  title: string;
}

export function PostImage({ imageUrl, title }: PostImageProps) {
  const resolvedUrl = resolveImageUrl(imageUrl);

  if (!resolvedUrl) return null;

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-brand-outline bg-brand-neutral-soft">
      <img
        src={resolvedUrl}
        alt={title}
        className="h-72 w-full object-cover transition duration-500 hover:scale-[1.02]"
      />
    </div>
  );
}
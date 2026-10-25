import Link from 'next/link';

import { PostMeta } from '@src/features/post/client';
import { PostPreview } from '@src/features/post/types';
import { FadeInOnView } from '@src/shared';

interface PostFeaturedItemProps {
  postPreview: PostPreview;
  fadeIn?: boolean;
}

const PostFeaturedItem = ({
  postPreview,
  fadeIn = false,
}: PostFeaturedItemProps) => {
  const { id, title, date, content, tag, readingTimeMinutes } = postPreview;

  const link = (
    <Link
      href={`/posts/${id}`}
      className="pointer-spotlight flex flex-col justify-end gap-6 p-6 md:flex-row md:flex-wrap md:items-end md:justify-between md:p-10 min-h-[240px] rounded-featured featured-card-surface focus-ring"
    >
      <div className="flex flex-col max-w-[620px] gap-3.5 min-w-0">
        <span className="font-mono text-xs text-accent-cyan">
          FEATURED · {tag}
        </span>
        <h2 className="text-2xl md:text-[34px] font-extrabold leading-[1.3] tracking-[-0.03em] break-keep">
          {title}
        </h2>
        <span className="text-base leading-[1.7] break-keep text-muted line-clamp-2">
          {content}
        </span>
      </div>
      <PostMeta date={date} readingTimeMinutes={readingTimeMinutes}>
        <span aria-hidden="true">→</span>
      </PostMeta>
    </Link>
  );

  return (
    <FadeInOnView
      as="section"
      fadeIn={fadeIn}
      aria-label="추천 글"
      className="p-px mb-5 rounded-featured-frame featured-card-border"
    >
      {link}
    </FadeInOnView>
  );
};

export default PostFeaturedItem;

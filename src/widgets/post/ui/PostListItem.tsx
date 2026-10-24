import Link from 'next/link';

import { PostMeta } from '@src/features/post/client';
import { PostPreview } from '@src/features/post/types';
import { FadeInOnView } from '@src/shared';

interface PostListItemProps {
  postPreview: PostPreview;
  fadeIn?: boolean;
}

const PostListItem = ({ postPreview, fadeIn = false }: PostListItemProps) => {
  const { id, title, date, tag, readingTimeMinutes } = postPreview;

  const link = (
    <Link
      href={`/posts/${id}`}
      className="pointer-spotlight flex flex-col h-full gap-3 p-6 md:p-[26px] min-h-[210px] rounded-card card-surface card-surface-hover transition-[color,background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 focus-ring"
    >
      <span className="font-mono text-xs text-accent-violet">{tag}</span>
      <h2 className="text-[19px] font-bold leading-[1.45] tracking-[-0.02em] break-keep line-clamp-3">
        {title}
      </h2>
      <PostMeta
        date={date}
        readingTimeMinutes={readingTimeMinutes}
        className="mt-auto"
      />
    </Link>
  );

  return (
    <FadeInOnView as="li" fadeIn={fadeIn}>
      {link}
    </FadeInOnView>
  );
};

export default PostListItem;

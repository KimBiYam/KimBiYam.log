import Link from 'next/link';
import * as m from 'motion/react-m';

import { PostDateText, PostReadingTime } from '@src/features/post/client';
import { PostPreview } from '@src/features/post/types';
import { viewportOpacityMotion } from '@src/shared';

interface PostListItemProps {
  postPreview: PostPreview;
  fadeIn?: boolean;
}

const PostListItem = ({ postPreview, fadeIn = false }: PostListItemProps) => {
  const { id, title, date, tag, readingTimeMinutes } = postPreview;

  const link = (
    <Link
      href={`/posts/${id}`}
      className="pointer-spotlight flex flex-col h-full gap-3 p-6 md:p-[26px] min-h-[210px] border rounded-[20px] border-line bg-glass transition-[color,background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-accent-violet/40 hover:bg-accent-violet/5 focus-ring"
    >
      <span className="font-mono text-xs text-accent-violet">{tag}</span>
      <h2 className="text-[19px] font-bold leading-[1.45] tracking-[-0.02em] break-keep line-clamp-3">
        {title}
      </h2>
      <span className="flex items-center gap-2 mt-auto">
        <PostDateText dateTime={date}>{date}</PostDateText>
        <span aria-hidden="true" className="font-mono text-xs text-muted">
          ·
        </span>
        <PostReadingTime minutes={readingTimeMinutes} />
      </span>
    </Link>
  );

  // Plain <li> unless the item fades in: skips motion setup for initial cards.
  return fadeIn ? (
    <m.li {...viewportOpacityMotion}>{link}</m.li>
  ) : (
    <li>{link}</li>
  );
};

export default PostListItem;

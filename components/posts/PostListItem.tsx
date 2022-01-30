import { PostPreview } from '../../types/post.types';
import NextLink from 'next/link';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { viewPointSlideUpMotion } from '../../lib/styles/motions';
import TagBadge from './TagBadge';

export type PostListItemProps = {
  postPreview: PostPreview;
};

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content, tag } = postPreview;

  return (
    <NextLink href={`/posts/${id}`}>
      <motion.div
        className="py-4 cursor-pointer hover:text-shadow dark:hover:text-shadow-dark transition-text-shadow"
        {...viewPointSlideUpMotion}
      >
        <h3 className="w-full overflow-hidden text-2xl font-bold truncate whitespace-nowrap">
          {title}
        </h3>
        <div className="flex items-center justify-between my-1">
          <p className="text-sm">{date}</p>
          <TagBadge tag={tag.toUpperCase()} />
        </div>
        <p className="overflow-hidden text-sm dark:text-zinc-400 text-zinc-700 md:text-base">
          {content}
        </p>
      </motion.div>
    </NextLink>
  );
};

export default memo(PostListItem);

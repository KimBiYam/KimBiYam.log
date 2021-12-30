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
        <h3 className="w-full text-2xl font-bold overflow-hidden whitespace-nowrap truncate">
          {title}
        </h3>
        <div className="my-1 flex justify-between items-center">
          <p className="text-sm">{date}</p>
          <TagBadge tag={tag.toUpperCase()} />
        </div>
        <p className="dark:text-zinc-400 text-zinc-700 text-sm md:text-base overflow-hidden">
          {content}
        </p>
      </motion.div>
    </NextLink>
  );
};

export default memo(PostListItem);

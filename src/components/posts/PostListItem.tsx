import { memo } from 'react';
import { motion } from 'framer-motion';
import { PostPreview } from '../../types/post.types';
import TagBadge from './TagBadge';
import { viewPortOpacityMotion } from '../../lib/styles/motions';
import NoScrollLink from '../base/NoScrollLink';

export type PostListItemProps = {
  postPreview: PostPreview;
};

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content, tag } = postPreview;

  return (
    <NoScrollLink href={`/posts/${id}`}>
      <a>
        <motion.div
          className="py-4 cursor-pointer hover:text-shadow dark:hover:text-shadow-dark transition-text-shadow"
          {...viewPortOpacityMotion}
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
      </a>
    </NoScrollLink>
  );
};

export default memo(PostListItem);

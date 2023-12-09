import { memo } from 'react';

import { motion } from 'framer-motion';

import { viewportOpacityMotion } from '@src/lib/styles/motions';
import { PostPreview } from '@src/types/post.types';

import PostDateText from './PostDateText';
import TagBadge from './TagBadge';
import NoScrollLink from '../base/NoScrollLink';

interface PostListItemProps {
  postPreview: PostPreview;
}

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content, tag } = postPreview;

  return (
    <li>
      <NoScrollLink href={`/posts/${id}`}>
        <motion.div
          className="py-4 duration-300 cursor-pointer transition-textShadow hover:text-shadow dark:hover:text-shadow-dark"
          {...viewportOpacityMotion}
        >
          <h3 className="w-full overflow-hidden text-2xl font-bold truncate whitespace-nowrap">
            {title}
          </h3>
          <div className="flex items-center justify-between my-1">
            <PostDateText>{date}</PostDateText>
            <TagBadge tag={tag.toUpperCase()} />
          </div>
          <p className="overflow-hidden text-sm dark:text-zinc-400 text-zinc-700 md:text-base">
            {content}
          </p>
        </motion.div>
      </NoScrollLink>
    </li>
  );
};

export default memo(PostListItem);

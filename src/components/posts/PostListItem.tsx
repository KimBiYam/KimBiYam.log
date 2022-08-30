import { memo } from 'react';

import { m } from 'framer-motion';

import {
  hoverLiftMotion,
  viewportOpacityMotion,
} from '../../lib/styles/motions';
import { PostPreview } from '../../types/post.types';
import NoScrollLink from '../base/NoScrollLink';
import TagBadge from './TagBadge';

interface PostListItemProps {
  postPreview: PostPreview;
}

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content, tag } = postPreview;

  return (
    <li>
      <NoScrollLink href={`/posts/${id}`}>
        <a>
          <m.div
            className="py-4 cursor-pointer duration-300 transition-textShadow hover:text-shadow dark:hover:text-shadow-dark"
            {...hoverLiftMotion}
            {...viewportOpacityMotion}
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
          </m.div>
        </a>
      </NoScrollLink>
    </li>
  );
};

export default memo(PostListItem);

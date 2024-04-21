import { memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import { viewportOpacityMotion } from '@src/lib/styles/motions';
import { PostPreview } from '@src/types/post.types';

import PostDateText from './PostDateText';
import TagBadge from './TagBadge';
import ogTagImage from '../../assets/images/logo_image.png';

interface PostListItemProps {
  postPreview: PostPreview;
}

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content, tag, ogImagePath } = postPreview;

  return (
    <motion.li className="h-full" {...viewportOpacityMotion}>
      <Link
        href={`/posts/${id}`}
        className="flex flex-col h-full duration-300 hover:text-shadow dark:hover:text-shadow-dark transition-textShadow"
      >
        <div className="flex items-center pt-[53%] relative mb-2">
          <Image
            alt={title}
            src={ogImagePath ?? ogTagImage.src}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            width="0"
            height="0"
            className={clsx(
              'absolute inset-0 object-cover w-auto h-full ml-auto mr-auto rounded-xl',
              {
                'bg-white': !ogImagePath,
              },
            )}
            priority
          />
        </div>
        <div className="flex-1">
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
        </div>
      </Link>
    </motion.li>
  );
};

export default memo(PostListItem);

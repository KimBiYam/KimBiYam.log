import React, { PropsWithChildren } from 'react';

import LinkIcon from '@src/assets/svgs/link_icon.svg';
import { POST_HEADING_TARGET_TAGS } from '@src/constants/posts';

type HeadingLinkProps = PropsWithChildren<{
  tag: (typeof POST_HEADING_TARGET_TAGS)[number];
  id: string;
}>;

const HeadingLink = ({ tag, id, children }: HeadingLinkProps) => {
  const Tag = tag;

  return (
    <Tag id={id}>
      <a
        href={`#${id}`}
        className="flex items-center no-underline hover:underline group"
      >
        {children}
        <LinkIcon className="hidden w-4 h-4 ml-1 group-hover:block opacity-60" />
      </a>
    </Tag>
  );
};

export default HeadingLink;

import React, { PropsWithChildren } from 'react';

import LinkIcon from '@src/assets/svgs/link_icon.svg';

import { POST_HEADING_TARGET_TAGS } from '../constants';

interface HeadingLinkProps extends PropsWithChildren {
  tag: (typeof POST_HEADING_TARGET_TAGS)[number];
  id: string;
}

const HeadingLink = ({ tag: Tag, id, children }: HeadingLinkProps) => {
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

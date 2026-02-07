'use client';

import React from 'react';
import HeadingLink from './HeadingLink';

import { POST_HEADING_TARGET_TAGS } from '../constants';

interface MarkdownHeadingProps {
  id?: string;
  tag: (typeof POST_HEADING_TARGET_TAGS)[number];
  children: React.ReactNode;
}

const MarkdownHeading = ({ id, tag, children }: MarkdownHeadingProps) => {
  return (
    <HeadingLink id={id ?? ''} tag={tag}>
      {children}
    </HeadingLink>
  );
};

export default MarkdownHeading;

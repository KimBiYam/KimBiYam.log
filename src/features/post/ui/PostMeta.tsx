import { ReactNode } from 'react';

import PostDateText from './PostDateText';
import PostReadingTime from './PostReadingTime';

interface PostMetaProps {
  date: string;
  readingTimeMinutes: number;
  className?: string;
  children?: ReactNode;
}

// The date · reading time row. children render after the reading time.
const PostMeta = ({
  date,
  readingTimeMinutes,
  className = '',
  children,
}: PostMetaProps) => (
  <span
    className={`flex items-center gap-2 font-mono text-xs text-muted ${className}`.trim()}
  >
    <PostDateText dateTime={date}>{date}</PostDateText>
    <span aria-hidden="true">·</span>
    <PostReadingTime minutes={readingTimeMinutes} />
    {children}
  </span>
);

export default PostMeta;

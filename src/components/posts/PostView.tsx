import { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import dynamic from 'next/dynamic';

import useCreateHeadingLink from '../../hooks/useCreateHeadingLink';
import useMounted from '../../hooks/useMounted';
import breakPoints from '../../lib/styles/breakPoints.json';
import { PostDetail } from '../../types/post.types';
import MarkdownView from './MarkdownView';
import PostDateText from './PostDateText';
import TagBadge from './TagBadge';

const DynamicTableOfContents = dynamic(() => import('./TableOfContents'));

interface PostViewProps {
  postDetail: PostDetail;
}

const PostView = ({ postDetail }: PostViewProps) => {
  const { title, date, contentHtml, tag } = postDetail;

  const markdownRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const isUpExtraLargeScreen = useMediaQuery({ minWidth: breakPoints.xl });

  useCreateHeadingLink(markdownRef);

  return (
    <article className="relative mt-8">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <div className="flex items-center justify-between my-4">
        <PostDateText>{date}</PostDateText>
        <TagBadge tag={tag.toUpperCase()} />
      </div>
      <MarkdownView contentHtml={contentHtml} ref={markdownRef} />
      {mounted && isUpExtraLargeScreen && <DynamicTableOfContents />}
    </article>
  );
};

export default PostView;

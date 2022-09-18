import { useMediaQuery } from 'react-responsive';

import dynamic from 'next/dynamic';

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

  const mounted = useMounted();
  const isUpExtraLargeScreen = useMediaQuery({ minWidth: breakPoints.xl });

  return (
    <article className="relative mt-8">
      <h1 className="text-2xl font-bold md:text-4xl">{title}</h1>
      <div className="flex items-center justify-between my-4">
        <PostDateText>{date}</PostDateText>
        <TagBadge tag={tag.toUpperCase()} />
      </div>
      <MarkdownView contentHtml={contentHtml} />
      {mounted && isUpExtraLargeScreen && <DynamicTableOfContents />}
    </article>
  );
};

export default PostView;

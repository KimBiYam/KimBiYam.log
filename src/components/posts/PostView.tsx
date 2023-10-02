'use client';

import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import dynamic from 'next/dynamic';

import { useSetAtom } from 'jotai';

import headerTitleAtom from '../../atoms/headerTitleAtom';
import useMounted from '../../hooks/useMounted';
import useScrollOverElementDetect from '../../hooks/useScrollOverElementDetect';
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const setHeaderTitleAtom = useSetAtom(headerTitleAtom);

  const mounted = useMounted();
  const isUpExtraLargeScreen = useMediaQuery({ minWidth: breakPoints.xl });
  const isScrollOverTitle = useScrollOverElementDetect(titleRef);

  useEffect(() => {
    setHeaderTitleAtom((prev) => ({ ...prev, isShowTitle: isScrollOverTitle }));
  }, [isScrollOverTitle, setHeaderTitleAtom]);

  useEffect(() => {
    setHeaderTitleAtom((prev) => ({ ...prev, title }));

    return () => {
      setHeaderTitleAtom({ isShowTitle: false, title: null });
    };
  }, [setHeaderTitleAtom, title]);

  return (
    <article className="relative mt-8">
      <h1 className="text-3xl font-bold md:text-4xl" ref={titleRef}>
        {title}
      </h1>
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

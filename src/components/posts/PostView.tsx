'use client';

import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import dynamic from 'next/dynamic';

import { useSetAtom } from 'jotai';

import headerTitleAtom from '@src/atoms/headerTitleAtom';
import useMounted from '@src/hooks/useMounted';
import useScrollOverElementDetect from '@src/hooks/useScrollOverElementDetect';
import breakPoints from '@src/lib/styles/breakPoints.json';
import { PostDetail, PostImageSize } from '@src/types/post.types';

import MarkdownView from './MarkdownView';
import PostDateText from './PostDateText';
import TagBadge from './TagBadge';

const DynamicTableOfContents = dynamic(() => import('./TableOfContents'));

interface PostViewProps {
  postDetail: PostDetail;
  imageSizes?: Record<string, PostImageSize>;
}

const PostView = ({ postDetail, imageSizes }: PostViewProps) => {
  const { title, date, contentHtml, tag } = postDetail;
  const setHeaderTitleAtom = useSetAtom(headerTitleAtom);

  const mounted = useMounted();
  const isUpExtraLargeScreen = useMediaQuery({ minWidth: breakPoints.xl });
  const { setEl } = useScrollOverElementDetect({
    onOverElementChanged(isOverElement) {
      setHeaderTitleAtom((prev) => ({
        ...prev,
        isShowTitle: isOverElement,
      }));
    },
  });

  useEffect(
    function setHeaderTitle() {
      setHeaderTitleAtom((prev) => ({ ...prev, title }));

      return function cleanupHeaderTitle() {
        setHeaderTitleAtom({ isShowTitle: false, title: null });
      };
    },
    [setHeaderTitleAtom, title],
  );

  return (
    <article className="relative mt-8">
      <h1 className="text-3xl font-bold md:text-4xl" ref={setEl}>
        {title}
      </h1>
      <div className="flex items-center justify-between my-4">
        <PostDateText>{date}</PostDateText>
        <TagBadge tag={tag.toUpperCase()} />
      </div>
      <MarkdownView contentHtml={contentHtml} imageSizes={imageSizes} />
      {mounted && isUpExtraLargeScreen && <DynamicTableOfContents />}
    </article>
  );
};

export default PostView;

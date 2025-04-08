'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import dynamic from 'next/dynamic';

import { useSetAtom } from 'jotai';

import {
  headerTitleAtom,
  PostDetail,
  PostImageSize,
  PostDateText,
  MarkdownView,
} from '@src/features/post/client';
import { TagBadge } from '@src/features/tag';
import { useMounted, useScrollOverElementDetect } from '@src/shared';
import breakPoints from '@src/shared/styles/breakPoints.json';

const DynamicTableOfContents = dynamic(
  () => import('@src/features/post/ui/TableOfContents'),
);

interface PostViewProps {
  postDetail: PostDetail;
  imageSizes?: Record<string, PostImageSize>;
}

const PostView = ({ postDetail, imageSizes }: PostViewProps) => {
  const { title, date, contentHtml, tag } = postDetail;
  const setHeaderTitleAtom = useSetAtom(headerTitleAtom);
  const [markdownViewEl, setMarkdownViewEl] = useState<HTMLDivElement | null>(
    null,
  );

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
      <MarkdownView
        ref={setMarkdownViewEl}
        contentHtml={contentHtml}
        imageSizes={imageSizes}
      />
      {mounted && isUpExtraLargeScreen && (
        <DynamicTableOfContents targetElement={markdownViewEl} />
      )}
    </article>
  );
};

export default PostView;

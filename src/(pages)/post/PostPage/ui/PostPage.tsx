'use client';

import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useSetAtom } from 'jotai';
import dynamic from 'next/dynamic';

import {
  PostDetail,
  PostImageSize,
  PostDateText,
  MarkdownView,
  PostShareButtons,
  headerTitleAtom,
} from '@src/features/post/client';
import { TagBadge } from '@src/features/tag';
import {
  useMounted,
  ProfileCard,
  Utterances,
  useScrollOverElementDetect,
} from '@src/shared';
import breakPoints from '@src/shared/styles/breakPoints.json';

import useSyncPostHeader from '@src/(pages)/post/PostPage/hooks/useSyncPostHeader';

const DynamicTableOfContents = dynamic(
  () => import('@src/features/post/ui/TableOfContents'),
);

interface PostPageProps {
  postDetail: PostDetail;
  imageSizes?: Record<string, PostImageSize>;
}

const PostPage = ({ postDetail, imageSizes }: PostPageProps) => {
  const { title, date, contentHtml, tag } = postDetail;
  const [markdownViewEl, setMarkdownViewEl] = useState<HTMLDivElement | null>(
    null,
  );

  const mounted = useMounted();
  const isUpExtraLargeScreen = useMediaQuery({ minWidth: breakPoints.xl });

  const setHeaderTitleAtom = useSetAtom(headerTitleAtom);
  const { setEl } = useScrollOverElementDetect({
    onOverElementChanged(isOverElement) {
      setHeaderTitleAtom((prev) => ({
        ...prev,
        isShowTitle: isOverElement,
      }));
    },
  });

  useSyncPostHeader(title);

  return (
    <>
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
      <PostShareButtons postDetail={postDetail} />
      <div className="py-4 my-10 border-t border-b">
        <ProfileCard />
      </div>
      <Utterances />
    </>
  );
};

export default PostPage;

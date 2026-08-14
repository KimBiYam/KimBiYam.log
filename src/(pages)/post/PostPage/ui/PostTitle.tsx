'use client';

import { useSetAtom } from 'jotai';

import { headerTitleAtom } from '@src/features/post/client';
import { useScrollOverElementDetect } from '@src/shared';
import useSyncPostHeader from '@src/(pages)/post/PostPage/hooks/useSyncPostHeader';

interface PostTitleProps {
  title: string;
}

const PostTitle = ({ title }: PostTitleProps) => {
  const setHeaderTitleAtom = useSetAtom(headerTitleAtom);
  const { setEl } = useScrollOverElementDetect({
    onOverElementChanged(isOverElement) {
      setHeaderTitleAtom((prev) => ({ ...prev, isShowTitle: isOverElement }));
    },
  });

  useSyncPostHeader(title);

  return (
    <h1 className="text-3xl font-bold md:text-4xl" ref={setEl}>
      {title}
    </h1>
  );
};

export default PostTitle;

import { getSortedPostPreviews } from '@src/features/post/server';
import { Tag } from '@src/features/tag';
import { ProfileCard } from '@src/shared/ui';
import { PostIndex } from '@src/widgets/post';

import type { ReactNode } from 'react';

interface PostIndexLayoutProps {
  children: ReactNode;
}

const PostIndexLayout = async ({ children }: PostIndexLayoutProps) => {
  const postPreviews = await getSortedPostPreviews();
  const tags = [
    Tag.all,
    ...Array.from(new Set(postPreviews.map(({ tag }) => tag))).sort(),
  ];

  return (
    <>
      {children}
      <PostIndex
        postPreviews={postPreviews}
        profile={<ProfileCard />}
        tags={tags}
      />
    </>
  );
};

export default PostIndexLayout;

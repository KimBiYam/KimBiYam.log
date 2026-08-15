'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { PostPreview } from '@src/features/post/types';
import { Tag, TagSelector } from '@src/features/tag';
import { DragScrollContainer } from '@src/shared/ui';

import PostList from './PostList';

interface PostIndexProps {
  postPreviews: PostPreview[];
  profile: ReactNode;
  tags: string[];
}

const getTagFromPathname = (pathname: string, tags: string[]) => {
  const match = pathname.match(/^\/tags\/([^/]+)\/?$/);
  if (!match) return Tag.all;

  const tag = decodeURIComponent(match[1]);
  return tags.includes(tag) ? tag : Tag.all;
};

const PostIndex = ({
  postPreviews,
  profile,
  tags,
}: PostIndexProps) => {
  const pathname = usePathname();
  const selectedTag = getTagFromPathname(pathname, tags);

  const handleTagSelect = (tag: string) => {
    if (tag === selectedTag) return;

    const href = tag === Tag.all ? '/' : `/tags/${encodeURIComponent(tag)}`;
    window.history.pushState(null, '', href);
  };

  const filteredPostPreviews =
    selectedTag === Tag.all
      ? postPreviews
      : postPreviews.filter(({ tag }) => tag === selectedTag);

  return (
    <div className="pb-12">
      <div className="my-2">{profile}</div>
      <DragScrollContainer>
        <TagSelector
          onTagSelect={handleTagSelect}
          selectedTag={selectedTag}
          tags={tags}
        />
      </DragScrollContainer>
      <PostList key={selectedTag} postPreviews={filteredPostPreviews} />
    </div>
  );
};

export default PostIndex;

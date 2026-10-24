'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

import { postListPageAtom } from '@src/features/post/client';
import { PostPreview } from '@src/features/post/types';
import { Tag, TagSelector } from '@src/features/tag';
import { BackgroundGlow, DragScrollContainer } from '@src/shared/ui';

import PostList from './PostList';

interface PostIndexProps {
  postPreviews: PostPreview[];
  tags: string[];
}

const getTagFromPathname = (pathname: string, tags: string[]) => {
  const match = pathname.match(/^\/tags\/([^/]+)\/?$/);
  if (!match) return Tag.all;

  const tag = decodeURIComponent(match[1]);
  return tags.includes(tag) ? tag : Tag.all;
};

const PostIndex = ({ postPreviews, tags }: PostIndexProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const setPostPages = useSetAtom(postListPageAtom);
  const selectedTag = getTagFromPathname(pathname, tags);
  const [prevTag, setPrevTag] = useState(selectedTag);
  const [hasTagChanged, setHasTagChanged] = useState(false);

  // Only the server-rendered initial list skips the first-page fade-in (LCP);
  // lists remounted after a tag change fade in every item.
  if (prevTag !== selectedTag) {
    setPrevTag(selectedTag);
    setHasTagChanged(true);
  }

  const handleTagSelect = (tag: string) => {
    if (tag === selectedTag) return;

    setPostPages((prev) => ({ ...prev, [tag]: 1 }));

    const href = tag === Tag.all ? '/' : `/tags/${encodeURIComponent(tag)}`;
    router.push(href, { scroll: false });
  };

  const filteredPostPreviews =
    selectedTag === Tag.all
      ? postPreviews
      : postPreviews.filter(({ tag }) => tag === selectedTag);

  return (
    <div data-layout="wide" className="pb-20">
      <BackgroundGlow />
      <DragScrollContainer>
        <TagSelector
          onTagSelect={handleTagSelect}
          selectedTag={selectedTag}
          tags={tags}
        />
      </DragScrollContainer>
      <PostList
        key={selectedTag}
        fadeInFirstPage={hasTagChanged}
        postPreviews={filteredPostPreviews}
        tag={selectedTag}
      />
    </div>
  );
};

export default PostIndex;

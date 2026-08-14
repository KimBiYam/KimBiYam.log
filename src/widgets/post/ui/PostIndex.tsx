'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { PostPreview } from '@src/features/post/types';
import { Tag, TagSelector } from '@src/features/tag';
import { DOMAIN_URL } from '@src/shared/constants';
import { DragScrollContainer } from '@src/shared/ui';

import PostList from './PostList';

const HOME_DESCRIPTION = 'KimBiYam의 개발 블로그 입니다.';

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

const syncDocumentMetadata = (tag: string) => {
  const isAll = tag === Tag.all;
  const title = isAll
    ? 'KimBiYam.log'
    : `${tag.toUpperCase()} 개발 글 | KimBiYam.log`;
  const description = isAll
    ? HOME_DESCRIPTION
    : `${tag.toUpperCase()} 주제로 작성한 개발 기록을 모았습니다.`;
  const canonicalPath = isAll ? '' : `/tags/${encodeURIComponent(tag)}`;

  document.title = title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', description);
  document
    .querySelector('link[rel="canonical"]')
    ?.setAttribute('href', `${DOMAIN_URL}${canonicalPath}`);
};

const PostIndex = ({
  postPreviews,
  profile,
  tags,
}: PostIndexProps) => {
  const pathname = usePathname();
  const selectedTag = getTagFromPathname(pathname, tags);

  useEffect(() => {
    syncDocumentMetadata(selectedTag);
  }, [selectedTag]);

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

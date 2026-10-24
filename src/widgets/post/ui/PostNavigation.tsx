import Link from 'next/link';

import { PostPreview } from '@src/features/post/types';

interface PostNavigationProps {
  newerPost?: PostPreview;
  olderPost?: PostPreview;
}

const PostNavigation = ({ newerPost, olderPost }: PostNavigationProps) => {
  if (!newerPost && !olderPost) return null;

  return (
    <nav
      aria-label="게시글 이동"
      className="flex flex-col gap-4 mt-10 sm-up:flex-row"
    >
      {olderPost && (
        <Link
          className="group flex flex-col min-w-0 p-5 card-surface card-surface-hover transition-colors duration-300 focus-ring sm-up:w-1/2"
          href={`/posts/${olderPost.id}`}
        >
          <span className="block font-mono text-xs text-muted">← 이전 글</span>
          <span className="block mt-2 font-semibold break-keep line-clamp-2 group-hover:underline">
            {olderPost.title}
          </span>
        </Link>
      )}
      {newerPost && (
        <Link
          className="group flex flex-col min-w-0 p-5 card-surface card-surface-hover transition-colors duration-300 focus-ring sm-up:w-1/2 text-right sm-up:ml-auto"
          href={`/posts/${newerPost.id}`}
        >
          <span className="block font-mono text-xs text-muted">다음 글 →</span>
          <span className="block mt-2 font-semibold break-keep line-clamp-2 group-hover:underline">
            {newerPost.title}
          </span>
        </Link>
      )}
    </nav>
  );
};

export default PostNavigation;

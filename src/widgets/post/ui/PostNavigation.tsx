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
      className="flex flex-col gap-6 pt-6 mt-10 border-t sm:flex-row"
    >
      {olderPost && (
        <Link
          className="min-w-0 group sm:w-1/2"
          href={`/posts/${olderPost.id}`}
        >
          <span className="block text-xs text-zinc-400">← 이전 글</span>
          <span className="block mt-2 font-semibold line-clamp-2 group-hover:underline">
            {olderPost.title}
          </span>
        </Link>
      )}
      {newerPost && (
        <Link
          className="min-w-0 text-right group sm:w-1/2 sm:ml-auto"
          href={`/posts/${newerPost.id}`}
        >
          <span className="block text-xs text-zinc-400">다음 글 →</span>
          <span className="block mt-2 font-semibold line-clamp-2 group-hover:underline">
            {newerPost.title}
          </span>
        </Link>
      )}
    </nav>
  );
};

export default PostNavigation;

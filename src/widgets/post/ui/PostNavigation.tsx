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
      className="grid grid-cols-1 gap-6 pt-6 mt-10 border-t sm:grid-cols-2"
    >
      {olderPost ? (
        <Link
          className="min-w-0 group"
          href={`/posts/${olderPost.id}`}
        >
          <span className="block text-xs text-zinc-400">← 이전 글</span>
          <span className="block mt-2 font-semibold line-clamp-2 group-hover:underline">
            {olderPost.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {newerPost && (
        <Link
          className="min-w-0 text-right group"
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

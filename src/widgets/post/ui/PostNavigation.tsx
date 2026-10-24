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
      className="flex flex-col gap-4 mt-10 [@media(min-width:480px)]:flex-row"
    >
      {olderPost && (
        <Link
          className="group flex flex-col min-w-0 p-5 border rounded-2xl border-line bg-glass transition-colors duration-300 hover:border-accent-violet/40 hover:bg-accent-violet/5 focus-ring [@media(min-width:480px)]:w-1/2"
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
          className="group flex flex-col min-w-0 p-5 border rounded-2xl border-line bg-glass transition-colors duration-300 hover:border-accent-violet/40 hover:bg-accent-violet/5 focus-ring [@media(min-width:480px)]:w-1/2 text-right [@media(min-width:480px)]:ml-auto"
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

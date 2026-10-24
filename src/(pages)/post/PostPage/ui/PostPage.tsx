import { hasPostHeadings } from '@src/features/post/lib/postHeadings';
import type {
  PostDetail,
  PostImageSize,
  PostPreview,
} from '@src/features/post/types';
import {
  MobileTableOfContents,
  PostDateText,
  PostReadingTime,
  PostShareButtons,
  ReadingProgress,
  TableOfContents,
} from '@src/features/post/ui';
import MarkdownView from '@src/features/post/ui/MarkdownView';
import { TagBadge } from '@src/features/tag';
import { BackgroundGlow, ProfileCard } from '@src/shared';
import { PostNavigation } from '@src/widgets/post';

import PostArticleEnhancements from './PostArticleEnhancements';
import PostTitle from './PostTitle';

interface PostPageProps {
  canonicalPath: string;
  postDetail: PostDetail;
  imageSizes?: Record<string, PostImageSize>;
  newerPost?: PostPreview;
  olderPost?: PostPreview;
}

const PostPage = ({
  canonicalPath,
  postDetail,
  imageSizes,
  newerPost,
  olderPost,
}: PostPageProps) => {
  const { title, date, description, contentHtml, tag, readingTimeMinutes } =
    postDetail;

  return (
    <div
      data-layout="wide"
      className="pb-10 xl:grid xl:grid-cols-[minmax(0,720px)_224px] xl:gap-12 xl:justify-center"
    >
      <ReadingProgress />
      <BackgroundGlow />
      <div className="w-full min-w-0 max-w-[720px] mx-auto xl:mx-0">
        <article className="mt-8">
          <header className="flex flex-col gap-[18px] mb-8">
            <TagBadge href={`/tags/${tag}`} tag={tag} />
            <PostTitle title={title} />
            {description && (
              <p className="text-base md:text-[19px] leading-[1.7] break-keep text-muted">
                {description}
              </p>
            )}
            <div className="flex items-center gap-3 pb-5 font-mono text-xs border-b text-muted">
              <PostDateText dateTime={date}>{date}</PostDateText>
              <span aria-hidden="true">·</span>
              <PostReadingTime minutes={readingTimeMinutes} />
            </div>
          </header>
          {hasPostHeadings(contentHtml) && <MobileTableOfContents />}
          <MarkdownView contentHtml={contentHtml} imageSizes={imageSizes} />
          <PostArticleEnhancements />
        </article>
        <PostShareButtons
          canonicalPath={canonicalPath}
          postDetail={postDetail}
        />
        <PostNavigation newerPost={newerPost} olderPost={olderPost} />
        <div className="py-4 my-10 border-t border-b">
          <ProfileCard />
        </div>
      </div>
      <TableOfContents />
    </div>
  );
};

export default PostPage;

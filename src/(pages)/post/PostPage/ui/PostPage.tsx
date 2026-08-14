import {
  PostDateText,
  MarkdownView,
  PostShareButtons,
} from '@src/features/post/ui';
import type {
  PostDetail,
  PostImageSize,
  PostPreview,
} from '@src/features/post/types';
import { TagBadge } from '@src/features/tag';
import { ProfileCard, Utterances } from '@src/shared';
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
  const { title, date, contentHtml, tag } = postDetail;

  return (
    <>
      <article className="relative mt-8">
        <PostTitle title={title} />
        <div className="flex items-center justify-between my-4">
          <PostDateText>{date}</PostDateText>
          <TagBadge href={`/tags/${tag}`} tag={tag} />
        </div>
        <MarkdownView
          contentHtml={contentHtml}
          imageSizes={imageSizes}
        />
        <PostArticleEnhancements />
      </article>
      <PostShareButtons canonicalPath={canonicalPath} postDetail={postDetail} />
      <PostNavigation newerPost={newerPost} olderPost={olderPost} />
      <div className="py-4 my-10 border-t border-b">
        <ProfileCard />
      </div>
      <Utterances />
    </>
  );
};

export default PostPage;

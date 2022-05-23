import { PostDetail } from '../../types/post.types';
import ProfileCard from '../base/ProfileCard';
import MarkdownView from './MarkdownView';
import TagBadge from './TagBadge';
import Utterances from './Utterances';

export type PostViewProps = {
  postDetail: PostDetail;
};

const PostView = ({ postDetail }: PostViewProps) => {
  const { title, date, contentHtml, tag } = postDetail;

  return (
    <article className="pb-24 mt-8">
      <h1 className="text-2xl font-bold md:text-4xl">{title}</h1>
      <div className="flex items-center justify-between my-4">
        <p className="text-sm">{date}</p>
        <TagBadge tag={tag.toUpperCase()} />
      </div>
      <MarkdownView contentHtml={contentHtml} />
      <div className="py-4 my-10 border-t border-b">
        <ProfileCard />
      </div>
      <Utterances />
    </article>
  );
};

export default PostView;

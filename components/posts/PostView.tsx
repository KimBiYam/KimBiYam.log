import { PostData } from '../../types/post.types';
import MarkdownView from './MarkdownView';
import TagBadge from './TagBadge';
import Utterances from './Utterances';

export type PostViewProps = {
  postData: PostData;
};

const PostView = ({ postData }: PostViewProps) => {
  const { title, date, contentHtml, tag } = postData;

  return (
    <article className="mt-8 pb-24">
      <h1 className="font-bold text-2xl md:text-4xl"> {title}</h1>
      <div className="my-4 flex justify-between items-center">
        <p className="text-sm">{date}</p>
        <TagBadge tag={tag.toUpperCase()} />
      </div>
      <MarkdownView contentHtml={contentHtml} />
      <Utterances />
    </article>
  );
};

export default PostView;

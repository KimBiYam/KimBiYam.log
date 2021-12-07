import { PostPreview } from "../../types/post.types";

export type PostListItemProps = {
  postPreview: PostPreview;
};

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { title, date, content } = postPreview;

  return (
    <div className="py-4">
      <h3 className="w-full text-xl font-bold overflow-hidden whitespace-nowrap truncate">
        {title}
      </h3>
      <div className="text-sm">{date}</div>
      <div className="mt-2">{content}</div>
    </div>
  );
};

export default PostListItem;

import { PostData } from "../../types/post.types";

export type PostListItemProps = {
  postData: PostData;
};

const PostListItem = ({ postData }: PostListItemProps) => {
  const { title, date, postPreview } = postData;

  return (
    <div className="py-4">
      <h3 className="w-full text-xl font-bold overflow-hidden whitespace-nowrap truncate">
        {title}
      </h3>
      <div className="text-sm">{date}</div>
      <div>{postPreview}</div>
    </div>
  );
};

export default PostListItem;

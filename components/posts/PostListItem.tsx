import { PostData } from "../../types/post.types";

export type PostListItemProps = {
  postData: PostData;
};

const PostListItem = ({ postData }: PostListItemProps) => {
  return (
    <div className="py-4">
      <h3 className="w-full font-bold overflow-hidden whitespace-nowrap truncate">
        {postData.title}
      </h3>
      <div>{postData.date}</div>
    </div>
  );
};

export default PostListItem;

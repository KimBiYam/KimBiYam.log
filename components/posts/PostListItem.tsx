import { PostPreview } from "../../types/post.types";
import NextLink from "next/link";

export type PostListItemProps = {
  postPreview: PostPreview;
};

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content } = postPreview;

  return (
    <NextLink href={`/posts/${id}`}>
      <div className="py-4 cursor-pointer">
        <h3 className="w-full text-2xl font-bold overflow-hidden whitespace-nowrap truncate">
          {title}
        </h3>
        <div className="text-sm">{date}</div>
        <div className="mt-2 dark:text-gray-300 text-zinc-700">{content}</div>
      </div>
    </NextLink>
  );
};

export default PostListItem;

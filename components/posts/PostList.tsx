import { useMemo } from "react";
import { Tag } from "../../constants";
import { PostPreview } from "../../types/post.types";
import PostListItem from "./PostListItem";

export type PostListProps = {
  postPreviews: PostPreview[];
  tag: string;
};

const PostList = ({ postPreviews, tag }: PostListProps) => {
  const filteredPostPreviews = useMemo(
    () =>
      postPreviews.filter(
        (postPreview) => tag === Tag.all || postPreview.tag === tag
      ),
    [postPreviews, tag]
  );

  return (
    <>
      {filteredPostPreviews.map((postPreview) => (
        <PostListItem
          key={postPreview.id + postPreview.title}
          postPreview={postPreview}
        />
      ))}
    </>
  );
};

export default PostList;

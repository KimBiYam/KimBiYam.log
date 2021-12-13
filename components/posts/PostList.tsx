import { useMemo } from "react";
import { Tag } from "../../constants";
import { PostPreview } from "../../types/post.types";
import PostListItem from "./PostListItem";

export type PostListProps = {
  postPreviews: PostPreview[];
  selectedTag: string;
};

const PostList = ({ postPreviews, selectedTag }: PostListProps) => {
  const filteredPostPreviews = useMemo(
    () =>
      postPreviews.filter(
        (postPreview) =>
          selectedTag === Tag.all || postPreview.tag === selectedTag
      ),
    [postPreviews, selectedTag]
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

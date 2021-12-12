import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageHead from "../components/base/PageHead";
import PostList from "../components/posts/PostList";
import TagSelector from "../components/posts/TagSelector";
import { Tag } from "../constants";
import { getSortedPostPreviews } from "../lib/posts/post";
import { PostPreview } from "../types/post.types";

export type HomeProps = {
  postPreviews: PostPreview[];
};

const Home = ({ postPreviews }: HomeProps) => {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string>(Tag.all);
  const tags = useMemo(
    () => [
      Tag.all,
      ...Array.from(
        new Set(postPreviews.map((postPreview) => postPreview.tag))
      ),
    ],
    [postPreviews]
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      const path = tag === Tag.all ? "/" : `/?tag=${tag}`;
      router.replace(path, undefined, { shallow: true });
    },
    [router]
  );

  useEffect(() => {
    if (typeof router.query.tag === "string") {
      setSelectedTag(router.query.tag);
    } else {
      setSelectedTag(Tag.all);
    }
  }, [setSelectedTag, router.query]);

  return (
    <>
      <PageHead
        title="KimBiYam.log"
        description="KimBiYam의 개발 블로그 입니다."
      />
      <TagSelector
        tags={tags}
        onTagClick={handleTagClick}
        selectedTag={selectedTag}
      />
      <PostList postPreviews={postPreviews} selectedTag={selectedTag} />
    </>
  );
};

export async function getStaticProps() {
  const postPreviews = getSortedPostPreviews();

  return {
    props: {
      postPreviews,
    },
  };
}

export default Home;

import { NextRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import postPageState from "../atoms/postPageState";
import { Tag } from "../constants";

const useTag = (router: NextRouter) => {
  const [selectedTag, setSelectedTag] = useState<string>(Tag.all);
  const setPostPage = useSetRecoilState(postPageState);

  const handleTagClick = useCallback((tag: string) => {
    const path = tag === Tag.all ? "/" : `/?tag=${tag}`;
    router.replace(path, undefined, { shallow: true, scroll: true });
    setPostPage(1);
  }, []);

  useEffect(() => {
    if (typeof router.query.tag === "string") {
      setSelectedTag(router.query.tag);
    } else {
      setSelectedTag(Tag.all);
    }
  }, [setSelectedTag, router.query]);

  return { selectedTag, handleTagClick };
};

export default useTag;

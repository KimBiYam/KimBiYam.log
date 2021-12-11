import fs from "fs";
import { POST_DIRECTORY } from "../../constants";

const getAllPostIds = () => {
  const fileNames = fs
    .readdirSync(POST_DIRECTORY)
    .filter((file) => file.endsWith(".md"));
  const postIds = fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ""),
    },
  }));

  return postIds;
};

export default getAllPostIds;

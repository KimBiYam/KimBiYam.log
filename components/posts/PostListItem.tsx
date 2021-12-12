import { PostPreview } from "../../types/post.types";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { slideUpMotion } from "../../lib/styles/motions";
import { memo } from "react";

export type PostListItemProps = {
  postPreview: PostPreview;
};

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content } = postPreview;

  return (
    <NextLink href={`/posts/${id}`}>
      <motion.div
        className="py-4 cursor-pointer hover:text-shadow dark:hover:text-shadow-dark transition-text-shadow"
        {...slideUpMotion}
      >
        <h3 className="w-full text-2xl font-bold overflow-hidden whitespace-nowrap truncate">
          {title}
        </h3>
        <div className="mt-2 mb-4 text-sm">{date}</div>
        <div className="dark:text-gray-300 text-zinc-700 text-sm md:text-base">
          {content}
        </div>
      </motion.div>
    </NextLink>
  );
};

export default memo(PostListItem);
